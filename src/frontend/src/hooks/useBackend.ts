import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Account,
  CompanyInfo,
  CompteTresorerieInput,
  FactureInput,
  FactureType,
  JournalEntryInput,
  MouvementStockInput,
  MouvementTresorerieInput,
  ProduitInput,
  Role,
  TiersInput,
  UserId,
  UserProfile,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export function useDashboardStats(exercice: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["dashboard", exercice.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Exercices ───────────────────────────────────────────────────────────────

export function useExercices() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["exercices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCreateExercice() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (annee: bigint) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createExercice(annee);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercices"] }),
  });
}

// ─── Plan Comptable ───────────────────────────────────────────────────────────

export function useComptes() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["comptes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComptes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useComptesParClasse(classe: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["comptes", "classe", classe.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComptesParClasse(classe);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAddCompte() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (compte: Account) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.addCompte(compte);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comptes"] }),
  });
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export function useJournalEntries(exercice: bigint, page: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["journal", exercice.toString(), page.toString()],
    queryFn: async () => {
      if (!actor) return { entries: [], total: 0n };
      return actor.getJournalEntries(exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCreateJournalEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: JournalEntryInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createJournalEntry(entry);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  });
}

export function useValidateJournalEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.validateJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.deleteJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  });
}

// ─── Grand Livre ──────────────────────────────────────────────────────────────

export function useGrandLivre(compteNumero: string, exercice: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["grandLivre", compteNumero, exercice.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGrandLivre(compteNumero, exercice);
    },
    enabled: !!actor && !isFetching && !!compteNumero,
    staleTime: 15_000,
  });
}

// ─── Balance ─────────────────────────────────────────────────────────────────

export function useBalance(exercice: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["balance", exercice.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBalance(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── États Financiers ─────────────────────────────────────────────────────────

export function useBilan(exercice: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["bilan", exercice.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBilan(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCompteResultats(exercice: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["compteResultats", exercice.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompteResultats(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Tiers ────────────────────────────────────────────────────────────────────

export function useTiers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["tiers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTiers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCreateTiers() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TiersInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createTiers(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tiers"] }),
  });
}

export function useUpdateTiers() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: TiersInput }) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateTiers(id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tiers"] }),
  });
}

// ─── Factures ─────────────────────────────────────────────────────────────────

export function useFactures(type: FactureType, exercice: bigint, page: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["factures", type, exercice.toString(), page.toString()],
    queryFn: async () => {
      if (!actor) return { factures: [], total: 0n };
      return actor.getFactures(type, exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCreateFacture() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (facture: FactureInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createFacture(facture);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] }),
  });
}

export function useValidateFacture() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.validateFacture(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["factures"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteFacture() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.deleteFacture(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] }),
  });
}

// ─── Produits / Stocks ────────────────────────────────────────────────────────

export function useProduits() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["produits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProduits();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCreateProduit() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (produit: ProduitInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createProduit(produit);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] }),
  });
}

export function useUpdateProduit() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      produit,
    }: { id: string; produit: ProduitInput }) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateProduit(id, produit);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] }),
  });
}

export function useMouvementsStock(
  produitId: string | null,
  exercice: bigint,
  page: bigint,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [
      "mouvementsStock",
      produitId,
      exercice.toString(),
      page.toString(),
    ],
    queryFn: async () => {
      if (!actor) return { mouvements: [], total: 0n };
      return actor.getMouvementsStock(produitId, exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCreateMouvementStock() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mvt: MouvementStockInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createMouvementStock(mvt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mouvementsStock"] });
      qc.invalidateQueries({ queryKey: ["produits"] });
      qc.invalidateQueries({ queryKey: ["valeurStock"] });
    },
  });
}

export function useValeurStock() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["valeurStock"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getValeurStock();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useProduitsEnAlerte() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["produitsEnAlerte"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProduitsEnRuptureOuAlerte();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Trésorerie ───────────────────────────────────────────────────────────────

export function useComptesTresorerie() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["comptesTresorerie"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComptesTresorerie();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMouvementsTresorerie(
  compteId: string | null,
  exercice: bigint,
  page: bigint,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [
      "mouvementsTresorerie",
      compteId,
      exercice.toString(),
      page.toString(),
    ],
    queryFn: async () => {
      if (!actor) return { mouvements: [], total: 0n };
      return actor.getMouvementsTresorerie(compteId, exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCreateMouvementTresorerie() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mvt: MouvementTresorerieInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createMouvementTresorerie(mvt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mouvementsTresorerie"] });
      qc.invalidateQueries({ queryKey: ["soldeTresorerie"] });
      qc.invalidateQueries({ queryKey: ["comptesTresorerie"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateCompteTresorerie() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (compte: CompteTresorerieInput) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createCompteTresorerie(compte);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comptesTresorerie"] });
      qc.invalidateQueries({ queryKey: ["soldeTresorerie"] });
    },
  });
}

export function useSoldeTresorerie() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["soldeTresorerie"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getSoldeTresorerie();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Paramètres entreprise ────────────────────────────────────────────────────

export function useCompanyInfo() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompanyInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}

export function useUpdateCompanyInfo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (info: CompanyInfo) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateCompanyInfo(info);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companyInfo"] }),
  });
}

// ─── Utilisateurs ─────────────────────────────────────────────────────────────

export function useUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSaveUserProfile() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUser"] }),
  });
}

export function useUpdateUserRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: UserId; role: Role }) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateUserRole(userId, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

// ─── Init Data ────────────────────────────────────────────────────────────────

export function useInitData() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor non disponible");
      // Initialize access control and create default exercice
      await actor._initializeAccessControl();
      return actor.createExercice(BigInt(new Date().getFullYear()));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exercices"] });
      qc.invalidateQueries({ queryKey: ["comptes"] });
    },
  });
}
