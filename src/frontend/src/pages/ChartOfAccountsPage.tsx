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
import { useAddCompte, useComptes } from "@/hooks/useBackend";
import { formatDZD } from "@/lib/format";
import { AccountType } from "@/types";
import type { Account } from "@/types";
import { BookOpen, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CLASS_LABELS: Record<number, string> = {
  1: "Capitaux propres",
  2: "Immobilisations",
  3: "Stocks",
  4: "Tiers",
  5: "Trésorerie",
  6: "Charges",
  7: "Produits",
};

type ColorSet = { bg: string; text: string; border: string };
const CLASS_COLORS: Record<number, ColorSet> = {
  1: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  2: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  3: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  4: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  5: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
  },
  6: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
  7: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
};

const TABS = [
  { value: "0", label: "Tous" },
  { value: "1", label: "Classe 1 – Capitaux" },
  { value: "2", label: "Classe 2 – Immobilisations" },
  { value: "3", label: "Classe 3 – Stocks" },
  { value: "4", label: "Classe 4 – Tiers" },
  { value: "5", label: "Classe 5 – Trésorerie" },
  { value: "6", label: "Classe 6 – Charges" },
  { value: "7", label: "Classe 7 – Produits" },
];

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.Actif]: "Actif",
  [AccountType.Passif]: "Passif",
  [AccountType.Charges]: "Charges",
  [AccountType.Produits]: "Produits",
  [AccountType.Bilan]: "Bilan",
};

function ClassBadge({ classe }: { classe: number }) {
  const color = CLASS_COLORS[classe] ?? CLASS_COLORS[1];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color.bg} ${color.text} ${color.border}`}
    >
      Cl.{classe} — {CLASS_LABELS[classe] ?? "—"}
    </span>
  );
}

function AddCompteDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [numero, setNumero] = useState("");
  const [libelle, setLibelle] = useState("");
  const [classe, setClasse] = useState("1");
  const [type, setType] = useState<AccountType>(AccountType.Actif);
  const addCompte = useAddCompte();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim() || !libelle.trim()) return;
    const compte: Account = {
      id: crypto.randomUUID(),
      numero: numero.trim(),
      libelle: libelle.trim(),
      classe: BigInt(classe),
      type,
      soldeDebit: 0n,
      soldeCredit: 0n,
    };
    try {
      const res = await addCompte.mutateAsync(compte);
      if ("err" in res) {
        toast.error(res.err);
      } else {
        toast.success("Compte ajouté avec succès");
        setNumero("");
        setLibelle("");
        setClasse("1");
        setType(AccountType.Actif);
        onClose();
      }
    } catch {
      toast.error("Erreur lors de l'ajout du compte");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un compte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-num">Numéro *</Label>
              <Input
                id="add-num"
                placeholder="ex: 101000"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                data-ocid="account-numero-input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-classe">Classe *</Label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger
                  id="add-classe"
                  data-ocid="account-classe-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((c) => (
                    <SelectItem key={String(c)} value={String(c)}>
                      {c} – {CLASS_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-libelle">Libellé *</Label>
            <Input
              id="add-libelle"
              placeholder="ex: Capital social"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              data-ocid="account-libelle-input"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-type">Type de compte</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as AccountType)}
            >
              <SelectTrigger id="add-type" data-ocid="account-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AccountType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {ACCOUNT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="cancel-add-account"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={addCompte.isPending}
              data-ocid="submit-add-account"
            >
              {addCompte.isPending ? "Ajout…" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ChartOfAccountsPage() {
  const { data: comptes = [], isLoading } = useComptes();
  const [activeTab, setActiveTab] = useState("0");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = comptes
    .filter((c) => {
      const matchClass = activeTab === "0" || c.classe === BigInt(activeTab);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.numero.toLowerCase().includes(q) ||
        c.libelle.toLowerCase().includes(q);
      return matchClass && matchSearch;
    })
    .sort((a, b) => a.numero.localeCompare(b.numero));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Plan Comptable SCF
            </h1>
            <p className="text-sm text-muted-foreground">
              Conforme SCF – Loi 07-11 · {comptes.length} compte
              {comptes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          data-ocid="add-account-btn"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un compte
        </Button>
      </div>

      {/* Class tabs */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-1 min-w-max bg-muted/50 rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              data-ocid={`class-tab-${tab.value}`}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-smooth whitespace-nowrap ${
                activeTab === tab.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Rechercher un compte…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="search-accounts"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Numéro
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Libellé
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Classe
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Type
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Solde débiteur
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Solde créditeur
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["l1", "l2", "l3", "l4", "l5"].map((k) => (
                  <tr key={k} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground"
                    data-ocid="accounts-empty-state"
                  >
                    <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Aucun compte trouvé</p>
                    <p className="text-xs mt-1">
                      {search
                        ? "Modifiez votre recherche"
                        : "Ajoutez votre premier compte via le bouton ci-dessus"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((compte) => (
                  <tr
                    key={compte.id}
                    className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                    data-ocid={`account-row-${compte.numero}`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-foreground tracking-wide">
                      {compte.numero}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {compte.libelle}
                    </td>
                    <td className="px-4 py-3">
                      <ClassBadge classe={Number(compte.classe)} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {ACCOUNT_TYPE_LABELS[compte.type] ?? compte.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {compte.soldeDebit > 0n ? (
                        <span className="text-rose-600 dark:text-rose-400">
                          {formatDZD(compte.soldeDebit)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0,00 DZD</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {compte.soldeCredit > 0n ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatDZD(compte.soldeCredit)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0,00 DZD</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCompteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
