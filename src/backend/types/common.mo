/// Types communs partagés à travers tous les domaines — Hazine SaaS
module {

  /// Identifiant unique d'un utilisateur (principal Internet Identity)
  public type UserId = Principal;

  /// Identifiant unique d'une entreprise (tenant SaaS)
  public type CompanyId = Text;

  /// Horodatage en nanosecondes (Int, retourné par Time.now())
  public type Timestamp = Int;

  /// Montant monétaire en centimes DZD (ex: 100000 = 1000,00 DZD)
  public type Amount = Nat;

  /// Devise — uniquement DZD pour cette application
  public type Currency = { #DZD };

  /// Rôles utilisateur dans le système multi-tenant
  public type Role = {
    #Admin;       // Accès complet : paramètres, utilisateurs, toutes opérations
    #Comptable;   // Accès journal, grand livre, factures, trésorerie
    #Gestionnaire;// Accès stocks, produits, mouvements
    #Lecteur;     // Lecture seule sur tous les modules
  };

  /// Résultat générique pour les opérations de mutation
  public type Result = { #ok; #err : Text };

  /// Résultat générique avec valeur de retour
  public type ResultValue<T> = { #ok : T; #err : Text };

  /// Paramètres de pagination
  public type PageParams = { page : Nat; pageSize : Nat };

  /// Informations de l'entreprise (tenant)
  public type CompanyInfo = {
    nom : Text;
    adresse : Text;
    nif : Text;       // Numéro d'Identification Fiscale
    nis : Text;       // Numéro d'Identification Statistique
    rc : Text;        // Registre de Commerce
    telephone : Text;
    email : Text;
    activite : Text;  // Secteur d'activité (commerce, production, hydrocarbures)
    exerciceActuel : Nat; // Année de l'exercice courant
  };

  /// Profil utilisateur affiché dans l'interface
  public type UserProfile = {
    userId : UserId;
    nom : Text;
    email : Text;
    role : Role;
    actif : Bool;
  };
};
