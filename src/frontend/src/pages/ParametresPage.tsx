import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAdmin } from "@/hooks/useAuth";
import {
  useCompanyInfo,
  useCreateExercice,
  useExercices,
  useUpdateCompanyInfo,
  useUpdateUserRole,
  useUsers,
} from "@/hooks/useBackend";
import { formatDate } from "@/lib/format";
import type { CompanyInfo, UserId } from "@/types";
import { Role } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { AlertCircle, Lock, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";

// ─── Tab Entreprise ───────────────────────────────────────────────────────────

const EMPTY_COMPANY: CompanyInfo = {
  nom: "",
  adresse: "",
  nif: "",
  nis: "",
  rc: "",
  telephone: "",
  email: "",
  activite: "",
  exerciceActuel: BigInt(new Date().getFullYear()),
};

function EntrepriseTab() {
  const { data: companyInfo, isLoading } = useCompanyInfo();
  const updateCompanyInfo = useUpdateCompanyInfo();
  const [form, setForm] = useState<CompanyInfo>(EMPTY_COMPANY);

  useEffect(() => {
    if (companyInfo) {
      setForm(companyInfo);
    }
  }, [companyInfo]);

  function handleChange(field: keyof CompanyInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await updateCompanyInfo.mutateAsync(form);
      if ("__kind__" in result && result.__kind__ === "err") {
        toast.error(`Erreur: ${result.err}`);
      } else {
        toast.success("Informations enregistrées avec succès.");
      }
    } catch {
      toast.error("Impossible de sauvegarder les informations.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {["f1", "f2", "f3", "f4"].map((id) => (
          <Skeleton key={id} className="h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base">
          Informations de l'entreprise
        </CardTitle>
        <CardDescription>
          Ces informations apparaîtront sur vos rapports et états financiers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nom">Raison sociale *</Label>
              <Input
                id="nom"
                value={form.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                placeholder="SARL Mon Entreprise"
                data-ocid="input-nom-entreprise"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="activite">Activité principale</Label>
              <Input
                id="activite"
                value={form.activite}
                onChange={(e) => handleChange("activite", e.target.value)}
                placeholder="Commerce de gros"
                data-ocid="input-activite"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={form.adresse}
              onChange={(e) => handleChange("adresse", e.target.value)}
              placeholder="1 Rue de l'Indépendance, Alger"
              data-ocid="input-adresse"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nif">NIF</Label>
              <Input
                id="nif"
                value={form.nif}
                onChange={(e) => handleChange("nif", e.target.value)}
                placeholder="000000000000000"
                data-ocid="input-nif"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nis">NIS</Label>
              <Input
                id="nis"
                value={form.nis}
                onChange={(e) => handleChange("nis", e.target.value)}
                placeholder="000000000000000"
                data-ocid="input-nis"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rc">Registre du Commerce (RC)</Label>
              <Input
                id="rc"
                value={form.rc}
                onChange={(e) => handleChange("rc", e.target.value)}
                placeholder="00/00-0000000"
                data-ocid="input-rc"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={form.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                placeholder="+213 21 000 000"
                data-ocid="input-telephone"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contact@entreprise.dz"
                data-ocid="input-email-entreprise"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={updateCompanyInfo.isPending}
              data-ocid="btn-save-entreprise"
            >
              {updateCompanyInfo.isPending
                ? "Enregistrement…"
                : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Tab Utilisateurs ─────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: Role.Admin, label: "Administrateur" },
  { value: Role.Comptable, label: "Comptable" },
  { value: Role.Gestionnaire, label: "Gestionnaire" },
  { value: Role.Lecteur, label: "Lecteur" },
];

function roleVariant(
  role: Role,
): "default" | "secondary" | "outline" | "destructive" {
  if (role === Role.Admin) return "default";
  if (role === Role.Comptable) return "secondary";
  if (role === Role.Gestionnaire) return "outline";
  return "outline";
}

function UtilisateursTab() {
  const { data: isAdmin, isLoading: loadingAdmin } = useIsAdmin();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const updateRole = useUpdateUserRole();

  if (loadingAdmin || loadingUsers) {
    return (
      <div className="space-y-3 mt-4">
        {["u1", "u2", "u3"].map((id) => (
          <Skeleton key={id} className="h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="shadow-card border-destructive/20">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-3 text-center">
          <Lock className="w-12 h-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-foreground">Accès refusé</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Seuls les administrateurs peuvent gérer les utilisateurs et les
            rôles.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function handleRoleChange(userId: UserId, role: Role) {
    try {
      const result = await updateRole.mutateAsync({ userId, role });
      if ("__kind__" in result && result.__kind__ === "err") {
        toast.error(`Erreur: ${result.err}`);
      } else {
        toast.success("Rôle mis à jour.");
      }
    } catch {
      toast.error("Impossible de modifier le rôle.");
    }
  }

  if (!users || users.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-10 pb-10 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Aucun utilisateur enregistré.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Modifiez les rôles des utilisateurs enregistrés dans le système.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  Nom
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  Rôle
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                  Statut
                </th>
                <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={`user-${idx}-${user.email}`}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`user-row-${idx}`}
                >
                  <td className="py-3 px-4 font-medium">{user.nom || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                    {user.email || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={roleVariant(user.role)} className="text-xs">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        user.actif
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.actif ? "bg-emerald-500" : "bg-muted-foreground"
                        }`}
                      />
                      {user.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Select
                      value={user.role}
                      onValueChange={(v) =>
                        handleRoleChange(user.userId, v as Role)
                      }
                    >
                      <SelectTrigger
                        className="w-36 h-8 text-xs"
                        aria-label={`Modifier le rôle de ${user.nom}`}
                        data-ocid={`select-role-${idx}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="text-xs"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tab Exercices Fiscaux ────────────────────────────────────────────────────

function ExercicesTab() {
  const { data: exercices, isLoading } = useExercices();
  const createExercice = useCreateExercice();

  const nextYear = BigInt(new Date().getFullYear() + 1);
  const hasNextYear = exercices?.some((e) => e.annee === nextYear);

  async function handleCreate() {
    try {
      const result = await createExercice.mutateAsync(nextYear);
      if ("__kind__" in result && result.__kind__ === "err") {
        toast.error(`Erreur: ${result.err}`);
      } else {
        toast.success(`Exercice ${nextYear} créé avec succès.`);
      }
    } catch {
      toast.error("Impossible de créer l'exercice.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {["e1", "e2", "e3"].map((id) => (
          <Skeleton key={id} className="h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hasNextYear && (
        <div className="flex justify-end">
          <Button
            onClick={handleCreate}
            disabled={createExercice.isPending}
            className="gap-2"
            data-ocid="btn-create-exercice"
          >
            <PlusCircle className="w-4 h-4" />
            {createExercice.isPending
              ? "Création…"
              : `Créer l'exercice ${String(nextYear)}`}
          </Button>
        </div>
      )}

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          {!exercices || exercices.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              Aucun exercice fiscal enregistré.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Année
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                    Début
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                    Fin
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...exercices]
                  .sort((a, b) => Number(b.annee - a.annee))
                  .map((fy, idx) => (
                    <tr
                      key={`fy-${idx}-${String(fy.annee)}`}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`exercice-row-${idx}`}
                    >
                      <td className="py-3 px-4 font-semibold">
                        {String(fy.annee)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                        {formatDate(fy.debut)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                        {formatDate(fy.fin)}
                      </td>
                      <td className="py-3 px-4">
                        {fy.cloture ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            Clôturé
                          </Badge>
                        ) : (
                          <Badge
                            variant="default"
                            className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15"
                          >
                            Ouvert
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!fy.cloture && <ClotureDialog annee={fy.annee} />}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ClotureDialog({ annee }: { annee: bigint }) {
  const { actor } = useActor(createActor);

  async function handleCloture() {
    if (!actor) return;
    try {
      await actor.cloturerExercice(annee);
      toast.success(`Exercice ${String(annee)} clôturé.`);
    } catch {
      toast.error("Erreur lors de la clôture.");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
          data-ocid={`btn-cloture-${String(annee)}`}
        >
          Clôturer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Clôturer l'exercice {String(annee)} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Une fois clôturé, aucun nouveau
            journal ne pourra être créé pour cet exercice. Vous pourrez
            uniquement consulter les données en lecture seule.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleCloture}
            data-ocid={`confirm-cloture-${String(annee)}`}
          >
            Confirmer la clôture
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ParametresPage() {
  return (
    <div className="p-6 space-y-6" data-ocid="parametres-page">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Paramètres
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configuration de l'application et gestion des accès
        </p>
      </div>

      <Tabs defaultValue="entreprise" className="space-y-4">
        <TabsList
          className="bg-card border border-border"
          data-ocid="tabs-parametres"
        >
          <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
          <TabsTrigger value="exercices">Exercices fiscaux</TabsTrigger>
        </TabsList>

        <TabsContent value="entreprise">
          <EntrepriseTab />
        </TabsContent>

        <TabsContent value="utilisateurs">
          <UtilisateursTab />
        </TabsContent>

        <TabsContent value="exercices">
          <ExercicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
