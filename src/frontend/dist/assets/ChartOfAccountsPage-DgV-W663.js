import { r as reactExports, j as jsxRuntimeExports, B as BookOpen, d as Button, S as Skeleton, A as AccountType } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { P as Plus, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CDXbd5E3.js";
import { I as Input, L as Label, u as ue } from "./index-nPZKqwAB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B8NVtKmT.js";
import { e as useComptes, f as useAddCompte } from "./useBackend-DhB6l_bQ.js";
import { f as formatDZD } from "./format-DzCE1O3H.js";
import { S as Search } from "./search-DvJoyn4G.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
const CLASS_LABELS = {
  1: "Capitaux propres",
  2: "Immobilisations",
  3: "Stocks",
  4: "Tiers",
  5: "Trésorerie",
  6: "Charges",
  7: "Produits"
};
const CLASS_COLORS = {
  1: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  2: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800"
  },
  3: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800"
  },
  4: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800"
  },
  5: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800"
  },
  6: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800"
  },
  7: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800"
  }
};
const TABS = [
  { value: "0", label: "Tous" },
  { value: "1", label: "Classe 1 – Capitaux" },
  { value: "2", label: "Classe 2 – Immobilisations" },
  { value: "3", label: "Classe 3 – Stocks" },
  { value: "4", label: "Classe 4 – Tiers" },
  { value: "5", label: "Classe 5 – Trésorerie" },
  { value: "6", label: "Classe 6 – Charges" },
  { value: "7", label: "Classe 7 – Produits" }
];
const ACCOUNT_TYPE_LABELS = {
  [AccountType.Actif]: "Actif",
  [AccountType.Passif]: "Passif",
  [AccountType.Charges]: "Charges",
  [AccountType.Produits]: "Produits",
  [AccountType.Bilan]: "Bilan"
};
function ClassBadge({ classe }) {
  const color = CLASS_COLORS[classe] ?? CLASS_COLORS[1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color.bg} ${color.text} ${color.border}`,
      children: [
        "Cl.",
        classe,
        " — ",
        CLASS_LABELS[classe] ?? "—"
      ]
    }
  );
}
function AddCompteDialog({
  open,
  onClose
}) {
  const [numero, setNumero] = reactExports.useState("");
  const [libelle, setLibelle] = reactExports.useState("");
  const [classe, setClasse] = reactExports.useState("1");
  const [type, setType] = reactExports.useState(AccountType.Actif);
  const addCompte = useAddCompte();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numero.trim() || !libelle.trim()) return;
    const compte = {
      id: crypto.randomUUID(),
      numero: numero.trim(),
      libelle: libelle.trim(),
      classe: BigInt(classe),
      type,
      soldeDebit: 0n,
      soldeCredit: 0n
    };
    try {
      const res = await addCompte.mutateAsync(compte);
      if ("err" in res) {
        ue.error(res.err);
      } else {
        ue.success("Compte ajouté avec succès");
        setNumero("");
        setLibelle("");
        setClasse("1");
        setType(AccountType.Actif);
        onClose();
      }
    } catch {
      ue.error("Erreur lors de l'ajout du compte");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Ajouter un compte" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-num", children: "Numéro *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "add-num",
              placeholder: "ex: 101000",
              value: numero,
              onChange: (e) => setNumero(e.target.value),
              "data-ocid": "account-numero-input",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-classe", children: "Classe *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classe, onValueChange: setClasse, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                id: "add-classe",
                "data-ocid": "account-classe-select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [1, 2, 3, 4, 5, 6, 7].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(c), children: [
              c,
              " – ",
              CLASS_LABELS[c]
            ] }, String(c))) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-libelle", children: "Libellé *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "add-libelle",
            placeholder: "ex: Capital social",
            value: libelle,
            onChange: (e) => setLibelle(e.target.value),
            "data-ocid": "account-libelle-input",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "add-type", children: "Type de compte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: type,
            onValueChange: (v) => setType(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "add-type", "data-ocid": "account-type-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(AccountType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: ACCOUNT_TYPE_LABELS[t] }, t)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "cancel-add-account",
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: addCompte.isPending,
            "data-ocid": "submit-add-account",
            children: addCompte.isPending ? "Ajout…" : "Ajouter"
          }
        )
      ] })
    ] })
  ] }) });
}
function ChartOfAccountsPage() {
  const { data: comptes = [], isLoading } = useComptes();
  const [activeTab, setActiveTab] = reactExports.useState("0");
  const [search, setSearch] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const filtered = comptes.filter((c) => {
    const matchClass = activeTab === "0" || c.classe === BigInt(activeTab);
    const q = search.toLowerCase();
    const matchSearch = !q || c.numero.toLowerCase().includes(q) || c.libelle.toLowerCase().includes(q);
    return matchClass && matchSearch;
  }).sort((a, b) => a.numero.localeCompare(b.numero));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Plan Comptable SCF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Conforme SCF – Loi 07-11 · ",
            comptes.length,
            " compte",
            comptes.length !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setDialogOpen(true),
          "data-ocid": "add-account-btn",
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Ajouter un compte"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-1 px-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 min-w-max bg-muted/50 rounded-lg p-1", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `class-tab-${tab.value}`,
        onClick: () => setActiveTab(tab.value),
        className: `px-3 py-1.5 rounded-md text-xs font-medium transition-smooth whitespace-nowrap ${activeTab === tab.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
        children: tab.label
      },
      tab.value
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Rechercher un compte…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9",
          "data-ocid": "search-accounts"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card shadow-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Numéro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Libellé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Classe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Solde débiteur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Solde créditeur" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["l1", "l2", "l3", "l4", "l5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) })
      ] }, k)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "td",
        {
          colSpan: 6,
          className: "text-center py-16 text-muted-foreground",
          "data-ocid": "accounts-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 mx-auto mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Aucun compte trouvé" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: search ? "Modifiez votre recherche" : "Ajoutez votre premier compte via le bouton ci-dessus" })
          ]
        }
      ) }) : filtered.map((compte) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/60 hover:bg-muted/30 transition-colors",
          "data-ocid": `account-row-${compte.numero}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-semibold text-foreground tracking-wide", children: compte.numero }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: compte.libelle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClassBadge, { classe: Number(compte.classe) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: ACCOUNT_TYPE_LABELS[compte.type] ?? compte.type }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm", children: compte.soldeDebit > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-600 dark:text-rose-400", children: formatDZD(compte.soldeDebit) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "0,00 DZD" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm", children: compte.soldeCredit > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400", children: formatDZD(compte.soldeCredit) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "0,00 DZD" }) })
          ]
        },
        compte.id
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddCompteDialog, { open: dialogOpen, onClose: () => setDialogOpen(false) })
  ] });
}
export {
  ChartOfAccountsPage as default
};
