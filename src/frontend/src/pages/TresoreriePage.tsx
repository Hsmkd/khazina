import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useComptesTresorerie,
  useCreateCompteTresorerie,
  useCreateMouvementTresorerie,
  useExercices,
  useMouvementsTresorerie,
  useSoldeTresorerie,
} from "@/hooks/useBackend";
import {
  currentExercice,
  dateToTimestamp,
  formatDZD,
  formatDate,
  parseDZD,
} from "@/lib/format";
import type { CompteTresorerie, MouvementTresorerie } from "@/types";
import { MvtType, TresoType } from "@/types";
import {
  Building2,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSoldeClass(solde: bigint) {
  if (solde < 0n) return "text-red-600 dark:text-red-400";
  if (solde > 0n) return "text-green-700 dark:text-green-400";
  return "text-muted-foreground";
}

function todayInputDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── Compte Card ─────────────────────────────────────────────────────────────

interface CompteCardProps {
  compte: CompteTresorerie;
  selected: boolean;
  onClick: () => void;
}

function CompteCard({ compte, selected, onClick }: CompteCardProps) {
  const isBanque = compte.type === TresoType.Banque;
  return (
    <button
      type="button"
      data-ocid="compte-card"
      onClick={onClick}
      className={`text-left rounded-xl border transition-smooth shadow-card hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full ${
        selected
          ? "border-primary bg-primary/5 shadow-elevated"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isBanque
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent-foreground"
            }`}
          >
            {isBanque ? (
              <Building2 className="w-5 h-5" />
            ) : (
              <Wallet className="w-5 h-5" />
            )}
          </div>
          <Badge variant="secondary" className="text-xs font-mono shrink-0">
            {compte.compteComptable}
          </Badge>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm leading-tight truncate">
            {compte.libelle}
          </p>
          {compte.banque && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {compte.banque}
            </p>
          )}
          {compte.numeroCompte && (
            <p className="text-xs text-muted-foreground font-mono truncate">
              {compte.numeroCompte}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-base font-bold tabular-nums ${getSoldeClass(compte.solde)}`}
          >
            {formatDZD(compte.solde)}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Add Compte Dialog ───────────────────────────────────────────────────────

interface AddCompteDialogProps {
  open: boolean;
  onClose: () => void;
}

function AddCompteDialog({ open, onClose }: AddCompteDialogProps) {
  const createCompte = useCreateCompteTresorerie();
  const [type, setType] = useState<TresoType>(TresoType.Caisse);
  const [libelle, setLibelle] = useState("");
  const [compteComptable, setCompteComptable] = useState("531");
  const [numeroCompte, setNumeroCompte] = useState("");
  const [banque, setBanque] = useState("");
  const [soldeInitial, setSoldeInitial] = useState("0");

  function handleTypeChange(t: TresoType) {
    setType(t);
    setCompteComptable(t === TresoType.Banque ? "512" : "531");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!libelle.trim()) {
      toast.error("Le libellé est obligatoire");
      return;
    }
    try {
      await createCompte.mutateAsync({
        libelle: libelle.trim(),
        compteComptable,
        soldeinitial: parseDZD(soldeInitial),
        type,
        banque: banque.trim() || undefined,
        numeroCompte: numeroCompte.trim() || undefined,
      });
      toast.success("Compte créé avec succès");
      setLibelle("");
      setNumeroCompte("");
      setBanque("");
      setSoldeInitial("0");
      setType(TresoType.Caisse);
      setCompteComptable("531");
      onClose();
    } catch {
      toast.error("Erreur lors de la création du compte");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un compte de trésorerie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Type */}
          <div className="space-y-2">
            <Label>Type de compte</Label>
            <div className="flex gap-3">
              {[
                { value: TresoType.Caisse, label: "💰 Caisse" },
                { value: TresoType.Banque, label: "🏦 Banque" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleTypeChange(value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-smooth ${
                    type === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Libellé */}
          <div className="space-y-1.5">
            <Label htmlFor="add-libelle">Libellé *</Label>
            <Input
              id="add-libelle"
              data-ocid="input-libelle"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder={
                type === TresoType.Banque
                  ? "Ex: Compte CPA principal"
                  : "Ex: Caisse principale"
              }
              required
            />
          </div>

          {/* Compte comptable */}
          <div className="space-y-1.5">
            <Label htmlFor="add-compte-comptable">Compte SCF</Label>
            <Input
              id="add-compte-comptable"
              data-ocid="input-compte-comptable"
              value={compteComptable}
              onChange={(e) => setCompteComptable(e.target.value)}
              placeholder={type === TresoType.Banque ? "512" : "531"}
            />
            <p className="text-xs text-muted-foreground">
              {type === TresoType.Banque
                ? "Classe 51x pour les banques"
                : "531 pour la caisse"}
            </p>
          </div>

          {/* Banque fields */}
          {type === TresoType.Banque && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="add-banque">Nom de la banque</Label>
                <Input
                  id="add-banque"
                  data-ocid="input-banque"
                  value={banque}
                  onChange={(e) => setBanque(e.target.value)}
                  placeholder="Ex: CPA, BNA, BADR…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-numero">Numéro de compte</Label>
                <Input
                  id="add-numero"
                  data-ocid="input-numero-compte"
                  value={numeroCompte}
                  onChange={(e) => setNumeroCompte(e.target.value)}
                  placeholder="Ex: 00200 15243 00045"
                  className="font-mono"
                />
              </div>
            </>
          )}

          {/* Solde initial */}
          <div className="space-y-1.5">
            <Label htmlFor="add-solde">Solde initial (DZD)</Label>
            <Input
              id="add-solde"
              data-ocid="input-solde-initial"
              value={soldeInitial}
              onChange={(e) => setSoldeInitial(e.target.value)}
              placeholder="0"
              className="font-mono"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              data-ocid="btn-submit-compte"
              className="flex-1"
              disabled={createCompte.isPending}
            >
              {createCompte.isPending ? "Création…" : "Créer le compte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Nouveau Mouvement Dialog ────────────────────────────────────────────────

interface NouveauMvtDialogProps {
  open: boolean;
  onClose: () => void;
  comptes: CompteTresorerie[];
  selectedCompteId: string | null;
  exercice: bigint;
}

function NouveauMvtDialog({
  open,
  onClose,
  comptes,
  selectedCompteId,
  exercice,
}: NouveauMvtDialogProps) {
  const createMvt = useCreateMouvementTresorerie();
  const [compteId, setCompteId] = useState(
    selectedCompteId ?? comptes[0]?.id ?? "",
  );
  const [type, setType] = useState<MvtType>(MvtType.Encaissement);
  const [date, setDate] = useState(todayInputDate());
  const [montant, setMontant] = useState("");
  const [libelle, setLibelle] = useState("");
  const [reference, setReference] = useState("");

  // Keep compteId in sync when selectedCompteId changes
  const effectiveCompteId =
    compteId || selectedCompteId || comptes[0]?.id || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!effectiveCompteId) {
      toast.error("Sélectionnez un compte");
      return;
    }
    if (!montant || parseDZD(montant) === 0n) {
      toast.error("Le montant doit être supérieur à zéro");
      return;
    }
    try {
      await createMvt.mutateAsync({
        compteId: effectiveCompteId,
        type,
        date: dateToTimestamp(new Date(date)),
        montant: parseDZD(montant),
        libelle: libelle.trim(),
        reference: reference.trim(),
        exercice,
      });
      toast.success("Mouvement enregistré");
      setMontant("");
      setLibelle("");
      setReference("");
      setDate(todayInputDate());
      onClose();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau mouvement de trésorerie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Compte */}
          <div className="space-y-1.5">
            <Label htmlFor="mvt-compte">Compte</Label>
            <select
              id="mvt-compte"
              data-ocid="select-compte"
              value={effectiveCompteId}
              onChange={(e) => setCompteId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {comptes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type === TresoType.Banque ? "🏦" : "💰"} {c.libelle}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type d'opération</Label>
            <div className="flex gap-3">
              {[
                {
                  value: MvtType.Encaissement,
                  label: "↑ Encaissement",
                  color: "text-green-700",
                },
                {
                  value: MvtType.Decaissement,
                  label: "↓ Décaissement",
                  color: "text-red-600",
                },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  data-ocid={`btn-type-${value.toLowerCase()}`}
                  onClick={() => setType(value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-smooth ${
                    type === value
                      ? `border-primary bg-primary/5 ${color}`
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="mvt-date">Date</Label>
            <Input
              id="mvt-date"
              data-ocid="input-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Montant */}
          <div className="space-y-1.5">
            <Label htmlFor="mvt-montant">Montant (DZD)</Label>
            <Input
              id="mvt-montant"
              data-ocid="input-montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="Ex: 150000"
              className="font-mono"
              required
            />
          </div>

          {/* Libellé */}
          <div className="space-y-1.5">
            <Label htmlFor="mvt-libelle">Libellé</Label>
            <Input
              id="mvt-libelle"
              data-ocid="input-libelle-mvt"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder="Description de l'opération"
            />
          </div>

          {/* Référence */}
          <div className="space-y-1.5">
            <Label htmlFor="mvt-ref">Référence</Label>
            <Input
              id="mvt-ref"
              data-ocid="input-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="N° facture, chèque, virement…"
              className="font-mono"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              data-ocid="btn-submit-mvt"
              className="flex-1"
              disabled={createMvt.isPending}
            >
              {createMvt.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Transactions Table ───────────────────────────────────────────────────────

interface TransactionsTableProps {
  mouvements: MouvementTresorerie[];
  isLoading: boolean;
  soldeInitial: bigint;
}

function TransactionsTable({
  mouvements,
  isLoading,
  soldeInitial,
}: TransactionsTableProps) {
  // Sort ascending by date for running balance
  const sorted = useMemo(
    () => [...mouvements].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [mouvements],
  );

  const rows = useMemo(() => {
    let balance = soldeInitial;
    return sorted.map((mvt) => {
      if (mvt.type === MvtType.Encaissement) {
        balance += mvt.montant;
      } else {
        balance -= mvt.montant;
      }
      return { mvt, balance };
    });
  }, [sorted, soldeInitial]);

  // Show newest first in table
  const displayRows = [...rows].reverse();

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {["l1", "l2", "l3", "l4"].map((id) => (
          <Skeleton key={id} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (displayRows.length === 0) {
    return (
      <div
        data-ocid="empty-transactions"
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">
          Aucun mouvement enregistré
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Cliquez sur « Nouveau mouvement » pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="transactions-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead>Référence</TableHead>
            <TableHead className="text-right text-green-700 dark:text-green-400">
              Encaissement
            </TableHead>
            <TableHead className="text-right text-red-600 dark:text-red-400">
              Décaissement
            </TableHead>
            <TableHead className="text-right">Solde cumulé</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayRows.map(({ mvt, balance }) => (
            <TableRow key={mvt.id} data-ocid="transaction-row">
              <TableCell className="text-sm font-mono whitespace-nowrap">
                {formatDate(mvt.date)}
              </TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">
                {mvt.libelle || "—"}
              </TableCell>
              <TableCell className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                {mvt.reference || "—"}
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-green-700 dark:text-green-400">
                {mvt.type === MvtType.Encaissement
                  ? formatDZD(mvt.montant)
                  : ""}
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-red-600 dark:text-red-400">
                {mvt.type === MvtType.Decaissement
                  ? formatDZD(mvt.montant)
                  : ""}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm font-semibold ${getSoldeClass(balance)}`}
              >
                {formatDZD(balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TresoreriePage() {
  const exercice = currentExercice();
  const { data: comptes = [], isLoading: loadingComptes } =
    useComptesTresorerie();
  const { data: soldeGlobal = 0n } = useSoldeTresorerie();
  const { data: exercices = [] } = useExercices();

  const [selectedCompteId, setSelectedCompteId] = useState<string | null>(null);
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showNouveauMvt, setShowNouveauMvt] = useState(false);

  const selectedCompte = comptes.find((c) => c.id === selectedCompteId) ?? null;

  const { data: mvtData, isLoading: loadingMvt } = useMouvementsTresorerie(
    selectedCompteId,
    exercice,
    0n,
  );
  const mouvements: MouvementTresorerie[] = mvtData?.mouvements ?? [];

  // Summary stats for the selected compte in this exercice
  const stats = useMemo(() => {
    let encaissements = 0n;
    let decaissements = 0n;
    for (const mvt of mouvements) {
      if (mvt.type === MvtType.Encaissement) encaissements += mvt.montant;
      else decaissements += mvt.montant;
    }
    return {
      encaissements,
      decaissements,
      fluxNet: encaissements - decaissements,
    };
  }, [mouvements]);

  // Current exercice year label
  const exerciceLabel =
    exercices.length > 0
      ? (exercices.find((e) => e.annee === exercice)?.annee.toString() ??
        exercice.toString())
      : exercice.toString();

  return (
    <div
      className="flex flex-col gap-6 p-6 max-w-7xl mx-auto"
      data-ocid="tresorerie-page"
    >
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Trésorerie
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Exercice {exerciceLabel} — Caisse & Banque
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Solde global
          </p>
          <p
            data-ocid="solde-global"
            className={`text-2xl font-bold font-mono tabular-nums ${getSoldeClass(soldeGlobal)}`}
          >
            {formatDZD(soldeGlobal)}
          </p>
        </div>
      </div>

      {/* ── Comptes Cards Row ── */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Comptes de trésorerie
        </h2>
        {loadingComptes ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {["c1", "c2", "c3"].map((id) => (
              <Skeleton key={id} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            data-ocid="comptes-grid"
          >
            {comptes.map((compte) => (
              <CompteCard
                key={compte.id}
                compte={compte}
                selected={selectedCompteId === compte.id}
                onClick={() =>
                  setSelectedCompteId(
                    selectedCompteId === compte.id ? null : compte.id,
                  )
                }
              />
            ))}
            {/* Add compte button */}
            <button
              type="button"
              data-ocid="btn-add-compte"
              onClick={() => setShowAddCompte(true)}
              className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-smooth p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary min-h-[160px]"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Ajouter un compte</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Selected compte: Transactions + Stats ── */}
      {selectedCompte && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4" data-ocid="stats-row">
            {[
              {
                label: "Encaissements",
                value: stats.encaissements,
                icon: TrendingUp,
                color: "text-green-700 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-950/20",
              },
              {
                label: "Décaissements",
                value: stats.decaissements,
                icon: TrendingDown,
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-950/20",
              },
              {
                label: "Flux net",
                value: stats.fluxNet,
                icon: stats.fluxNet >= 0n ? TrendingUp : TrendingDown,
                color: getSoldeClass(stats.fluxNet),
                bg: "bg-muted/40",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className={`border-0 ${bg}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-card shadow-sm">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p
                      className={`text-base font-bold font-mono tabular-nums ${color}`}
                    >
                      {formatDZD(value < 0n ? -value : value)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transactions section */}
          <Card className="border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {selectedCompte.type === TresoType.Banque ? (
                    <Building2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Wallet className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {selectedCompte.libelle}
                  </p>
                  {selectedCompte.banque && (
                    <p className="text-xs text-muted-foreground">
                      {selectedCompte.banque}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="font-mono text-xs ml-1">
                  {selectedCompte.compteComptable}
                </Badge>
              </div>
              <Button
                size="sm"
                data-ocid="btn-nouveau-mvt"
                onClick={() => setShowNouveauMvt(true)}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouveau mouvement
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionsTable
                mouvements={mouvements}
                isLoading={loadingMvt}
                soldeInitial={selectedCompte.solde - stats.fluxNet}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state when no compte selected */}
      {!selectedCompte && !loadingComptes && comptes.length > 0 && (
        <div
          data-ocid="select-compte-hint"
          className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-dashed border-border"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">Sélectionnez un compte</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cliquez sur un compte ci-dessus pour voir ses mouvements
          </p>
        </div>
      )}

      {/* Dialogs */}
      <AddCompteDialog
        open={showAddCompte}
        onClose={() => setShowAddCompte(false)}
      />
      {showNouveauMvt && (
        <NouveauMvtDialog
          open={showNouveauMvt}
          onClose={() => setShowNouveauMvt(false)}
          comptes={comptes}
          selectedCompteId={selectedCompteId}
          exercice={exercice}
        />
      )}
    </div>
  );
}
