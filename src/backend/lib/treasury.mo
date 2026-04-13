/// Logique domaine trésorerie — Caisse, Banque, Mouvements
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Types "../types/treasury";
import AccountingTypes "../types/accounting";
import AccountingLib "../lib/accounting";
import CommonTypes "../types/common";

module {

  public type CompteTresorerie = Types.CompteTresorerie;
  public type CompteTresorerieInput = Types.CompteTresorerieInput;
  public type MouvementTresorerie = Types.MouvementTresorerie;
  public type MouvementTresorerieInput = Types.MouvementTresorerieInput;

  let PAGE_SIZE : Nat = 50;

  // ── Comptes de trésorerie ───────────────────────────────────────────────────

  /// Retourne tous les comptes de trésorerie actifs
  public func getComptesTresorerie(
    comptes : Map.Map<Text, CompteTresorerie>
  ) : [CompteTresorerie] {
    comptes.values()
    |> List.fromIter<CompteTresorerie>(_)
    |> _.filter(func(c) { c.actif })
    |> _.toArray()
  };

  /// Crée un nouveau compte de trésorerie
  public func createCompteTresorerie(
    comptes : Map.Map<Text, CompteTresorerie>,
    input : CompteTresorerieInput,
  ) : CommonTypes.ResultValue<Text> {
    if (input.libelle == "") {
      return #err "Le libellé du compte est obligatoire"
    };
    let id = "TRES-" # (comptes.size() + 1).toText();
    let newCompte : CompteTresorerie = {
      id;
      type_ = input.type_;
      libelle = input.libelle;
      numeroCompte = input.numeroCompte;
      banque = input.banque;
      solde = input.soldeinitial;
      compteComptable = input.compteComptable;
      actif = true;
    };
    comptes.add(id, newCompte);
    #ok id
  };

  // ── Mouvements de trésorerie ────────────────────────────────────────────────

  /// Retourne les mouvements de trésorerie paginés
  public func getMouvementsTresorerie(
    mouvements : List.List<MouvementTresorerie>,
    compteId : ?Text,
    exercice : Nat,
    page : Nat,
  ) : { mouvements : [MouvementTresorerie]; total : Nat } {
    let filtered = mouvements.filter(func(m) {
      m.exercice == exercice and (
        switch (compteId) {
          case null { true };
          case (?cid) { m.compteId == cid };
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

  /// Enregistre un mouvement de trésorerie et met à jour le solde
  public func createMouvementTresorerie(
    mouvements : List.List<MouvementTresorerie>,
    comptes : Map.Map<Text, CompteTresorerie>,
    journal : List.List<AccountingTypes.JournalEntry>,
    comptesComptables : Map.Map<Text, AccountingTypes.Account>,
    nextJournalId : { var value : Nat },
    input : MouvementTresorerieInput,
  ) : CommonTypes.ResultValue<Text> {
    switch (comptes.get(input.compteId)) {
      case null { #err "Compte de trésorerie introuvable" };
      case (?compte) {
        let id = "MVT-TRES-" # (mouvements.size() + 1).toText();
        let newMvt : MouvementTresorerie = {
          id;
          date_ = input.date_;
          compteId = input.compteId;
          type_ = input.type_;
          montant = input.montant;
          libelle = input.libelle;
          reference = input.reference;
          exercice = input.exercice;
        };
        mouvements.add(newMvt);

        // Mettre à jour le solde du compte
        let updatedSolde : Nat = switch (input.type_) {
          case (#Encaissement) { compte.solde + input.montant };
          case (#Decaissement) {
            if (compte.solde >= input.montant) { compte.solde - input.montant } else { 0 }
          };
        };
        comptes.add(input.compteId, { compte with solde = updatedSolde });

        // Écriture comptable automatique
        let compteScf = compte.compteComptable;
        let ecritures : [AccountingTypes.EcritureComptable] = switch (input.type_) {
          case (#Encaissement) {
            // Débit compte trésorerie (51x/53x), Crédit compte de contrepartie
            [
              { compte = compteScf; libelle = input.libelle; debit = input.montant; credit = 0 },
              { compte = "41"; libelle = input.libelle; debit = 0; credit = input.montant },
            ]
          };
          case (#Decaissement) {
            // Crédit compte trésorerie (51x/53x), Débit compte de contrepartie
            [
              { compte = "40"; libelle = input.libelle; debit = input.montant; credit = 0 },
              { compte = compteScf; libelle = input.libelle; debit = 0; credit = input.montant },
            ]
          };
        };

        let journalCode = switch (compte.type_) {
          case (#Banque) "BQ";
          case (#Caisse) "CA";
        };

        AccountingLib.createJournalEntryDirect(
          journal,
          comptesComptables,
          nextJournalId,
          input.libelle # " (" # input.reference # ")",
          journalCode,
          input.exercice,
          ecritures,
        );

        #ok id
      };
    }
  };

  /// Calcule le solde total de trésorerie (somme de tous les comptes actifs)
  public func getSoldeTresorerie(
    comptes : Map.Map<Text, CompteTresorerie>
  ) : CommonTypes.Amount {
    comptes.foldLeft(0 : Nat, func(acc : Nat, _ : Text, c : CompteTresorerie) : Nat {
      if (c.actif) { acc + c.solde } else { acc }
    })
  };
};
