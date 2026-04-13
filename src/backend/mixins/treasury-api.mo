/// Mixin API Trésorerie — Comptes (caisse/banque) et Mouvements
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import AccountingTypes "../types/accounting";
import TreasuryTypes "../types/treasury";
import CommonTypes "../types/common";
import TreasuryLib "../lib/treasury";

mixin (
  accessControlState : AccessControl.AccessControlState,
  comptesTreso : Map.Map<Text, TreasuryTypes.CompteTresorerie>,
  mouvementsTreso : List.List<TreasuryTypes.MouvementTresorerie>,
  journal : List.List<AccountingTypes.JournalEntry>,
  comptesComptables : Map.Map<Text, AccountingTypes.Account>,
  nextJournalId : { var value : Nat },
) {

  // ── Comptes de trésorerie ───────────────────────────────────────────────────

  /// Retourne tous les comptes de trésorerie
  public query ({ caller }) func getComptesTresorerie() : async [TreasuryTypes.CompteTresorerie] {
    TreasuryLib.getComptesTresorerie(comptesTreso)
  };

  /// Initialise les comptes de trésorerie par défaut et les retourne
  public shared ({ caller }) func initTresorerie() : async () {
    if (comptesTreso.isEmpty()) {
      ignore TreasuryLib.createCompteTresorerie(
        comptesTreso,
        {
          type_ = #Caisse;
          libelle = "Caisse siège";
          numeroCompte = null;
          banque = null;
          compteComptable = "531";
          soldeinitial = 0;
        },
      );
      ignore TreasuryLib.createCompteTresorerie(
        comptesTreso,
        {
          type_ = #Banque;
          libelle = "Compte bancaire principal";
          numeroCompte = null;
          banque = null;
          compteComptable = "512";
          soldeinitial = 0;
        },
      )
    }
  };

  /// Crée un nouveau compte de trésorerie (Admin, Comptable)
  public shared ({ caller }) func createCompteTresorerie(
    compte : TreasuryTypes.CompteTresorerieInput
  ) : async CommonTypes.ResultValue<Text> {
    TreasuryLib.createCompteTresorerie(comptesTreso, compte)
  };

  // ── Mouvements de trésorerie ────────────────────────────────────────────────

  /// Retourne les mouvements de trésorerie paginés
  public query ({ caller }) func getMouvementsTresorerie(
    compteId : ?Text,
    exercice : Nat,
    page : Nat,
  ) : async { mouvements : [TreasuryTypes.MouvementTresorerie]; total : Nat } {
    TreasuryLib.getMouvementsTresorerie(mouvementsTreso, compteId, exercice, page)
  };

  /// Enregistre un mouvement de trésorerie (Admin, Comptable, Gestionnaire)
  public shared ({ caller }) func createMouvementTresorerie(
    mvt : TreasuryTypes.MouvementTresorerieInput
  ) : async CommonTypes.ResultValue<Text> {
    TreasuryLib.createMouvementTresorerie(
      mouvementsTreso,
      comptesTreso,
      journal,
      comptesComptables,
      nextJournalId,
      mvt,
    )
  };

  /// Retourne le solde total de trésorerie (somme de tous les comptes)
  public query ({ caller }) func getSoldeTresorerie() : async CommonTypes.Amount {
    TreasuryLib.getSoldeTresorerie(comptesTreso)
  };
};
