/// Mixin API Stocks — Produits, Mouvements, Valorisation CMUP
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import AccountingTypes "../types/accounting";
import InventoryTypes "../types/inventory";
import CommonTypes "../types/common";
import InventoryLib "../lib/inventory";

mixin (
  accessControlState : AccessControl.AccessControlState,
  produits : Map.Map<Text, InventoryTypes.Produit>,
  mouvementsStock : List.List<InventoryTypes.MouvementStock>,
  journal : List.List<AccountingTypes.JournalEntry>,
  comptes : Map.Map<Text, AccountingTypes.Account>,
  nextJournalId : { var value : Nat },
) {

  // ── Produits ────────────────────────────────────────────────────────────────

  /// Retourne tous les produits du catalogue
  public query ({ caller }) func getProduits() : async [InventoryTypes.Produit] {
    InventoryLib.getProduits(produits)
  };

  /// Retourne un produit par son identifiant
  public query ({ caller }) func getProduit(
    id : Text
  ) : async ?InventoryTypes.Produit {
    InventoryLib.getProduit(produits, id)
  };

  /// Crée un nouveau produit dans le catalogue (Admin, Gestionnaire)
  public shared ({ caller }) func createProduit(
    produit : InventoryTypes.ProduitInput
  ) : async CommonTypes.ResultValue<Text> {
    InventoryLib.createProduit(produits, produit)
  };

  /// Met à jour les informations d'un produit (Admin, Gestionnaire)
  public shared ({ caller }) func updateProduit(
    id : Text,
    produit : InventoryTypes.ProduitInput,
  ) : async CommonTypes.Result {
    InventoryLib.updateProduit(produits, id, produit)
  };

  /// Retourne les produits en rupture de stock ou sous le seuil d'alerte
  public query ({ caller }) func getProduitsEnRuptureOuAlerte() : async [InventoryTypes.Produit] {
    InventoryLib.getProduitsEnRuptureOuAlerte(produits)
  };

  // ── Mouvements de stock ─────────────────────────────────────────────────────

  /// Retourne les mouvements de stock paginés
  public query ({ caller }) func getMouvementsStock(
    produitId : ?Text,
    exercice : Nat,
    page : Nat,
  ) : async { mouvements : [InventoryTypes.MouvementStock]; total : Nat } {
    InventoryLib.getMouvementsStock(mouvementsStock, produitId, exercice, page)
  };

  /// Enregistre un nouveau mouvement de stock (Admin, Gestionnaire)
  public shared ({ caller }) func createMouvementStock(
    mvt : InventoryTypes.MouvementStockInput
  ) : async CommonTypes.ResultValue<Text> {
    InventoryLib.createMouvementStock(
      mouvementsStock,
      produits,
      journal,
      comptes,
      nextJournalId,
      mvt,
    )
  };

  // ── Valorisation du stock ───────────────────────────────────────────────────

  /// Calcule la valeur du stock par produit (méthode CMUP)
  public query ({ caller }) func getValeurStock() : async [InventoryTypes.ValeurStock] {
    InventoryLib.getValeurStock(produits, mouvementsStock)
  };
};
