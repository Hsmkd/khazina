import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDashboardStats,
  useExercices,
  useJournalEntries,
  useProduitsEnAlerte,
  useValeurStock,
} from "@/hooks/useBackend";
import { currentExercice, formatDZD, formatDate } from "@/lib/format";
import type { FiscalYear, JournalEntry, Produit, ValeurStock } from "@/types";
import {
  AlertTriangle,
  BookOpen,
  CreditCard,
  FileText,
  Package,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

// ── Exercice selector ────────────────────────────────────────────────────────

function ExerciceSelector({
  exercices,
  selected,
  onChange,
}: {
  exercices: FiscalYear[];
  selected: bigint;
  onChange: (v: bigint) => void;
}) {
  if (exercices.length <= 1) {
    return (
      <span className="text-sm font-medium text-muted-foreground">
        Exercice {selected.toString()}
      </span>
    );
  }
  return (
    <select
      value={selected.toString()}
      onChange={(e) => onChange(BigInt(e.target.value))}
      className="text-sm border border-input rounded-md px-3 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      data-ocid="exercice-selector"
    >
      {exercices.map((ex) => (
        <option key={ex.annee.toString()} value={ex.annee.toString()}>
          Exercice {ex.annee.toString()}
          {ex.cloture ? " (clôturé)" : ""}
        </option>
      ))}
    </select>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
  subtitle?: string;
  loading?: boolean;
}

function KpiCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  loading,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  const trendColor =
    trend === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : trend === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <Card
      className="shadow-card transition-smooth hover:shadow-elevated"
      data-ocid="kpi-card"
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground leading-tight">
            {title}
          </p>
          <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0 ml-2">
            {icon}
          </div>
        </div>
        <p
          className={`text-xl font-bold font-display tracking-tight ${trendColor} break-all`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Journal Entry Row ─────────────────────────────────────────────────────────

function JournalRow({ entry }: { entry: JournalEntry }) {
  const totalDebit = entry.ecritures.reduce((acc, e) => acc + e.debit, 0n);
  return (
    <tr
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
      data-ocid="journal-row"
    >
      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
        {formatDate(entry.date)}
      </td>
      <td className="py-3 px-4 text-sm text-foreground max-w-[200px] truncate">
        <span title={entry.libelle}>{entry.libelle}</span>
      </td>
      <td className="py-3 px-4 text-sm font-mono text-right whitespace-nowrap text-foreground">
        {formatDZD(totalDebit)}
      </td>
      <td className="py-3 px-4 text-right">
        {entry.valide ? (
          <Badge
            variant="default"
            className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
          >
            Validé
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Brouillon
          </Badge>
        )}
      </td>
    </tr>
  );
}

// ── Stock Alert Row ───────────────────────────────────────────────────────────

function StockAlertRow({ produit }: { produit: Produit }) {
  const isRupture = produit.stockActuel === 0;
  return (
    <div
      className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
      data-ocid="stock-alert-row"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {produit.designation}
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          {produit.code}
        </p>
      </div>
      <div className="ml-3 text-right shrink-0">
        <p
          className={`text-sm font-bold tabular-nums ${isRupture ? "text-destructive" : "text-amber-600 dark:text-amber-400"}`}
        >
          {produit.stockActuel} {produit.unite}
        </p>
        <p className="text-xs text-muted-foreground">
          min: {produit.stockMinimum} {produit.unite}
        </p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [exercice, setExercice] = useState<bigint>(currentExercice());

  const { data: exercices = [], isLoading: loadingEx } = useExercices();
  const { data: stats, isLoading: loadingStats } = useDashboardStats(exercice);
  const { data: journalData, isLoading: loadingJournal } = useJournalEntries(
    exercice,
    0n,
  );
  const { data: alertes = [], isLoading: loadingAlertes } =
    useProduitsEnAlerte();
  const { data: valeurStock = [], isLoading: loadingStock } = useValeurStock();

  // Use exercice from state; sync to latest available if exercices loaded
  const latestAnnee =
    !loadingEx && exercices.length > 0
      ? exercices.reduce((max, ex) => (ex.annee > max ? ex.annee : max), 0n)
      : null;
  const effectiveExercice = latestAnnee ?? exercice;

  const recentEntries: JournalEntry[] = (journalData?.entries ?? []).slice(
    0,
    5,
  );

  const totalValeurStock: bigint = (valeurStock as ValeurStock[]).reduce(
    (acc, v) => acc + v.valeurTotale,
    0n,
  );

  const resultatPositif = stats ? stats.resultatNet >= 0n : true;

  const kpis: KpiCardProps[] = [
    {
      title: "Chiffre d'affaires",
      value: loadingStats ? "—" : formatDZD(stats?.chiffreAffaires ?? 0n),
      icon: <TrendingUp size={18} aria-label="CA" />,
      trend: "positive",
      subtitle: `Exercice ${effectiveExercice.toString()}`,
      loading: loadingStats,
    },
    {
      title: "Résultat net",
      value: loadingStats ? "—" : formatDZD(stats?.resultatNet ?? 0n),
      icon: resultatPositif ? (
        <TrendingUp size={18} aria-label="Résultat" />
      ) : (
        <TrendingDown size={18} aria-label="Résultat" />
      ),
      trend: loadingStats
        ? "neutral"
        : resultatPositif
          ? "positive"
          : "negative",
      subtitle: resultatPositif ? "Bénéfice" : "Perte",
      loading: loadingStats,
    },
    {
      title: "Trésorerie",
      value: loadingStats ? "—" : formatDZD(stats?.soldeTresorerie ?? 0n),
      icon: <Wallet size={18} aria-label="Trésorerie" />,
      trend: "neutral",
      loading: loadingStats,
    },
    {
      title: "Factures en attente",
      value: loadingStats
        ? "—"
        : Number(stats?.nombreFacturesEnAttente ?? 0n).toString(),
      icon: <FileText size={18} aria-label="Factures en attente" />,
      trend: "neutral",
      subtitle: "En brouillon",
      loading: loadingStats,
    },
    {
      title: "Créances clients",
      value: loadingStats ? "—" : formatDZD(stats?.totalCreances ?? 0n),
      icon: <CreditCard size={18} aria-label="Créances" />,
      trend: "neutral",
      subtitle: "Non encaissées",
      loading: loadingStats,
    },
    {
      title: "Dettes fournisseurs",
      value: loadingStats ? "—" : formatDZD(stats?.totalDettes ?? 0n),
      icon: <CreditCard size={18} aria-label="Dettes" />,
      trend: stats && stats.totalDettes > 0n ? "negative" : "neutral",
      subtitle: "Non réglées",
      loading: loadingStats,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vue d'ensemble de votre activité comptable
          </p>
        </div>
        <ExerciceSelector
          exercices={exercices}
          selected={effectiveExercice}
          onChange={setExercice}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            subtitle={kpi.subtitle}
            loading={kpi.loading}
          />
        ))}
      </div>

      {/* Stock alert banner */}
      {!loadingStats && stats && stats.alertesStock > 0n && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
          data-ocid="stock-alert-banner"
        >
          <AlertTriangle size={16} aria-label="Alerte stock" />
          <span className="text-sm font-medium">
            {Number(stats.alertesStock)} produit
            {Number(stats.alertesStock) > 1 ? "s" : ""} en alerte de stock
          </span>
        </div>
      )}

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent journal entries — 2/3 */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen
                size={16}
                className="text-accent"
                aria-label="Journal"
              />
              Dernières écritures comptables
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingJournal ? (
              <div className="p-4 space-y-3">
                {["j1", "j2", "j3", "j4", "j5"].map((id) => (
                  <Skeleton key={id} className="h-10 w-full rounded" />
                ))}
              </div>
            ) : recentEntries.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 px-4 text-center"
                data-ocid="journal-empty"
              >
                <BookOpen
                  size={32}
                  className="text-muted-foreground/40 mb-3"
                  aria-label="Aucune écriture"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucune écriture pour cet exercice
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Les écritures comptables apparaîtront ici une fois saisies.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Date
                      </th>
                      <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Libellé
                      </th>
                      <th className="py-2.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Montant
                      </th>
                      <th className="py-2.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.map((entry) => (
                      <JournalRow key={entry.id} entry={entry} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock alerts — 1/3 */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package size={16} className="text-accent" aria-label="Stock" />
              Alertes de stock
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {loadingAlertes ? (
              <div className="space-y-3">
                {["a1", "a2", "a3"].map((id) => (
                  <Skeleton key={id} className="h-12 w-full rounded" />
                ))}
              </div>
            ) : alertes.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-8 text-center"
                data-ocid="stock-alerts-empty"
              >
                <Package
                  size={28}
                  className="text-muted-foreground/40 mb-2"
                  aria-label="Aucune alerte"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucune alerte de stock
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Tous les niveaux sont suffisants.
                </p>
              </div>
            ) : (
              <div data-ocid="stock-alerts-list">
                {(alertes as Produit[]).map((p) => (
                  <StockAlertRow key={p.id} produit={p} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom: Valeur totale du stock */}
      <Card className="shadow-card bg-muted/30">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/15 text-accent">
                <Package size={20} aria-label="Valeur stock" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Valeur totale du stock
                </p>
                <p className="text-xs text-muted-foreground">
                  Valorisation au prix moyen pondéré (CMUP)
                </p>
              </div>
            </div>
            {loadingStock ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <p
                className="text-2xl font-bold font-display text-foreground tracking-tight"
                data-ocid="total-stock-value"
              >
                {formatDZD(totalValeurStock)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
