import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, S as Skeleton, T as TrendingUp, a as TrendingDown, d as Button } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CDbFlOZ-.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B8NVtKmT.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DxsJhoy2.js";
import { u as useExercices, D as useBilan, E as useCompanyInfo, F as useCompteResultats, k as useBalance } from "./useBackend-DhB6l_bQ.js";
import { f as formatDZD, b as formatAmount } from "./format-DzCE1O3H.js";
import { C as CircleAlert } from "./circle-alert-vd5Teel_.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
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
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
function ScfBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: "text-xs border-accent text-accent font-mono tracking-wide",
      children: "Conforme SCF – Loi 07-11"
    }
  );
}
function PrintButton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: () => window.print(),
      className: "gap-2 print:hidden",
      "data-ocid": "btn-print",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4" }),
        "Imprimer"
      ]
    }
  );
}
function AmountRow({
  label,
  amount,
  bold,
  indent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex justify-between items-center py-1.5 border-b border-border/50 last:border-0 ${bold ? "font-semibold" : ""} ${indent ? "pl-4" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-sm ${bold ? "text-foreground" : "text-muted-foreground"}`,
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-mono ${bold ? "text-foreground" : ""}`, children: formatAmount(amount) })
      ]
    }
  );
}
function SectionBlock({
  title,
  rows,
  totalLabel,
  total
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold uppercase tracking-widest text-primary/70 mb-2 pb-1 border-b-2 border-primary/20", children: title }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic py-2", children: "Aucun mouvement" }) : rows.map((ab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      AmountRow,
      {
        label: `${ab.compte.numero} – ${ab.compte.libelle}`,
        amount: ab.solde,
        indent: true
      },
      ab.compte.numero
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AmountRow, { label: totalLabel, amount: total, bold: true })
  ] });
}
function BilanTab({ exercice }) {
  const { data: bilan, isLoading } = useBilan(exercice);
  const { data: companyInfo } = useCompanyInfo();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mt-4", children: ["sk1", "sk2", "sk3"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, id)) });
  }
  if (!bilan) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 mx-auto mb-3 opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Données du bilan non disponibles pour cet exercice." })
    ] });
  }
  const actifNonCourant = bilan.actifDetails.filter(
    (ab) => ab.compte.numero.startsWith("2")
  );
  const actifCourant = bilan.actifDetails.filter(
    (ab) => ab.compte.numero.startsWith("3") || ab.compte.numero.startsWith("4") || ab.compte.numero.startsWith("5")
  );
  const capitauxPropres = bilan.passifDetails.filter(
    (ab) => ab.compte.numero.startsWith("1")
  );
  const passifNonCourant = bilan.passifDetails.filter(
    (ab) => ab.compte.numero.startsWith("1") === false && Number(ab.compte.numero[0]) >= 1 && Number(ab.compte.numero[0]) <= 4 && ab.compte.classe === 1n
  );
  const passifCourant = bilan.passifDetails.filter(
    (ab) => ab.compte.numero.startsWith("4")
  );
  const totalActifNonCourant = actifNonCourant.reduce(
    (s, ab) => s + ab.solde,
    0n
  );
  const totalActifCourant = actifCourant.reduce((s, ab) => s + ab.solde, 0n);
  const totalCapitauxPropres = capitauxPropres.reduce(
    (s, ab) => s + ab.solde,
    0n
  );
  const totalPassifNonCourant = passifNonCourant.reduce(
    (s, ab) => s + ab.solde,
    0n
  );
  const totalPassifCourant = passifCourant.reduce((s, ab) => s + ab.solde, 0n);
  const nomEntreprise = (companyInfo == null ? void 0 : companyInfo.nom) || "Votre entreprise";
  const annee = Number(exercice);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4 print:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: nomEntreprise }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-semibold text-primary mt-0.5", children: [
          "BILAN AU 31/12/",
          annee
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScfBadge, {}),
          bilan.estEquilibre ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
            "Bilan équilibré ✓"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-destructive font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
            "Déséquilibre détecté"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PrintButton, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 bg-primary/5 rounded-t-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold uppercase tracking-widest text-primary", children: "ACTIF" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionBlock,
            {
              title: "Actif Non Courant",
              rows: actifNonCourant,
              totalLabel: "Total Actif Non Courant",
              total: totalActifNonCourant
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionBlock,
            {
              title: "Actif Courant",
              rows: actifCourant,
              totalLabel: "Total Actif Courant",
              total: totalActifCourant
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t-2 border-primary flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm uppercase tracking-wide text-foreground", children: "TOTAL ACTIF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base font-mono text-primary", children: formatDZD(bilan.totalActif) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 bg-accent/10 rounded-t-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold uppercase tracking-widest text-accent-foreground", children: "PASSIF" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionBlock,
            {
              title: "Capitaux Propres",
              rows: capitauxPropres,
              totalLabel: "Total Capitaux Propres",
              total: totalCapitauxPropres
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionBlock,
            {
              title: "Passif Non Courant",
              rows: passifNonCourant,
              totalLabel: "Total Passif Non Courant",
              total: totalPassifNonCourant
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionBlock,
            {
              title: "Passif Courant",
              rows: passifCourant,
              totalLabel: "Total Passif Courant",
              total: totalPassifCourant
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t-2 border-accent flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm uppercase tracking-wide text-foreground", children: "TOTAL PASSIF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base font-mono text-accent-foreground", children: formatDZD(bilan.totalPassif) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function CompteResultatsTab({ exercice }) {
  const { data: cr, isLoading } = useCompteResultats(exercice);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mt-4", children: ["sk1", "sk2", "sk3"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, id)) });
  }
  if (!cr) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 mx-auto mb-3 opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Données non disponibles pour cet exercice." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-primary", children: [
          "COMPTE DE RÉSULTATS — Exercice ",
          Number(exercice)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScfBadge, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PrintButton, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 bg-destructive/5 rounded-t-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold uppercase tracking-widest text-destructive", children: "CHARGES (Classe 6)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
          cr.chargesDetails.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic py-2", children: "Aucune charge enregistrée" }) : cr.chargesDetails.map((ab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            AmountRow,
            {
              label: `${ab.compte.numero} – ${ab.compte.libelle}`,
              amount: ab.solde,
              indent: true
            },
            ab.compte.numero
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t-2 border-destructive flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm uppercase text-foreground", children: "TOTAL CHARGES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base font-mono text-destructive", children: formatDZD(cr.totalCharges) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 bg-emerald-500/5 rounded-t-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400", children: "PRODUITS (Classe 7)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", children: [
          cr.produitsDetails.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic py-2", children: "Aucun produit enregistré" }) : cr.produitsDetails.map((ab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            AmountRow,
            {
              label: `${ab.compte.numero} – ${ab.compte.libelle}`,
              amount: ab.solde,
              indent: true
            },
            ab.compte.numero
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t-2 border-emerald-500 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm uppercase text-foreground", children: "TOTAL PRODUITS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base font-mono text-emerald-700 dark:text-emerald-400", children: formatDZD(cr.totalProduits) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: `shadow-elevated border-2 ${cr.estBenefice ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-destructive/30 bg-destructive/5"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            cr.estBenefice ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-8 h-8 text-emerald-600 dark:text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-8 h-8 text-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-bold text-lg tracking-wide ${cr.estBenefice ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"}`,
                children: cr.estBenefice ? "BÉNÉFICE NET DE L'EXERCICE" : "PERTE NETTE DE L'EXERCICE"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-3xl font-bold font-display ${cr.estBenefice ? "text-emerald-700 dark:text-emerald-300" : "text-destructive"}`,
              children: formatDZD(
                cr.resultatNet < 0n ? -cr.resultatNet : cr.resultatNet
              )
            }
          )
        ] }) })
      }
    )
  ] });
}
const CLASS_LABELS = {
  "1": "Classe 1 – Capitaux",
  "2": "Classe 2 – Immobilisations",
  "3": "Classe 3 – Stocks",
  "4": "Classe 4 – Tiers",
  "5": "Classe 5 – Trésorerie",
  "6": "Classe 6 – Charges",
  "7": "Classe 7 – Produits"
};
function BalanceTab({ exercice }) {
  const { data: balances, isLoading } = useBalance(exercice);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mt-4", children: ["r1", "r2", "r3", "r4", "r5"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, id)) });
  }
  if (!balances || balances.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 mx-auto mb-3 opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aucune donnée de balance pour cet exercice." })
    ] });
  }
  const grouped = {};
  for (const ab of balances) {
    const cls = ab.compte.numero[0] ?? "?";
    if (!grouped[cls]) grouped[cls] = [];
    grouped[cls].push(ab);
  }
  const totalDebit = balances.reduce((s, ab) => s + ab.totalDebit, 0n);
  const totalCredit = balances.reduce((s, ab) => s + ab.totalCredit, 0n);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b-2 border-primary/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground w-24", children: "N° Compte" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground", children: "Libellé" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground", children: "Total Débit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground", children: "Total Crédit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground", children: "Solde" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Object.keys(grouped).sort().map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 5,
          className: "py-1.5 px-2 text-xs font-bold uppercase tracking-wider text-primary/80",
          children: CLASS_LABELS[cls] ?? `Classe ${cls}`
        }
      ) }),
      grouped[cls].map((ab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono text-xs text-muted-foreground", children: ab.compte.numero }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 truncate max-w-xs", children: ab.compte.libelle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono text-xs", children: formatAmount(ab.totalDebit) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono text-xs", children: formatAmount(ab.totalCredit) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `py-2 text-right font-mono text-xs font-medium ${ab.estDebiteur ? "text-foreground" : "text-muted-foreground"}`,
                children: formatAmount(ab.solde)
              }
            )
          ]
        },
        ab.compte.numero
      ))
    ] }, `group-${cls}`)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-primary font-bold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 2, className: "py-2 text-sm uppercase tracking-wide", children: "TOTAUX GÉNÉRAUX" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono", children: formatAmount(totalDebit) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono", children: formatAmount(totalCredit) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono", children: formatAmount(
        totalDebit > totalCredit ? totalDebit - totalCredit : totalCredit - totalDebit
      ) })
    ] }) })
  ] }) }) });
}
function RapportsPage() {
  const { data: exercices } = useExercices();
  const currentYear = BigInt((/* @__PURE__ */ new Date()).getFullYear());
  const [exercice, setExercice] = reactExports.useState(currentYear);
  const exerciceOptions = exercices && exercices.length > 0 ? exercices.map((e) => String(e.annee)) : [String(currentYear)];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "rapports-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Rapports Financiers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "États financiers conformes SCF – Loi 07-11" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground whitespace-nowrap", children: "Exercice :" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(exercice),
            onValueChange: (v) => setExercice(BigInt(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-28",
                  "data-ocid": "select-exercice-rapports",
                  "aria-label": "Sélectionner l'exercice fiscal",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: exerciceOptions.map((annee) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: annee, children: annee }, annee)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "bilan", className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          className: "bg-card border border-border",
          "data-ocid": "tabs-rapports",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "bilan", children: "Bilan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "compte-resultats", children: "Compte de résultats" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "balance", children: "Balance" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "bilan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BilanTab, { exercice }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "compte-resultats", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompteResultatsTab, { exercice }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "balance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceTab, { exercice }) })
    ] })
  ] });
}
export {
  RapportsPage as default
};
