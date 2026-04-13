import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateFacture,
  useDeleteFacture,
  useExercices,
  useFactures,
  useTiers,
  useValidateFacture,
} from "@/hooks/useBackend";
import {
  currentExercice,
  formatDZD,
  formatDate,
  formatFactureStatut,
  parseDZD,
} from "@/lib/format";
import { FactureStatut, FactureType } from "@/types";
import type { Facture, FiscalYear, LigneFacture } from "@/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: FactureStatut }) {
  const map: Record<FactureStatut, { label: string; className: string }> = {
    [FactureStatut.Brouillon]: {
      label: "Brouillon",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    [FactureStatut.Validee]: {
      label: "Validée",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    [FactureStatut.Payee]: {
      label: "Payée",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    [FactureStatut.Annulee]: {
      label: "Annulée",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };
  const cfg = map[statut] ?? {
    label: formatFactureStatut(statut),
    className: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

// ─── Ligne helpers ────────────────────────────────────────────────────────────

interface LigneRow {
  id: string;
  designation: string;
  quantite: string;
  prixUnitaire: string;
  tauxTVA: string;
}

function calcLigne(l: LigneRow) {
  const qty = Number.parseFloat(l.quantite) || 0;
  const pu = Number.parseFloat(l.prixUnitaire.replace(",", ".")) || 0;
  const taux = Number.parseFloat(l.tauxTVA) / 100;
  const ht = qty * pu;
  const tva = ht * taux;
  return { ht, tva, ttc: ht + tva };
}

function toLigneFacture(l: LigneRow): LigneFacture {
  const { ht, tva, ttc } = calcLigne(l);
  return {
    designation: l.designation,
    quantite: Number.parseFloat(l.quantite) || 0,
    prixUnitaire: parseDZD(l.prixUnitaire),
    tauxTVA: Number.parseFloat(l.tauxTVA) || 0,
    montantHT: BigInt(Math.round(ht * 100)),
    montantTVA: BigInt(Math.round(tva * 100)),
    montantTTC: BigInt(Math.round(ttc * 100)),
  };
}

const defaultLigne = (): LigneRow => ({
  id: Math.random().toString(36).slice(2),
  designation: "",
  quantite: "1",
  prixUnitaire: "0",
  tauxTVA: "19",
});

// ─── Formulaire nouvelle facture fournisseur ──────────────────────────────────

function NouvelleFactureDialog({
  open,
  onClose,
  fournisseurs,
  exercice,
}: {
  open: boolean;
  onClose: () => void;
  fournisseurs: { id: string; nom: string }[];
  exercice: bigint;
}) {
  const createFacture = useCreateFacture();
  const [tiersId, setTiersId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [lignes, setLignes] = useState<LigneRow[]>([defaultLigne()]);

  const totals = lignes.reduce(
    (acc, l) => {
      const { ht, tva, ttc } = calcLigne(l);
      return { ht: acc.ht + ht, tva: acc.tva + tva, ttc: acc.ttc + ttc };
    },
    { ht: 0, tva: 0, ttc: 0 },
  );

  function addLigne() {
    setLignes((prev) => [...prev, defaultLigne()]);
  }

  function removeLigne(id: string) {
    setLignes((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLigne(id: string, field: keyof LigneRow, value: string) {
    setLignes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tiersId) {
      toast.error("Veuillez sélectionner un fournisseur");
      return;
    }
    if (lignes.length === 0) {
      toast.error("Ajoutez au moins une ligne");
      return;
    }

    createFacture.mutate(
      {
        tiersId,
        type: FactureType.Achat,
        exercice,
        date: BigInt(new Date(date).getTime()) * 1_000_000n,
        notes,
        lignes: lignes.map(toLigneFacture),
      },
      {
        onSuccess: (res) => {
          if (res.__kind__ === "ok") {
            toast.success("Facture fournisseur créée");
            onClose();
            setTiersId("");
            setNotes("");
            setLignes([defaultLigne()]);
          } else {
            toast.error(res.err);
          }
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle facture fournisseur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fournisseur *</Label>
              <Select value={tiersId} onValueChange={setTiersId}>
                <SelectTrigger
                  className="mt-1"
                  data-ocid="facture-fournisseur-select"
                >
                  <SelectValue placeholder="Choisir un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {fournisseurs.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1"
                data-ocid="facture-fournisseur-date"
              />
            </div>
          </div>

          {/* Lignes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-semibold">
                Lignes de facturation
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLigne}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Ajouter une ligne
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Désignation</TableHead>
                    <TableHead className="w-20">Qté</TableHead>
                    <TableHead className="w-32">Prix HT (DZD)</TableHead>
                    <TableHead className="w-24">TVA</TableHead>
                    <TableHead className="w-28 text-right">HT</TableHead>
                    <TableHead className="w-28 text-right">TTC</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lignes.map((l) => {
                    const { ht, ttc } = calcLigne(l);
                    return (
                      <TableRow key={l.id}>
                        <TableCell>
                          <Input
                            value={l.designation}
                            onChange={(e) =>
                              updateLigne(l.id, "designation", e.target.value)
                            }
                            placeholder="Description du produit/service"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={l.quantite}
                            onChange={(e) =>
                              updateLigne(l.id, "quantite", e.target.value)
                            }
                            min="0"
                            step="0.01"
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={l.prixUnitaire}
                            onChange={(e) =>
                              updateLigne(l.id, "prixUnitaire", e.target.value)
                            }
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={l.tauxTVA}
                            onValueChange={(v) =>
                              updateLigne(l.id, "tauxTVA", v)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="9">9%</SelectItem>
                              <SelectItem value="19">19%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {ht.toLocaleString("fr-DZ", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-medium">
                          {ttc.toLocaleString("fr-DZ", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeLigne(l.id)}
                            aria-label="Supprimer la ligne"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="bg-muted/40 rounded-lg p-4 min-w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total HT</span>
                <span className="font-mono">
                  {totals.ht.toLocaleString("fr-DZ", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  DZD
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total TVA</span>
                <span className="font-mono">
                  {totals.tva.toLocaleString("fr-DZ", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  DZD
                </span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total TTC</span>
                <span className="font-mono text-primary">
                  {totals.ttc.toLocaleString("fr-DZ", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  DZD
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Notes / Observations</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createFacture.isPending}
              data-ocid="facture-fournisseur-submit-btn"
            >
              Enregistrer en brouillon
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function FactureDetailPanel({
  facture,
  tiersMap,
}: { facture: Facture; tiersMap: Map<string, string> }) {
  return (
    <div className="px-6 py-4 bg-muted/30 border-t space-y-3">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Fournisseur : </span>
          <span className="font-medium">
            {tiersMap.get(facture.tiersId) ?? facture.tiersId}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Date : </span>
          <span>{formatDate(facture.date)}</span>
        </div>
        {facture.notes && (
          <div className="col-span-3">
            <span className="text-muted-foreground">Notes : </span>
            <span>{facture.notes}</span>
          </div>
        )}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Désignation</TableHead>
              <TableHead className="w-20 text-right">Qté</TableHead>
              <TableHead className="w-32 text-right">Prix HT</TableHead>
              <TableHead className="w-20 text-right">TVA</TableHead>
              <TableHead className="w-32 text-right">Montant HT</TableHead>
              <TableHead className="w-32 text-right">Montant TTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facture.lignes.map((l, i) => (
              <TableRow key={`ligne-fournisseur-${facture.id}-${i}`}>
                <TableCell>{l.designation}</TableCell>
                <TableCell className="text-right font-mono">
                  {l.quantite}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatDZD(l.prixUnitaire)}
                </TableCell>
                <TableCell className="text-right">{l.tauxTVA}%</TableCell>
                <TableCell className="text-right font-mono">
                  {formatDZD(l.montantHT)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatDZD(l.montantTTC)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FacturesFournisseursPage() {
  const [exercice, setExercice] = useState<bigint>(currentExercice());
  const [statutFilter, setStatutFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const exercicesQuery = useExercices();
  const tiersQuery = useTiers();
  const facturesQuery = useFactures(FactureType.Achat, exercice, 0n);
  const validateFacture = useValidateFacture();
  const deleteFacture = useDeleteFacture();

  const tiersMap = new Map((tiersQuery.data ?? []).map((t) => [t.id, t.nom]));
  const fournisseurs = (tiersQuery.data ?? []).filter((t) => t.estFournisseur);

  const allFactures = facturesQuery.data?.factures ?? [];
  const factures =
    statutFilter === "all"
      ? allFactures
      : allFactures.filter((f) => f.statut === statutFilter);

  function handleValidate(id: string) {
    validateFacture.mutate(id, {
      onSuccess: (res) => {
        if (res.__kind__ === "ok") toast.success("Facture validée");
        else toast.error(res.err);
      },
    });
  }

  function handleDelete(id: string) {
    deleteFacture.mutate(id, {
      onSuccess: (res) => {
        if (res.__kind__ === "ok") toast.success("Facture supprimée");
        else toast.error(res.err);
      },
    });
  }

  const isLoading = facturesQuery.isLoading || tiersQuery.isLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Factures Fournisseurs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestion des factures d&apos;achat — Conforme SCF
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          data-ocid="nouvelle-facture-fournisseur-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select
          value={exercice.toString()}
          onValueChange={(v) => setExercice(BigInt(v))}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="exercice-filter-fournisseur"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(exercicesQuery.data ?? []).map((ex: FiscalYear) => (
              <SelectItem key={ex.annee.toString()} value={ex.annee.toString()}>
                Exercice {ex.annee.toString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statutFilter} onValueChange={setStatutFilter}>
          <SelectTrigger className="w-40" data-ocid="statut-filter-fournisseur">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value={FactureStatut.Brouillon}>Brouillon</SelectItem>
            <SelectItem value={FactureStatut.Validee}>Validée</SelectItem>
            <SelectItem value={FactureStatut.Payee}>Payée</SelectItem>
            <SelectItem value={FactureStatut.Annulee}>Annulée</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-muted-foreground self-center">
          {factures.length} facture{factures.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-8" />
              <TableHead>N° Facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              ["r1", "r2", "r3", "r4", "r5"].map((id) => (
                <TableRow key={id}>
                  {["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"].map(
                    (c) => (
                      <TableCell key={c}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))}
            {!isLoading && factures.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div
                    className="flex flex-col items-center gap-3"
                    data-ocid="factures-fournisseurs-empty"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium">Aucune facture trouvée</p>
                    <p className="text-sm">
                      Créez votre première facture fournisseur
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowDialog(true)}
                      data-ocid="empty-state-create-fournisseur-btn"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Nouvelle facture
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              factures.map((f) => (
                <>
                  <TableRow
                    key={f.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() =>
                      setExpandedId(expandedId === f.id ? null : f.id)
                    }
                    data-ocid={`facture-fournisseur-row-${f.id}`}
                  >
                    <TableCell>
                      {expandedId === f.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-primary">
                      {f.numero}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatDate(f.date)}
                    </TableCell>
                    <TableCell>{tiersMap.get(f.tiersId) ?? "—"}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatDZD(f.totalHT)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatDZD(f.totalTVA)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold">
                      {formatDZD(f.totalTTC)}
                    </TableCell>
                    <TableCell>
                      <StatutBadge statut={f.statut} />
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                        onKeyUp={(e) => e.stopPropagation()}
                      >
                        {f.statut === FactureStatut.Brouillon && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleValidate(f.id)}
                              title="Valider"
                              aria-label="Valider la facture"
                              data-ocid={`validate-facture-fournisseur-${f.id}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(f.id)}
                              title="Supprimer"
                              aria-label="Supprimer la facture"
                              data-ocid={`delete-facture-fournisseur-${f.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === f.id && (
                    <TableRow key={`${f.id}-detail`}>
                      <TableCell colSpan={9} className="p-0">
                        <FactureDetailPanel facture={f} tiersMap={tiersMap} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
          </TableBody>
        </Table>
      </div>

      <NouvelleFactureDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        fournisseurs={fournisseurs}
        exercice={exercice}
      />
    </div>
  );
}
