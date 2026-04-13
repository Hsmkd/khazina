import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CompteTresorerie {
    id: string;
    actif: boolean;
    libelle: string;
    compteComptable: string;
    type: TresoType;
    banque?: string;
    solde: Amount;
    numeroCompte?: string;
}
export interface FactureInput {
    date: Timestamp;
    tiersId: string;
    type: FactureType;
    exercice: bigint;
    dateEcheance?: Timestamp;
    notes: string;
    lignes: Array<LigneFacture>;
}
export type Timestamp = bigint;
export interface Produit {
    id: string;
    actif: boolean;
    code: string;
    stockActuel: number;
    designation: string;
    compteStock: string;
    prixAchat: Amount;
    prixVente: Amount;
    unite: string;
    stockMinimum: number;
}
export interface MouvementTresorerie {
    id: string;
    libelle: string;
    date: Timestamp;
    type: MvtType;
    exercice: bigint;
    reference: string;
    compteId: string;
    montant: Amount;
}
export interface MouvementStockInput {
    date: Timestamp;
    type: MouvementType;
    exercice: bigint;
    reference: string;
    produitId: string;
    notes: string;
    quantite: number;
    prixUnitaire: Amount;
}
export interface LigneFacture {
    montantHT: Amount;
    montantTTC: Amount;
    montantTVA: Amount;
    designation: string;
    tauxTVA: number;
    produitId?: string;
    quantite: number;
    prixUnitaire: Amount;
}
export interface Account {
    id: string;
    soldeDebit: Amount;
    classe: bigint;
    libelle: string;
    type: AccountType;
    numero: string;
    soldeCredit: Amount;
    compteParent?: string;
}
export interface Facture {
    id: string;
    statut: FactureStatut;
    date: Timestamp;
    totalHT: Amount;
    tiersId: string;
    type: FactureType;
    exercice: bigint;
    dateEcheance?: Timestamp;
    totalTTC: Amount;
    totalTVA: Amount;
    notes: string;
    numero: string;
    lignes: Array<LigneFacture>;
}
export interface MouvementStock {
    id: string;
    date: Timestamp;
    type: MouvementType;
    exercice: bigint;
    reference: string;
    produitId: string;
    notes: string;
    quantite: number;
    prixUnitaire: Amount;
}
export interface BilanData {
    totalActif: Amount;
    exercice: bigint;
    passifDetails: Array<AccountBalance>;
    estEquilibre: boolean;
    actifDetails: Array<AccountBalance>;
    totalPassif: Amount;
}
export interface CompteResultatsData {
    totalProduits: Amount;
    resultatNet: Amount;
    produitsDetails: Array<AccountBalance>;
    exercice: bigint;
    estBenefice: boolean;
    totalCharges: Amount;
    chargesDetails: Array<AccountBalance>;
}
export interface EcritureComptable {
    libelle: string;
    credit: Amount;
    compte: string;
    debit: Amount;
}
export interface TiersInput {
    rc: string;
    nif: string;
    nis: string;
    nom: string;
    estClient: boolean;
    compteComptable: string;
    email: string;
    adresse: string;
    estFournisseur: boolean;
    telephone: string;
}
export interface AccountBalance {
    totalCredit: Amount;
    estDebiteur: boolean;
    solde: Amount;
    compte: Account;
    totalDebit: Amount;
}
export interface CompanyInfo {
    rc: string;
    nif: string;
    nis: string;
    nom: string;
    email: string;
    exerciceActuel: bigint;
    adresse: string;
    telephone: string;
    activite: string;
}
export interface Tiers {
    id: string;
    rc: string;
    nif: string;
    nis: string;
    nom: string;
    estClient: boolean;
    compteComptable: string;
    email: string;
    adresse: string;
    estFournisseur: boolean;
    telephone: string;
}
export type Amount = bigint;
export type ResultValue = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface ProduitInput {
    code: string;
    designation: string;
    compteStock: string;
    prixAchat: Amount;
    prixVente: Amount;
    unite: string;
    stockMinimum: number;
}
export interface MouvementTresorerieInput {
    libelle: string;
    date: Timestamp;
    type: MvtType;
    exercice: bigint;
    reference: string;
    compteId: string;
    montant: Amount;
}
export type UserId = Principal;
export interface FiscalYear {
    fin: Timestamp;
    annee: bigint;
    cloture: boolean;
    debut: Timestamp;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface JournalEntry {
    id: string;
    libelle: string;
    date: Timestamp;
    valide: boolean;
    exercice: bigint;
    journalCode: string;
    numero: bigint;
    ecritures: Array<EcritureComptable>;
}
export interface CompteTresorerieInput {
    libelle: string;
    compteComptable: string;
    soldeinitial: Amount;
    type: TresoType;
    banque?: string;
    numeroCompte?: string;
}
export interface JournalEntryInput {
    libelle: string;
    date: Timestamp;
    exercice: bigint;
    journalCode: string;
    ecritures: Array<EcritureComptable>;
}
export interface ValeurStock {
    designation: string;
    prixMoyenPondere: Amount;
    produitId: string;
    quantite: number;
    valeurTotale: Amount;
}
export interface UserProfile {
    nom: string;
    actif: boolean;
    userId: UserId;
    role: Role;
    email: string;
}
export enum AccountType {
    Passif = "Passif",
    Bilan = "Bilan",
    Charges = "Charges",
    Produits = "Produits",
    Actif = "Actif"
}
export enum FactureStatut {
    Annulee = "Annulee",
    Validee = "Validee",
    Payee = "Payee",
    Brouillon = "Brouillon"
}
export enum FactureType {
    Achat = "Achat",
    Vente = "Vente"
}
export enum MouvementType {
    Entree = "Entree",
    Sortie = "Sortie",
    Ajustement = "Ajustement"
}
export enum MvtType {
    Decaissement = "Decaissement",
    Encaissement = "Encaissement"
}
export enum Role {
    Lecteur = "Lecteur",
    Gestionnaire = "Gestionnaire",
    Comptable = "Comptable",
    Admin = "Admin"
}
export enum TresoType {
    Banque = "Banque",
    Caisse = "Caisse"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
/**
 * / Hazine — SaaS Comptabilité Algérienne (Conforme SCF - Loi 07-11)
 * / Racine de composition : déclare l'état, importe et inclut les mixins.
 * / Aucune logique métier ici — tout est délégué aux mixins.
 */
export interface backendInterface {
    addCompte(compte: Account): Promise<Result>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cloturerExercice(annee: bigint): Promise<Result>;
    createCompteTresorerie(compte: CompteTresorerieInput): Promise<ResultValue>;
    createExercice(annee: bigint): Promise<Result>;
    createFacture(facture: FactureInput): Promise<ResultValue>;
    createJournalEntry(entry: JournalEntryInput): Promise<ResultValue>;
    createMouvementStock(mvt: MouvementStockInput): Promise<ResultValue>;
    createMouvementTresorerie(mvt: MouvementTresorerieInput): Promise<ResultValue>;
    createProduit(produit: ProduitInput): Promise<ResultValue>;
    createTiers(input: TiersInput): Promise<ResultValue>;
    deleteFacture(id: string): Promise<Result>;
    deleteJournalEntry(id: string): Promise<Result>;
    getBalance(exercice: bigint): Promise<Array<AccountBalance>>;
    getBilan(exercice: bigint): Promise<BilanData>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompanyInfo(): Promise<CompanyInfo | null>;
    getCompteResultats(exercice: bigint): Promise<CompteResultatsData>;
    getComptes(): Promise<Array<Account>>;
    getComptesParClasse(classe: bigint): Promise<Array<Account>>;
    getComptesTresorerie(): Promise<Array<CompteTresorerie>>;
    getDashboardStats(exercice: bigint): Promise<{
        totalDettes: Amount;
        resultatNet: Amount;
        totalCreances: Amount;
        nombreFacturesEnAttente: bigint;
        alertesStock: bigint;
        chiffreAffaires: Amount;
        soldeTresorerie: Amount;
    }>;
    getExercices(): Promise<Array<FiscalYear>>;
    getFacture(id: string): Promise<Facture | null>;
    getFactures(type: FactureType, exercice: bigint, page: bigint): Promise<{
        total: bigint;
        factures: Array<Facture>;
    }>;
    getGrandLivre(compteNumero: string, exercice: bigint): Promise<Array<JournalEntry>>;
    getJournalEntries(exercice: bigint, page: bigint): Promise<{
        total: bigint;
        entries: Array<JournalEntry>;
    }>;
    getJournalEntry(id: string): Promise<JournalEntry | null>;
    getMouvementsStock(produitId: string | null, exercice: bigint, page: bigint): Promise<{
        mouvements: Array<MouvementStock>;
        total: bigint;
    }>;
    getMouvementsTresorerie(compteId: string | null, exercice: bigint, page: bigint): Promise<{
        mouvements: Array<MouvementTresorerie>;
        total: bigint;
    }>;
    getProduit(id: string): Promise<Produit | null>;
    getProduits(): Promise<Array<Produit>>;
    getProduitsEnRuptureOuAlerte(): Promise<Array<Produit>>;
    getSoldeTresorerie(): Promise<Amount>;
    getTiers(): Promise<Array<Tiers>>;
    getTiersById(id: string): Promise<Tiers | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsers(): Promise<Array<UserProfile>>;
    getValeurStock(): Promise<Array<ValeurStock>>;
    initData(): Promise<void>;
    initTresorerie(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCompanyInfo(info: CompanyInfo): Promise<Result>;
    updateCompte(id: string, compte: Account): Promise<Result>;
    updateProduit(id: string, produit: ProduitInput): Promise<Result>;
    updateTiers(id: string, input: TiersInput): Promise<Result>;
    updateUserRole(userId: UserId, role: Role): Promise<Result>;
    validateFacture(id: string): Promise<Result>;
    validateJournalEntry(id: string): Promise<Result>;
}
