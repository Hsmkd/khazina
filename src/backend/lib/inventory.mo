/// Logique domaine gestion des stocks — Produits, Mouvements, Valorisation CMUP
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Types "../types/inventory";
import AccountingTypes "../types/accounting";
import AccountingLib "../lib/accounting";
import CommonTypes "../types/common";

module {

  public type Produit = Types.Produit;
  public type ProduitInput = Types.ProduitInput;
  public type MouvementStock = Types.MouvementStock;
  public type MouvementStockInput = Types.MouvementStockInput;
  public type ValeurStock = Types.ValeurStock;

  let PAGE_SIZE : Nat = 50;

  // ── Produits ────────────────────────────────────────────────────────────────

  /// Retourne tous les produits actifs
  public func getProduits(
    produits : Map.Map<Text, Produit>
  ) : [Produit] {
    produits.values()
    |> List.fromIter<Produit>(_)
    |> _.filter(func(p) { p.actif })
    |> _.toArray()
  };

  /// Retourne un produit par son identifiant
  public func getProduit(
    produits : Map.Map<Text, Produit>,
    id : Text,
  ) : ?Produit {
    produits.get(id)
  };

  /// Crée un nouveau produit dans le catalogue
  public func createProduit(
    produits : Map.Map<Text, Produit>,
    input : ProduitInput,
  ) : CommonTypes.ResultValue<Text> {
    if (input.code == "") {
      return #err "Le code article est obligatoire"
    };
    if (input.designation == "") {
      return #err "La désignation est obligatoire"
    };
    // Vérifier unicité du code
    let codeExiste = produits.any(func(_, p) { p.code == input.code });
    if (codeExiste) {
      return #err ("Le code article " # input.code # " existe déjà")
    };
    let id = "PROD-" # (produits.size() + 1).toText();
    let newProduit : Produit = {
      id;
      code = input.code;
      designation = input.designation;
      unite = input.unite;
      prixAchat = input.prixAchat;
      prixVente = input.prixVente;
      stockActuel = 0.0;
      stockMinimum = input.stockMinimum;
      compteStock = input.compteStock;
      actif = true;
    };
    produits.add(id, newProduit);
    #ok id
  };

  /// Met à jour les informations d'un produit
  public func updateProduit(
    produits : Map.Map<Text, Produit>,
    id : Text,
    input : ProduitInput,
  ) : CommonTypes.Result {
    switch (produits.get(id)) {
      case null { #err "Produit introuvable" };
      case (?p) {
        produits.add(id, {
          p with
          code = input.code;
          designation = input.designation;
          unite = input.unite;
          prixAchat = input.prixAchat;
          prixVente = input.prixVente;
          stockMinimum = input.stockMinimum;
          compteStock = input.compteStock;
        });
        #ok
      };
    }
  };

  /// Retourne les produits en rupture ou sous le seuil d'alerte
  public func getProduitsEnRuptureOuAlerte(
    produits : Map.Map<Text, Produit>
  ) : [Produit] {
    produits.values()
    |> List.fromIter<Produit>(_)
    |> _.filter(func(p) { p.actif and p.stockActuel <= p.stockMinimum })
    |> _.toArray()
  };

  // ── Mouvements de stock ─────────────────────────────────────────────────────

  /// Retourne les mouvements de stock paginés
  public func getMouvementsStock(
    mouvements : List.List<MouvementStock>,
    produitId : ?Text,
    exercice : Nat,
    page : Nat,
  ) : { mouvements : [MouvementStock]; total : Nat } {
    let filtered = mouvements.filter(func(m) {
      m.exercice == exercice and (
        switch (produitId) {
          case null { true };
          case (?pid) { m.produitId == pid };
        }
      )
    });
    let total = filtered.size();
    let start = page * PAGE_SIZE;
    if (start >= total) {
      return { mouvements = []; total }
    };
    let end_ = Nat.min(start + PAGE_SIZE, total);
    { mouvements = filtered.sliceToArray(start, end_); total }
  };

  /// Enregistre un mouvement de stock et met à jour le stock (CMUP)
  public func createMouvementStock(
    mouvements : List.List<MouvementStock>,
    produits : Map.Map<Text, Produit>,
    journal : List.List<AccountingTypes.JournalEntry>,
    comptes : Map.Map<Text, AccountingTypes.Account>,
    nextJournalId : { var value : Nat },
    input : MouvementStockInput,
  ) : CommonTypes.ResultValue<Text> {
    switch (produits.get(input.produitId)) {
      case null { #err "Produit introuvable" };
      case (?produit) {
        let id = "MVT-" # (mouvements.size() + 1).toText();
        let newMvt : MouvementStock = {
          id;
          date_ = input.date_;
          produitId = input.produitId;
          type_ = input.type_;
          quantite = input.quantite;
          prixUnitaire = input.prixUnitaire;
          reference = input.reference;
          exercice = input.exercice;
          notes = input.notes;
        };
        mouvements.add(newMvt);

        // Mise à jour du stock CMUP selon le type de mouvement
        let updatedProduit : Produit = switch (input.type_) {
          case (#Entree) {
            // CMUP = (ancienStock * ancienPMU + quantite * prixUnitaire) / (ancienStock + quantite)
            let ancienStock = produit.stockActuel;
            let ancienPMU = produit.prixAchat.toFloat();
            let nouveauStock = ancienStock + input.quantite;
            let nouveauPMU = if (nouveauStock > 0.0) {
              (ancienStock * ancienPMU + input.quantite * input.prixUnitaire.toFloat()) / nouveauStock
            } else { input.prixUnitaire.toFloat() };
            let nouveauPrixAchat = Int.abs(nouveauPMU.toInt());
            { produit with stockActuel = nouveauStock; prixAchat = nouveauPrixAchat }
          };
          case (#Sortie) {
            let nouveauStock = if (produit.stockActuel >= input.quantite) {
              produit.stockActuel - input.quantite
            } else { 0.0 };
            { produit with stockActuel = nouveauStock }
          };
          case (#Ajustement) {
            { produit with stockActuel = input.quantite }
          };
        };
        produits.add(input.produitId, updatedProduit);

        // Écriture comptable pour les entrées de stock
        switch (input.type_) {
          case (#Entree) {
            let montant = Int.abs((input.quantite * input.prixUnitaire.toFloat()).toInt());
            let compteStk = updatedProduit.compteStock;
            AccountingLib.createJournalEntryDirect(
              journal,
              comptes,
              nextJournalId,
              "Entrée stock — " # produit.designation # " (" # input.reference # ")",
              "STK",
              input.exercice,
              [
                { compte = compteStk; libelle = "Stock " # produit.designation; debit = montant; credit = 0 },
                { compte = "40"; libelle = "Fournisseurs — " # input.reference; debit = 0; credit = montant },
              ],
            )
          };
          case _ {};
        };

        #ok id
      };
    }
  };

  // ── Valorisation (CMUP) ─────────────────────────────────────────────────────

  /// Calcule la valeur du stock par produit avec le prix moyen pondéré (CMUP)
  public func getValeurStock(
    produits : Map.Map<Text, Produit>,
    _mouvements : List.List<MouvementStock>,
  ) : [ValeurStock] {
    produits.values()
    |> List.fromIter<Produit>(_)
    |> _.filter(func(p) { p.actif })
    |> _.map<Produit, ValeurStock>(func(p) {
      let prixMoyenPondere = p.prixAchat;
      let valeurTotale = Int.abs((p.stockActuel * prixMoyenPondere.toFloat()).toInt());
      {
        produitId = p.id;
        designation = p.designation;
        quantite = p.stockActuel;
        prixMoyenPondere;
        valeurTotale;
      }
    })
    |> _.toArray()
  };

  /// Compte le nombre de produits en alerte ou rupture
  public func getNombreAlertes(
    produits : Map.Map<Text, Produit>
  ) : Nat {
    produits.foldLeft(0 : Nat, func(acc : Nat, _ : Text, p : Produit) : Nat {
      if (p.actif and p.stockActuel <= p.stockMinimum) { acc + 1 } else { acc }
    })
  };
};
