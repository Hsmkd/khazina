/// Mixin API Facturation — Tiers (clients/fournisseurs) et Factures
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import AccountingTypes "../types/accounting";
import InvoiceTypes "../types/invoice";
import CommonTypes "../types/common";
import InvoiceLib "../lib/invoice";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tiers : Map.Map<Text, InvoiceTypes.Tiers>,
  factures : List.List<InvoiceTypes.Facture>,
  journal : List.List<AccountingTypes.JournalEntry>,
  comptes : Map.Map<Text, AccountingTypes.Account>,
  nextJournalId : { var value : Nat },
) {

  // ── Tiers ────────────────────────────────────────────────────────────────────

  /// Retourne tous les tiers (clients et fournisseurs)
  public query ({ caller }) func getTiers() : async [InvoiceTypes.Tiers] {
    InvoiceLib.getTiers(tiers)
  };

  /// Retourne un tiers par son identifiant
  public query ({ caller }) func getTiersById(
    id : Text
  ) : async ?InvoiceTypes.Tiers {
    InvoiceLib.getTiersById(tiers, id)
  };

  /// Crée un nouveau tiers (Admin, Comptable, Gestionnaire)
  public shared ({ caller }) func createTiers(
    input : InvoiceTypes.TiersInput
  ) : async CommonTypes.ResultValue<Text> {
    InvoiceLib.createTiers(tiers, input)
  };

  /// Met à jour un tiers existant (Admin, Comptable, Gestionnaire)
  public shared ({ caller }) func updateTiers(
    id : Text,
    input : InvoiceTypes.TiersInput,
  ) : async CommonTypes.Result {
    InvoiceLib.updateTiers(tiers, id, input)
  };

  // ── Factures ────────────────────────────────────────────────────────────────

  /// Retourne les factures paginées par type et exercice
  public query ({ caller }) func getFactures(
    type_ : InvoiceTypes.FactureType,
    exercice : Nat,
    page : Nat,
  ) : async { factures : [InvoiceTypes.Facture]; total : Nat } {
    InvoiceLib.getFactures(factures, type_, exercice, page)
  };

  /// Retourne une facture par son identifiant
  public query ({ caller }) func getFacture(
    id : Text
  ) : async ?InvoiceTypes.Facture {
    InvoiceLib.getFacture(factures, id)
  };

  /// Crée une nouvelle facture en brouillon (Admin, Comptable, Gestionnaire)
  public shared ({ caller }) func createFacture(
    facture : InvoiceTypes.FactureInput
  ) : async CommonTypes.ResultValue<Text> {
    InvoiceLib.createFacture(factures, facture)
  };

  /// Valide une facture (Admin, Comptable)
  public shared ({ caller }) func validateFacture(
    id : Text
  ) : async CommonTypes.Result {
    InvoiceLib.validateFacture(factures, journal, comptes, nextJournalId, id)
  };

  /// Supprime une facture en brouillon (Admin, Comptable)
  public shared ({ caller }) func deleteFacture(
    id : Text
  ) : async CommonTypes.Result {
    InvoiceLib.deleteFacture(factures, id)
  };
};
