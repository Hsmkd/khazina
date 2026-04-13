/// Types trésorerie (caisse et banque) — Hazine SaaS
import CommonTypes "common";

module {

  public type Amount = CommonTypes.Amount;
  public type Timestamp = CommonTypes.Timestamp;

  /// Type de compte de trésorerie
  public type TresoType = {
    #Caisse;  // Espèces — compte 53x
    #Banque;  // Compte bancaire — compte 51x
  };

  /// Compte de trésorerie
  public type CompteTresorerie = {
    id : Text;
    type_ : TresoType;
    libelle : Text;
    numeroCompte : ?Text; // Numéro de compte bancaire (pour les banques)
    banque : ?Text;       // Nom de la banque
    solde : Amount;       // Solde courant en centimes DZD
    compteComptable : Text; // Compte SCF associé (51x ou 53x)
    actif : Bool;
  };

  /// Saisie pour la création d'un compte de trésorerie
  public type CompteTresorerieInput = {
    type_ : TresoType;
    libelle : Text;
    numeroCompte : ?Text;
    banque : ?Text;
    compteComptable : Text;
    soldeinitial : Amount; // Solde d'ouverture
  };

  /// Nature du mouvement de trésorerie
  public type MvtType = {
    #Encaissement; // Entrée d'argent (paiement client, virement entrant)
    #Decaissement; // Sortie d'argent (paiement fournisseur, virement sortant)
  };

  /// Mouvement de trésorerie
  public type MouvementTresorerie = {
    id : Text;
    date_ : Timestamp;
    compteId : Text;      // Identifiant du compte de trésorerie
    type_ : MvtType;
    montant : Amount;     // Montant en centimes DZD
    libelle : Text;
    reference : Text;     // Numéro de pièce ou de facture associée
    exercice : Nat;
  };

  /// Saisie pour la création d'un mouvement de trésorerie
  public type MouvementTresorerieInput = {
    date_ : Timestamp;
    compteId : Text;
    type_ : MvtType;
    montant : Amount;
    libelle : Text;
    reference : Text;
    exercice : Nat;
  };
};
