/// Logique domaine entreprise et utilisateurs — Paramètres, Rôles
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import List "mo:core/List";
import CommonTypes "../types/common";
import AccountingTypes "../types/accounting";
import InvoiceTypes "../types/invoice";
import InventoryTypes "../types/inventory";
import TreasuryTypes "../types/treasury";

module {

  public type CompanyInfo = CommonTypes.CompanyInfo;
  public type UserProfile = CommonTypes.UserProfile;
  public type Role = CommonTypes.Role;

  // ── Informations entreprise ─────────────────────────────────────────────────

  /// Retourne les informations de l'entreprise
  public func getCompanyInfo(
    companyInfo : Map.Map<Text, CompanyInfo>
  ) : ?CompanyInfo {
    companyInfo.get("default")
  };

  /// Met à jour les informations de l'entreprise
  public func updateCompanyInfo(
    companyInfo : Map.Map<Text, CompanyInfo>,
    info : CompanyInfo,
  ) : CommonTypes.Result {
    companyInfo.add("default", info);
    #ok
  };

  // ── Gestion utilisateurs ────────────────────────────────────────────────────

  /// Retourne la liste de tous les utilisateurs avec leur profil et rôle
  public func getUsers(
    userProfiles : Map.Map<Principal, UserProfile>
  ) : [UserProfile] {
    userProfiles.values() |> List.fromIter<UserProfile>(_) |> _.toArray()
  };

  /// Retourne le profil de l'utilisateur courant
  public func getCallerProfile(
    userProfiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
  ) : ?UserProfile {
    userProfiles.get(caller)
  };

  /// Sauvegarde le profil de l'utilisateur courant (premier login)
  public func saveCallerProfile(
    userProfiles : Map.Map<Principal, UserProfile>,
    caller : Principal,
    profile : UserProfile,
  ) : () {
    userProfiles.add(caller, profile)
  };

  /// Met à jour le rôle d'un utilisateur (Admin uniquement)
  public func updateUserRole(
    userProfiles : Map.Map<Principal, UserProfile>,
    userId : Principal,
    role : Role,
  ) : CommonTypes.Result {
    switch (userProfiles.get(userId)) {
      case null { #err "Utilisateur introuvable" };
      case (?p) {
        userProfiles.add(userId, { p with role });
        #ok
      };
    }
  };

  // ── Tableau de bord ─────────────────────────────────────────────────────────

  /// Calcule les statistiques du tableau de bord pour un exercice donné
  public func getDashboardStats(
    exercice : Nat,
    factures : List.List<InvoiceTypes.Facture>,
    produits : Map.Map<Text, InventoryTypes.Produit>,
    comptesTreso : Map.Map<Text, TreasuryTypes.CompteTresorerie>,
    _journal : List.List<AccountingTypes.JournalEntry>,
    comptes : Map.Map<Text, AccountingTypes.Account>,
  ) : {
    chiffreAffaires : CommonTypes.Amount;
    resultatNet : CommonTypes.Amount;
    soldeTresorerie : CommonTypes.Amount;
    nombreFacturesEnAttente : Nat;
    alertesStock : Nat;
    totalCreances : CommonTypes.Amount;
    totalDettes : CommonTypes.Amount;
  } {
    // Chiffre d'affaires = somme des factures vente validées de l'exercice (totalTTC)
    let chiffreAffaires = factures.foldLeft(
      0,
      func(acc : Nat, f : InvoiceTypes.Facture) : Nat {
        if (f.exercice == exercice and f.type_ == #Vente) {
          switch (f.statut) {
            case (#Validee or #Payee) { acc + f.totalTTC };
            case _ { acc };
          }
        } else { acc }
      },
    );

    // Résultat net = totalProduits - totalCharges (via soldes comptes classe 6 et 7)
    var totalCharges : Nat = 0;
    var totalProduits : Nat = 0;
    for ((_, compte) in comptes.entries()) {
      if (compte.classe == 6) {
        // charges : solde débiteur
        totalCharges += compte.soldeDebit
      } else if (compte.classe == 7) {
        // produits : solde créditeur
        totalProduits += compte.soldeCredit
      }
    };
    let resultatNet = if (totalProduits >= totalCharges) { Nat.sub(totalProduits, totalCharges) } else { 0 };

    // Solde trésorerie = somme de tous les comptes actifs
    let soldeTresorerie = comptesTreso.foldLeft(
      0 : Nat,
      func(acc : Nat, _ : Text, c : TreasuryTypes.CompteTresorerie) : Nat { if (c.actif) { acc + c.solde } else { acc } },
    );

    // Factures en attente = brouillons
    let nombreFacturesEnAttente = factures.foldLeft(
      0,
      func(acc : Nat, f : InvoiceTypes.Facture) : Nat {
        if (f.exercice == exercice) {
          switch (f.statut) {
            case (#Brouillon) { acc + 1 };
            case _ { acc };
          }
        } else { acc }
      },
    );

    // Alertes stock = produits avec stockActuel <= stockMinimum
    let alertesStock = produits.foldLeft(
      0 : Nat,
      func(acc : Nat, _ : Text, p : InventoryTypes.Produit) : Nat {
        if (p.actif and p.stockActuel <= p.stockMinimum) { acc + 1 } else { acc }
      },
    );

    // Total créances = somme factures vente validées ou brouillon non payées
    let totalCreances = factures.foldLeft(
      0,
      func(acc : Nat, f : InvoiceTypes.Facture) : Nat {
        if (f.exercice == exercice and f.type_ == #Vente) {
          switch (f.statut) {
            case (#Validee or #Brouillon) { acc + f.totalTTC };
            case _ { acc };
          }
        } else { acc }
      },
    );

    // Total dettes = somme factures achat validées ou brouillon non payées
    let totalDettes = factures.foldLeft(
      0,
      func(acc : Nat, f : InvoiceTypes.Facture) : Nat {
        if (f.exercice == exercice and f.type_ == #Achat) {
          switch (f.statut) {
            case (#Validee or #Brouillon) { acc + f.totalTTC };
            case _ { acc };
          }
        } else { acc }
      },
    );

    {
      chiffreAffaires;
      resultatNet;
      soldeTresorerie;
      nombreFacturesEnAttente;
      alertesStock;
      totalCreances;
      totalDettes;
    }
  };
};
