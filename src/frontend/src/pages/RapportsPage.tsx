import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useBalance,
  useBilan,
  useCompanyInfo,
  useCompteResultats,
  useExercices,
} from "@/hooks/useBackend";
import { formatAmount, formatDZD } from "@/lib/format";
import type { AccountBalance } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Printer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Fragment, useState } from "react";

// ─── Shared sub-components ────────────────────────────────────────────────────

function ScfBadge() {
  return (
    <Badge
      variant="outline"
      className="text-xs border-accent text-accent font-mono tracking-wide"
    >
      Conforme SCF – Loi 07-11
    </Badge>
  );
}

function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="gap-2 print:hidden"
      data-ocid="btn-print"
    >
      <Printer className="w-4 h-4" />
      Imprimer
    </Button>
  );
}

function AmountRow({
  label,
  amount,
  bold,
  indent,
}: {
  label: string;
  amount: bigint;
  bold?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 border-b border-border/50 last:border-0 ${
        bold ? "font-semibold" : ""
      } ${indent ? "pl-4" : ""}`}
    >
      <span
        className={`text-sm ${bold ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span className={`text-sm font-mono ${bold ? "text-foreground" : ""}`}>
        {formatAmount(amount)}
      </span>
    </div>
  );
}

function SectionBlock({
  title,
  rows,
  totalLabel,
  total,
}: {
  title: string;
  rows: AccountBalance[];
  totalLabel: string;
  total: bigint;
}) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2 pb-1 border-b-2 border-primary/20">
        {title}
      </h4>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-2">
          Aucun mouvement
        </p>
      ) : (
        rows.map((ab) => (
          <AmountRow
            key={ab.compte.numero}
            label={`${ab.compte.numero} – ${ab.compte.libelle}`}
            amount={ab.solde}
            indent
          />
        ))
      )}
      <AmountRow label={totalLabel} amount={total} bold />
    </div>
  );
}

// ─── Tab: Bilan ───────────────────────────────────────────────────────────────

function BilanTab({ exercice }: { exercice: bigint }) {
  const { data: bilan, isLoading } = useBilan(exercice);
  const { data: companyInfo } = useCompanyInfo();

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {["sk1", "sk2", "sk3"].map((id) => (
          <Skeleton key={id} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!bilan) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Données du bilan non disponibles pour cet exercice.</p>
      </div>
    );
  }

  const actifNonCourant = bilan.actifDetails.filter((ab) =>
    ab.compte.numero.startsWith("2"),
  );
  const actifCourant = bilan.actifDetails.filter(
    (ab) =>
      ab.compte.numero.startsWith("3") ||
      ab.compte.numero.startsWith("4") ||
      ab.compte.numero.startsWith("5"),
  );
  const capitauxPropres = bilan.passifDetails.filter((ab) =>
    ab.compte.numero.startsWith("1"),
  );
  const passifNonCourant = bilan.passifDetails.filter(
    (ab) =>
      ab.compte.numero.startsWith("1") === false &&
      Number(ab.compte.numero[0]) >= 1 &&
      Number(ab.compte.numero[0]) <= 4 &&
      ab.compte.classe === 1n,
  );
  const passifCourant = bilan.passifDetails.filter((ab) =>
    ab.compte.numero.startsWith("4"),
  );

  const totalActifNonCourant = actifNonCourant.reduce(
    (s, ab) => s + ab.solde,
    0n,
  );
  const totalActifCourant = actifCourant.reduce((s, ab) => s + ab.solde, 0n);
  const totalCapitauxPropres = capitauxPropres.reduce(
    (s, ab) => s + ab.solde,
    0n,
  );
  const totalPassifNonCourant = passifNonCourant.reduce(
    (s, ab) => s + ab.solde,
    0n,
  );
  const totalPassifCourant = passifCourant.reduce((s, ab) => s + ab.solde, 0n);

  const nomEntreprise = companyInfo?.nom || "Votre entreprise";
  const annee = Number(exercice);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 print:block">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            {nomEntreprise}
          </h2>
          <p className="text-base font-semibold text-primary mt-0.5">
            BILAN AU 31/12/{annee}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <ScfBadge />
            {bilan.estEquilibre ? (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bilan équilibré ✓
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Déséquilibre détecté
              </span>
            )}
          </div>
        </div>
        <PrintButton />
      </div>

      {/* Two-column bilan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ACTIF */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">
              ACTIF
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SectionBlock
              title="Actif Non Courant"
              rows={actifNonCourant}
              totalLabel="Total Actif Non Courant"
              total={totalActifNonCourant}
            />
            <SectionBlock
              title="Actif Courant"
              rows={actifCourant}
              totalLabel="Total Actif Courant"
              total={totalActifCourant}
            />
            <div className="mt-3 pt-3 border-t-2 border-primary flex justify-between items-center">
              <span className="font-bold text-sm uppercase tracking-wide text-foreground">
                TOTAL ACTIF
              </span>
              <span className="font-bold text-base font-mono text-primary">
                {formatDZD(bilan.totalActif)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* PASSIF */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 bg-accent/10 rounded-t-lg">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-accent-foreground">
              PASSIF
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SectionBlock
              title="Capitaux Propres"
              rows={capitauxPropres}
              totalLabel="Total Capitaux Propres"
              total={totalCapitauxPropres}
            />
            <SectionBlock
              title="Passif Non Courant"
              rows={passifNonCourant}
              totalLabel="Total Passif Non Courant"
              total={totalPassifNonCourant}
            />
            <SectionBlock
              title="Passif Courant"
              rows={passifCourant}
              totalLabel="Total Passif Courant"
              total={totalPassifCourant}
            />
            <div className="mt-3 pt-3 border-t-2 border-accent flex justify-between items-center">
              <span className="font-bold text-sm uppercase tracking-wide text-foreground">
                TOTAL PASSIF
              </span>
              <span className="font-bold text-base font-mono text-accent-foreground">
                {formatDZD(bilan.totalPassif)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Compte de Résultats ─────────────────────────────────────────────────

function CompteResultatsTab({ exercice }: { exercice: bigint }) {
  const { data: cr, isLoading } = useCompteResultats(exercice);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {["sk1", "sk2", "sk3"].map((id) => (
          <Skeleton key={id} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!cr) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Données non disponibles pour cet exercice.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold text-primary">
            COMPTE DE RÉSULTATS — Exercice {Number(exercice)}
          </p>
          <div className="mt-2">
            <ScfBadge />
          </div>
        </div>
        <PrintButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHARGES */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 bg-destructive/5 rounded-t-lg">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-destructive">
              CHARGES (Classe 6)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {cr.chargesDetails.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">
                Aucune charge enregistrée
              </p>
            ) : (
              cr.chargesDetails.map((ab) => (
                <AmountRow
                  key={ab.compte.numero}
                  label={`${ab.compte.numero} – ${ab.compte.libelle}`}
                  amount={ab.solde}
                  indent
                />
              ))
            )}
            <div className="mt-3 pt-3 border-t-2 border-destructive flex justify-between items-center">
              <span className="font-bold text-sm uppercase text-foreground">
                TOTAL CHARGES
              </span>
              <span className="font-bold text-base font-mono text-destructive">
                {formatDZD(cr.totalCharges)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* PRODUITS */}
        <Card className="shadow-card">
          <CardHeader className="pb-2 bg-emerald-500/5 rounded-t-lg">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              PRODUITS (Classe 7)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {cr.produitsDetails.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">
                Aucun produit enregistré
              </p>
            ) : (
              cr.produitsDetails.map((ab) => (
                <AmountRow
                  key={ab.compte.numero}
                  label={`${ab.compte.numero} – ${ab.compte.libelle}`}
                  amount={ab.solde}
                  indent
                />
              ))
            )}
            <div className="mt-3 pt-3 border-t-2 border-emerald-500 flex justify-between items-center">
              <span className="font-bold text-sm uppercase text-foreground">
                TOTAL PRODUITS
              </span>
              <span className="font-bold text-base font-mono text-emerald-700 dark:text-emerald-400">
                {formatDZD(cr.totalProduits)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résultat net */}
      <Card
        className={`shadow-elevated border-2 ${
          cr.estBenefice
            ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10"
            : "border-destructive/30 bg-destructive/5"
        }`}
      >
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {cr.estBenefice ? (
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-8 h-8 text-destructive" />
              )}
              <span
                className={`font-bold text-lg tracking-wide ${
                  cr.estBenefice
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-destructive"
                }`}
              >
                {cr.estBenefice
                  ? "BÉNÉFICE NET DE L'EXERCICE"
                  : "PERTE NETTE DE L'EXERCICE"}
              </span>
            </div>
            <span
              className={`text-3xl font-bold font-display ${
                cr.estBenefice
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-destructive"
              }`}
            >
              {formatDZD(
                cr.resultatNet < 0n ? -cr.resultatNet : cr.resultatNet,
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Balance ─────────────────────────────────────────────────────────────

const CLASS_LABELS: Record<string, string> = {
  "1": "Classe 1 – Capitaux",
  "2": "Classe 2 – Immobilisations",
  "3": "Classe 3 – Stocks",
  "4": "Classe 4 – Tiers",
  "5": "Classe 5 – Trésorerie",
  "6": "Classe 6 – Charges",
  "7": "Classe 7 – Produits",
};

function BalanceTab({ exercice }: { exercice: bigint }) {
  const { data: balances, isLoading } = useBalance(exercice);

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {["r1", "r2", "r3", "r4", "r5"].map((id) => (
          <Skeleton key={id} className="h-10 rounded" />
        ))}
      </div>
    );
  }

  if (!balances || balances.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Aucune donnée de balance pour cet exercice.</p>
      </div>
    );
  }

  // Group by class
  const grouped: Record<string, AccountBalance[]> = {};
  for (const ab of balances) {
    const cls = ab.compte.numero[0] ?? "?";
    if (!grouped[cls]) grouped[cls] = [];
    grouped[cls].push(ab);
  }

  const totalDebit = balances.reduce((s, ab) => s + ab.totalDebit, 0n);
  const totalCredit = balances.reduce((s, ab) => s + ab.totalCredit, 0n);

  return (
    <Card className="shadow-card">
      <CardContent className="pt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-primary/30">
              <th className="text-left py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground w-24">
                N° Compte
              </th>
              <th className="text-left py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Libellé
              </th>
              <th className="text-right py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Total Débit
              </th>
              <th className="text-right py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Total Crédit
              </th>
              <th className="text-right py-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Solde
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(grouped)
              .sort()
              .map((cls) => (
                <Fragment key={`group-${cls}`}>
                  <tr className="bg-muted/40">
                    <td
                      colSpan={5}
                      className="py-1.5 px-2 text-xs font-bold uppercase tracking-wider text-primary/80"
                    >
                      {CLASS_LABELS[cls] ?? `Classe ${cls}`}
                    </td>
                  </tr>
                  {grouped[cls].map((ab) => (
                    <tr
                      key={ab.compte.numero}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {ab.compte.numero}
                      </td>
                      <td className="py-2 truncate max-w-xs">
                        {ab.compte.libelle}
                      </td>
                      <td className="py-2 text-right font-mono text-xs">
                        {formatAmount(ab.totalDebit)}
                      </td>
                      <td className="py-2 text-right font-mono text-xs">
                        {formatAmount(ab.totalCredit)}
                      </td>
                      <td
                        className={`py-2 text-right font-mono text-xs font-medium ${
                          ab.estDebiteur
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatAmount(ab.solde)}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-primary font-bold">
              <td colSpan={2} className="py-2 text-sm uppercase tracking-wide">
                TOTAUX GÉNÉRAUX
              </td>
              <td className="py-2 text-right font-mono">
                {formatAmount(totalDebit)}
              </td>
              <td className="py-2 text-right font-mono">
                {formatAmount(totalCredit)}
              </td>
              <td className="py-2 text-right font-mono">
                {formatAmount(
                  totalDebit > totalCredit
                    ? totalDebit - totalCredit
                    : totalCredit - totalDebit,
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RapportsPage() {
  const { data: exercices } = useExercices();
  const currentYear = BigInt(new Date().getFullYear());
  const [exercice, setExercice] = useState<bigint>(currentYear);

  const exerciceOptions =
    exercices && exercices.length > 0
      ? exercices.map((e) => String(e.annee))
      : [String(currentYear)];

  return (
    <div className="p-6 space-y-6" data-ocid="rapports-page">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Rapports Financiers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            États financiers conformes SCF – Loi 07-11
          </p>
        </div>

        {/* Exercice selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Exercice :
          </span>
          <Select
            value={String(exercice)}
            onValueChange={(v) => setExercice(BigInt(v))}
          >
            <SelectTrigger
              className="w-28"
              data-ocid="select-exercice-rapports"
              aria-label="Sélectionner l'exercice fiscal"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exerciceOptions.map((annee) => (
                <SelectItem key={annee} value={annee}>
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bilan" className="space-y-4">
        <TabsList
          className="bg-card border border-border"
          data-ocid="tabs-rapports"
        >
          <TabsTrigger value="bilan">Bilan</TabsTrigger>
          <TabsTrigger value="compte-resultats">
            Compte de résultats
          </TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="bilan">
          <BilanTab exercice={exercice} />
        </TabsContent>

        <TabsContent value="compte-resultats">
          <CompteResultatsTab exercice={exercice} />
        </TabsContent>

        <TabsContent value="balance">
          <BalanceTab exercice={exercice} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
