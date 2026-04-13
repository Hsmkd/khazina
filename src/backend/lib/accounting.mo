/// Logique domaine comptabilité — Plan SCF, Journal, Grand Livre, Balance
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Types "../types/accounting";
import CommonTypes "../types/common";

module {

  public type Account = Types.Account;
  public type JournalEntry = Types.JournalEntry;
  public type JournalEntryInput = Types.JournalEntryInput;
  public type FiscalYear = Types.FiscalYear;
  public type AccountBalance = Types.AccountBalance;
  public type BilanData = Types.BilanData;
  public type CompteResultatsData = Types.CompteResultatsData;

  let PAGE_SIZE : Nat = 50;

  // ── Initialisation du plan comptable SCF ────────────────────────────────────

  /// Retourne la liste des comptes SCF pré-définis
  public func seedComptesSCF() : [Account] {
    [
      // CLASSE 1 — CAPITAUX
      { id = "101"; numero = "101"; libelle = "Capital social"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "106"; numero = "106"; libelle = "Réserves"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "108"; numero = "108"; libelle = "Compte de l'exploitant"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "12";  numero = "12";  libelle = "Résultat de l'exercice"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "13";  numero = "13";  libelle = "Résultat en instance d'affectation"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "15";  numero = "15";  libelle = "Provisions"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "16";  numero = "16";  libelle = "Emprunts et dettes assimilées"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "17";  numero = "17";  libelle = "Dettes rattachées à des participations"; classe = 1; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "18";  numero = "18";  libelle = "Comptes de liaisons"; classe = 1; type_ = #Bilan; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      // CLASSE 2 — IMMOBILISATIONS
      { id = "20";  numero = "20";  libelle = "Immobilisations incorporelles"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "21";  numero = "21";  libelle = "Immobilisations corporelles"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "22";  numero = "22";  libelle = "Terrains"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "23";  numero = "23";  libelle = "Constructions"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "24";  numero = "24";  libelle = "Équipements"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "25";  numero = "25";  libelle = "Autres immobilisations corporelles"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "26";  numero = "26";  libelle = "Immobilisations financières"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "27";  numero = "27";  libelle = "Autres immobilisations financières"; classe = 2; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "28";  numero = "28";  libelle = "Amortissements"; classe = 2; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "29";  numero = "29";  libelle = "Pertes de valeur"; classe = 2; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      // CLASSE 3 — STOCKS
      { id = "30";  numero = "30";  libelle = "Stocks de marchandises"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "31";  numero = "31";  libelle = "Matières premières"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "32";  numero = "32";  libelle = "Autres approvisionnements"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "33";  numero = "33";  libelle = "En-cours de production de biens"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "34";  numero = "34";  libelle = "En-cours de production de services"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "35";  numero = "35";  libelle = "Stocks de produits"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "37";  numero = "37";  libelle = "Stocks à l'extérieur"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "38";  numero = "38";  libelle = "Achats stockés"; classe = 3; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "39";  numero = "39";  libelle = "Dépréciations des stocks"; classe = 3; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      // CLASSE 4 — TIERS
      { id = "40";    numero = "40";    libelle = "Fournisseurs et comptes rattachés"; classe = 4; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "41";    numero = "41";    libelle = "Clients et comptes rattachés"; classe = 4; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "42";    numero = "42";    libelle = "Personnel et comptes rattachés"; classe = 4; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "43";    numero = "43";    libelle = "Organismes sociaux et comptes rattachés"; classe = 4; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "44";    numero = "44";    libelle = "État, collectivités et organismes publics"; classe = 4; type_ = #Bilan; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "44571"; numero = "44571"; libelle = "TVA collectée"; classe = 4; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = ?"44" },
      { id = "44572"; numero = "44572"; libelle = "TVA déductible"; classe = 4; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = ?"44" },
      { id = "445";   numero = "445";   libelle = "État — TVA"; classe = 4; type_ = #Bilan; soldeDebit = 0; soldeCredit = 0; compteParent = ?"44" },
      { id = "448";   numero = "448";   libelle = "État — autres impôts"; classe = 4; type_ = #Bilan; soldeDebit = 0; soldeCredit = 0; compteParent = ?"44" },
      { id = "49";    numero = "49";    libelle = "Dépréciations des comptes de tiers"; classe = 4; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      // CLASSE 5 — FINANCIERS
      { id = "51";  numero = "51";  libelle = "Banques, établissements financiers"; classe = 5; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "512"; numero = "512"; libelle = "Banque"; classe = 5; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = ?"51" },
      { id = "514"; numero = "514"; libelle = "Chèques postaux"; classe = 5; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = ?"51" },
      { id = "53";  numero = "53";  libelle = "Caisse"; classe = 5; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "531"; numero = "531"; libelle = "Caisse siège"; classe = 5; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = ?"53" },
      { id = "54";  numero = "54";  libelle = "Régies d'avances"; classe = 5; type_ = #Actif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "58";  numero = "58";  libelle = "Virements internes"; classe = 5; type_ = #Bilan; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "59";  numero = "59";  libelle = "Dépréciations"; classe = 5; type_ = #Passif; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      // CLASSE 6 — CHARGES
      { id = "60";  numero = "60";  libelle = "Achats et variations de stocks"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "601"; numero = "601"; libelle = "Achats de marchandises"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = ?"60" },
      { id = "602"; numero = "602"; libelle = "Achats de matières premières"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = ?"60" },
      { id = "61";  numero = "61";  libelle = "Services extérieurs"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "62";  numero = "62";  libelle = "Autres services extérieurs"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "63";  numero = "63";  libelle = "Charges de personnel"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "64";  numero = "64";  libelle = "Impôts, taxes"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "65";  numero = "65";  libelle = "Autres charges"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "66";  numero = "66";  libelle = "Charges financières"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "67";  numero = "67";  libelle = "Éléments extraordinaires (charges)"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "68";  numero = "68";  libelle = "Dotations aux amortissements"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "69";  numero = "69";  libelle = "Impôts sur les résultats (IBS)"; classe = 6; type_ = #Charges; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      // CLASSE 7 — PRODUITS
      { id = "70";  numero = "70";  libelle = "Ventes de marchandises"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "701"; numero = "701"; libelle = "Ventes de produits finis"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = ?"70" },
      { id = "706"; numero = "706"; libelle = "Prestations de services"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = ?"70" },
      { id = "707"; numero = "707"; libelle = "Ventes de marchandises (détail)"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = ?"70" },
      { id = "71";  numero = "71";  libelle = "Production stockée"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "72";  numero = "72";  libelle = "Production immobilisée"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "73";  numero = "73";  libelle = "Produits nets partiels"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "74";  numero = "74";  libelle = "Subventions d'exploitation"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "75";  numero = "75";  libelle = "Autres produits"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "76";  numero = "76";  libelle = "Produits financiers"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "77";  numero = "77";  libelle = "Éléments extraordinaires (produits)"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "78";  numero = "78";  libelle = "Reprises sur pertes de valeur"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
      { id = "79";  numero = "79";  libelle = "Transferts de charges"; classe = 7; type_ = #Produits; soldeDebit = 0; soldeCredit = 0; compteParent = null },
    ]
  };

  // ── Plan comptable ──────────────────────────────────────────────────────────

  /// Retourne tous les comptes du plan comptable
  public func getComptes(
    comptes : Map.Map<Text, Account>
  ) : [Account] {
    comptes.values() |> List.fromIter<Account>(_) |> _.toArray()
  };

  /// Retourne les comptes d'une classe donnée (1 à 7)
  public func getComptesParClasse(
    comptes : Map.Map<Text, Account>,
    classe : Nat,
  ) : [Account] {
    comptes.values()
    |> List.fromIter<Account>(_)
    |> _.filter(func(c) { c.classe == classe })
    |> _.toArray()
  };

  /// Ajoute un compte au plan comptable
  public func addCompte(
    comptes : Map.Map<Text, Account>,
    compte : Account,
  ) : CommonTypes.Result {
    if (comptes.containsKey(compte.numero)) {
      #err ("Le compte " # compte.numero # " existe déjà")
    } else {
      comptes.add(compte.numero, compte);
      #ok
    }
  };

  /// Met à jour un compte existant
  public func updateCompte(
    comptes : Map.Map<Text, Account>,
    id : Text,
    compte : Account,
  ) : CommonTypes.Result {
    switch (comptes.get(id)) {
      case null { #err "Compte introuvable" };
      case (?_) {
        comptes.add(id, compte);
        #ok
      };
    }
  };

  // ── Journal comptable ───────────────────────────────────────────────────────

  /// Retourne les écritures du journal paginées
  public func getJournalEntries(
    journal : List.List<JournalEntry>,
    exercice : Nat,
    page : Nat,
  ) : { entries : [JournalEntry]; total : Nat } {
    let filtered = journal.filter(func(e) { e.exercice == exercice });
    let total = filtered.size();
    let start = page * PAGE_SIZE;
    if (start >= total) {
      return { entries = []; total }
    };
    let end_ = Nat.min(start + PAGE_SIZE, total);
    { entries = filtered.sliceToArray(start, end_); total }
  };

  /// Retourne une écriture de journal par son identifiant
  public func getJournalEntry(
    journal : List.List<JournalEntry>,
    id : Text,
  ) : ?JournalEntry {
    journal.find(func(e) { e.id == id })
  };

  /// Vérifie l'équilibre débit/crédit d'une liste d'écritures
  func isEquilibre(ecritures : [Types.EcritureComptable]) : Bool {
    var totalDebit : Nat = 0;
    var totalCredit : Nat = 0;
    for (e in ecritures.values()) {
      totalDebit += e.debit;
      totalCredit += e.credit;
    };
    totalDebit == totalCredit
  };

  /// Génère un identifiant unique d'écriture de journal
  func makeJournalId(exercice : Nat, numero : Nat) : Text {
    "JRN-" # exercice.toText() # "-" # numero.toText()
  };

  /// Crée une nouvelle écriture de journal (non validée)
  public func createJournalEntry(
    journal : List.List<JournalEntry>,
    _comptes : Map.Map<Text, Account>,
    nextId : Nat,
    entry : JournalEntryInput,
  ) : CommonTypes.ResultValue<Text> {
    if (not isEquilibre(entry.ecritures)) {
      return #err "L'écriture n'est pas équilibrée (Σdébit ≠ Σcrédit)"
    };
    let id = makeJournalId(entry.exercice, nextId);
    let newEntry : JournalEntry = {
      id;
      numero = nextId;
      date_ = entry.date_;
      libelle = entry.libelle;
      ecritures = entry.ecritures;
      valide = false;
      exercice = entry.exercice;
      journalCode = entry.journalCode;
    };
    journal.add(newEntry);
    #ok id
  };

  /// Valide une écriture de journal et met à jour les soldes des comptes
  public func validateJournalEntry(
    journal : List.List<JournalEntry>,
    comptes : Map.Map<Text, Account>,
    id : Text,
  ) : CommonTypes.Result {
    switch (journal.findIndex(func(e) { e.id == id })) {
      case null { #err "Écriture introuvable" };
      case (?idx) {
        let entry = journal.at(idx);
        if (entry.valide) {
          return #err "Cette écriture est déjà validée"
        };
        // Mettre à jour les soldes des comptes
        for (ligne in entry.ecritures.values()) {
          switch (comptes.get(ligne.compte)) {
            case null { /* compte non trouvé — ignorer */ };
            case (?compte) {
              let updated = {
                compte with
                soldeDebit = compte.soldeDebit + ligne.debit;
                soldeCredit = compte.soldeCredit + ligne.credit;
              };
              comptes.add(ligne.compte, updated)
            };
          }
        };
        // Marquer comme validée
        journal.put(idx, { entry with valide = true });
        #ok
      };
    }
  };

  /// Supprime une écriture non validée
  public func deleteJournalEntry(
    journal : List.List<JournalEntry>,
    id : Text,
  ) : CommonTypes.Result {
    switch (journal.findIndex(func(e) { e.id == id })) {
      case null { #err "Écriture introuvable" };
      case (?idx) {
        let entry = journal.at(idx);
        if (entry.valide) {
          return #err "Impossible de supprimer une écriture validée"
        };
        // Reconstruit la liste sans cet élément
        let newJournal = journal.filter(func(e) { e.id != id });
        journal.clear();
        journal.append(newJournal);
        #ok
      };
    }
  };

  // ── Grand Livre et Balance ──────────────────────────────────────────────────

  /// Retourne toutes les écritures d'un compte (grand livre individuel)
  public func getGrandLivre(
    journal : List.List<JournalEntry>,
    compteNumero : Text,
    exercice : Nat,
  ) : [JournalEntry] {
    journal.filter(func(e) {
      e.exercice == exercice and
      e.ecritures.any(func(ligne) { ligne.compte == compteNumero })
    })
    |> _.toArray()
  };

  /// Calcule la balance générale de tous les comptes
  public func getBalance(
    comptes : Map.Map<Text, Account>,
    journal : List.List<JournalEntry>,
    exercice : Nat,
  ) : [AccountBalance] {
    // Accumulate per-account totals from validated journal entries
    let debitMap = Map.empty<Text, Nat>();
    let creditMap = Map.empty<Text, Nat>();

    journal.forEach(func(entry) {
      if (entry.exercice == exercice and entry.valide) {
        for (ligne in entry.ecritures.values()) {
          let prevD = switch (debitMap.get(ligne.compte)) { case (?v) v; case null 0 };
          let prevC = switch (creditMap.get(ligne.compte)) { case (?v) v; case null 0 };
          debitMap.add(ligne.compte, prevD + ligne.debit);
          creditMap.add(ligne.compte, prevC + ligne.credit)
        }
      }
    });

    let result = List.empty<AccountBalance>();
    for ((numero, compte) in comptes.entries()) {
      let totalDebit = switch (debitMap.get(numero)) { case (?v) v; case null 0 };
      let totalCredit = switch (creditMap.get(numero)) { case (?v) v; case null 0 };
      if (totalDebit > 0 or totalCredit > 0) {
        let estDebiteur = totalDebit >= totalCredit;
        let solde = if (estDebiteur) { Nat.sub(totalDebit, totalCredit) } else { Nat.sub(totalCredit, totalDebit) };
        result.add({
          compte;
          totalDebit;
          totalCredit;
          solde;
          estDebiteur;
        })
      }
    };
    result.toArray()
  };

  /// Génère les données du Bilan (Actif / Passif)
  public func getBilan(
    comptes : Map.Map<Text, Account>,
    journal : List.List<JournalEntry>,
    exercice : Nat,
  ) : BilanData {
    let balance = getBalance(comptes, journal, exercice);
    let actifDetails = List.empty<AccountBalance>();
    let passifDetails = List.empty<AccountBalance>();

    for (ab in balance.values()) {
      switch (ab.compte.type_) {
        case (#Actif) { actifDetails.add(ab) };
        case (#Passif) { passifDetails.add(ab) };
        case _ {};
      }
    };

    let totalActif = actifDetails.foldLeft(0, func(acc : Nat, ab : AccountBalance) : Nat { acc + ab.solde });
    let totalPassif = passifDetails.foldLeft(0, func(acc : Nat, ab : AccountBalance) : Nat { acc + ab.solde });

    {
      exercice;
      totalActif;
      totalPassif;
      actifDetails = actifDetails.toArray();
      passifDetails = passifDetails.toArray();
      estEquilibre = totalActif == totalPassif;
    }
  };

  /// Génère les données du Compte de Résultats
  public func getCompteResultats(
    comptes : Map.Map<Text, Account>,
    journal : List.List<JournalEntry>,
    exercice : Nat,
  ) : CompteResultatsData {
    let balance = getBalance(comptes, journal, exercice);
    let chargesDetails = List.empty<AccountBalance>();
    let produitsDetails = List.empty<AccountBalance>();

    for (ab in balance.values()) {
      switch (ab.compte.type_) {
        case (#Charges) { chargesDetails.add(ab) };
        case (#Produits) { produitsDetails.add(ab) };
        case _ {};
      }
    };

    let totalCharges = chargesDetails.foldLeft(0, func(acc : Nat, ab : AccountBalance) : Nat { acc + ab.totalDebit });
    let totalProduits = produitsDetails.foldLeft(0, func(acc : Nat, ab : AccountBalance) : Nat { acc + ab.totalCredit });
    let estBenefice = totalProduits >= totalCharges;
    let resultatNet = if (estBenefice) { Nat.sub(totalProduits, totalCharges) } else { Nat.sub(totalCharges, totalProduits) };

    {
      exercice;
      totalCharges;
      totalProduits;
      resultatNet;
      estBenefice;
      chargesDetails = chargesDetails.toArray();
      produitsDetails = produitsDetails.toArray();
    }
  };

  // ── Exercices fiscaux ───────────────────────────────────────────────────────

  /// Retourne tous les exercices fiscaux
  public func getExercices(
    exercices : List.List<FiscalYear>
  ) : [FiscalYear] {
    exercices.toArray()
  };

  /// Crée un nouvel exercice fiscal
  public func createExercice(
    exercices : List.List<FiscalYear>,
    annee : Nat,
  ) : CommonTypes.Result {
    switch (exercices.find(func(e) { e.annee == annee })) {
      case (?_) { #err ("L'exercice " # annee.toText() # " existe déjà") };
      case null {
        // Timestamp de début (1er janvier) et fin (31 décembre) en nanosecondes
        // Approximation : annee * 365.25 jours depuis epoch 1970
        let debutMs : Int = (annee - 1970) * 365 * 24 * 3600 * 1_000_000_000;
        let finMs : Int = debutMs + 365 * 24 * 3600 * 1_000_000_000;
        exercices.add({
          annee;
          debut = debutMs;
          fin = finMs;
          cloture = false;
        });
        #ok
      };
    }
  };

  /// Clôture un exercice fiscal (interdit nouvelles écritures)
  public func cloturerExercice(
    exercices : List.List<FiscalYear>,
    annee : Nat,
  ) : CommonTypes.Result {
    switch (exercices.findIndex(func(e) { e.annee == annee })) {
      case null { #err ("Exercice " # annee.toText() # " introuvable") };
      case (?idx) {
        let ex = exercices.at(idx);
        if (ex.cloture) {
          #err "Cet exercice est déjà clôturé"
        } else {
          exercices.put(idx, { ex with cloture = true });
          #ok
        }
      };
    }
  };

  // ── Création automatique d'écritures comptables ─────────────────────────────

  /// Crée une écriture comptable directement (utilisé par invoice/treasury)
  public func createJournalEntryDirect(
    journal : List.List<JournalEntry>,
    comptes : Map.Map<Text, Account>,
    nextId : { var value : Nat },
    libelle : Text,
    journalCode : Text,
    exercice : Nat,
    ecritures : [Types.EcritureComptable],
  ) : () {
    if (not isEquilibre(ecritures)) {
      return // Écriture non équilibrée — ignorer
    };
    let id = makeJournalId(exercice, nextId.value);
    let entry : JournalEntry = {
      id;
      numero = nextId.value;
      date_ = Time.now();
      libelle;
      ecritures;
      valide = true; // Écriture automatique : validée immédiatement
      exercice;
      journalCode;
    };
    nextId.value += 1;
    journal.add(entry);
    // Mettre à jour les soldes
    for (ligne in ecritures.values()) {
      switch (comptes.get(ligne.compte)) {
        case null {};
        case (?compte) {
          comptes.add(
            ligne.compte,
            { compte with
              soldeDebit = compte.soldeDebit + ligne.debit;
              soldeCredit = compte.soldeCredit + ligne.credit;
            },
          )
        };
      }
    }
  };
};
