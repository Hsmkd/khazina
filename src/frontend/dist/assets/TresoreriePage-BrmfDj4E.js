import { c as createLucideIcon, r as reactExports, m as MvtType, j as jsxRuntimeExports, S as Skeleton, T as TrendingUp, a as TrendingDown, n as TresoType, W as Wallet, d as Button } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { C as Card, c as CardContent, a as CardHeader } from "./card-CDbFlOZ-.js";
import { P as Plus, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CDXbd5E3.js";
import { L as Label, I as Input, u as ue } from "./index-nPZKqwAB.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-q3Pp5WBA.js";
import { y as useComptesTresorerie, z as useSoldeTresorerie, u as useExercices, A as useMouvementsTresorerie, B as useCreateCompteTresorerie, C as useCreateMouvementTresorerie } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, f as formatDZD, a as formatDate, p as parseDZD, d as dateToTimestamp } from "./format-DzCE1O3H.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode);
function getSoldeClass(solde) {
  if (solde < 0n) return "text-red-600 dark:text-red-400";
  if (solde > 0n) return "text-green-700 dark:text-green-400";
  return "text-muted-foreground";
}
function todayInputDate() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function CompteCard({ compte, selected, onClick }) {
  const isBanque = compte.type === TresoType.Banque;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "data-ocid": "compte-card",
      onClick,
      className: `text-left rounded-xl border transition-smooth shadow-card hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full ${selected ? "border-primary bg-primary/5 shadow-elevated" : "border-border bg-card hover:border-primary/40"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isBanque ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"}`,
              children: isBanque ? /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-mono shrink-0", children: compte.compteComptable })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm leading-tight truncate", children: compte.libelle }),
          compte.banque && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: compte.banque }),
          compte.numeroCompte && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate", children: compte.numeroCompte })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `text-base font-bold tabular-nums ${getSoldeClass(compte.solde)}`,
            children: formatDZD(compte.solde)
          }
        ) })
      ] })
    }
  );
}
function AddCompteDialog({ open, onClose }) {
  const createCompte = useCreateCompteTresorerie();
  const [type, setType] = reactExports.useState(TresoType.Caisse);
  const [libelle, setLibelle] = reactExports.useState("");
  const [compteComptable, setCompteComptable] = reactExports.useState("531");
  const [numeroCompte, setNumeroCompte] = reactExports.useState("");
  const [banque, setBanque] = reactExports.useState("");
  const [soldeInitial, setSoldeInitial] = reactExports.useState("0");
  function handleTypeChange(t) {
    setType(t);
    setCompteComptable(t === TresoType.Banque ? "512" : "531");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!libelle.trim()) {
      ue.error("Le libellé est obligatoire");
      return;
    }
    try {
      await createCompte.mutateAsync({
        libelle: libelle.trim(),
        compteComptable,
        soldeinitial: parseDZD(soldeInitial),
        type,
        banque: banque.trim() || void 0,
        numeroCompte: numeroCompte.trim() || void 0
      });
      ue.success("Compte créé avec succès");
      setLibelle("");
      setNumeroCompte("");
      setBanque("");
      setSoldeInitial("0");
      setType(TresoType.Caisse);
      setCompteComptable("531");
      onClose();
    } catch {
      ue.error("Erreur lors de la création du compte");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Ajouter un compte de trésorerie" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type de compte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [
          { value: TresoType.Caisse, label: "💰 Caisse" },
          { value: TresoType.Banque, label: "🏦 Banque" }
        ].map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => handleTypeChange(value),
            className: `flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-smooth ${type === value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`,
            children: label
          },
          value
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-libelle", children: "Libellé *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "add-libelle",
            "data-ocid": "input-libelle",
            value: libelle,
            onChange: (e) => setLibelle(e.target.value),
            placeholder: type === TresoType.Banque ? "Ex: Compte CPA principal" : "Ex: Caisse principale",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-compte-comptable", children: "Compte SCF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "add-compte-comptable",
            "data-ocid": "input-compte-comptable",
            value: compteComptable,
            onChange: (e) => setCompteComptable(e.target.value),
            placeholder: type === TresoType.Banque ? "512" : "531"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: type === TresoType.Banque ? "Classe 51x pour les banques" : "531 pour la caisse" })
      ] }),
      type === TresoType.Banque && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-banque", children: "Nom de la banque" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "add-banque",
              "data-ocid": "input-banque",
              value: banque,
              onChange: (e) => setBanque(e.target.value),
              placeholder: "Ex: CPA, BNA, BADR…"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-numero", children: "Numéro de compte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "add-numero",
              "data-ocid": "input-numero-compte",
              value: numeroCompte,
              onChange: (e) => setNumeroCompte(e.target.value),
              placeholder: "Ex: 00200 15243 00045",
              className: "font-mono"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-solde", children: "Solde initial (DZD)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "add-solde",
            "data-ocid": "input-solde-initial",
            value: soldeInitial,
            onChange: (e) => setSoldeInitial(e.target.value),
            placeholder: "0",
            className: "font-mono"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "flex-1",
            onClick: onClose,
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            "data-ocid": "btn-submit-compte",
            className: "flex-1",
            disabled: createCompte.isPending,
            children: createCompte.isPending ? "Création…" : "Créer le compte"
          }
        )
      ] })
    ] })
  ] }) });
}
function NouveauMvtDialog({
  open,
  onClose,
  comptes,
  selectedCompteId,
  exercice
}) {
  var _a, _b;
  const createMvt = useCreateMouvementTresorerie();
  const [compteId, setCompteId] = reactExports.useState(
    selectedCompteId ?? ((_a = comptes[0]) == null ? void 0 : _a.id) ?? ""
  );
  const [type, setType] = reactExports.useState(MvtType.Encaissement);
  const [date, setDate] = reactExports.useState(todayInputDate());
  const [montant, setMontant] = reactExports.useState("");
  const [libelle, setLibelle] = reactExports.useState("");
  const [reference, setReference] = reactExports.useState("");
  const effectiveCompteId = compteId || selectedCompteId || ((_b = comptes[0]) == null ? void 0 : _b.id) || "";
  async function handleSubmit(e) {
    e.preventDefault();
    if (!effectiveCompteId) {
      ue.error("Sélectionnez un compte");
      return;
    }
    if (!montant || parseDZD(montant) === 0n) {
      ue.error("Le montant doit être supérieur à zéro");
      return;
    }
    try {
      await createMvt.mutateAsync({
        compteId: effectiveCompteId,
        type,
        date: dateToTimestamp(new Date(date)),
        montant: parseDZD(montant),
        libelle: libelle.trim(),
        reference: reference.trim(),
        exercice
      });
      ue.success("Mouvement enregistré");
      setMontant("");
      setLibelle("");
      setReference("");
      setDate(todayInputDate());
      onClose();
    } catch {
      ue.error("Erreur lors de l'enregistrement");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nouveau mouvement de trésorerie" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-compte", children: "Compte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "mvt-compte",
            "data-ocid": "select-compte",
            value: effectiveCompteId,
            onChange: (e) => setCompteId(e.target.value),
            className: "w-full h-9 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            children: comptes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
              c.type === TresoType.Banque ? "🏦" : "💰",
              " ",
              c.libelle
            ] }, c.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type d'opération" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [
          {
            value: MvtType.Encaissement,
            label: "↑ Encaissement",
            color: "text-green-700"
          },
          {
            value: MvtType.Decaissement,
            label: "↓ Décaissement",
            color: "text-red-600"
          }
        ].map(({ value, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `btn-type-${value.toLowerCase()}`,
            onClick: () => setType(value),
            className: `flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-smooth ${type === value ? `border-primary bg-primary/5 ${color}` : "border-border text-muted-foreground hover:border-primary/40"}`,
            children: label
          },
          value
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-date", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "mvt-date",
            "data-ocid": "input-date",
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-montant", children: "Montant (DZD)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "mvt-montant",
            "data-ocid": "input-montant",
            value: montant,
            onChange: (e) => setMontant(e.target.value),
            placeholder: "Ex: 150000",
            className: "font-mono",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-libelle", children: "Libellé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "mvt-libelle",
            "data-ocid": "input-libelle-mvt",
            value: libelle,
            onChange: (e) => setLibelle(e.target.value),
            placeholder: "Description de l'opération"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-ref", children: "Référence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "mvt-ref",
            "data-ocid": "input-reference",
            value: reference,
            onChange: (e) => setReference(e.target.value),
            placeholder: "N° facture, chèque, virement…",
            className: "font-mono"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "flex-1",
            onClick: onClose,
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            "data-ocid": "btn-submit-mvt",
            className: "flex-1",
            disabled: createMvt.isPending,
            children: createMvt.isPending ? "Enregistrement…" : "Enregistrer"
          }
        )
      ] })
    ] })
  ] }) });
}
function TransactionsTable({
  mouvements,
  isLoading,
  soldeInitial
}) {
  const sorted = reactExports.useMemo(
    () => [...mouvements].sort((a, b) => a.date < b.date ? -1 : 1),
    [mouvements]
  );
  const rows = reactExports.useMemo(() => {
    let balance = soldeInitial;
    return sorted.map((mvt) => {
      if (mvt.type === MvtType.Encaissement) {
        balance += mvt.montant;
      } else {
        balance -= mvt.montant;
      }
      return { mvt, balance };
    });
  }, [sorted, soldeInitial]);
  const displayRows = [...rows].reverse();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: ["l1", "l2", "l3", "l4"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }, id)) });
  }
  if (displayRows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "empty-transactions",
        className: "flex flex-col items-center justify-center py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Aucun mouvement enregistré" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Cliquez sur « Nouveau mouvement » pour commencer" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-ocid": "transactions-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Libellé" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Référence" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right text-green-700 dark:text-green-400", children: "Encaissement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right text-red-600 dark:text-red-400", children: "Décaissement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Solde cumulé" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: displayRows.map(({ mvt, balance }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-ocid": "transaction-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-mono whitespace-nowrap", children: formatDate(mvt.date) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm max-w-[200px] truncate", children: mvt.libelle || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-mono text-muted-foreground whitespace-nowrap", children: mvt.reference || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm text-green-700 dark:text-green-400", children: mvt.type === MvtType.Encaissement ? formatDZD(mvt.montant) : "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm text-red-600 dark:text-red-400", children: mvt.type === MvtType.Decaissement ? formatDZD(mvt.montant) : "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          className: `text-right font-mono text-sm font-semibold ${getSoldeClass(balance)}`,
          children: formatDZD(balance)
        }
      )
    ] }, mvt.id)) })
  ] }) });
}
function TresoreriePage() {
  var _a;
  const exercice = currentExercice();
  const { data: comptes = [], isLoading: loadingComptes } = useComptesTresorerie();
  const { data: soldeGlobal = 0n } = useSoldeTresorerie();
  const { data: exercices = [] } = useExercices();
  const [selectedCompteId, setSelectedCompteId] = reactExports.useState(null);
  const [showAddCompte, setShowAddCompte] = reactExports.useState(false);
  const [showNouveauMvt, setShowNouveauMvt] = reactExports.useState(false);
  const selectedCompte = comptes.find((c) => c.id === selectedCompteId) ?? null;
  const { data: mvtData, isLoading: loadingMvt } = useMouvementsTresorerie(
    selectedCompteId,
    exercice,
    0n
  );
  const mouvements = (mvtData == null ? void 0 : mvtData.mouvements) ?? [];
  const stats = reactExports.useMemo(() => {
    let encaissements = 0n;
    let decaissements = 0n;
    for (const mvt of mouvements) {
      if (mvt.type === MvtType.Encaissement) encaissements += mvt.montant;
      else decaissements += mvt.montant;
    }
    return {
      encaissements,
      decaissements,
      fluxNet: encaissements - decaissements
    };
  }, [mouvements]);
  const exerciceLabel = exercices.length > 0 ? ((_a = exercices.find((e) => e.annee === exercice)) == null ? void 0 : _a.annee.toString()) ?? exercice.toString() : exercice.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-6 p-6 max-w-7xl mx-auto",
      "data-ocid": "tresorerie-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Trésorerie" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              "Exercice ",
              exerciceLabel,
              " — Caisse & Banque"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Solde global" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "solde-global",
                className: `text-2xl font-bold font-mono tabular-nums ${getSoldeClass(soldeGlobal)}`,
                children: formatDZD(soldeGlobal)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Comptes de trésorerie" }),
          loadingComptes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: ["c1", "c2", "c3"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
              "data-ocid": "comptes-grid",
              children: [
                comptes.map((compte) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CompteCard,
                  {
                    compte,
                    selected: selectedCompteId === compte.id,
                    onClick: () => setSelectedCompteId(
                      selectedCompteId === compte.id ? null : compte.id
                    )
                  },
                  compte.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "btn-add-compte",
                    onClick: () => setShowAddCompte(true),
                    className: "rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-smooth p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary min-h-[160px]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Ajouter un compte" })
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        selectedCompte && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", "data-ocid": "stats-row", children: [
            {
              label: "Encaissements",
              value: stats.encaissements,
              icon: TrendingUp,
              color: "text-green-700 dark:text-green-400",
              bg: "bg-green-50 dark:bg-green-950/20"
            },
            {
              label: "Décaissements",
              value: stats.decaissements,
              icon: TrendingDown,
              color: "text-red-600 dark:text-red-400",
              bg: "bg-red-50 dark:bg-red-950/20"
            },
            {
              label: "Flux net",
              value: stats.fluxNet,
              icon: stats.fluxNet >= 0n ? TrendingUp : TrendingDown,
              color: getSoldeClass(stats.fluxNet),
              bg: "bg-muted/40"
            }
          ].map(({ label, value, icon: Icon, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `border-0 ${bg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg flex items-center justify-center bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${color}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-base font-bold font-mono tabular-nums ${color}`,
                  children: formatDZD(value < 0n ? -value : value)
                }
              )
            ] })
          ] }) }, label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between py-4 px-5 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: selectedCompte.type === TresoType.Banque ? /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: selectedCompte.libelle }),
                  selectedCompte.banque && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedCompte.banque })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-mono text-xs ml-1", children: selectedCompte.compteComptable })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  "data-ocid": "btn-nouveau-mvt",
                  onClick: () => setShowNouveauMvt(true),
                  className: "gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    "Nouveau mouvement"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TransactionsTable,
              {
                mouvements,
                isLoading: loadingMvt,
                soldeInitial: selectedCompte.solde - stats.fluxNet
              }
            ) })
          ] })
        ] }),
        !selectedCompte && !loadingComptes && comptes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "select-compte-hint",
            className: "flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-dashed border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-6 h-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Sélectionnez un compte" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Cliquez sur un compte ci-dessus pour voir ses mouvements" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddCompteDialog,
          {
            open: showAddCompte,
            onClose: () => setShowAddCompte(false)
          }
        ),
        showNouveauMvt && /* @__PURE__ */ jsxRuntimeExports.jsx(
          NouveauMvtDialog,
          {
            open: showNouveauMvt,
            onClose: () => setShowNouveauMvt(false),
            comptes,
            selectedCompteId,
            exercice
          }
        )
      ]
    }
  );
}
export {
  TresoreriePage as default
};
