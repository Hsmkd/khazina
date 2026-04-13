import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBalance, useExercices } from "@/hooks/useBackend";
import { currentExercice, formatAmount } from "@/lib/format";
import type { AccountBalance } from "@/types";
import { CheckCircle, Download, Scale, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

const CLASS_LABELS: Record<number, string> = {
  1: "Classe 1 — Capitaux propres et assimilés",
  2: "Classe 2 — Immobilisations",
  3: "Classe 3 — Stocks",
  4: "Classe 4 — Tiers",
  5: "Classe 5 — Trésorerie",
  6: "Classe 6 — Charges",
  7: "Classe 7 — Produits",
};

interface GroupedBalance {
  classe: number;
  label: string;
  rows: AccountBalance[];
  subtotalDebit: bigint;
  subtotalCredit: bigint;
  subtotalSoldeDebit: bigint;
  subtotalSoldeCredit: bigint;
}

function groupByClasse(balances: AccountBalance[]): GroupedBalance[] {
  const map = new Map<number, AccountBalance[]>();
  for (const b of balances) {
    const cl = Number(b.compte.classe);
    const existing = map.get(cl);
    if (existing) existing.push(b);
    else map.set(cl, [b]);
  }
  const groups: GroupedBalance[] = [];
  for (const [cl, rows] of Array.from(map.entries()).sort(
    ([a], [b]) => a - b,
  )) {
    const subtotalDebit = rows.reduce((s, r) => s + r.totalDebit, 0n);
    const subtotalCredit = rows.reduce((s, r) => s + r.totalCredit, 0n);
    const subtotalSoldeDebit = rows.reduce(
      (s, r) => s + (r.estDebiteur ? r.solde : 0n),
      0n,
    );
    const subtotalSoldeCredit = rows.reduce(
      (s, r) => s + (!r.estDebiteur ? r.solde : 0n),
      0n,
    );
    groups.push({
      classe: cl,
      label: CLASS_LABELS[cl] ?? `Classe ${cl}`,
      rows: rows.sort((a, b) => a.compte.numero.localeCompare(b.compte.numero)),
      subtotalDebit,
      subtotalCredit,
      subtotalSoldeDebit,
      subtotalSoldeCredit,
    });
  }
  return groups;
}

export default function BalancePage() {
  const { data: exercices = [] } = useExercices();
  const [exercice, setExercice] = useState<bigint>(currentExercice());
  const { data: balances = [], isLoading } = useBalance(exercice);

  const exerciceOptions = useMemo(
    () =>
      exercices.length > 0
        ? exercices
        : [{ annee: currentExercice(), fin: 0n, debut: 0n, cloture: false }],
    [exercices],
  );

  const groups = useMemo(() => groupByClasse(balances), [balances]);

  const grandTotalDebit = groups.reduce((s, g) => s + g.subtotalDebit, 0n);
  const grandTotalCredit = groups.reduce((s, g) => s + g.subtotalCredit, 0n);
  const grandSoldeDebit = groups.reduce((s, g) => s + g.subtotalSoldeDebit, 0n);
  const grandSoldeCredit = groups.reduce(
    (s, g) => s + g.subtotalSoldeCredit,
    0n,
  );
  const isEquilibre = grandTotalDebit === grandTotalCredit;

  const handlePrint = () => window.print();

  return (
    <div className="p-6 space-y-6 print:p-4 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center print:hidden">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Balance Générale des Comptes
            </h1>
            <p className="text-sm text-muted-foreground">
              Exercice {String(exercice)} · {balances.length} compte
              {balances.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <Select
            value={String(exercice)}
            onValueChange={(v) => setExercice(BigInt(v))}
          >
            <SelectTrigger
              className="w-40"
              data-ocid="balance-exercice-select"
              aria-label="Exercice"
            >
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
            variant="outline"
            onClick={handlePrint}
            className="gap-2"
            data-ocid="export-balance-btn"
          >
            <Download className="w-4 h-4" />
            Exporter / Imprimer
          </Button>
        </div>
      </div>

      {/* Equilibre indicator */}
      {!isLoading && balances.length > 0 && (
        <div
          className={`flex items-center gap-3 rounded-xl px-5 py-3.5 border text-sm font-semibold ${
            isEquilibre
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
          }`}
          data-ocid="balance-equilibre-indicator"
        >
          {isEquilibre ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>
            {isEquilibre
              ? "Balance équilibrée — Total débit = Total crédit"
              : "Balance non équilibrée — Vérifiez vos écritures"}
          </span>
          <span className="ml-auto font-mono">
            {formatAmount(grandTotalDebit)} DZD
          </span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  N° Compte
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Libellé
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Mvt Débit
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Mvt Crédit
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Solde Débiteur
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Solde Créditeur
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["b1", "b2", "b3", "b4"].map((k) => (
                  <tr key={k} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
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
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : groups.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground"
                    data-ocid="balance-empty-state"
                  >
                    <Scale className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Aucune donnée</p>
                    <p className="text-xs mt-1">
                      Créez des écritures comptables pour générer la balance
                    </p>
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <>
                    {/* Class header */}
                    <tr
                      key={`class-header-${group.classe}`}
                      className="bg-primary/5 border-y border-primary/10"
                    >
                      <td
                        colSpan={6}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary"
                      >
                        {group.label}
                      </td>
                    </tr>

                    {/* Account rows */}
                    {group.rows.map((balance) => (
                      <tr
                        key={balance.compte.id}
                        className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                        data-ocid={`balance-row-${balance.compte.numero}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-sm font-semibold text-foreground">
                          {balance.compte.numero}
                        </td>
                        <td className="px-4 py-2.5 text-foreground">
                          {balance.compte.libelle}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-sm">
                          {balance.totalDebit > 0n ? (
                            <span>{formatAmount(balance.totalDebit)} DZD</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-sm">
                          {balance.totalCredit > 0n ? (
                            <span>{formatAmount(balance.totalCredit)} DZD</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-sm">
                          {balance.estDebiteur && balance.solde > 0n ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              {formatAmount(balance.solde)} DZD
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-sm">
                          {!balance.estDebiteur && balance.solde > 0n ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {formatAmount(balance.solde)} DZD
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {/* Class subtotal */}
                    <tr
                      key={`class-subtotal-${group.classe}`}
                      className="border-b border-border bg-muted/30 font-semibold text-sm"
                    >
                      <td
                        colSpan={2}
                        className="px-4 py-2.5 text-muted-foreground text-xs uppercase tracking-wide"
                      >
                        Sous-total Classe {group.classe}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        {formatAmount(group.subtotalDebit)} DZD
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        {formatAmount(group.subtotalCredit)} DZD
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                        {group.subtotalSoldeDebit > 0n
                          ? `${formatAmount(group.subtotalSoldeDebit)} DZD`
                          : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {group.subtotalSoldeCredit > 0n
                          ? `${formatAmount(group.subtotalSoldeCredit)} DZD`
                          : "—"}
                      </td>
                    </tr>
                  </>
                ))
              )}
            </tbody>

            {/* Grand total */}
            {!isLoading && groups.length > 0 && (
              <tfoot>
                <tr
                  className={`border-t-2 font-bold text-sm ${
                    isEquilibre ? "border-emerald-400" : "border-rose-400"
                  }`}
                >
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-foreground uppercase tracking-wide"
                  >
                    TOTAL GÉNÉRAL
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono ${isEquilibre ? "text-foreground" : "text-rose-600 dark:text-rose-400"}`}
                  >
                    {formatAmount(grandTotalDebit)} DZD
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono ${isEquilibre ? "text-foreground" : "text-rose-600 dark:text-rose-400"}`}
                  >
                    {formatAmount(grandTotalCredit)} DZD
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600 dark:text-rose-400">
                    {formatAmount(grandSoldeDebit)} DZD
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    {formatAmount(grandSoldeCredit)} DZD
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
