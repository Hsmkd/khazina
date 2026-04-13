import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, T as TrendingUp, a as TrendingDown, W as Wallet, F as FileText, b as TriangleAlert, B as BookOpen, S as Skeleton, P as Package } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CDbFlOZ-.js";
import { u as useExercices, a as useDashboardStats, b as useJournalEntries, c as useProduitsEnAlerte, d as useValeurStock } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, f as formatDZD, a as formatDate } from "./format-DzCE1O3H.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode);
function ExerciceSelector({
  exercices,
  selected,
  onChange
}) {
  if (exercices.length <= 1) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
      "Exercice ",
      selected.toString()
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      value: selected.toString(),
      onChange: (e) => onChange(BigInt(e.target.value)),
      className: "text-sm border border-input rounded-md px-3 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
      "data-ocid": "exercice-selector",
      children: exercices.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: ex.annee.toString(), children: [
        "Exercice ",
        ex.annee.toString(),
        ex.cloture ? " (clôturé)" : ""
      ] }, ex.annee.toString()))
    }
  );
}
function KpiCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
    ] }) });
  }
  const trendColor = trend === "positive" ? "text-emerald-600 dark:text-emerald-400" : trend === "negative" ? "text-destructive" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "shadow-card transition-smooth hover:shadow-elevated",
      "data-ocid": "kpi-card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground leading-tight", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-accent/10 text-accent shrink-0 ml-2", children: icon })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `text-xl font-bold font-display tracking-tight ${trendColor} break-all`,
            children: value
          }
        ),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: subtitle })
      ] })
    }
  );
}
function JournalRow({ entry }) {
  const totalDebit = entry.ecritures.reduce((acc, e) => acc + e.debit, 0n);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
      "data-ocid": "journal-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-muted-foreground whitespace-nowrap", children: formatDate(entry.date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-foreground max-w-[200px] truncate", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: entry.libelle, children: entry.libelle }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm font-mono text-right whitespace-nowrap text-foreground", children: formatDZD(totalDebit) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: entry.valide ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "default",
            className: "text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
            children: "Validé"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Brouillon" }) })
      ]
    }
  );
}
function StockAlertRow({ produit }) {
  const isRupture = produit.stockActuel === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between py-2.5 border-b border-border last:border-0",
      "data-ocid": "stock-alert-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: produit.designation }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: produit.code })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-3 text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: `text-sm font-bold tabular-nums ${isRupture ? "text-destructive" : "text-amber-600 dark:text-amber-400"}`,
              children: [
                produit.stockActuel,
                " ",
                produit.unite
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "min: ",
            produit.stockMinimum,
            " ",
            produit.unite
          ] })
        ] })
      ]
    }
  );
}
function DashboardPage() {
  const [exercice, setExercice] = reactExports.useState(currentExercice());
  const { data: exercices = [], isLoading: loadingEx } = useExercices();
  const { data: stats, isLoading: loadingStats } = useDashboardStats(exercice);
  const { data: journalData, isLoading: loadingJournal } = useJournalEntries(
    exercice,
    0n
  );
  const { data: alertes = [], isLoading: loadingAlertes } = useProduitsEnAlerte();
  const { data: valeurStock = [], isLoading: loadingStock } = useValeurStock();
  const latestAnnee = !loadingEx && exercices.length > 0 ? exercices.reduce((max, ex) => ex.annee > max ? ex.annee : max, 0n) : null;
  const effectiveExercice = latestAnnee ?? exercice;
  const recentEntries = ((journalData == null ? void 0 : journalData.entries) ?? []).slice(
    0,
    5
  );
  const totalValeurStock = valeurStock.reduce(
    (acc, v) => acc + v.valeurTotale,
    0n
  );
  const resultatPositif = stats ? stats.resultatNet >= 0n : true;
  const kpis = [
    {
      title: "Chiffre d'affaires",
      value: loadingStats ? "—" : formatDZD((stats == null ? void 0 : stats.chiffreAffaires) ?? 0n),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18, "aria-label": "CA" }),
      trend: "positive",
      subtitle: `Exercice ${effectiveExercice.toString()}`,
      loading: loadingStats
    },
    {
      title: "Résultat net",
      value: loadingStats ? "—" : formatDZD((stats == null ? void 0 : stats.resultatNet) ?? 0n),
      icon: resultatPositif ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18, "aria-label": "Résultat" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18, "aria-label": "Résultat" }),
      trend: loadingStats ? "neutral" : resultatPositif ? "positive" : "negative",
      subtitle: resultatPositif ? "Bénéfice" : "Perte",
      loading: loadingStats
    },
    {
      title: "Trésorerie",
      value: loadingStats ? "—" : formatDZD((stats == null ? void 0 : stats.soldeTresorerie) ?? 0n),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 18, "aria-label": "Trésorerie" }),
      trend: "neutral",
      loading: loadingStats
    },
    {
      title: "Factures en attente",
      value: loadingStats ? "—" : Number((stats == null ? void 0 : stats.nombreFacturesEnAttente) ?? 0n).toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18, "aria-label": "Factures en attente" }),
      trend: "neutral",
      subtitle: "En brouillon",
      loading: loadingStats
    },
    {
      title: "Créances clients",
      value: loadingStats ? "—" : formatDZD((stats == null ? void 0 : stats.totalCreances) ?? 0n),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18, "aria-label": "Créances" }),
      trend: "neutral",
      subtitle: "Non encaissées",
      loading: loadingStats
    },
    {
      title: "Dettes fournisseurs",
      value: loadingStats ? "—" : formatDZD((stats == null ? void 0 : stats.totalDettes) ?? 0n),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18, "aria-label": "Dettes" }),
      trend: stats && stats.totalDettes > 0n ? "negative" : "neutral",
      subtitle: "Non réglées",
      loading: loadingStats
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground tracking-tight", children: "Tableau de bord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Vue d'ensemble de votre activité comptable" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ExerciceSelector,
        {
          exercices,
          selected: effectiveExercice,
          onChange: setExercice
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4", children: kpis.map((kpi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      KpiCard,
      {
        title: kpi.title,
        value: kpi.value,
        icon: kpi.icon,
        trend: kpi.trend,
        subtitle: kpi.subtitle,
        loading: kpi.loading
      },
      kpi.title
    )) }),
    !loadingStats && stats && stats.alertesStock > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
        "data-ocid": "stock-alert-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, "aria-label": "Alerte stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
            Number(stats.alertesStock),
            " produit",
            Number(stats.alertesStock) > 1 ? "s" : "",
            " en alerte de stock"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BookOpen,
            {
              size: 16,
              className: "text-accent",
              "aria-label": "Journal"
            }
          ),
          "Dernières écritures comptables"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loadingJournal ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: ["j1", "j2", "j3", "j4", "j5"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded" }, id)) }) : recentEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-12 px-4 text-center",
            "data-ocid": "journal-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BookOpen,
                {
                  size: 32,
                  className: "text-muted-foreground/40 mb-3",
                  "aria-label": "Aucune écriture"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Aucune écriture pour cet exercice" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Les écritures comptables apparaîtront ici une fois saisies." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Libellé" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Montant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Statut" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recentEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(JournalRow, { entry }, entry.id)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16, className: "text-accent", "aria-label": "Stock" }),
          "Alertes de stock"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-4", children: loadingAlertes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a1", "a2", "a3"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded" }, id)) }) : alertes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-8 text-center",
            "data-ocid": "stock-alerts-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Package,
                {
                  size: 28,
                  className: "text-muted-foreground/40 mb-2",
                  "aria-label": "Aucune alerte"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Aucune alerte de stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Tous les niveaux sont suffisants." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "stock-alerts-list", children: alertes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(StockAlertRow, { produit: p }, p.id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-lg bg-accent/15 text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20, "aria-label": "Valeur stock" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Valeur totale du stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Valorisation au prix moyen pondéré (CMUP)" })
        ] })
      ] }),
      loadingStock ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-2xl font-bold font-display text-foreground tracking-tight",
          "data-ocid": "total-stock-value",
          children: formatDZD(totalValeurStock)
        }
      )
    ] }) }) })
  ] });
}
export {
  DashboardPage as default
};
