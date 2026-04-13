import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, F as FileText, d as Button, S as Skeleton, C as ChevronRight } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { P as Plus, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CDXbd5E3.js";
import { u as ue, L as Label, I as Input } from "./index-nPZKqwAB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as ChevronDown } from "./select-B8NVtKmT.js";
import { u as useExercices, e as useComptes, b as useJournalEntries, g as useValidateJournalEntry, h as useDeleteJournalEntry, i as useCreateJournalEntry } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, a as formatDate, b as formatAmount, d as dateToTimestamp } from "./format-DzCE1O3H.js";
import { C as CircleCheckBig } from "./circle-check-big-5CX_dOyG.js";
import { T as Trash2 } from "./trash-2-CKagV75d.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
const EMPTY_LINE = () => ({
  key: crypto.randomUUID(),
  compte: "",
  libelle: "",
  debit: "",
  credit: ""
});
function parseMontant(v) {
  const cleaned = v.replace(/\s/g, "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n) || n < 0) return 0n;
  return BigInt(Math.round(n * 100));
}
function linesTotal(lines, field) {
  return lines.reduce((acc, l) => acc + parseMontant(l[field]), 0n);
}
function NewEntryDialog({
  open,
  onClose,
  comptes,
  exercice
}) {
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().substring(0, 10));
  const [libelle, setLibelle] = reactExports.useState("");
  const [lines, setLines] = reactExports.useState([
    EMPTY_LINE(),
    EMPTY_LINE()
  ]);
  const create = useCreateJournalEntry();
  const totalDebit = linesTotal(lines, "debit");
  const totalCredit = linesTotal(lines, "credit");
  const isBalanced = totalDebit > 0n && totalDebit === totalCredit;
  const setLine = (key, field, value) => {
    setLines(
      (prev) => prev.map((l) => l.key === key ? { ...l, [field]: value } : l)
    );
  };
  const addLine = () => setLines((prev) => [...prev, EMPTY_LINE()]);
  const removeLine = (key) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((l) => l.key !== key));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBalanced) {
      ue.error("L'écriture n'est pas équilibrée (Débit ≠ Crédit)");
      return;
    }
    const ecritures = lines.filter((l) => l.compte).map((l) => ({
      compte: l.compte,
      libelle: l.libelle || libelle,
      debit: parseMontant(l.debit),
      credit: parseMontant(l.credit)
    }));
    const entry = {
      date: dateToTimestamp(new Date(date)),
      libelle,
      exercice,
      journalCode: "OD",
      ecritures
    };
    try {
      const res = await create.mutateAsync(entry);
      if ("err" in res) {
        ue.error(res.err);
      } else {
        ue.success("Écriture créée avec succès");
        setDate((/* @__PURE__ */ new Date()).toISOString().substring(0, 10));
        setLibelle("");
        setLines([EMPTY_LINE(), EMPTY_LINE()]);
        onClose();
      }
    } catch {
      ue.error("Erreur lors de la création de l'écriture");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nouvelle écriture comptable" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-date", children: "Date *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "entry-date",
              type: "date",
              value: date,
              onChange: (e) => setDate(e.target.value),
              "data-ocid": "journal-date-input",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-libelle", children: "Libellé *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "entry-libelle",
              placeholder: "ex: Règlement facture client",
              value: libelle,
              onChange: (e) => setLibelle(e.target.value),
              "data-ocid": "journal-libelle-input",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-xs font-semibold text-muted-foreground", children: "Compte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-xs font-semibold text-muted-foreground", children: "Libellé ligne" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-xs font-semibold text-muted-foreground text-right", children: "Débit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-xs font-semibold text-muted-foreground text-right", children: "Crédit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2" })
        ] }),
        lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-12 gap-2 items-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: line.compte,
                  onValueChange: (v) => setLine(line.key, "compte", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-8 text-xs",
                        "data-ocid": "journal-line-compte",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Compte…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-52", children: comptes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      SelectItem,
                      {
                        value: c.numero,
                        className: "text-xs",
                        children: [
                          c.numero,
                          " – ",
                          c.libelle
                        ]
                      },
                      c.id
                    )) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "h-8 text-xs",
                  placeholder: "Libellé…",
                  value: line.libelle,
                  onChange: (e) => setLine(line.key, "libelle", e.target.value),
                  "data-ocid": "journal-line-libelle"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "h-8 text-xs text-right",
                  placeholder: "0,00",
                  value: line.debit,
                  onChange: (e) => setLine(line.key, "debit", e.target.value),
                  "data-ocid": "journal-line-debit"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "h-8 text-xs text-right",
                  placeholder: "0,00",
                  value: line.credit,
                  onChange: (e) => setLine(line.key, "credit", e.target.value),
                  "data-ocid": "journal-line-credit"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 flex gap-1 justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                  onClick: () => removeLine(line.key),
                  "aria-label": "Supprimer la ligne",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                }
              ) })
            ]
          },
          line.key
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: addLine,
            className: "gap-1.5 mt-1",
            "data-ocid": "add-line-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Ajouter une ligne"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center justify-between rounded-lg px-4 py-3 border text-sm font-medium ${isBalanced ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"}`,
          "data-ocid": "balance-indicator",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isBalanced ? "✓ Écriture équilibrée" : "⚠ Écriture non équilibrée" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 font-mono text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Débit : ",
                formatAmount(totalDebit),
                " DZD"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Crédit : ",
                formatAmount(totalCredit),
                " DZD"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "cancel-entry",
            children: "Annuler"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: create.isPending || !isBalanced,
            "data-ocid": "submit-entry",
            children: create.isPending ? "Enregistrement…" : "Enregistrer"
          }
        )
      ] })
    ] })
  ] }) });
}
function JournalPage() {
  const { data: exercices = [] } = useExercices();
  const { data: comptes = [] } = useComptes();
  const [exercice, setExercice] = reactExports.useState(currentExercice());
  const [page] = reactExports.useState(0n);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const { data, isLoading } = useJournalEntries(exercice, page);
  const entries = (data == null ? void 0 : data.entries) ?? [];
  const validateEntry = useValidateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  const exerciceOptions = reactExports.useMemo(
    () => exercices.length > 0 ? exercices : [{ annee: currentExercice(), fin: 0n, debut: 0n, cloture: false }],
    [exercices]
  );
  const handleValidate = async (id) => {
    try {
      const res = await validateEntry.mutateAsync(id);
      if ("err" in res) ue.error(res.err);
      else ue.success("Écriture validée");
    } catch {
      ue.error("Erreur lors de la validation");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette écriture ?")) return;
    try {
      const res = await deleteEntry.mutateAsync(id);
      if ("err" in res) ue.error(res.err);
      else ue.success("Écriture supprimée");
    } catch {
      ue.error("Erreur lors de la suppression");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Journal Comptable" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            (data == null ? void 0 : data.total) ?? 0,
            " écriture",
            Number((data == null ? void 0 : data.total) ?? 0) !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(exercice),
            onValueChange: (v) => setExercice(BigInt(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "journal-exercice-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
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
            onClick: () => setDialogOpen(true),
            "data-ocid": "new-entry-btn",
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Nouvelle écriture"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card shadow-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-6 px-4 py-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "N°" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Libellé" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Total débit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Total crédit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 font-semibold text-foreground", children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? ["j1", "j2", "j3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-10" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 ml-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 mx-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 ml-auto" }) })
      ] }, k)) : entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "td",
        {
          colSpan: 8,
          className: "text-center py-16 text-muted-foreground",
          "data-ocid": "journal-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 mx-auto mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Aucune écriture" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Créez votre première écriture comptable" })
          ]
        }
      ) }) : entries.map((entry) => {
        const totalDebit = entry.ecritures.reduce(
          (s, e) => s + e.debit,
          0n
        );
        const totalCredit = entry.ecritures.reduce(
          (s, e) => s + e.credit,
          0n
        );
        const isExpanded = expandedId === entry.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/60 hover:bg-muted/20 transition-colors",
              "data-ocid": `journal-row-${entry.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "p-0.5 rounded hover:bg-muted transition-colors",
                    "aria-label": isExpanded ? "Réduire" : "Développer",
                    onClick: () => setExpandedId(isExpanded ? null : entry.id),
                    children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                  "#",
                  String(entry.numero).padStart(4, "0")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: formatDate(entry.date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground font-medium", children: entry.libelle }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-sm", children: [
                  formatAmount(totalDebit),
                  " DZD"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-sm", children: [
                  formatAmount(totalCredit),
                  " DZD"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: entry.valide ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800", children: "Validé" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800", children: "Brouillon" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-1.5", children: !entry.valide && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
                      onClick: () => handleValidate(entry.id),
                      "aria-label": "Valider",
                      "data-ocid": `validate-entry-${entry.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-destructive hover:bg-destructive/10",
                      onClick: () => handleDelete(entry.id),
                      "aria-label": "Supprimer",
                      "data-ocid": `delete-entry-${entry.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] }) }) })
              ]
            },
            entry.id
          ),
          isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              className: "bg-muted/20 border-b border-border/60",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 8, className: "px-6 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide", children: "Détail des écritures" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left pb-1 font-medium w-32", children: "Compte" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left pb-1 font-medium", children: "Libellé" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right pb-1 font-medium w-32", children: "Débit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right pb-1 font-medium w-32", children: "Crédit" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entry.ecritures.map((ec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-t border-border/40",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 font-mono", children: ec.compte }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5", children: ec.libelle }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-right font-mono text-rose-600 dark:text-rose-400", children: ec.debit > 0n ? `${formatAmount(ec.debit)} DZD` : "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-right font-mono text-emerald-600 dark:text-emerald-400", children: ec.credit > 0n ? `${formatAmount(ec.credit)} DZD` : "—" })
                      ]
                    },
                    `${entry.id}-ec-${i}`
                  )) })
                ] })
              ] })
            },
            `${entry.id}-expanded`
          )
        ] });
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewEntryDialog,
      {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        comptes,
        exercice
      }
    )
  ] });
}
export {
  JournalPage as default
};
