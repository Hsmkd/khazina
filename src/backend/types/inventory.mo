/// Types gestion des stocks et inventaire — Hazine SaaS
import CommonTypes "common";

module {

  public type Amount = CommonTypes.Amount;
  public type Timestamp = CommonTypes.Timestamp;

  /// Produit du catalogue
  public type Produit = {
    id : Text;
    code : Text;         // Code article interne
    designation : Text;
    unite : Text;        // Unité de mesure (kg, pièce, litre, m², etc.)
    prixAchat : Amount;  // Prix d'achat unitaire en centimes DZD
    prixVente : Amount;  // Prix de vente HT unitaire en centimes DZD
    stockActuel : Float; // Quantité en stock
    stockMinimum : Float;// Seuil d'alerte rupture de stock
    compteStock : Text;  // Compte comptable SCF (ex: "30", "31", "32")
    actif : Bool;        // Produit actif ou archivé
  };

  /// Saisie pour la création/mise à jour d'un produit
  public type ProduitInput = {
    code : Text;
    designation : Text;
    unite : Text;
    prixAchat : Amount;
    prixVente : Amount;
    stockMinimum : Float;
    compteStock : Text;
  };

  /// Type de mouvement de stock
  public type MouvementType = {
    #Entree;      // Réception achat, retour client
    #Sortie;      // Livraison vente, consommation
    #Ajustement;  // Inventaire physique — correction de stock
  };

  /// Mouvement de stock (entrée, sortie, ajustement)
  public type MouvementStock = {
    id : Text;
    date_ : Timestamp;
    produitId : Text;
    type_ : MouvementType;
    quantite : Float;
    prixUnitaire : Amount; // Prix unitaire au moment du mouvement
    reference : Text;      // Numéro de facture ou bon associé
    exercice : Nat;
    notes : Text;
  };

  /// Saisie pour la création d'un mouvement de stock
  public type MouvementStockInput = {
    date_ : Timestamp;
    produitId : Text;
    type_ : MouvementType;
    quantite : Float;
    prixUnitaire : Amount;
    reference : Text;
    exercice : Nat;
    notes : Text;
  };

  /// Valorisation du stock par produit (méthode CMUP)
  public type ValeurStock = {
    produitId : Text;
    designation : Text;
    quantite : Float;
    prixMoyenPondere : Amount; // Coût moyen unitaire pondéré en centimes DZD
    valeurTotale : Amount;     // quantite × prixMoyenPondere
  };
};
