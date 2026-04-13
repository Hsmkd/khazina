import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateMouvementStock,
  useExercices,
  useMouvementsStock,
  useProduits,
  useValeurStock,
} from "@/hooks/useBackend";
import {
  currentExercice,
  dateToTimestamp,
  formatAmount,
  formatDZD,
  formatDate,
  parseDZD,
} from "@/lib/format";
import { MouvementType } from "@/types";
import type { MouvementStockInput } from "@/types";
import { useSearch } from "@tanstack/react-router";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Layers,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  if (type === MouvementType.Entree) {
    return (
      <Badge
        className="text-xs bg-emerald-500/15 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20"
        data-ocid="badge-entree"
      >
        <ArrowDownCircle className="w-3 h-3 mr-1" aria-hidden="true" />
        Entrée
      </Badge>
    );
  }
  if (type === MouvementType.Sortie) {
    return (
      <Badge variant="destructive" className="text-xs" data-ocid="badge-sortie">
        <ArrowUpCircle className="w-3 h-3 mr-1" aria-hidden="true" />
        Sortie
      </Badge>
    );
  }
  return (
    <Badge
      className="text-xs bg-sky-500/15 text-sky-700 border-sky-300 hover:bg-sky-500/20"
      data-ocid="badge-ajustement"
    >
      <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" />
      Ajustement
    </Badge>
  );
}

// ─── Nouveau Mouvement Dialog ─────────────────────────────────────────────────

interface NouveauMvtDialogProps {
  open: boolean;
  onClose: () => void;
  produits: { id: string; designation: string; code: string }[];
  preselectProduitId?: string;
  exercice: bigint;
}

function NouveauMvtDialog({
  open,
  onClose,
  produits,
  preselectProduitId,
  exercice,
}: NouveauMvtDialogProps) {
  const createMvt = useCreateMouvementStock();

  const todayStr = new Date().toISOString().split("T")[0];

  const [produitId, setProduitId] = useState(preselectProduitId ?? "");
  const [type, setType] = useState<MouvementType>(MouvementType.Entree);
  const [date, setDate] = useState(todayStr);
  const [quantite, setQuantite] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setProduitId(preselectProduitId ?? "");
    setType(MouvementType.Entree);
    setDate(todayStr);
    setQuantite("");
    setPrixUnitaire("");
    setReference("");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!produitId) {
      toast.error("Veuillez sélectionner un produit");
      return;
    }
    const qty = Number(quantite);
    if (!qty || qty <= 0) {
      toast.error("La quantité doit être supérieure à 0");
      return;
    }
    const input: MouvementStockInput = {
      produitId,
      type,
      exercice,
      date: dateToTimestamp(new Date(date)),
      quantite: qty,
      prixUnitaire: type === MouvementType.Entree ? parseDZD(prixUnitaire) : 0n,
      reference: reference.trim(),
      notes: notes.trim(),
    };
    try {
      const res = await createMvt.mutateAsync(input);
      if ("err" in res) {
        toast.error(res.err);
        return;
      }
      toast.success("Mouvement enregistré");
      reset();
      onClose();
    } catch {
      toast.error("Une erreur s'est produite");
    }
  }

  const typeOptions = [
    { value: MouvementType.Entree, label: "Entrée de stock" },
    { value: MouvementType.Sortie, label: "Sortie de stock" },
    { value: MouvementType.Ajustement, label: "Ajustement d'inventaire" },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau mouvement de stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="mvt-produit">Produit *</Label>
            <select
              id="mvt-produit"
              value={produitId}
              onChange={(e) => setProduitId(e.target.value)}
              required
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              data-ocid="select-mvt-produit"
            >
              <option value="">— Sélectionner un produit —</option>
              {produits.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.code}] {p.designation}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Type de mouvement *</Label>
            <div
              className="flex gap-2 flex-wrap"
              role="radiogroup"
              aria-label="Type de mouvement"
            >
              {typeOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm transition-smooth ${
                    type === opt.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/50"
                  }`}
                  data-ocid={`radio-type-${opt.value.toLowerCase()}`}
                >
                  <input
                    type="radio"
                    name="mvt-type"
                    value={opt.value}
                    checked={type === opt.value}
                    onChange={() => setType(opt.value as MouvementType)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="mvt-date">Date *</Label>
              <Input
                id="mvt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                data-ocid="input-mvt-date"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mvt-qte">Quantité *</Label>
              <Input
                id="mvt-qte"
                type="number"
                min="0.001"
                step="0.001"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                placeholder="0"
                required
                data-ocid="input-mvt-quantite"
              />
            </div>
          </div>

          {type === MouvementType.Entree && (
            <div className="space-y-1.5">
              <Label htmlFor="mvt-pu">Prix unitaire HT (DZD)</Label>
              <Input
                id="mvt-pu"
                type="number"
                min="0"
                step="0.01"
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(e.target.value)}
                placeholder="0"
                data-ocid="input-mvt-prix-unitaire"
              />
              <p className="text-xs text-muted-foreground">
                Pour les sorties, le CMUP est utilisé automatiquement.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="mvt-ref">Référence</Label>
            <Input
              id="mvt-ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="N° facture, bon de livraison…"
              data-ocid="input-mvt-reference"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mvt-notes">Notes</Label>
            <Textarea
              id="mvt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations…"
              rows={2}
              data-ocid="input-mvt-notes"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              data-ocid="btn-cancel-mvt"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createMvt.isPending}
              data-ocid="btn-save-mvt"
            >
              {createMvt.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TYPE_FILTER_OPTIONS = [
  { value: "", label: "Tous les types" },
  { value: MouvementType.Entree, label: "Entrée" },
  { value: MouvementType.Sortie, label: "Sortie" },
  { value: MouvementType.Ajustement, label: "Ajustement" },
];

export default function MouvementsStockPage() {
  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const preselectProduitId = searchParams?.produit ?? "";

  const { data: produits = [] } = useProduits();
  const { data: exercices = [] } = useExercices();
  const { data: valeurs = [] } = useValeurStock();

  const [selectedProduit, setSelectedProduit] = useState(preselectProduitId);
  const [selectedExercice, setSelectedExercice] = useState(currentExercice());
  const [typeFilter, setTypeFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page] = useState(0n);

  const { data: result, isLoading } = useMouvementsStock(
    selectedProduit || null,
    selectedExercice,
    page,
  );

  const mouvements = result?.mouvements ?? [];

  const filteredMvts = useMemo(() => {
    if (!typeFilter) return mouvements;
    return mouvements.filter((m) => {
      const key = Object.keys(m.type)[0];
      return key === typeFilter;
    });
  }, [mouvements, typeFilter]);

  const totalValeurStock = useMemo(
    () => valeurs.reduce((acc, v) => acc + v.valeurTotale, 0n),
    [valeurs],
  );

  function getMvtTypeKey(type: MouvementType): string {
    return type as string;
  }

  function getProduitLabel(id: string): string {
    const p = produits.find((x) => x.id === id);
    return p ? `[${p.code}] ${p.designation}` : id;
  }

  const skeletonMvtRows = ["m1", "m2", "m3", "m4", "m5"];
  const skeletonMvtCols = [
    "mc1",
    "mc2",
    "mc3",
    "mc4",
    "mc5",
    "mc6",
    "mc7",
    "mc8",
  ];
  const skeletonValRows = ["v1", "v2", "v3"];
  const skeletonValCols = ["vc1", "vc2", "vc3", "vc4"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Mouvements de Stock
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Méthode de valorisation : CMUP
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-ocid="btn-nouveau-mvt">
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Nouveau mouvement
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-52 space-y-1.5">
              <Label htmlFor="filter-produit">Produit</Label>
              <select
                id="filter-produit"
                value={selectedProduit}
                onChange={(e) => setSelectedProduit(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-ocid="filter-select-produit"
              >
                <option value="">Tous les produits</option>
                {produits.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-36 space-y-1.5">
              <Label htmlFor="filter-exercice">Exercice</Label>
              <select
                id="filter-exercice"
                value={selectedExercice.toString()}
                onChange={(e) => setSelectedExercice(BigInt(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-ocid="filter-select-exercice"
              >
                {exercices.length === 0 && (
                  <option value={currentExercice().toString()}>
                    {currentExercice().toString()}
                  </option>
                )}
                {exercices.map((ex) => (
                  <option key={ex.annee.toString()} value={ex.annee.toString()}>
                    {ex.annee.toString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-48 space-y-1.5">
              <Label htmlFor="filter-type">Type</Label>
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-ocid="filter-select-type"
              >
                {TYPE_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mouvements table */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" aria-hidden="true" />
            Historique des mouvements
            <Badge variant="secondary" className="ml-auto">
              {filteredMvts.length} mouvement
              {filteredMvts.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Produit</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="text-right font-semibold">
                  Quantité
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Prix Unitaire
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Montant
                </TableHead>
                <TableHead className="font-semibold">Référence</TableHead>
                <TableHead className="font-semibold">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                skeletonMvtRows.map((id) => (
                  <TableRow key={id}>
                    {skeletonMvtCols.map((c) => (
                      <TableCell key={c}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && filteredMvts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div
                      className="flex flex-col items-center gap-3"
                      data-ocid="empty-state-mouvements"
                    >
                      <Layers
                        className="w-10 h-10 opacity-25"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-foreground">
                        Aucun mouvement trouvé
                      </p>
                      <p className="text-sm">
                        Enregistrez le premier mouvement de stock.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        data-ocid="btn-empty-nouveau-mvt"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                        Nouveau mouvement
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                filteredMvts.map((m) => {
                  const typeKey = getMvtTypeKey(m.type);
                  const montant = BigInt(
                    Math.round(m.quantite * Number(m.prixUnitaire)),
                  );
                  return (
                    <TableRow
                      key={m.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`row-mvt-${m.id}`}
                    >
                      <TableCell className="text-sm font-mono">
                        {formatDate(m.date)}
                      </TableCell>
                      <TableCell className="text-sm min-w-0">
                        <span className="truncate block max-w-44">
                          {getProduitLabel(m.produitId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={typeKey} />
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {m.quantite.toLocaleString("fr-DZ")}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {m.prixUnitaire > 0n ? (
                          formatAmount(m.prixUnitaire)
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            CMUP
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatAmount(montant)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {m.reference || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-40">
                        <span className="truncate block">{m.notes || "—"}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Valorisation du stock */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            Valorisation du stock (CMUP)
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold">Produit</TableHead>
                <TableHead className="text-right font-semibold">
                  Stock Actuel
                </TableHead>
                <TableHead className="text-right font-semibold">
                  CMUP (DZD)
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Valeur Totale (DZD)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {valeurs.length === 0 &&
                skeletonValRows.map((id) => (
                  <TableRow key={id}>
                    {skeletonValCols.map((c) => (
                      <TableCell key={c}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {valeurs.map((v) => (
                <TableRow
                  key={v.produitId}
                  className="hover:bg-muted/30 transition-colors"
                  data-ocid={`row-valeur-${v.produitId}`}
                >
                  <TableCell className="font-medium">{v.designation}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {v.quantite.toLocaleString("fr-DZ")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatAmount(v.prixMoyenPondere)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-primary">
                    {formatAmount(v.valeurTotale)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Grand Total */}
        <div className="border-t bg-muted/30 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Valeur totale du stock
          </span>
          <span
            className="text-lg font-display font-bold text-primary"
            data-ocid="grand-total-valeur"
          >
            {formatDZD(totalValeurStock)}
          </span>
        </div>
      </Card>

      <NouveauMvtDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        produits={produits}
        preselectProduitId={preselectProduitId}
        exercice={selectedExercice}
      />
    </div>
  );
}
