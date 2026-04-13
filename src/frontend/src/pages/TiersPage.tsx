import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTiers, useTiers, useUpdateTiers } from "@/hooks/useBackend";
import type { Tiers, TiersInput } from "@/types";
import { Edit, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Type badge ───────────────────────────────────────────────────────────────

function TypeBadge({ tiers }: { tiers: Tiers }) {
  if (tiers.estClient && tiers.estFournisseur) {
    return (
      <Badge
        variant="outline"
        className="bg-purple-100 text-purple-800 border-purple-200"
      >
        Les deux
      </Badge>
    );
  }
  if (tiers.estClient) {
    return (
      <Badge
        variant="outline"
        className="bg-blue-100 text-blue-800 border-blue-200"
      >
        Client
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-amber-100 text-amber-800 border-amber-200"
    >
      Fournisseur
    </Badge>
  );
}

// ─── Form dialog ──────────────────────────────────────────────────────────────

const emptyForm = (): TiersInput => ({
  nom: "",
  adresse: "",
  nif: "",
  nis: "",
  rc: "",
  telephone: "",
  email: "",
  estClient: true,
  estFournisseur: false,
  compteComptable: "41",
});

function TiersFormDialog({
  open,
  onClose,
  initial,
  tiersId,
}: {
  open: boolean;
  onClose: () => void;
  initial?: TiersInput;
  tiersId?: string;
}) {
  const createTiers = useCreateTiers();
  const updateTiers = useUpdateTiers();
  const [form, setForm] = useState<TiersInput>(initial ?? emptyForm());
  const isEdit = !!tiersId;

  function handleTypeChange(
    field: "estClient" | "estFournisseur",
    checked: boolean,
  ) {
    setForm((prev) => {
      const next = { ...prev, [field]: checked };
      if (next.estClient && !next.estFournisseur) next.compteComptable = "41";
      else if (!next.estClient && next.estFournisseur)
        next.compteComptable = "40";
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.estClient && !form.estFournisseur) {
      toast.error("Cochez au moins un type (client ou fournisseur)");
      return;
    }

    if (isEdit && tiersId) {
      updateTiers.mutate(
        { id: tiersId, input: form },
        {
          onSuccess: (res) => {
            if (res.__kind__ === "ok") {
              toast.success("Tiers mis à jour");
              onClose();
            } else toast.error(res.err);
          },
        },
      );
    } else {
      createTiers.mutate(form, {
        onSuccess: (res) => {
          if (res.__kind__ === "ok") {
            toast.success("Tiers créé");
            onClose();
            setForm(emptyForm());
          } else toast.error(res.err);
        },
      });
    }
  }

  const isPending = createTiers.isPending || updateTiers.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le tiers" : "Ajouter un tiers"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label>Nom / Raison sociale *</Label>
            <Input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
              className="mt-1"
              data-ocid="tiers-nom-input"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-6">
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="chk-client"
              >
                <Checkbox
                  id="chk-client"
                  checked={form.estClient}
                  onCheckedChange={(v) =>
                    handleTypeChange("estClient", v === true)
                  }
                  data-ocid="tiers-client-checkbox"
                />
                <span className="text-sm">Est client</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="chk-fournisseur"
              >
                <Checkbox
                  id="chk-fournisseur"
                  checked={form.estFournisseur}
                  onCheckedChange={(v) =>
                    handleTypeChange("estFournisseur", v === true)
                  }
                  data-ocid="tiers-fournisseur-checkbox"
                />
                <span className="text-sm">Est fournisseur</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>NIF</Label>
              <Input
                value={form.nif}
                onChange={(e) => setForm({ ...form, nif: e.target.value })}
                placeholder="N° Fiscal"
                className="mt-1"
                data-ocid="tiers-nif-input"
              />
            </div>
            <div>
              <Label>NIS</Label>
              <Input
                value={form.nis}
                onChange={(e) => setForm({ ...form, nis: e.target.value })}
                placeholder="N° Statistique"
                className="mt-1"
                data-ocid="tiers-nis-input"
              />
            </div>
            <div>
              <Label>RC</Label>
              <Input
                value={form.rc}
                onChange={(e) => setForm({ ...form, rc: e.target.value })}
                placeholder="Registre Commerce"
                className="mt-1"
                data-ocid="tiers-rc-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Téléphone</Label>
              <Input
                value={form.telephone}
                onChange={(e) =>
                  setForm({ ...form, telephone: e.target.value })
                }
                className="mt-1"
                data-ocid="tiers-telephone-input"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1"
                data-ocid="tiers-email-input"
              />
            </div>
          </div>

          <div>
            <Label>Adresse</Label>
            <Input
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              className="mt-1"
              data-ocid="tiers-adresse-input"
            />
          </div>

          <div>
            <Label>Compte comptable</Label>
            <div className="flex gap-2 mt-1">
              <Select
                value={form.compteComptable}
                onValueChange={(v) => setForm({ ...form, compteComptable: v })}
              >
                <SelectTrigger className="w-52" data-ocid="tiers-compte-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="41">41 — Clients</SelectItem>
                  <SelectItem value="40">40 — Fournisseurs</SelectItem>
                  <SelectItem value="419">419 — Clients créditeurs</SelectItem>
                  <SelectItem value="409">
                    409 — Fournisseurs débiteurs
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={form.compteComptable}
                onChange={(e) =>
                  setForm({ ...form, compteComptable: e.target.value })
                }
                placeholder="ex: 411"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="tiers-submit-btn"
            >
              {isEdit ? "Mettre à jour" : "Créer le tiers"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type TabValue = "tous" | "clients" | "fournisseurs";

export default function TiersPage() {
  const [tab, setTab] = useState<TabValue>("tous");
  const [showDialog, setShowDialog] = useState(false);
  const [editTiers, setEditTiers] = useState<Tiers | null>(null);
  const [search, setSearch] = useState("");

  const tiersQuery = useTiers();
  const allTiers = tiersQuery.data ?? [];

  const filtered = allTiers.filter((t) => {
    const matchTab =
      tab === "tous" ||
      (tab === "clients" && t.estClient) ||
      (tab === "fournisseurs" && t.estFournisseur);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.nom.toLowerCase().includes(q) ||
      t.nif.toLowerCase().includes(q) ||
      t.nis.toLowerCase().includes(q) ||
      t.rc.toLowerCase().includes(q) ||
      t.telephone.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  function closeDialog() {
    setShowDialog(false);
    setEditTiers(null);
  }

  const counts = {
    tous: allTiers.length,
    clients: allTiers.filter((t) => t.estClient).length,
    fournisseurs: allTiers.filter((t) => t.estFournisseur).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Clients &amp; Fournisseurs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestion du fichier tiers — Comptes 40 &amp; 41
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          data-ocid="ajouter-tiers-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un tiers
        </Button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList data-ocid="tiers-tabs">
            <TabsTrigger value="tous">Tous ({counts.tous})</TabsTrigger>
            <TabsTrigger value="clients">
              Clients ({counts.clients})
            </TabsTrigger>
            <TabsTrigger value="fournisseurs">
              Fournisseurs ({counts.fournisseurs})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
          data-ocid="tiers-search-input"
        />
        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} tiers
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Nom</TableHead>
              <TableHead>NIF</TableHead>
              <TableHead>NIS</TableHead>
              <TableHead>RC</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiersQuery.isLoading &&
              ["r1", "r2", "r3", "r4"].map((id) => (
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
            {!tiersQuery.isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div
                    className="flex flex-col items-center gap-3"
                    data-ocid="tiers-empty-state"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium">
                      {search
                        ? "Aucun résultat trouvé"
                        : "Aucun tiers enregistré"}
                    </p>
                    <p className="text-sm">
                      {search
                        ? "Essayez une autre recherche"
                        : "Ajoutez votre premier client ou fournisseur"}
                    </p>
                    {!search && (
                      <Button
                        size="sm"
                        onClick={() => setShowDialog(true)}
                        data-ocid="empty-state-ajouter-tiers-btn"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Ajouter un tiers
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!tiersQuery.isLoading &&
              filtered.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`tiers-row-${t.id}`}
                >
                  <TableCell className="font-medium">{t.nom}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {t.nif || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {t.nis || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {t.rc || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {t.telephone || "—"}
                  </TableCell>
                  <TableCell className="text-sm truncate max-w-36">
                    {t.email || "—"}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {t.compteComptable}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TypeBadge tiers={t} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditTiers(t)}
                        title="Modifier"
                        aria-label="Modifier le tiers"
                        data-ocid={`edit-tiers-${t.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      {showDialog && (
        <TiersFormDialog open={showDialog} onClose={closeDialog} />
      )}
      {editTiers && (
        <TiersFormDialog
          open={!!editTiers}
          onClose={closeDialog}
          tiersId={editTiers.id}
          initial={{
            nom: editTiers.nom,
            adresse: editTiers.adresse,
            nif: editTiers.nif,
            nis: editTiers.nis,
            rc: editTiers.rc,
            telephone: editTiers.telephone,
            email: editTiers.email,
            estClient: editTiers.estClient,
            estFournisseur: editTiers.estFournisseur,
            compteComptable: editTiers.compteComptable,
          }}
        />
      )}
    </div>
  );
}
