// Re-export all backend types for use throughout the app
import type React from "react";
export type {
  Account,
  AccountBalance,
  Amount,
  BilanData,
  CompanyInfo,
  CompteResultatsData,
  CompteTresorerie,
  CompteTresorerieInput,
  EcritureComptable,
  Facture,
  FactureInput,
  FiscalYear,
  JournalEntry,
  JournalEntryInput,
  LigneFacture,
  MouvementStock,
  MouvementStockInput,
  MouvementTresorerie,
  MouvementTresorerieInput,
  Option,
  Produit,
  ProduitInput,
  Result,
  ResultValue,
  Tiers,
  TiersInput,
  Timestamp,
  UserId,
  UserProfile,
  ValeurStock,
} from "../backend";

// Export enums from backend implementation
export {
  AccountType,
  FactureStatut,
  FactureType,
  MouvementType,
  MvtType,
  Role,
  TresoType,
  UserRole,
} from "../backend";

// Dashboard stats type
export interface DashboardStats {
  totalDettes: bigint;
  resultatNet: bigint;
  totalCreances: bigint;
  nombreFacturesEnAttente: bigint;
  alertesStock: bigint;
  chiffreAffaires: bigint;
  soldeTresorerie: bigint;
}

// Navigation item type
export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}
