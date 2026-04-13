/// Types comptables SCF (Système Comptable Financier) — Loi 07-11
import CommonTypes "common";

module {

  public type Amount = CommonTypes.Amount;
  public type Timestamp = CommonTypes.Timestamp;

  /// Nature du compte comptable selon le plan SCF
  public type AccountType = {
    #Actif;    // Classe 1-5 : immobilisations, stocks, créances, trésorerie
    #Passif;   // Classe 1-5 : capitaux, dettes
    #Charges;  // Classe 6 : charges de l'exercice
    #Produits; // Classe 7 : produits de l'exercice
    #Bilan;    // Comptes de bilan polyvalents
  };

  /// Compte du plan comptable SCF
  public type Account = {
    id : Text;
    numero : Text;        // Numéro de compte (ex: "512", "401")
    libelle : Text;       // Libellé du compte
    classe : Nat;         // Classe 1 à 7
    type_ : AccountType;
    soldeDebit : Amount;  // Solde côté débit en centimes DZD
    soldeCredit : Amount; // Solde côté crédit en centimes DZD
    compteParent : ?Text; // Numéro du compte parent (pour hiérarchie)
  };

  /// Solde d'un compte dans la balance générale
  public type AccountBalance = {
    compte : Account;
    totalDebit : Amount;
    totalCredit : Amount;
    solde : Amount;        // Solde débiteur ou créditeur
    estDebiteur : Bool;
  };

  /// Ligne d'écriture comptable (imputation sur un compte)
  public type EcritureComptable = {
    compte : Text;   // Numéro de compte
    libelle : Text;
    debit : Amount;  // Montant débit en centimes DZD
    credit : Amount; // Montant crédit en centimes DZD
  };

  /// Écriture de journal (article comptable)
  public type JournalEntry = {
    id : Text;
    numero : Nat;
    date_ : Timestamp;
    libelle : Text;
    ecritures : [EcritureComptable]; // Doit être équilibrée (Σdebit = Σcredit)
    valide : Bool;
    exercice : Nat; // Année de l'exercice fiscal
    journalCode : Text; // Ex: "VTE" ventes, "ACH" achats, "BQ" banque
  };

  /// Saisie pour la création d'une écriture de journal
  public type JournalEntryInput = {
    date_ : Timestamp;
    libelle : Text;
    ecritures : [EcritureComptable];
    exercice : Nat;
    journalCode : Text;
  };

  /// Exercice fiscal
  public type FiscalYear = {
    annee : Nat;
    debut : Timestamp;
    fin : Timestamp;
    cloture : Bool; // Exercice clôturé — aucune écriture autorisée après
  };

  /// Données du Bilan (Actif / Passif)
  public type BilanData = {
    exercice : Nat;
    totalActif : Amount;
    totalPassif : Amount;
    actifDetails : [AccountBalance];
    passifDetails : [AccountBalance];
    estEquilibre : Bool; // Actif = Passif
  };

  /// Données du Compte de Résultats
  public type CompteResultatsData = {
    exercice : Nat;
    totalCharges : Amount;
    totalProduits : Amount;
    resultatNet : Amount;    // Produits - Charges
    estBenefice : Bool;
    chargesDetails : [AccountBalance];
    produitsDetails : [AccountBalance];
  };
};
