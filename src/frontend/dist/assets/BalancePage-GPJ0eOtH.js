import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, e as Scale, d as Button, S as Skeleton } from "./index-C-LTSMmt.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B8NVtKmT.js";
import { u as useExercices, k as useBalance } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, b as formatAmount } from "./format-DzCE1O3H.js";
import { C as CircleCheckBig } from "./circle-check-big-5CX_dOyG.js";
import "./index-CEA_Dzw8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode);
const CLASS_LABELS = {
  1: "Classe 1 — Capitaux propres et assimilés",
  2: "Classe 2 — Immobilisations",
  3: "Classe 3 — Stocks",
  4: "Classe 4 — Tiers",
  5: "Classe 5 — Trésorerie",
  6: "Classe 6 — Charges",
  7: "Classe 7 — Produits"
};
function groupByClasse(balances) {
  const map = /* @__PURE__ */ new Map();
  for (const b of balances) {
    const cl = Number(b.compte.classe);
    const existing = map.get(cl);
    if (existing) existing.push(b);
    else map.set(cl, [b]);
  }
  const groups = [];
  for (const [cl, rows] of Array.from(map.entries()).sort(
    ([a], [b]) => a - b
  )) {
    const subtotalDebit = rows.reduce((s, r) => s + r.totalDebit, 0n);
    const subtotalCredit = rows.reduce((s, r) => s + r.totalCredit, 0n);
    const subtotalSoldeDebit = rows.reduce(
      (s, r) => s + (r.estDebiteur ? r.solde : 0n),
      0n
    );
    const subtotalSoldeCredit = rows.reduce(
      (s, r) => s + (!r.estDebiteur ? r.solde : 0n),
      0n
    );
    groups.push({
      classe: cl,
      label: CLASS_LABELS[cl] ?? `Classe ${cl}`,
      rows: rows.sort((a, b) => a.compte.numero.localeCompare(b.compte.numero)),
      subtotalDebit,
      subtotalCredit,
      subtotalSoldeDebit,
      subtotalSoldeCredit
    });
  }
  return groups;
}
function BalancePage() {
  const { data: exercices = [] } = useExercices();
  const [exercice, setExercice] = reactExports.useState(currentExercice());
  const { data: balances = [], isLoading } = useBalance(exercice);
  const exerciceOptions = reactExports.useMemo(
    () => exercices.length > 0 ? exercices : [{ annee: currentExercice(), fin: 0n, debut: 0n, cloture: false }],
    [exercices]
  );
  const groups = reactExports.useMemo(() => groupByClasse(balances), [balances]);
  const grandTotalDebit = groups.reduce((s, g) => s + g.subtotalDebit, 0n);
  const grandTotalCredit = groups.reduce((s, g) => s + g.subtotalCredit, 0n);
  const grandSoldeDebit = groups.reduce((s, g) => s + g.subtotalSoldeDebit, 0n);
  const grandSoldeCredit = groups.reduce(
    (s, g) => s + g.subtotalSoldeCredit,
    0n
  );
  const isEquilibre = grandTotalDebit === grandTotalCredit;
  const handlePrint = () => window.print();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 print:p-4 print:space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Balance Générale des Comptes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Exercice ",
            String(exercice),
            " · ",
            balances.length,
            " compte",
            balances.length !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 print:hidden", children: [
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
                  "data-ocid": "balance-exercice-select",
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
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handlePrint,
            className: "gap-2",
            "data-ocid": "export-balance-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
              "Exporter / Imprimer"
            ]
          }
        )
      ] })
    ] }),
    !isLoading && balances.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex items-center gap-3 rounded-xl px-5 py-3.5 border text-sm font-semibold ${isEquilibre ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"}`,
        "data-ocid": "balance-equilibre-indicator",
        children: [
          isEquilibre ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isEquilibre ? "Balance équilibrée — Total débit = Total crédit" : "Balance non équilibrée — Vérifiez vos écritures" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono", children: [
            formatAmount(grandTotalDebit),
            " DZD"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card shadow-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b-2 border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "N° Compte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Libellé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Mvt Débit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Mvt Crédit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Solde Débiteur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Solde Créditeur" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["b1", "b2", "b3", "b4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) })
      ] }, k)) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "td",
        {
          colSpan: 6,
          className: "text-center py-16 text-muted-foreground",
          "data-ocid": "balance-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "w-8 h-8 mx-auto mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Aucune donnée" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Créez des écritures comptables pour générer la balance" })
          ]
        }
      ) }) : groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "tr",
          {
            className: "bg-primary/5 border-y border-primary/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 6,
                className: "px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary",
                children: group.label
              }
            )
          },
          `class-header-${group.classe}`
        ),
        group.rows.map((balance) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/60 hover:bg-muted/20 transition-colors",
            "data-ocid": `balance-row-${balance.compte.numero}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-sm font-semibold text-foreground", children: balance.compte.numero }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-foreground", children: balance.compte.libelle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-sm", children: balance.totalDebit > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatAmount(balance.totalDebit),
                " DZD"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-sm", children: balance.totalCredit > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatAmount(balance.totalCredit),
                " DZD"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-sm", children: balance.estDebiteur && balance.solde > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-600 dark:text-rose-400", children: [
                formatAmount(balance.solde),
                " DZD"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-sm", children: !balance.estDebiteur && balance.solde > 0n ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 dark:text-emerald-400", children: [
                formatAmount(balance.solde),
                " DZD"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) })
            ]
          },
          balance.compte.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border bg-muted/30 font-semibold text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  colSpan: 2,
                  className: "px-4 py-2.5 text-muted-foreground text-xs uppercase tracking-wide",
                  children: [
                    "Sous-total Classe ",
                    group.classe
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono", children: [
                formatAmount(group.subtotalDebit),
                " DZD"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono", children: [
                formatAmount(group.subtotalCredit),
                " DZD"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400", children: group.subtotalSoldeDebit > 0n ? `${formatAmount(group.subtotalSoldeDebit)} DZD` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400", children: group.subtotalSoldeCredit > 0n ? `${formatAmount(group.subtotalSoldeCredit)} DZD` : "—" })
            ]
          },
          `class-subtotal-${group.classe}`
        )
      ] })) }),
      !isLoading && groups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: `border-t-2 font-bold text-sm ${isEquilibre ? "border-emerald-400" : "border-rose-400"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 2,
                className: "px-4 py-3 text-foreground uppercase tracking-wide",
                children: "TOTAL GÉNÉRAL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: `px-4 py-3 text-right font-mono ${isEquilibre ? "text-foreground" : "text-rose-600 dark:text-rose-400"}`,
                children: [
                  formatAmount(grandTotalDebit),
                  " DZD"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: `px-4 py-3 text-right font-mono ${isEquilibre ? "text-foreground" : "text-rose-600 dark:text-rose-400"}`,
                children: [
                  formatAmount(grandTotalCredit),
                  " DZD"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-rose-600 dark:text-rose-400", children: [
              formatAmount(grandSoldeDebit),
              " DZD"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400", children: [
              formatAmount(grandSoldeCredit),
              " DZD"
            ] })
          ]
        }
      ) })
    ] }) }) })
  ] });
}
export {
  BalancePage as default
};
