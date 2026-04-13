import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useComptes, useExercices, useGrandLivre } from "@/hooks/useBackend";
import { currentExercice, formatAmount, formatDate } from "@/lib/format";
import type { Account } from "@/types";
import { BookMarked, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface GrandLivreRow {
  entryId: string;
  entryNumero: bigint;
  entryDate: bigint;
  entryLibelle: string;
  debit: bigint;
  credit: bigint;
  solde: bigint;
}

export default function GrandLivrePage() {
  const { data: exercices = [] } = useExercices();
  const { data: allComptes = [], isLoading: comptesLoading } = useComptes();
  const [exercice, setExercice] = useState<bigint>(currentExercice());
  const [selectedNumero, setSelectedNumero] = useState<string>("");
  const [search, setSearch] = useState("");

  const exerciceOptions = useMemo(
    () =>
      exercices.length > 0
        ? exercices
        : [{ annee: currentExercice(), fin: 0n, debut: 0n, cloture: false }],
    [exercices],
  );

  const { data: journalEntries = [], isLoading: livreLoading } = useGrandLivre(
    selectedNumero,
    exercice,
  );

  // Build running-balance rows for the selected account
  const rows: GrandLivreRow[] = useMemo(() => {
    let runningBalance = 0n;
    const result: GrandLivreRow[] = [];
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
          solde: runningBalance,
        });
      }
    }
    return result;
  }, [journalEntries, selectedNumero]);

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0n);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0n);
  const soldeFinal = totalDebit - totalCredit;

  // Filtered comptes for the search box
  const filteredComptes: Account[] = allComptes
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        !q ||
        c.numero.toLowerCase().includes(q) ||
        c.libelle.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.numero.localeCompare(b.numero));

  const selectedCompte = allComptes.find((c) => c.numero === selectedNumero);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BookMarked className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            Grand Livre
          </h1>
          <p className="text-sm text-muted-foreground">Mouvements par compte</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Compte selector with search */}
        <div className="flex-1 min-w-64 space-y-1.5">
          <label
            htmlFor="gl-search"
            className="text-sm font-medium text-foreground"
          >
            Compte
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="gl-search"
              type="text"
              placeholder="Rechercher un compte…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="grand-livre-search"
            />
          </div>
          {search && filteredComptes.length > 0 && (
            <div className="absolute z-10 mt-1 bg-card border border-border rounded-lg shadow-elevated max-h-52 overflow-y-auto text-sm">
              {filteredComptes.slice(0, 20).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSelectedNumero(c.numero);
                    setSearch("");
                  }}
                  data-ocid={`select-compte-${c.numero}`}
                >
                  <span className="font-mono text-muted-foreground">
                    {c.numero}
                  </span>
                  <span className="truncate">{c.libelle}</span>
                </button>
              ))}
            </div>
          )}
          {selectedCompte && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                Compte sélectionné :
              </span>
              <span className="text-xs font-mono font-medium text-foreground">
                {selectedCompte.numero}
              </span>
              <span className="text-xs text-foreground">
                — {selectedCompte.libelle}
              </span>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-destructive ml-1"
                onClick={() => setSelectedNumero("")}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Exercice */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Exercice</p>
          <Select
            value={String(exercice)}
            onValueChange={(v) => setExercice(BigInt(v))}
          >
            <SelectTrigger
              className="w-40"
              data-ocid="grand-livre-exercice"
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
        </div>

        {/* Dropdown list when no selection */}
        {!selectedNumero && !search && (
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">
              Ou sélectionner
            </p>
            <Select
              value={selectedNumero}
              onValueChange={(v) => setSelectedNumero(v)}
              disabled={comptesLoading}
            >
              <SelectTrigger
                className="w-72"
                data-ocid="grand-livre-compte-select"
                aria-label="Choisir un compte"
              >
                <SelectValue placeholder="Choisir un compte…" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {allComptes
                  .sort((a, b) => a.numero.localeCompare(b.numero))
                  .map((c) => (
                    <SelectItem key={c.id} value={c.numero} className="text-sm">
                      {c.numero} – {c.libelle}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Table */}
      {!selectedNumero ? (
        <div
          className="rounded-xl border border-border bg-card shadow-card flex flex-col items-center justify-center py-20 text-muted-foreground"
          data-ocid="grand-livre-empty"
        >
          <BookMarked className="w-10 h-10 mb-4 opacity-25" />
          <p className="font-medium">Sélectionnez un compte</p>
          <p className="text-sm mt-1">
            Recherchez ou choisissez un compte pour afficher le grand livre
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Account header */}
          <div className="px-5 py-4 bg-primary/5 border-b border-border flex items-center justify-between">
            <div>
              <span className="font-mono font-bold text-primary text-lg">
                {selectedNumero}
              </span>
              {selectedCompte && (
                <span className="ml-3 text-foreground font-medium">
                  {selectedCompte.libelle}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              Exercice {String(exercice)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    N° écriture
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Libellé
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">
                    Débit
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">
                    Crédit
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">
                    Solde
                  </th>
                </tr>
              </thead>
              <tbody>
                {livreLoading ? (
                  ["g1", "g2", "g3"].map((k) => (
                    <tr key={k} className="border-b border-border/60">
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-12" />
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
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="grand-livre-no-entries"
                    >
                      <p className="font-medium">Aucun mouvement</p>
                      <p className="text-xs mt-1">
                        Ce compte n'a pas de mouvements pour cet exercice
                      </p>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr
                      key={`${row.entryId}-${idx}`}
                      className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground">
                        {formatDate(row.entryDate)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{String(row.entryNumero).padStart(4, "0")}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {row.entryLibelle}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {row.debit > 0n ? (
                          <span className="text-rose-600 dark:text-rose-400">
                            {formatAmount(row.debit)} DZD
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {row.credit > 0n ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {formatAmount(row.credit)} DZD
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                        <span
                          className={
                            row.solde >= 0n
                              ? "text-foreground"
                              : "text-destructive"
                          }
                        >
                          {row.solde < 0n ? "-" : ""}
                          {formatAmount(
                            row.solde < 0n ? -row.solde : row.solde,
                          )}{" "}
                          DZD
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/40 border-t-2 border-border font-semibold">
                    <td colSpan={3} className="px-4 py-3 text-foreground">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-rose-600 dark:text-rose-400">
                      {formatAmount(totalDebit)} DZD
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      {formatAmount(totalCredit)} DZD
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span
                        className={
                          soldeFinal >= 0n
                            ? "text-foreground"
                            : "text-destructive"
                        }
                      >
                        {soldeFinal < 0n ? "-" : ""}
                        {formatAmount(
                          soldeFinal < 0n ? -soldeFinal : soldeFinal,
                        )}{" "}
                        DZD
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
