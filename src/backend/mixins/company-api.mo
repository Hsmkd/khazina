/// Mixin API Entreprise et Utilisateurs — Paramètres, Profils, Rôles, Dashboard
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import AccountingTypes "../types/accounting";
import InvoiceTypes "../types/invoice";
import InventoryTypes "../types/inventory";
import TreasuryTypes "../types/treasury";
import CommonTypes "../types/common";
import CompanyLib "../lib/company";
import InvoiceLib "../lib/invoice";
import InventoryLib "../lib/inventory";
import TreasuryLib "../lib/treasury";

mixin (
  accessControlState : AccessControl.AccessControlState,
  companyInfo : Map.Map<Text, CommonTypes.CompanyInfo>,
  userProfiles : Map.Map<Principal, CommonTypes.UserProfile>,
  // State refs needed for dashboard aggregation
  factures : List.List<InvoiceTypes.Facture>,
  produits : Map.Map<Text, InventoryTypes.Produit>,
  comptesTreso : Map.Map<Text, TreasuryTypes.CompteTresorerie>,
  journalEntries : List.List<AccountingTypes.JournalEntry>,
  comptesComptables : Map.Map<Text, AccountingTypes.Account>,
) {

  // ── Profil utilisateur (requis par le mixin authorization) ──────────────────

  /// Retourne le profil de l'utilisateur courant
  public query ({ caller }) func getCallerUserProfile() : async ?CommonTypes.UserProfile {
    CompanyLib.getCallerProfile(userProfiles, caller)
  };

  /// Sauvegarde le profil de l'utilisateur courant (premier login)
  public shared ({ caller }) func saveCallerUserProfile(
    profile : CommonTypes.UserProfile
  ) : async () {
    CompanyLib.saveCallerProfile(userProfiles, caller, profile)
  };

  /// Retourne le profil d'un utilisateur par son principal
  public query ({ caller }) func getUserProfile(
    user : Principal
  ) : async ?CommonTypes.UserProfile {
    CompanyLib.getCallerProfile(userProfiles, user)
  };

  // ── Informations entreprise ─────────────────────────────────────────────────

  /// Retourne les informations de l'entreprise
  public query ({ caller }) func getCompanyInfo() : async ?CommonTypes.CompanyInfo {
    CompanyLib.getCompanyInfo(companyInfo)
  };

  /// Met à jour les informations de l'entreprise (Admin uniquement)
  public shared ({ caller }) func updateCompanyInfo(
    info : CommonTypes.CompanyInfo
  ) : async CommonTypes.Result {
    switch (CompanyLib.getCallerProfile(userProfiles, caller)) {
      case null { #err "Accès refusé" };
      case (?profile) {
        switch (profile.role) {
          case (#Admin) { CompanyLib.updateCompanyInfo(companyInfo, info) };
          case _ { #err "Accès refusé — rôle Admin requis" };
        }
      };
    }
  };

  // ── Gestion des utilisateurs ────────────────────────────────────────────────

  /// Retourne la liste de tous les utilisateurs (Admin uniquement)
  public query ({ caller }) func getUsers() : async [CommonTypes.UserProfile] {
    switch (CompanyLib.getCallerProfile(userProfiles, caller)) {
      case null { [] };
      case (?profile) {
        switch (profile.role) {
          case (#Admin) { CompanyLib.getUsers(userProfiles) };
          case _ { [] };
        }
      };
    }
  };

  /// Met à jour le rôle d'un utilisateur (Admin uniquement)
  public shared ({ caller }) func updateUserRole(
    userId : CommonTypes.UserId,
    role : CommonTypes.Role,
  ) : async CommonTypes.Result {
    switch (CompanyLib.getCallerProfile(userProfiles, caller)) {
      case null { #err "Accès refusé" };
      case (?profile) {
        switch (profile.role) {
          case (#Admin) { CompanyLib.updateUserRole(userProfiles, userId, role) };
          case _ { #err "Accès refusé — rôle Admin requis" };
        }
      };
    }
  };

  // ── Tableau de bord ─────────────────────────────────────────────────────────

  /// Retourne les indicateurs clés du tableau de bord
  public query ({ caller }) func getDashboardStats(
    exercice : Nat
  ) : async {
    chiffreAffaires : CommonTypes.Amount;
    resultatNet : CommonTypes.Amount;
    soldeTresorerie : CommonTypes.Amount;
    nombreFacturesEnAttente : Nat;
    alertesStock : Nat;
    totalCreances : CommonTypes.Amount;
    totalDettes : CommonTypes.Amount;
  } {
    CompanyLib.getDashboardStats(
      exercice,
      factures,
      produits,
      comptesTreso,
      journalEntries,
      comptesComptables,
    )
  };
};
