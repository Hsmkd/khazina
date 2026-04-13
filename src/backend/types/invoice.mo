/// Types factures et tiers — Hazine SaaS
import CommonTypes "common";

module {

  public type Amount = CommonTypes.Amount;
  public type Timestamp = CommonTypes.Timestamp;

  /// Tiers : client ou fournisseur
  public type Tiers = {
    id : Text;
    nom : Text;
    adresse : Text;
    nif : Text;       // Numéro d'Identification Fiscale
    nis : Text;       // Numéro d'Identification Statistique
    rc : Text;        // Registre de Commerce
    telephone : Text;
    email : Text;
    estClient : Bool;       // true = client, false = fournisseur
    estFournisseur : Bool;
    compteComptable : Text; // Compte 411 (client) ou 401 (fournisseur)
  };

  /// Saisie pour la création/mise à jour d'un tiers
  public type TiersInput = {
    nom : Text;
    adresse : Text;
    nif : Text;
    nis : Text;
    rc : Text;
    telephone : Text;
    email : Text;
    estClient : Bool;
    estFournisseur : Bool;
    compteComptable : Text;
  };

  /// Taux de TVA applicables en Algérie
  public type TauxTVA = {
    #TVA9;   // 9% — taux réduit
    #TVA19;  // 19% — taux normal
    #Exonere; // 0% — exonéré de TVA
  };

  /// Ligne de facture
  public type LigneFacture = {
    produitId : ?Text;        // Optionnel : lien vers le produit en stock
    designation : Text;
    quantite : Float;
    prixUnitaire : Amount;    // Prix HT en centimes DZD
    tauxTVA : Float;          // 0.0, 9.0 ou 19.0
    montantHT : Amount;       // quantite × prixUnitaire
    montantTVA : Amount;      // montantHT × tauxTVA / 100
    montantTTC : Amount;      // montantHT + montantTVA
  };

  /// Type de facture
  public type FactureType = { #Vente; #Achat };

  /// Statut du cycle de vie d'une facture
  public type FactureStatut = {
    #Brouillon;  // En cours de saisie
    #Validee;    // Validée — génère écriture comptable
    #Payee;      // Payée intégralement
    #Annulee;    // Annulée — aucune comptabilisation
  };

  /// Facture client (vente) ou fournisseur (achat)
  public type Facture = {
    id : Text;
    numero : Text;
    date_ : Timestamp;
    type_ : FactureType;
    tiersId : Text;
    lignes : [LigneFacture];
    totalHT : Amount;
    totalTVA : Amount;
    totalTTC : Amount;
    statut : FactureStatut;
    exercice : Nat;
    dateEcheance : ?Timestamp; // Date d'échéance de paiement
    notes : Text;
  };

  /// Saisie pour la création d'une facture
  public type FactureInput = {
    date_ : Timestamp;
    type_ : FactureType;
    tiersId : Text;
    lignes : [LigneFacture];
    exercice : Nat;
    dateEcheance : ?Timestamp;
    notes : Text;
  };
};
