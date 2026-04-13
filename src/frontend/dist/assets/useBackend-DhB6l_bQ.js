var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { H as Subscribable, I as shallowEqualObjects, J as hashKey, K as getDefaultState, N as notifyManager, O as useQueryClient, r as reactExports, Q as noop, V as shouldThrowError, X as useQuery, s as useActor, t as createActor } from "./index-C-LTSMmt.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function useBackendActor() {
  return useActor(createActor);
}
function useDashboardStats(exercice) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["dashboard", exercice.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useExercices() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["exercices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useCreateExercice() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (annee) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createExercice(annee);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercices"] })
  });
}
function useComptes() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["comptes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComptes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useAddCompte() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (compte) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.addCompte(compte);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comptes"] })
  });
}
function useJournalEntries(exercice, page) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["journal", exercice.toString(), page.toString()],
    queryFn: async () => {
      if (!actor) return { entries: [], total: 0n };
      return actor.getJournalEntries(exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
}
function useCreateJournalEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createJournalEntry(entry);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] })
  });
}
function useValidateJournalEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.validateJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] })
  });
}
function useDeleteJournalEntry() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.deleteJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] })
  });
}
function useGrandLivre(compteNumero, exercice) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["grandLivre", compteNumero, exercice.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGrandLivre(compteNumero, exercice);
    },
    enabled: !!actor && !isFetching && !!compteNumero,
    staleTime: 15e3
  });
}
function useBalance(exercice) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["balance", exercice.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBalance(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useBilan(exercice) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["bilan", exercice.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBilan(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCompteResultats(exercice) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["compteResultats", exercice.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompteResultats(exercice);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useTiers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["tiers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTiers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useCreateTiers() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createTiers(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tiers"] })
  });
}
function useUpdateTiers() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateTiers(id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tiers"] })
  });
}
function useFactures(type, exercice, page) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["factures", type, exercice.toString(), page.toString()],
    queryFn: async () => {
      if (!actor) return { factures: [], total: 0n };
      return actor.getFactures(type, exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
}
function useCreateFacture() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (facture) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createFacture(facture);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] })
  });
}
function useValidateFacture() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.validateFacture(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["factures"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}
function useDeleteFacture() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.deleteFacture(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["factures"] })
  });
}
function useProduits() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["produits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProduits();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useCreateProduit() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (produit) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createProduit(produit);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] })
  });
}
function useUpdateProduit() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      produit
    }) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateProduit(id, produit);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] })
  });
}
function useMouvementsStock(produitId, exercice, page) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [
      "mouvementsStock",
      produitId,
      exercice.toString(),
      page.toString()
    ],
    queryFn: async () => {
      if (!actor) return { mouvements: [], total: 0n };
      return actor.getMouvementsStock(produitId, exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
}
function useCreateMouvementStock() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mvt) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createMouvementStock(mvt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mouvementsStock"] });
      qc.invalidateQueries({ queryKey: ["produits"] });
      qc.invalidateQueries({ queryKey: ["valeurStock"] });
    }
  });
}
function useValeurStock() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["valeurStock"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getValeurStock();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useProduitsEnAlerte() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["produitsEnAlerte"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProduitsEnRuptureOuAlerte();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useComptesTresorerie() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["comptesTresorerie"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComptesTresorerie();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useMouvementsTresorerie(compteId, exercice, page) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: [
      "mouvementsTresorerie",
      compteId,
      exercice.toString(),
      page.toString()
    ],
    queryFn: async () => {
      if (!actor) return { mouvements: [], total: 0n };
      return actor.getMouvementsTresorerie(compteId, exercice, page);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
}
function useCreateMouvementTresorerie() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mvt) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createMouvementTresorerie(mvt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mouvementsTresorerie"] });
      qc.invalidateQueries({ queryKey: ["soldeTresorerie"] });
      qc.invalidateQueries({ queryKey: ["comptesTresorerie"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}
function useCreateCompteTresorerie() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (compte) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.createCompteTresorerie(compte);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comptesTresorerie"] });
      qc.invalidateQueries({ queryKey: ["soldeTresorerie"] });
    }
  });
}
function useSoldeTresorerie() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["soldeTresorerie"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getSoldeTresorerie();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCompanyInfo() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompanyInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 12e4
  });
}
function useUpdateCompanyInfo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (info) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateCompanyInfo(info);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companyInfo"] })
  });
}
function useUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useUpdateUserRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }) => {
      if (!actor) throw new Error("Actor non disponible");
      return actor.updateUserRole(userId, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] })
  });
}
export {
  useMouvementsTresorerie as A,
  useCreateCompteTresorerie as B,
  useCreateMouvementTresorerie as C,
  useBilan as D,
  useCompanyInfo as E,
  useCompteResultats as F,
  useUpdateCompanyInfo as G,
  useUsers as H,
  useUpdateUserRole as I,
  useCreateExercice as J,
  useDashboardStats as a,
  useJournalEntries as b,
  useProduitsEnAlerte as c,
  useValeurStock as d,
  useComptes as e,
  useAddCompte as f,
  useValidateJournalEntry as g,
  useDeleteJournalEntry as h,
  useCreateJournalEntry as i,
  useGrandLivre as j,
  useBalance as k,
  useTiers as l,
  useFactures as m,
  useValidateFacture as n,
  useDeleteFacture as o,
  useCreateFacture as p,
  useCreateTiers as q,
  useUpdateTiers as r,
  useProduits as s,
  useCreateProduit as t,
  useExercices as u,
  useUpdateProduit as v,
  useMouvementsStock as w,
  useCreateMouvementStock as x,
  useComptesTresorerie as y,
  useSoldeTresorerie as z
};
