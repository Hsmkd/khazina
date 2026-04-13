import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useComptes,
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useExercices,
  useJournalEntries,
  useValidateJournalEntry,
} from "@/hooks/useBackend";
import {
  currentExercice,
  dateToTimestamp,
  formatAmount,
  formatDate,
} from "@/lib/format";
import type { Account, EcritureComptable, JournalEntryInput } from "@/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Écriture line row ─────────────────────────────────────────────────────────

interface EcritureLine {
  key: string;
  compte: string;
  libelle: string;
  debit: string;
  credit: string;
}

const EMPTY_LINE = (): EcritureLine => ({
  key: crypto.randomUUID(),
  compte: "",
  libelle: "",
  debit: "",
  credit: "",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMontant(v: string): bigint {
  const cleaned = v.replace(/\s/g, "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n) || n < 0) return 0n;
  return BigInt(Math.round(n * 100));
}

function linesTotal(lines: EcritureLine[], field: "debit" | "credit"): bigint {
  return lines.reduce((acc, l) => acc + parseMontant(l[field]), 0n);
}

// ─── Nouvelle écriture dialog ─────────────────────────────────────────────────

interface NewEntryDialogProps {
  open: boolean;
  onClose: () => void;
  comptes: Account[];
  exercice: bigint;
}

function NewEntryDialog({
  open,
  onClose,
  comptes,
  exercice,
}: NewEntryDialogProps) {
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [libelle, setLibelle] = useState("");
  const [lines, setLines] = useState<EcritureLine[]>([
    EMPTY_LINE(),
    EMPTY_LINE(),
  ]);
  const create = useCreateJournalEntry();

  const totalDebit = linesTotal(lines, "debit");
  const totalCredit = linesTotal(lines, "credit");
  const isBalanced = totalDebit > 0n && totalDebit === totalCredit;

  const setLine = (key: string, field: keyof EcritureLine, value: string) => {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)),
    );
  };

  const addLine = () => setLines((prev) => [...prev, EMPTY_LINE()]);
  const removeLine = (key: string) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((l) => l.key !== key));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      toast.error("L'écriture n'est pas équilibrée (Débit ≠ Crédit)");
      return;
    }
    const ecritures: EcritureComptable[] = lines
      .filter((l) => l.compte)
      .map((l) => ({
        compte: l.compte,
        libelle: l.libelle || libelle,
        debit: parseMontant(l.debit),
        credit: parseMontant(l.credit),
      }));
    const entry: JournalEntryInput = {
      date: dateToTimestamp(new Date(date)),
      libelle,
      exercice,
      journalCode: "OD",
      ecritures,
    };
    try {
      const res = await create.mutateAsync(entry);
      if ("err" in res) {
        toast.error(res.err);
      } else {
        toast.success("Écriture créée avec succès");
        setDate(new Date().toISOString().substring(0, 10));
        setLibelle("");
        setLines([EMPTY_LINE(), EMPTY_LINE()]);
        onClose();
      }
    } catch {
      toast.error("Erreur lors de la création de l'écriture");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle écriture comptable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="entry-date">Date *</Label>
              <Input
                id="entry-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="journal-date-input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-libelle">Libellé *</Label>
              <Input
                id="entry-libelle"
                placeholder="ex: Règlement facture client"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                data-ocid="journal-libelle-input"
                required
              />
            </div>
          </div>

          {/* Lignes d'écriture */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 px-1">
              <span className="col-span-3 text-xs font-semibold text-muted-foreground">
                Compte
              </span>
              <span className="col-span-3 text-xs font-semibold text-muted-foreground">
                Libellé ligne
              </span>
              <span className="col-span-2 text-xs font-semibold text-muted-foreground text-right">
                Débit
              </span>
              <span className="col-span-2 text-xs font-semibold text-muted-foreground text-right">
                Crédit
              </span>
              <span className="col-span-2" />
            </div>
            {lines.map((line) => (
              <div
                key={line.key}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <div className="col-span-3">
                  <Select
                    value={line.compte}
                    onValueChange={(v) => setLine(line.key, "compte", v)}
                  >
                    <SelectTrigger
                      className="h-8 text-xs"
                      data-ocid="journal-line-compte"
                    >
                      <SelectValue placeholder="Compte…" />
                    </SelectTrigger>
                    <SelectContent className="max-h-52">
                      {comptes.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.numero}
                          className="text-xs"
                        >
                          {c.numero} – {c.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Input
                    className="h-8 text-xs"
                    placeholder="Libellé…"
                    value={line.libelle}
                    onChange={(e) =>
                      setLine(line.key, "libelle", e.target.value)
                    }
                    data-ocid="journal-line-libelle"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    className="h-8 text-xs text-right"
                    placeholder="0,00"
                    value={line.debit}
                    onChange={(e) => setLine(line.key, "debit", e.target.value)}
                    data-ocid="journal-line-debit"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    className="h-8 text-xs text-right"
                    placeholder="0,00"
                    value={line.credit}
                    onChange={(e) =>
                      setLine(line.key, "credit", e.target.value)
                    }
                    data-ocid="journal-line-credit"
                  />
                </div>
                <div className="col-span-2 flex gap-1 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLine(line.key)}
                    aria-label="Supprimer la ligne"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLine}
              className="gap-1.5 mt-1"
              data-ocid="add-line-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une ligne
            </Button>
          </div>

          {/* Balance indicator */}
          <div
            className={`flex items-center justify-between rounded-lg px-4 py-3 border text-sm font-medium ${
              isBalanced
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
            }`}
            data-ocid="balance-indicator"
          >
            <span>
              {isBalanced
                ? "✓ Écriture équilibrée"
                : "⚠ Écriture non équilibrée"}
            </span>
            <div className="flex gap-6 font-mono text-xs">
              <span>Débit : {formatAmount(totalDebit)} DZD</span>
              <span>Crédit : {formatAmount(totalCredit)} DZD</span>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="cancel-entry"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || !isBalanced}
              data-ocid="submit-entry"
            >
              {create.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const { data: exercices = [] } = useExercices();
  const { data: comptes = [] } = useComptes();
  const [exercice, setExercice] = useState<bigint>(currentExercice());
  const [page] = useState<bigint>(0n);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useJournalEntries(exercice, page);
  const entries = data?.entries ?? [];

  const validateEntry = useValidateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const exerciceOptions = useMemo(
    () =>
      exercices.length > 0
        ? exercices
        : [{ annee: currentExercice(), fin: 0n, debut: 0n, cloture: false }],
    [exercices],
  );

  const handleValidate = async (id: string) => {
    try {
      const res = await validateEntry.mutateAsync(id);
      if ("err" in res) toast.error(res.err);
      else toast.success("Écriture validée");
    } catch {
      toast.error("Erreur lors de la validation");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette écriture ?")) return;
    try {
      const res = await deleteEntry.mutateAsync(id);
      if ("err" in res) toast.error(res.err);
      else toast.success("Écriture supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Journal Comptable
            </h1>
            <p className="text-sm text-muted-foreground">
              {data?.total ?? 0} écriture
              {Number(data?.total ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={String(exercice)}
            onValueChange={(v) => setExercice(BigInt(v))}
          >
            <SelectTrigger className="w-36" data-ocid="journal-exercice-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exerciceOptions.map((ex) => (
                <SelectItem key={String(ex.annee)} value={String(ex.annee)}>
                  Exercice {String(ex.annee)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setDialogOpen(true)}
            data-ocid="new-entry-btn"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle écriture
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-6 px-4 py-3" />
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  N°
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Libellé
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Total débit
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Total crédit
                </th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">
                  Statut
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["j1", "j2", "j3"].map((k) => (
                  <tr key={k} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-4" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-7 w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-muted-foreground"
                    data-ocid="journal-empty-state"
                  >
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Aucune écriture</p>
                    <p className="text-xs mt-1">
                      Créez votre première écriture comptable
                    </p>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const totalDebit = entry.ecritures.reduce(
                    (s, e) => s + e.debit,
                    0n,
                  );
                  const totalCredit = entry.ecritures.reduce(
                    (s, e) => s + e.credit,
                    0n,
                  );
                  const isExpanded = expandedId === entry.id;
                  return (
                    <>
                      <tr
                        key={entry.id}
                        className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                        data-ocid={`journal-row-${entry.id}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          <button
                            type="button"
                            className="p-0.5 rounded hover:bg-muted transition-colors"
                            aria-label={isExpanded ? "Réduire" : "Développer"}
                            onClick={() =>
                              setExpandedId(isExpanded ? null : entry.id)
                            }
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          #{String(entry.numero).padStart(4, "0")}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {entry.libelle}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {formatAmount(totalDebit)} DZD
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {formatAmount(totalCredit)} DZD
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.valide ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                              Validé
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                              Brouillon
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!entry.valide && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                  onClick={() => handleValidate(entry.id)}
                                  aria-label="Valider"
                                  data-ocid={`validate-entry-${entry.id}`}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(entry.id)}
                                  aria-label="Supprimer"
                                  data-ocid={`delete-entry-${entry.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr
                          key={`${entry.id}-expanded`}
                          className="bg-muted/20 border-b border-border/60"
                        >
                          <td colSpan={8} className="px-6 py-3">
                            <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
                              Détail des écritures
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-muted-foreground">
                                  <th className="text-left pb-1 font-medium w-32">
                                    Compte
                                  </th>
                                  <th className="text-left pb-1 font-medium">
                                    Libellé
                                  </th>
                                  <th className="text-right pb-1 font-medium w-32">
                                    Débit
                                  </th>
                                  <th className="text-right pb-1 font-medium w-32">
                                    Crédit
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {entry.ecritures.map((ec, i) => (
                                  <tr
                                    key={`${entry.id}-ec-${i}`}
                                    className="border-t border-border/40"
                                  >
                                    <td className="py-1.5 font-mono">
                                      {ec.compte}
                                    </td>
                                    <td className="py-1.5">{ec.libelle}</td>
                                    <td className="py-1.5 text-right font-mono text-rose-600 dark:text-rose-400">
                                      {ec.debit > 0n
                                        ? `${formatAmount(ec.debit)} DZD`
                                        : "—"}
                                    </td>
                                    <td className="py-1.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                      {ec.credit > 0n
                                        ? `${formatAmount(ec.credit)} DZD`
                                        : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        comptes={comptes}
        exercice={exercice}
      />
    </div>
  );
}
