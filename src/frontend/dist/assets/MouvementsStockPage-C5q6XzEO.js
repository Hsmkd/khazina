import { c as createLucideIcon, k as useSearch, r as reactExports, j as jsxRuntimeExports, d as Button, M as MouvementType, L as Layers, S as Skeleton, l as ChartColumn } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-CDbFlOZ-.js";
import { P as Plus, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CDXbd5E3.js";
import { L as Label, I as Input, u as ue } from "./index-nPZKqwAB.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-q3Pp5WBA.js";
import { T as Textarea } from "./textarea-Dt-KOE3T.js";
import { s as useProduits, u as useExercices, d as useValeurStock, w as useMouvementsStock, x as useCreateMouvementStock } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, a as formatDate, b as formatAmount, f as formatDZD, p as parseDZD, d as dateToTimestamp } from "./format-DzCE1O3H.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 8v8", key: "napkw2" }],
  ["path", { d: "m8 12 4 4 4-4", key: "k98ssh" }]
];
const CircleArrowDown = createLucideIcon("circle-arrow-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m16 12-4-4-4 4", key: "177agl" }],
  ["path", { d: "M12 16V8", key: "1sbj14" }]
];
const CircleArrowUp = createLucideIcon("circle-arrow-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function TypeBadge({ type }) {
  if (type === MouvementType.Entree) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        className: "text-xs bg-emerald-500/15 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20",
        "data-ocid": "badge-entree",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "w-3 h-3 mr-1", "aria-hidden": "true" }),
          "Entrée"
        ]
      }
    );
  }
  if (type === MouvementType.Sortie) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "text-xs", "data-ocid": "badge-sortie", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "w-3 h-3 mr-1", "aria-hidden": "true" }),
      "Sortie"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      className: "text-xs bg-sky-500/15 text-sky-700 border-sky-300 hover:bg-sky-500/20",
      "data-ocid": "badge-ajustement",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1", "aria-hidden": "true" }),
        "Ajustement"
      ]
    }
  );
}
function NouveauMvtDialog({
  open,
  onClose,
  produits,
  preselectProduitId,
  exercice
}) {
  const createMvt = useCreateMouvementStock();
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [produitId, setProduitId] = reactExports.useState(preselectProduitId ?? "");
  const [type, setType] = reactExports.useState(MouvementType.Entree);
  const [date, setDate] = reactExports.useState(todayStr);
  const [quantite, setQuantite] = reactExports.useState("");
  const [prixUnitaire, setPrixUnitaire] = reactExports.useState("");
  const [reference, setReference] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  function reset() {
    setProduitId(preselectProduitId ?? "");
    setType(MouvementType.Entree);
    setDate(todayStr);
    setQuantite("");
    setPrixUnitaire("");
    setReference("");
    setNotes("");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!produitId) {
      ue.error("Veuillez sélectionner un produit");
      return;
    }
    const qty = Number(quantite);
    if (!qty || qty <= 0) {
      ue.error("La quantité doit être supérieure à 0");
      return;
    }
    const input = {
      produitId,
      type,
      exercice,
      date: dateToTimestamp(new Date(date)),
      quantite: qty,
      prixUnitaire: type === MouvementType.Entree ? parseDZD(prixUnitaire) : 0n,
      reference: reference.trim(),
      notes: notes.trim()
    };
    try {
      const res = await createMvt.mutateAsync(input);
      if ("err" in res) {
        ue.error(res.err);
        return;
      }
      ue.success("Mouvement enregistré");
      reset();
      onClose();
    } catch {
      ue.error("Une erreur s'est produite");
    }
  }
  const typeOptions = [
    { value: MouvementType.Entree, label: "Entrée de stock" },
    { value: MouvementType.Sortie, label: "Sortie de stock" },
    { value: MouvementType.Ajustement, label: "Ajustement d'inventaire" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v) {
          reset();
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nouveau mouvement de stock" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-produit", children: "Produit *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "mvt-produit",
                value: produitId,
                onChange: (e) => setProduitId(e.target.value),
                required: true,
                className: "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "data-ocid": "select-mvt-produit",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Sélectionner un produit —" }),
                  produits.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                    "[",
                    p.code,
                    "] ",
                    p.designation
                  ] }, p.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type de mouvement *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex gap-2 flex-wrap",
                role: "radiogroup",
                "aria-label": "Type de mouvement",
                children: typeOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    className: `flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm transition-smooth ${type === opt.value ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/50"}`,
                    "data-ocid": `radio-type-${opt.value.toLowerCase()}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "radio",
                          name: "mvt-type",
                          value: opt.value,
                          checked: type === opt.value,
                          onChange: () => setType(opt.value),
                          className: "sr-only"
                        }
                      ),
                      opt.label
                    ]
                  },
                  opt.value
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-date", children: "Date *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "mvt-date",
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  required: true,
                  "data-ocid": "input-mvt-date"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-qte", children: "Quantité *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "mvt-qte",
                  type: "number",
                  min: "0.001",
                  step: "0.001",
                  value: quantite,
                  onChange: (e) => setQuantite(e.target.value),
                  placeholder: "0",
                  required: true,
                  "data-ocid": "input-mvt-quantite"
                }
              )
            ] })
          ] }),
          type === MouvementType.Entree && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-pu", children: "Prix unitaire HT (DZD)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "mvt-pu",
                type: "number",
                min: "0",
                step: "0.01",
                value: prixUnitaire,
                onChange: (e) => setPrixUnitaire(e.target.value),
                placeholder: "0",
                "data-ocid": "input-mvt-prix-unitaire"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pour les sorties, le CMUP est utilisé automatiquement." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-ref", children: "Référence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "mvt-ref",
                value: reference,
                onChange: (e) => setReference(e.target.value),
                placeholder: "N° facture, bon de livraison…",
                "data-ocid": "input-mvt-reference"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mvt-notes", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "mvt-notes",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Observations…",
                rows: 2,
                "data-ocid": "input-mvt-notes"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => {
                  reset();
                  onClose();
                },
                "data-ocid": "btn-cancel-mvt",
                children: "Annuler"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: createMvt.isPending,
                "data-ocid": "btn-save-mvt",
                children: createMvt.isPending ? "Enregistrement…" : "Enregistrer"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
const TYPE_FILTER_OPTIONS = [
  { value: "", label: "Tous les types" },
  { value: MouvementType.Entree, label: "Entrée" },
  { value: MouvementType.Sortie, label: "Sortie" },
  { value: MouvementType.Ajustement, label: "Ajustement" }
];
function MouvementsStockPage() {
  const searchParams = useSearch({ strict: false });
  const preselectProduitId = (searchParams == null ? void 0 : searchParams.produit) ?? "";
  const { data: produits = [] } = useProduits();
  const { data: exercices = [] } = useExercices();
  const { data: valeurs = [] } = useValeurStock();
  const [selectedProduit, setSelectedProduit] = reactExports.useState(preselectProduitId);
  const [selectedExercice, setSelectedExercice] = reactExports.useState(currentExercice());
  const [typeFilter, setTypeFilter] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [page] = reactExports.useState(0n);
  const { data: result, isLoading } = useMouvementsStock(
    selectedProduit || null,
    selectedExercice,
    page
  );
  const mouvements = (result == null ? void 0 : result.mouvements) ?? [];
  const filteredMvts = reactExports.useMemo(() => {
    if (!typeFilter) return mouvements;
    return mouvements.filter((m) => {
      const key = Object.keys(m.type)[0];
      return key === typeFilter;
    });
  }, [mouvements, typeFilter]);
  const totalValeurStock = reactExports.useMemo(
    () => valeurs.reduce((acc, v) => acc + v.valeurTotale, 0n),
    [valeurs]
  );
  function getMvtTypeKey(type) {
    return type;
  }
  function getProduitLabel(id) {
    const p = produits.find((x) => x.id === id);
    return p ? `[${p.code}] ${p.designation}` : id;
  }
  const skeletonMvtRows = ["m1", "m2", "m3", "m4", "m5"];
  const skeletonMvtCols = [
    "mc1",
    "mc2",
    "mc3",
    "mc4",
    "mc5",
    "mc6",
    "mc7",
    "mc8"
  ];
  const skeletonValRows = ["v1", "v2", "v3"];
  const skeletonValCols = ["vc1", "vc2", "vc3", "vc4"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold text-foreground", children: "Mouvements de Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Méthode de valorisation : CMUP" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setDialogOpen(true), "data-ocid": "btn-nouveau-mvt", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "aria-hidden": "true" }),
        "Nouveau mouvement"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-52 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "filter-produit", children: "Produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "filter-produit",
            value: selectedProduit,
            onChange: (e) => setSelectedProduit(e.target.value),
            className: "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "data-ocid": "filter-select-produit",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Tous les produits" }),
              produits.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                "[",
                p.code,
                "] ",
                p.designation
              ] }, p.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-36 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "filter-exercice", children: "Exercice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "filter-exercice",
            value: selectedExercice.toString(),
            onChange: (e) => setSelectedExercice(BigInt(e.target.value)),
            className: "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "data-ocid": "filter-select-exercice",
            children: [
              exercices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: currentExercice().toString(), children: currentExercice().toString() }),
              exercices.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ex.annee.toString(), children: ex.annee.toString() }, ex.annee.toString()))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-48 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "filter-type", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "filter-type",
            value: typeFilter,
            onChange: (e) => setTypeFilter(e.target.value),
            className: "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "data-ocid": "filter-select-type",
            children: TYPE_FILTER_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4", "aria-hidden": "true" }),
        "Historique des mouvements",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto", children: [
          filteredMvts.length,
          " mouvement",
          filteredMvts.length !== 1 ? "s" : ""
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Produit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Quantité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Prix Unitaire" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Montant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Référence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Notes" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          isLoading && skeletonMvtRows.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: skeletonMvtCols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, c)) }, id)),
          !isLoading && filteredMvts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              colSpan: 8,
              className: "text-center py-12 text-muted-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-3",
                  "data-ocid": "empty-state-mouvements",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Layers,
                      {
                        className: "w-10 h-10 opacity-25",
                        "aria-hidden": "true"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Aucun mouvement trouvé" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Enregistrez le premier mouvement de stock." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        onClick: () => setDialogOpen(true),
                        "data-ocid": "btn-empty-nouveau-mvt",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1", "aria-hidden": "true" }),
                          "Nouveau mouvement"
                        ]
                      }
                    )
                  ]
                }
              )
            }
          ) }),
          !isLoading && filteredMvts.map((m) => {
            const typeKey = getMvtTypeKey(m.type);
            const montant = BigInt(
              Math.round(m.quantite * Number(m.prixUnitaire))
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                className: "hover:bg-muted/30 transition-colors",
                "data-ocid": `row-mvt-${m.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-mono", children: formatDate(m.date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block max-w-44", children: getProduitLabel(m.produitId) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: typeKey }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-medium", children: m.quantite.toLocaleString("fr-DZ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: m.prixUnitaire > 0n ? formatAmount(m.prixUnitaire) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic text-xs", children: "CMUP" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-semibold", children: formatAmount(montant) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground font-mono", children: m.reference || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground max-w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: m.notes || "—" }) })
                ]
              },
              m.id
            );
          })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4", "aria-hidden": "true" }),
        "Valorisation du stock (CMUP)"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Produit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Stock Actuel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "CMUP (DZD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Valeur Totale (DZD)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          valeurs.length === 0 && skeletonValRows.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: skeletonValCols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, c)) }, id)),
          valeurs.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "hover:bg-muted/30 transition-colors",
              "data-ocid": `row-valeur-${v.produitId}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: v.designation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-semibold", children: v.quantite.toLocaleString("fr-DZ") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: formatAmount(v.prixMoyenPondere) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-semibold text-primary", children: formatAmount(v.valeurTotale) })
              ]
            },
            v.produitId
          ))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t bg-muted/30 px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Valeur totale du stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-lg font-display font-bold text-primary",
            "data-ocid": "grand-total-valeur",
            children: formatDZD(totalValeurStock)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NouveauMvtDialog,
      {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        produits,
        preselectProduitId,
        exercice: selectedExercice
      }
    )
  ] });
}
export {
  MouvementsStockPage as default
};
