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
import {
  useCreateProduit,
  useProduits,
  useProduitsEnAlerte,
  useUpdateProduit,
  useValeurStock,
} from "@/hooks/useBackend";
import {
  currentExercice,
  formatAmount,
  formatDZD,
  parseDZD,
} from "@/lib/format";
import type { Produit, ProduitInput } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Edit2,
  Package,
  PackageX,
  Plus,
  Search,
  TrendingDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNITES = ["pièce", "kg", "litre", "mètre", "boîte", "carton", "autre"];

const defaultForm = {
  code: "",
  designation: "",
  unite: "pièce",
  uniteCustom: "",
  prixAchat: "",
  prixVente: "",
  stockInitial: "",
  stockMinimum: "0",
  compteStock: "30",
};

type ProduitFormData = typeof defaultForm;

// ─── Stock Status Badge ───────────────────────────────────────────────────────

function StockBadge({ produit }: { produit: Produit }) {
  if (produit.stockActuel === 0) {
    return (
      <Badge
        variant="destructive"
        className="text-xs"
        data-ocid="stock-badge-rupture"
      >
        <PackageX className="w-3 h-3 mr-1" aria-hidden="true" />
        En rupture
      </Badge>
    );
  }
  if (produit.stockActuel <= produit.stockMinimum) {
    return (
      <Badge
        className="text-xs bg-amber-500/15 text-amber-700 border-amber-300 hover:bg-amber-500/20"
        data-ocid="stock-badge-alerte"
      >
        <AlertTriangle className="w-3 h-3 mr-1" aria-hidden="true" />
        En alerte
      </Badge>
    );
  }
  return (
    <Badge
      className="text-xs bg-emerald-500/15 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20"
      data-ocid="stock-badge-normal"
    >
      Normal
    </Badge>
  );
}

// ─── Produit Form Dialog ──────────────────────────────────────────────────────

interface ProduitDialogProps {
  open: boolean;
  onClose: () => void;
  editProduit?: Produit;
}

function ProduitDialog({ open, onClose, editProduit }: ProduitDialogProps) {
  const createProduit = useCreateProduit();
  const updateProduit = useUpdateProduit();

  const [form, setForm] = useState<ProduitFormData>(() => {
    if (editProduit) {
      const isCustom = !UNITES.slice(0, -1).includes(editProduit.unite);
      return {
        code: editProduit.code,
        designation: editProduit.designation,
        unite: isCustom ? "autre" : editProduit.unite,
        uniteCustom: isCustom ? editProduit.unite : "",
        prixAchat: editProduit.prixAchat
          ? (Number(editProduit.prixAchat) / 100).toString()
          : "",
        prixVente: editProduit.prixVente
          ? (Number(editProduit.prixVente) / 100).toString()
          : "",
        stockInitial: editProduit.stockActuel.toString(),
        stockMinimum: editProduit.stockMinimum.toString(),
        compteStock: editProduit.compteStock,
      };
    }
    return { ...defaultForm };
  });

  function setField(field: keyof ProduitFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const unite =
      form.unite === "autre" ? form.uniteCustom.trim() || "pièce" : form.unite;
    const input: ProduitInput = {
      code: form.code.trim(),
      designation: form.designation.trim(),
      unite,
      prixAchat: parseDZD(form.prixAchat),
      prixVente: parseDZD(form.prixVente),
      stockMinimum: Number(form.stockMinimum) || 0,
      compteStock: form.compteStock.trim() || "30",
    };
    try {
      if (editProduit) {
        const res = await updateProduit.mutateAsync({
          id: editProduit.id,
          produit: input,
        });
        if ("err" in res) {
          toast.error(res.err);
          return;
        }
        toast.success("Produit mis à jour");
      } else {
        const res = await createProduit.mutateAsync(input);
        if ("err" in res) {
          toast.error(res.err);
          return;
        }
        toast.success("Produit créé avec succès");
      }
      onClose();
    } catch {
      toast.error("Une erreur s'est produite");
    }
  }

  const isPending = createProduit.isPending || updateProduit.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editProduit ? "Modifier le produit" : "Nouveau produit"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-code">Code *</Label>
              <Input
                id="p-code"
                value={form.code}
                onChange={setField("code")}
                placeholder="EX-001"
                required
                data-ocid="input-prod-code"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-unite">Unité</Label>
              <select
                id="p-unite"
                value={form.unite}
                onChange={setField("unite")}
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-ocid="select-prod-unite"
              >
                {UNITES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.unite === "autre" && (
            <div className="space-y-1.5">
              <Label htmlFor="p-unite-custom">Unité personnalisée</Label>
              <Input
                id="p-unite-custom"
                value={form.uniteCustom}
                onChange={setField("uniteCustom")}
                placeholder="ex : palette, tonne…"
                data-ocid="input-prod-unite-custom"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="p-designation">Désignation *</Label>
            <Input
              id="p-designation"
              value={form.designation}
              onChange={setField("designation")}
              placeholder="Nom du produit"
              required
              data-ocid="input-prod-designation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-pa">Prix d'achat HT (DZD)</Label>
              <Input
                id="p-pa"
                type="number"
                min="0"
                step="0.01"
                value={form.prixAchat}
                onChange={setField("prixAchat")}
                placeholder="0"
                data-ocid="input-prod-pa"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-pv">Prix de vente HT (DZD)</Label>
              <Input
                id="p-pv"
                type="number"
                min="0"
                step="0.01"
                value={form.prixVente}
                onChange={setField("prixVente")}
                placeholder="0"
                data-ocid="input-prod-pv"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {!editProduit && (
              <div className="space-y-1.5">
                <Label htmlFor="p-stock-init">Stock initial (qté)</Label>
                <Input
                  id="p-stock-init"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockInitial}
                  onChange={setField("stockInitial")}
                  placeholder="0"
                  data-ocid="input-prod-stock-init"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="p-stock-min">Stock minimum (alerte)</Label>
              <Input
                id="p-stock-min"
                type="number"
                min="0"
                step="1"
                value={form.stockMinimum}
                onChange={setField("stockMinimum")}
                placeholder="0"
                data-ocid="input-prod-stock-min"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-compte">Compte de stock (SCF)</Label>
            <Input
              id="p-compte"
              value={form.compteStock}
              onChange={setField("compteStock")}
              placeholder="30"
              data-ocid="input-prod-compte"
            />
            <p className="text-xs text-muted-foreground">
              Par défaut : 30 — Stocks de marchandises
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="btn-cancel-prod"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="btn-save-prod"
            >
              {isPending
                ? "Enregistrement…"
                : editProduit
                  ? "Modifier"
                  : "Créer le produit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProduitsPage() {
  const { data: produits = [], isLoading } = useProduits();
  const { data: alertes = [] } = useProduitsEnAlerte();
  const { data: valeurs = [] } = useValeurStock();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduit, setEditProduit] = useState<Produit | undefined>();

  const totalValeur = useMemo(
    () => valeurs.reduce((acc, v) => acc + v.valeurTotale, 0n),
    [valeurs],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return produits;
    return produits.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.designation.toLowerCase().includes(q),
    );
  }, [produits, search]);

  function getValeur(id: string): bigint {
    return valeurs.find((v) => v.produitId === id)?.valeurTotale ?? 0n;
  }

  function openNew() {
    setEditProduit(undefined);
    setDialogOpen(true);
  }

  function openEdit(p: Produit, e: React.MouseEvent) {
    e.stopPropagation();
    setEditProduit(p);
    setDialogOpen(true);
  }

  function goToMouvements(id: string) {
    navigate({
      to: "/stocks/mouvements",
      search: { produit: id } as Record<string, string>,
    });
  }

  const skeletonRows = ["r1", "r2", "r3", "r4", "r5"];
  const skeletonCols = [
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "c10",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Catalogue Produits
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Exercice {currentExercice().toString()}
          </p>
        </div>
        <Button onClick={openNew} data-ocid="btn-nouveau-produit">
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Nouveau produit
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Package className="w-3.5 h-3.5" aria-hidden="true" />
              Total produits
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-2xl font-display font-bold text-foreground">
              {produits.length}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              Valeur totale du stock
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <span className="text-xl font-display font-bold text-primary">
              {formatDZD(totalValeur)}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              Produits en alerte
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex items-center gap-2">
            <span
              className={`text-2xl font-display font-bold ${alertes.length > 0 ? "text-destructive" : "text-foreground"}`}
              data-ocid="alerte-count"
            >
              {alertes.length}
            </span>
            {alertes.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                Attention
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder="Rechercher par code ou désignation…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="input-search-produit"
        />
      </div>

      {/* Table */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Désignation</TableHead>
                <TableHead className="font-semibold">Unité</TableHead>
                <TableHead className="text-right font-semibold">
                  Prix Achat HT
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Prix Vente HT
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Stock Actuel
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Stock Min
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Valeur Stock
                </TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                skeletonRows.map((id) => (
                  <TableRow key={id}>
                    {skeletonCols.map((c) => (
                      <TableCell key={c}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-14 text-muted-foreground"
                  >
                    <div
                      className="flex flex-col items-center gap-3"
                      data-ocid="empty-state-produits"
                    >
                      <Package
                        className="w-10 h-10 opacity-25"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-foreground">
                        Aucun produit trouvé
                      </p>
                      <p className="text-sm">
                        {search
                          ? "Aucun résultat pour cette recherche."
                          : "Commencez par créer un premier produit."}
                      </p>
                      {!search && (
                        <Button
                          size="sm"
                          onClick={openNew}
                          data-ocid="btn-empty-nouveau-produit"
                        >
                          <Plus
                            className="w-3.5 h-3.5 mr-1"
                            aria-hidden="true"
                          />
                          Nouveau produit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => goToMouvements(p.id)}
                    data-ocid={`row-produit-${p.id}`}
                  >
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {p.code}
                    </TableCell>
                    <TableCell className="font-medium min-w-0">
                      <span className="truncate block max-w-48">
                        {p.designation}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {p.unite}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatAmount(p.prixAchat)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatAmount(p.prixVente)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {p.stockActuel}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {p.stockMinimum}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-primary">
                      {formatAmount(getValeur(p.id))}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <StockBadge produit={p} />
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => openEdit(p, e)}
                        aria-label={`Modifier ${p.designation}`}
                        data-ocid={`btn-edit-produit-${p.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProduitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editProduit={editProduit}
      />
    </div>
  );
}
