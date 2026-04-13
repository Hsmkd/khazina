import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-C-LTSMmt.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B8NVtKmT.js";
import { u as useExercices, e as useComptes, j as useGrandLivre } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, a as formatDate, b as formatAmount } from "./format-DzCE1O3H.js";
import { S as Search } from "./search-DvJoyn4G.js";
import "./index-CEA_Dzw8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 2v8l3-3 3 3V2", key: "sqw3rj" }],
  [
    "path",
    {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ]
];
const BookMarked = createLucideIcon("book-marked", __iconNode);
function GrandLivrePage() {
  const { data: exercices = [] } = useExercices();
  const { data: allComptes = [], isLoading: comptesLoading } = useComptes();
  const [exercice, setExercice] = reactExports.useState(currentExercice());
  const [selectedNumero, setSelectedNumero] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const exerciceOptions = reactExports.useMemo(
    () => exercices.length > 0 ? exercices : [{ annee: currentExercice(), fin: 0n, debut: 0n, cloture: false }],
    [exercices]
  );
  const { data: journalEntries = [], isLoading: livreLoading } = useGrandLivre(
    selectedNumero,
    exercice
  );
  const rows = reactExports.useMemo(() => {
    let runningBalance = 0n;
    const result = [];
    for (const entry of journalEntries) {
      for (const ec of entry.ecritures) {
        if (ec.compte !== selectedNumero) continue;
        runningBalance += ec.debit - ec.credit;
        result.push({
          entryId: entry.id,
          entryNumero: entry.numero,
          entryDate: entry.date,
          entryLibelle: ec.libelle || entry.libelle,
          debit: ec.debit,
          credit: ec.credit,
          solde: runningBalance
        });
      }
    }
    return result;
  }, [journalEntries, selectedNumero]);
  const totalDebit = rows.reduce((s, r) => s + r.debit, 0n);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0n);
  const soldeFinal = totalDebit - totalCredit;
  const filteredComptes = allComptes.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.numero.toLowerCase().includes(q) || c.libelle.toLowerCase().includes(q);
  }).sort((a, b) => a.numero.localeCompare(b.numero));
  const selectedCompte = allComptes.find((c) => c.numero === selectedNumero);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Grand Livre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Mouvements par compte" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-64 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "gl-search",
            className: "text-sm font-medium text-foreground",
            children: "Compte"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "gl-search",
              type: "text",
              placeholder: "Rechercher un compte…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring",
              "data-ocid": "grand-livre-search"
            }
          )
        ] }),
        search && filteredComptes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-10 mt-1 bg-card border border-border rounded-lg shadow-elevated max-h-52 overflow-y-auto text-sm", children: filteredComptes.slice(0, 20).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center gap-2",
            onClick: () => {
              setSelectedNumero(c.numero);
              setSearch("");
            },
            "data-ocid": `select-compte-${c.numero}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground", children: c.numero }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: c.libelle })
            ]
          },
          c.id
        )) }),
        selectedCompte && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Compte sélectionné :" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-medium text-foreground", children: selectedCompte.numero }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-foreground", children: [
            "— ",
            selectedCompte.libelle
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-muted-foreground hover:text-destructive ml-1",
              onClick: () => setSelectedNumero(""),
              children: "✕"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Exercice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(exercice),
            onValueChange: (v) => setExercice(BigInt(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-40",
                  "data-ocid": "grand-livre-exercice",
                  "aria-label": "Exercice",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: exerciceOptions.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(ex.annee), children: [
                "Exercice ",
                String(ex.annee)
              ] }, String(ex.annee))) })
            ]
          }
        )
      ] }),
      !selectedNumero && !search && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Ou sélectionner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: selectedNumero,
            onValueChange: (v) => setSelectedNumero(v),
            disabled: comptesLoading,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-72",
                  "data-ocid": "grand-livre-compte-select",
                  "aria-label": "Choisir un compte",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choisir un compte…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: allComptes.sort((a, b) => a.numero.localeCompare(b.numero)).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.numero, className: "text-sm", children: [
                c.numero,
                " – ",
                c.libelle
              ] }, c.id)) })
            ]
          }
        )
      ] })
    ] }),
    !selectedNumero ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card shadow-card flex flex-col items-center justify-center py-20 text-muted-foreground",
        "data-ocid": "grand-livre-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "w-10 h-10 mb-4 opacity-25" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Sélectionnez un compte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Recherchez ou choisissez un compte pour afficher le grand livre" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 bg-primary/5 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary text-lg", children: selectedNumero }),
          selectedCompte && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-foreground font-medium", children: selectedCompte.libelle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Exercice ",
          String(exercice)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "N° écriture" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Libellé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Débit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Crédit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Solde" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: livreLoading ? ["g1", "g2", "g3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) })
        ] }, k)) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "td",
          {
            colSpan: 6,
            className: "text-center py-12 text-muted-foreground",
            "data-ocid": "grand-livre-no-entries",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Aucun mouvement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Ce compte n'a pas de mouvements pour cet exercice" })
            ]
          }
        ) }) : rows.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/60 hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: formatDate(row.entryDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                "#",
                String(row.entryNumero).padStart(4, "0")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: row.entryLibelle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm", children: row.debit > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-600 dark:text-rose-400", children: [
                formatAmount(row.debit),
                " DZD"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm", children: row.credit > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 dark:text-emerald-400", children: [
                formatAmount(row.credit),
                " DZD"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: row.solde >= 0n ? "text-foreground" : "text-destructive",
                  children: [
                    row.solde < 0n ? "-" : "",
                    formatAmount(
                      row.solde < 0n ? -row.solde : row.solde
                    ),
                    " ",
                    "DZD"
                  ]
                }
              ) })
            ]
          },
          `${row.entryId}-${idx}`
        )) }),
        rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-t-2 border-border font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "px-4 py-3 text-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-rose-600 dark:text-rose-400", children: [
            formatAmount(totalDebit),
            " DZD"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400", children: [
            formatAmount(totalCredit),
            " DZD"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: soldeFinal >= 0n ? "text-foreground" : "text-destructive",
              children: [
                soldeFinal < 0n ? "-" : "",
                formatAmount(
                  soldeFinal < 0n ? -soldeFinal : soldeFinal
                ),
                " ",
                "DZD"
              ]
            }
          ) })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  GrandLivrePage as default
};
