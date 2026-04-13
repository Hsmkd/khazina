import { c as createLucideIcon, i as useNavigate, r as reactExports, j as jsxRuntimeExports, d as Button, P as Package, a as TrendingDown, b as TriangleAlert, S as Skeleton } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CDbFlOZ-.js";
import { P as Plus, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CDXbd5E3.js";
import { I as Input, L as Label, u as ue } from "./index-nPZKqwAB.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-q3Pp5WBA.js";
import { s as useProduits, c as useProduitsEnAlerte, d as useValeurStock, t as useCreateProduit, v as useUpdateProduit } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, f as formatDZD, b as formatAmount, p as parseDZD } from "./format-DzCE1O3H.js";
import { S as Search } from "./search-DvJoyn4G.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }],
  ["path", { d: "m17 13 5 5m-5 0 5-5", key: "im3w4b" }]
];
const PackageX = createLucideIcon("package-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
const UNITES = ["pièce", "kg", "litre", "mètre", "boîte", "carton", "autre"];
const defaultForm = {
  code: "",
  designation: "",
  unite: "pièce",
  uniteCustom: "",
  prixAchat: "",
  prixVente: "",
  stockInitial: "",
  stockMinimum: "0",
  compteStock: "30"
};
function StockBadge({ produit }) {
  if (produit.stockActuel === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "destructive",
        className: "text-xs",
        "data-ocid": "stock-badge-rupture",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PackageX, { className: "w-3 h-3 mr-1", "aria-hidden": "true" }),
          "En rupture"
        ]
      }
    );
  }
  if (produit.stockActuel <= produit.stockMinimum) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        className: "text-xs bg-amber-500/15 text-amber-700 border-amber-300 hover:bg-amber-500/20",
        "data-ocid": "stock-badge-alerte",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3 mr-1", "aria-hidden": "true" }),
          "En alerte"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      className: "text-xs bg-emerald-500/15 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20",
      "data-ocid": "stock-badge-normal",
      children: "Normal"
    }
  );
}
function ProduitDialog({ open, onClose, editProduit }) {
  const createProduit = useCreateProduit();
  const updateProduit = useUpdateProduit();
  const [form, setForm] = reactExports.useState(() => {
    if (editProduit) {
      const isCustom = !UNITES.slice(0, -1).includes(editProduit.unite);
      return {
        code: editProduit.code,
        designation: editProduit.designation,
        unite: isCustom ? "autre" : editProduit.unite,
        uniteCustom: isCustom ? editProduit.unite : "",
        prixAchat: editProduit.prixAchat ? (Number(editProduit.prixAchat) / 100).toString() : "",
        prixVente: editProduit.prixVente ? (Number(editProduit.prixVente) / 100).toString() : "",
        stockInitial: editProduit.stockActuel.toString(),
        stockMinimum: editProduit.stockMinimum.toString(),
        compteStock: editProduit.compteStock
      };
    }
    return { ...defaultForm };
  });
  function setField(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const unite = form.unite === "autre" ? form.uniteCustom.trim() || "pièce" : form.unite;
    const input = {
      code: form.code.trim(),
      designation: form.designation.trim(),
      unite,
      prixAchat: parseDZD(form.prixAchat),
      prixVente: parseDZD(form.prixVente),
      stockMinimum: Number(form.stockMinimum) || 0,
      compteStock: form.compteStock.trim() || "30"
    };
    try {
      if (editProduit) {
        const res = await updateProduit.mutateAsync({
          id: editProduit.id,
          produit: input
        });
        if ("err" in res) {
          ue.error(res.err);
          return;
        }
        ue.success("Produit mis à jour");
      } else {
        const res = await createProduit.mutateAsync(input);
        if ("err" in res) {
          ue.error(res.err);
          return;
        }
        ue.success("Produit créé avec succès");
      }
      onClose();
    } catch {
      ue.error("Une erreur s'est produite");
    }
  }
  const isPending = createProduit.isPending || updateProduit.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editProduit ? "Modifier le produit" : "Nouveau produit" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-code", children: "Code *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "p-code",
              value: form.code,
              onChange: setField("code"),
              placeholder: "EX-001",
              required: true,
              "data-ocid": "input-prod-code"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-unite", children: "Unité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "p-unite",
              value: form.unite,
              onChange: setField("unite"),
              className: "flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "data-ocid": "select-prod-unite",
              children: UNITES.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: u, children: u }, u))
            }
          )
        ] })
      ] }),
      form.unite === "autre" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-unite-custom", children: "Unité personnalisée" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "p-unite-custom",
            value: form.uniteCustom,
            onChange: setField("uniteCustom"),
            placeholder: "ex : palette, tonne…",
            "data-ocid": "input-prod-unite-custom"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-designation", children: "Désignation *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "p-designation",
            value: form.designation,
            onChange: setField("designation"),
            placeholder: "Nom du produit",
            required: true,
            "data-ocid": "input-prod-designation"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-pa", children: "Prix d'achat HT (DZD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "p-pa",
              type: "number",
              min: "0",
              step: "0.01",
              value: form.prixAchat,
              onChange: setField("prixAchat"),
              placeholder: "0",
              "data-ocid": "input-prod-pa"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-pv", children: "Prix de vente HT (DZD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "p-pv",
              type: "number",
              min: "0",
              step: "0.01",
              value: form.prixVente,
              onChange: setField("prixVente"),
              placeholder: "0",
              "data-ocid": "input-prod-pv"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        !editProduit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-stock-init", children: "Stock initial (qté)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "p-stock-init",
              type: "number",
              min: "0",
              step: "1",
              value: form.stockInitial,
              onChange: setField("stockInitial"),
              placeholder: "0",
              "data-ocid": "input-prod-stock-init"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-stock-min", children: "Stock minimum (alerte)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "p-stock-min",
              type: "number",
              min: "0",
              step: "1",
              value: form.stockMinimum,
              onChange: setField("stockMinimum"),
              placeholder: "0",
              "data-ocid": "input-prod-stock-min"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-compte", children: "Compte de stock (SCF)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "p-compte",
            value: form.compteStock,
            onChange: setField("compteStock"),
            placeholder: "30",
            "data-ocid": "input-prod-compte"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Par défaut : 30 — Stocks de marchandises" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "btn-cancel-prod",
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isPending,
            "data-ocid": "btn-save-prod",
            children: isPending ? "Enregistrement…" : editProduit ? "Modifier" : "Créer le produit"
          }
        )
      ] })
    ] })
  ] }) });
}
function ProduitsPage() {
  const { data: produits = [], isLoading } = useProduits();
  const { data: alertes = [] } = useProduitsEnAlerte();
  const { data: valeurs = [] } = useValeurStock();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editProduit, setEditProduit] = reactExports.useState();
  const totalValeur = reactExports.useMemo(
    () => valeurs.reduce((acc, v) => acc + v.valeurTotale, 0n),
    [valeurs]
  );
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return produits;
    return produits.filter(
      (p) => p.code.toLowerCase().includes(q) || p.designation.toLowerCase().includes(q)
    );
  }, [produits, search]);
  function getValeur(id) {
    var _a;
    return ((_a = valeurs.find((v) => v.produitId === id)) == null ? void 0 : _a.valeurTotale) ?? 0n;
  }
  function openNew() {
    setEditProduit(void 0);
    setDialogOpen(true);
  }
  function openEdit(p, e) {
    e.stopPropagation();
    setEditProduit(p);
    setDialogOpen(true);
  }
  function goToMouvements(id) {
    navigate({
      to: "/stocks/mouvements",
      search: { produit: id }
    });
  }
  const skeletonRows = ["r1", "r2", "r3", "r4", "r5"];
  const skeletonCols = [
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "c10"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold text-foreground", children: "Catalogue Produits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Exercice ",
          currentExercice().toString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNew, "data-ocid": "btn-nouveau-produit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "aria-hidden": "true" }),
        "Nouveau produit"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
          "Total produits"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-display font-bold text-foreground", children: produits.length }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
          "Valeur totale du stock"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-display font-bold text-primary", children: formatDZD(totalValeur) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
          "Produits en alerte"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-2xl font-display font-bold ${alertes.length > 0 ? "text-destructive" : "text-foreground"}`,
              "data-ocid": "alerte-count",
              children: alertes.length
            }
          ),
          alertes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Attention" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Rechercher par code ou désignation…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9",
          "data-ocid": "input-search-produit"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Désignation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Unité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Prix Achat HT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Prix Vente HT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Stock Actuel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Stock Min" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Valeur Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        isLoading && skeletonRows.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: skeletonCols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, c)) }, id)),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 10,
            className: "text-center py-14 text-muted-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-3",
                "data-ocid": "empty-state-produits",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Package,
                    {
                      className: "w-10 h-10 opacity-25",
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Aucun produit trouvé" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "Aucun résultat pour cette recherche." : "Commencez par créer un premier produit." }),
                  !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      onClick: openNew,
                      "data-ocid": "btn-empty-nouveau-produit",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Plus,
                          {
                            className: "w-3.5 h-3.5 mr-1",
                            "aria-hidden": "true"
                          }
                        ),
                        "Nouveau produit"
                      ]
                    }
                  )
                ]
              }
            )
          }
        ) }),
        !isLoading && filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "cursor-pointer hover:bg-muted/30 transition-colors",
            onClick: () => goToMouvements(p.id),
            "data-ocid": `row-produit-${p.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs font-semibold text-primary", children: p.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block max-w-48", children: p.designation }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: p.unite }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: formatAmount(p.prixAchat) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: formatAmount(p.prixVente) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-semibold", children: p.stockActuel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm text-muted-foreground", children: p.stockMinimum }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-semibold text-primary", children: formatAmount(getValeur(p.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(StockBadge, { produit: p }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableCell,
                {
                  className: "text-right",
                  onClick: (e) => e.stopPropagation(),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7",
                      onClick: (e) => openEdit(p, e),
                      "aria-label": `Modifier ${p.designation}`,
                      "data-ocid": `btn-edit-produit-${p.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
                    }
                  )
                }
              )
            ]
          },
          p.id
        ))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProduitDialog,
      {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        editProduit
      }
    )
  ] });
}
export {
  ProduitsPage as default
};
