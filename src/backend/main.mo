/// Hazine — SaaS Comptabilité Algérienne (Conforme SCF - Loi 07-11)
/// Racine de composition : déclare l'état, importe et inclut les mixins.
/// Aucune logique métier ici — tout est délégué aux mixins.
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";

import AccountingTypes "types/accounting";
import InvoiceTypes "types/invoice";
import InventoryTypes "types/inventory";
import TreasuryTypes "types/treasury";
import CommonTypes "types/common";

import AccountingMixin "mixins/accounting-api";
import InvoiceMixin "mixins/invoice-api";
import InventoryMixin "mixins/inventory-api";
import TreasuryMixin "mixins/treasury-api";
import CompanyMixin "mixins/company-api";

actor {

  // ── State : Autorisation ────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();

  // ── State : Entreprise et utilisateurs ─────────────────────────────────────
  let companyInfo = Map.empty<Text, CommonTypes.CompanyInfo>();
  let userProfiles = Map.empty<Principal, CommonTypes.UserProfile>();

  // ── State : Plan comptable SCF ──────────────────────────────────────────────
  let comptesComptables = Map.empty<Text, AccountingTypes.Account>();
  let journal = List.empty<AccountingTypes.JournalEntry>();
  let exercices = List.empty<AccountingTypes.FiscalYear>();
  let nextJournalId = { var value : Nat = 1 };

  // ── State : Facturation ─────────────────────────────────────────────────────
  let tiers = Map.empty<Text, InvoiceTypes.Tiers>();
  let factures = List.empty<InvoiceTypes.Facture>();

  // ── State : Stocks ──────────────────────────────────────────────────────────
  let produits = Map.empty<Text, InventoryTypes.Produit>();
  let mouvementsStock = List.empty<InventoryTypes.MouvementStock>();

  // ── State : Trésorerie ──────────────────────────────────────────────────────
  let comptesTreso = Map.empty<Text, TreasuryTypes.CompteTresorerie>();
  let mouvementsTreso = List.empty<TreasuryTypes.MouvementTresorerie>();

  // ── Mixins ──────────────────────────────────────────────────────────────────

  // Gestion des identités Internet Identity
  include MixinAuthorization(accessControlState);

  // Stockage de fichiers (pièces justificatives, documents)
  include MixinObjectStorage();

  // API Entreprise, Utilisateurs et Tableau de bord
  include CompanyMixin(
    accessControlState,
    companyInfo,
    userProfiles,
    factures,
    produits,
    comptesTreso,
    journal,
    comptesComptables,
  );

  // API Comptabilité SCF
  include AccountingMixin(
    accessControlState,
    comptesComptables,
    journal,
    exercices,
    nextJournalId,
  );

  // API Facturation
  include InvoiceMixin(
    accessControlState,
    tiers,
    factures,
    journal,
    comptesComptables,
    nextJournalId,
  );

  // API Gestion des stocks
  include InventoryMixin(
    accessControlState,
    produits,
    mouvementsStock,
    journal,
    comptesComptables,
    nextJournalId,
  );

  // API Trésorerie
  include TreasuryMixin(
    accessControlState,
    comptesTreso,
    mouvementsTreso,
    journal,
    comptesComptables,
    nextJournalId,
  );
};
