/// Logique domaine facturation — Clients, Fournisseurs, Factures
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Types "../types/invoice";
import AccountingTypes "../types/accounting";
import AccountingLib "../lib/accounting";
import CommonTypes "../types/common";

module {

  public type Tiers = Types.Tiers;
  public type TiersInput = Types.TiersInput;
  public type Facture = Types.Facture;
  public type FactureInput = Types.FactureInput;
  public type FactureType = Types.FactureType;

  let PAGE_SIZE : Nat = 50;

  // ── Tiers (clients et fournisseurs) ────────────────────────────────────────

  /// Retourne tous les tiers
  public func getTiers(
    tiers : Map.Map<Text, Tiers>
  ) : [Tiers] {
    tiers.values() |> List.fromIter<Tiers>(_) |> _.toArray()
  };

  /// Retourne un tiers par son identifiant
  public func getTiersById(
    tiers : Map.Map<Text, Tiers>,
    id : Text,
  ) : ?Tiers {
    tiers.get(id)
  };

  /// Crée un nouveau tiers
  public func createTiers(
    tiers : Map.Map<Text, Tiers>,
    input : TiersInput,
  ) : CommonTypes.ResultValue<Text> {
    if (input.nom == "") {
      return #err "Le nom du tiers est obligatoire"
    };
    let id = "TIERS-" # (tiers.size() + 1).toText() # "-" # Int.abs(Time.now()).toText();
    let newTiers : Tiers = {
      id;
      nom = input.nom;
      adresse = input.adresse;
      nif = input.nif;
      nis = input.nis;
      rc = input.rc;
      telephone = input.telephone;
      email = input.email;
      estClient = input.estClient;
      estFournisseur = input.estFournisseur;
      compteComptable = input.compteComptable;
    };
    tiers.add(id, newTiers);
    #ok id
  };

  /// Met à jour un tiers existant
  public func updateTiers(
    tiers : Map.Map<Text, Tiers>,
    id : Text,
    input : TiersInput,
  ) : CommonTypes.Result {
    switch (tiers.get(id)) {
      case null { #err "Tiers introuvable" };
      case (?t) {
        tiers.add(id, {
          t with
          nom = input.nom;
          adresse = input.adresse;
          nif = input.nif;
          nis = input.nis;
          rc = input.rc;
          telephone = input.telephone;
          email = input.email;
          estClient = input.estClient;
          estFournisseur = input.estFournisseur;
          compteComptable = input.compteComptable;
        });
        #ok
      };
    }
  };

  // ── Factures ────────────────────────────────────────────────────────────────

  /// Retourne les factures paginées (ventes ou achats)
  public func getFactures(
    factures : List.List<Facture>,
    type_ : FactureType,
    exercice : Nat,
    page : Nat,
  ) : { factures : [Facture]; total : Nat } {
    let filtered = factures.filter(func(f) {
      f.type_ == type_ and f.exercice == exercice
    });
    let total = filtered.size();
    let start = page * PAGE_SIZE;
    if (start >= total) {
      return { factures = []; total }
    };
    let end_ = Nat.min(start + PAGE_SIZE, total);
    { factures = filtered.sliceToArray(start, end_); total }
  };

  /// Retourne une facture par son identifiant
  public func getFacture(
    factures : List.List<Facture>,
    id : Text,
  ) : ?Facture {
    factures.find(func(f) { f.id == id })
  };

  /// Génère le numéro de facture selon le type
  func makeFactureNumero(type_ : FactureType, exercice : Nat, count : Nat) : Text {
    let prefix = switch (type_) { case (#Vente) "VTE"; case (#Achat) "ACH" };
    let num = count + 1;
    let numStr = if (num < 10) { "0000" # num.toText() }
    else if (num < 100) { "000" # num.toText() }
    else if (num < 1000) { "00" # num.toText() }
    else if (num < 10000) { "0" # num.toText() }
    else { num.toText() };
    prefix # "-" # exercice.toText() # "-" # numStr
  };

  /// Calcule les montants d'une ligne de facture
  func computeLigne(l : Types.LigneFacture) : Types.LigneFacture {
    let montantHT = Int.abs((l.quantite * l.prixUnitaire.toFloat()).toInt());
    let montantTVA = Int.abs((montantHT.toFloat() * l.tauxTVA / 100.0).toInt());
    let montantTTC = montantHT + montantTVA;
    { l with montantHT; montantTVA; montantTTC }
  };

  /// Crée une nouvelle facture en brouillon
  public func createFacture(
    factures : List.List<Facture>,
    input : FactureInput,
  ) : CommonTypes.ResultValue<Text> {
    if (input.tiersId == "") {
      return #err "Le tiers est obligatoire"
    };
    if (input.lignes.size() == 0) {
      return #err "La facture doit contenir au moins une ligne"
    };

    // Compter factures du même type et exercice pour le numéro
    let count = factures.foldLeft(0, func(acc : Nat, f : Facture) : Nat {
      if (f.type_ == input.type_ and f.exercice == input.exercice) { acc + 1 } else { acc }
    });

    let id = "FAC-" # (factures.size() + 1).toText() # "-" # count.toText();
    let numero = makeFactureNumero(input.type_, input.exercice, count);

    // Calculer les lignes et totaux
    let lignesCalculees = input.lignes.map(func(l : Types.LigneFacture) : Types.LigneFacture { computeLigne(l) });
    let totalHT = lignesCalculees.foldLeft(0, func(acc : Nat, l : Types.LigneFacture) : Nat { acc + l.montantHT });
    let totalTVA = lignesCalculees.foldLeft(0, func(acc : Nat, l : Types.LigneFacture) : Nat { acc + l.montantTVA });
    let totalTTC = totalHT + totalTVA;

    let newFacture : Facture = {
      id;
      numero;
      date_ = input.date_;
      type_ = input.type_;
      tiersId = input.tiersId;
      lignes = lignesCalculees;
      totalHT;
      totalTVA;
      totalTTC;
      statut = #Brouillon;
      exercice = input.exercice;
      dateEcheance = input.dateEcheance;
      notes = input.notes;
    };
    factures.add(newFacture);
    #ok id
  };

  /// Valide une facture et crée l'écriture comptable automatique
  public func validateFacture(
    factures : List.List<Facture>,
    journal : List.List<AccountingTypes.JournalEntry>,
    comptes : Map.Map<Text, AccountingTypes.Account>,
    nextJournalId : { var value : Nat },
    id : Text,
  ) : CommonTypes.Result {
    switch (factures.findIndex(func(f) { f.id == id })) {
      case null { #err "Facture introuvable" };
      case (?idx) {
        let facture = factures.at(idx);
        switch (facture.statut) {
          case (#Brouillon) {};
          case _ { return #err "Seules les factures en brouillon peuvent être validées" };
        };

        // Créer l'écriture comptable automatique
        let ecritures : [AccountingTypes.EcritureComptable] = switch (facture.type_) {
          case (#Vente) {
            // Débit 41 (clients) = totalTTC, Crédit 70 (ventes) = totalHT, Crédit 44571 (TVA collectée) = totalTVA
            [
              { compte = "41"; libelle = "Clients — " # facture.numero; debit = facture.totalTTC; credit = 0 },
              { compte = "70"; libelle = "Ventes — " # facture.numero; debit = 0; credit = facture.totalHT },
              { compte = "44571"; libelle = "TVA collectée — " # facture.numero; debit = 0; credit = facture.totalTVA },
            ]
          };
          case (#Achat) {
            // Débit 60 (achats) = totalHT, Débit 44572 (TVA déductible) = totalTVA, Crédit 40 (fournisseurs) = totalTTC
            [
              { compte = "60"; libelle = "Achats — " # facture.numero; debit = facture.totalHT; credit = 0 },
              { compte = "44572"; libelle = "TVA déductible — " # facture.numero; debit = facture.totalTVA; credit = 0 },
              { compte = "40"; libelle = "Fournisseurs — " # facture.numero; debit = 0; credit = facture.totalTTC },
            ]
          };
        };

        AccountingLib.createJournalEntryDirect(
          journal,
          comptes,
          nextJournalId,
          "Validation facture " # facture.numero,
          switch (facture.type_) { case (#Vente) "VTE"; case (#Achat) "ACH" },
          facture.exercice,
          ecritures,
        );

        // Mettre à jour le statut
        factures.put(idx, { facture with statut = #Validee });
        #ok
      };
    }
  };

  /// Supprime une facture en brouillon
  public func deleteFacture(
    factures : List.List<Facture>,
    id : Text,
  ) : CommonTypes.Result {
    switch (factures.find(func(f) { f.id == id })) {
      case null { #err "Facture introuvable" };
      case (?f) {
        switch (f.statut) {
          case (#Brouillon) {
            let newList = factures.filter(func(x) { x.id != id });
            factures.clear();
            factures.append(newList);
            #ok
          };
          case _ { #err "Seules les factures en brouillon peuvent être supprimées" };
        }
      };
    }
  };

  /// Calcule le montant total des créances clients (factures vente non payées)
  public func getTotalCreances(
    factures : List.List<Facture>,
    exercice : Nat,
  ) : CommonTypes.Amount {
    factures.foldLeft(0, func(acc : Nat, f : Facture) : Nat {
      if (f.exercice == exercice and f.type_ == #Vente) {
        switch (f.statut) {
          case (#Validee or #Brouillon) { acc + f.totalTTC };
          case _ { acc };
        }
      } else { acc }
    })
  };

  /// Calcule le montant total des dettes fournisseurs (factures achat non payées)
  public func getTotalDettes(
    factures : List.List<Facture>,
    exercice : Nat,
  ) : CommonTypes.Amount {
    factures.foldLeft(0, func(acc : Nat, f : Facture) : Nat {
      if (f.exercice == exercice and f.type_ == #Achat) {
        switch (f.statut) {
          case (#Validee or #Brouillon) { acc + f.totalTTC };
          case _ { acc };
        }
      } else { acc }
    })
  };

  /// Compte les factures en attente de validation
  public func getNombreFacturesEnAttente(
    factures : List.List<Facture>,
    exercice : Nat,
  ) : Nat {
    factures.foldLeft(0, func(acc : Nat, f : Facture) : Nat {
      if (f.exercice == exercice) {
        switch (f.statut) {
          case (#Brouillon) { acc + 1 };
          case _ { acc };
        }
      } else { acc }
    })
  };
};
