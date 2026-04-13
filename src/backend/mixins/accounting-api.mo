/// Mixin API Comptabilité — Journal, Grand Livre, Balance, Bilan, Exercices
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import AccountingTypes "../types/accounting";
import CommonTypes "../types/common";
import AccountingLib "../lib/accounting";

mixin (
  accessControlState : AccessControl.AccessControlState,
  comptes : Map.Map<Text, AccountingTypes.Account>,
  journal : List.List<AccountingTypes.JournalEntry>,
  exercices : List.List<AccountingTypes.FiscalYear>,
  nextJournalId : { var value : Nat },
) {

  // ── Initialisation automatique ──────────────────────────────────────────────

  /// Initialise le plan comptable SCF et l'exercice par défaut si vides
  func initIfEmpty() : () {
    if (comptes.isEmpty()) {
      let seedComptes = AccountingLib.seedComptesSCF();
      for (compte in seedComptes.values()) {
        comptes.add(compte.numero, compte)
      }
    };
    if (exercices.isEmpty()) {
      ignore AccountingLib.createExercice(exercices, 2025)
    }
  };

  // ── Plan comptable ──────────────────────────────────────────────────────────

  /// Retourne tous les comptes du plan comptable SCF
  public query ({ caller }) func getComptes() : async [AccountingTypes.Account] {
    AccountingLib.getComptes(comptes)
  };

  /// Retourne les comptes d'une classe donnée (1 à 7)
  public query ({ caller }) func getComptesParClasse(
    classe : Nat
  ) : async [AccountingTypes.Account] {
    AccountingLib.getComptesParClasse(comptes, classe)
  };

  /// Ajoute un nouveau compte au plan comptable (Admin, Comptable)
  public shared ({ caller }) func addCompte(
    compte : AccountingTypes.Account
  ) : async CommonTypes.Result {
    initIfEmpty();
    AccountingLib.addCompte(comptes, compte)
  };

  /// Met à jour un compte du plan comptable (Admin, Comptable)
  public shared ({ caller }) func updateCompte(
    id : Text,
    compte : AccountingTypes.Account,
  ) : async CommonTypes.Result {
    AccountingLib.updateCompte(comptes, id, compte)
  };

  // ── Journal comptable ───────────────────────────────────────────────────────

  /// Retourne les écritures du journal, paginées par exercice
  public query ({ caller }) func getJournalEntries(
    exercice : Nat,
    page : Nat,
  ) : async { entries : [AccountingTypes.JournalEntry]; total : Nat } {
    AccountingLib.getJournalEntries(journal, exercice, page)
  };

  /// Retourne une écriture de journal par son identifiant
  public query ({ caller }) func getJournalEntry(
    id : Text
  ) : async ?AccountingTypes.JournalEntry {
    AccountingLib.getJournalEntry(journal, id)
  };

  /// Crée une nouvelle écriture de journal (Admin, Comptable)
  public shared ({ caller }) func createJournalEntry(
    entry : AccountingTypes.JournalEntryInput
  ) : async CommonTypes.ResultValue<Text> {
    let result = AccountingLib.createJournalEntry(journal, comptes, nextJournalId.value, entry);
    switch (result) {
      case (#ok _) { nextJournalId.value += 1 };
      case (#err _) {};
    };
    result
  };

  /// Valide une écriture de journal (Admin, Comptable)
  public shared ({ caller }) func validateJournalEntry(
    id : Text
  ) : async CommonTypes.Result {
    AccountingLib.validateJournalEntry(journal, comptes, id)
  };

  /// Supprime une écriture de journal non validée (Admin, Comptable)
  public shared ({ caller }) func deleteJournalEntry(
    id : Text
  ) : async CommonTypes.Result {
    AccountingLib.deleteJournalEntry(journal, id)
  };

  // ── Grand Livre et Balance ──────────────────────────────────────────────────

  /// Retourne toutes les écritures d'un compte (grand livre)
  public query ({ caller }) func getGrandLivre(
    compteNumero : Text,
    exercice : Nat,
  ) : async [AccountingTypes.JournalEntry] {
    AccountingLib.getGrandLivre(journal, compteNumero, exercice)
  };

  /// Retourne la balance générale de tous les comptes
  public query ({ caller }) func getBalance(
    exercice : Nat
  ) : async [AccountingTypes.AccountBalance] {
    AccountingLib.getBalance(comptes, journal, exercice)
  };

  /// Génère le bilan comptable (Actif / Passif)
  public query ({ caller }) func getBilan(
    exercice : Nat
  ) : async AccountingTypes.BilanData {
    AccountingLib.getBilan(comptes, journal, exercice)
  };

  /// Génère le compte de résultats
  public query ({ caller }) func getCompteResultats(
    exercice : Nat
  ) : async AccountingTypes.CompteResultatsData {
    AccountingLib.getCompteResultats(comptes, journal, exercice)
  };

  // ── Exercices fiscaux ───────────────────────────────────────────────────────

  /// Retourne tous les exercices fiscaux
  public query ({ caller }) func getExercices() : async [AccountingTypes.FiscalYear] {
    AccountingLib.getExercices(exercices)
  };

  /// Crée un nouvel exercice fiscal (Admin)
  public shared ({ caller }) func createExercice(
    annee : Nat
  ) : async CommonTypes.Result {
    AccountingLib.createExercice(exercices, annee)
  };

  /// Clôture un exercice fiscal (Admin)
  public shared ({ caller }) func cloturerExercice(
    annee : Nat
  ) : async CommonTypes.Result {
    AccountingLib.cloturerExercice(exercices, annee)
  };

  /// Initialise le plan comptable et l'exercice par défaut (Admin)
  public shared ({ caller }) func initData() : async () {
    initIfEmpty()
  };
};
