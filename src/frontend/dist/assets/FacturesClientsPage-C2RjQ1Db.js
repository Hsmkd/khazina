import { r as reactExports, f as FactureType, j as jsxRuntimeExports, d as Button, g as FactureStatut, S as Skeleton } from "./index-C-LTSMmt.js";
import { B as Badge } from "./badge-xbJUQqab.js";
import { P as Plus, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CDXbd5E3.js";
import { u as ue, L as Label, I as Input } from "./index-nPZKqwAB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as ChevronUp, C as ChevronDown } from "./select-B8NVtKmT.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-q3Pp5WBA.js";
import { T as Textarea } from "./textarea-Dt-KOE3T.js";
import { u as useExercices, l as useTiers, m as useFactures, n as useValidateFacture, o as useDeleteFacture, p as useCreateFacture, q as useCreateTiers } from "./useBackend-DhB6l_bQ.js";
import { c as currentExercice, a as formatDate, f as formatDZD, e as formatFactureStatut, p as parseDZD } from "./format-DzCE1O3H.js";
import { E as Eye } from "./eye-PoGXPcgx.js";
import { C as CircleCheckBig } from "./circle-check-big-5CX_dOyG.js";
import { T as Trash2 } from "./trash-2-CKagV75d.js";
import "./index-CEA_Dzw8.js";
import "./index-CsXa6FL2.js";
function StatutBadge({ statut }) {
  const map = {
    [FactureStatut.Brouillon]: {
      label: "Brouillon",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    [FactureStatut.Validee]: {
      label: "Validée",
      className: "bg-blue-100 text-blue-800 border-blue-200"
    },
    [FactureStatut.Payee]: {
      label: "Payée",
      className: "bg-green-100 text-green-800 border-green-200"
    },
    [FactureStatut.Annulee]: {
      label: "Annulée",
      className: "bg-red-100 text-red-800 border-red-200"
    }
  };
  const cfg = map[statut] ?? {
    label: formatFactureStatut(statut),
    className: "bg-muted text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cfg.className, children: cfg.label });
}
function calcLigne(l) {
  const qty = Number.parseFloat(l.quantite) || 0;
  const pu = Number.parseFloat(l.prixUnitaire.replace(",", ".")) || 0;
  const taux = Number.parseFloat(l.tauxTVA) / 100;
  const ht = qty * pu;
  const tva = ht * taux;
  return { ht, tva, ttc: ht + tva };
}
function toLigneFacture(l) {
  const { ht, tva, ttc } = calcLigne(l);
  return {
    designation: l.designation,
    quantite: Number.parseFloat(l.quantite) || 0,
    prixUnitaire: parseDZD(l.prixUnitaire),
    tauxTVA: Number.parseFloat(l.tauxTVA) || 0,
    montantHT: BigInt(Math.round(ht * 100)),
    montantTVA: BigInt(Math.round(tva * 100)),
    montantTTC: BigInt(Math.round(ttc * 100))
  };
}
const defaultLigne = () => ({
  id: Math.random().toString(36).slice(2),
  designation: "",
  quantite: "1",
  prixUnitaire: "0",
  tauxTVA: "19"
});
function NouveauClientDialog({
  open,
  onClose,
  onCreated
}) {
  const createTiers = useCreateTiers();
  const [nom, setNom] = reactExports.useState("");
  const [tel, setTel] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  function handleSubmit(e) {
    e.preventDefault();
    const input = {
      nom,
      adresse: "",
      nif: "",
      nis: "",
      rc: "",
      telephone: tel,
      email,
      estClient: true,
      estFournisseur: false,
      compteComptable: "41"
    };
    createTiers.mutate(input, {
      onSuccess: (res) => {
        if (res.__kind__ === "ok") {
          ue.success("Client créé");
          onCreated(res.ok);
          onClose();
        } else {
          ue.error(res.err);
        }
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nouveau client" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nom *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: nom,
            onChange: (e) => setNom(e.target.value),
            required: true,
            className: "mt-1"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Téléphone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: tel,
            onChange: (e) => setTel(e.target.value),
            className: "mt-1"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "mt-1"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Annuler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: createTiers.isPending, children: "Créer" })
      ] })
    ] })
  ] }) });
}
function NouvelleFactureDialog({
  open,
  onClose,
  tiers,
  exercice,
  type
}) {
  const createFacture = useCreateFacture();
  const [tiersId, setTiersId] = reactExports.useState("");
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [notes, setNotes] = reactExports.useState("");
  const [lignes, setLignes] = reactExports.useState([defaultLigne()]);
  const [showNouveauClient, setShowNouveauClient] = reactExports.useState(false);
  const clients = tiers.filter(
    (t) => type === FactureType.Vente ? t.estClient : t.estFournisseur
  );
  const totals = lignes.reduce(
    (acc, l) => {
      const { ht, tva, ttc } = calcLigne(l);
      return { ht: acc.ht + ht, tva: acc.tva + tva, ttc: acc.ttc + ttc };
    },
    { ht: 0, tva: 0, ttc: 0 }
  );
  function addLigne() {
    setLignes((prev) => [...prev, defaultLigne()]);
  }
  function removeLigne(id) {
    setLignes((prev) => prev.filter((l) => l.id !== id));
  }
  function updateLigne(id, field, value) {
    setLignes(
      (prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l)
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!tiersId) {
      ue.error("Veuillez sélectionner un tiers");
      return;
    }
    if (lignes.length === 0) {
      ue.error("Ajoutez au moins une ligne");
      return;
    }
    createFacture.mutate(
      {
        tiersId,
        type,
        exercice,
        date: BigInt(new Date(date).getTime()) * 1000000n,
        notes,
        lignes: lignes.map(toLigneFacture)
      },
      {
        onSuccess: (res) => {
          if (res.__kind__ === "ok") {
            ue.success("Facture créée");
            onClose();
            setTiersId("");
            setNotes("");
            setLignes([defaultLigne()]);
          } else {
            ue.error(res.err);
          }
        }
      }
    );
  }
  const tiersLabel = type === FactureType.Vente ? "Client" : "Fournisseur";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: type === FactureType.Vente ? "Nouvelle facture client" : "Nouvelle facture fournisseur" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              tiersLabel,
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tiersId, onValueChange: setTiersId, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "flex-1",
                    "data-ocid": "facture-tiers-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectValue,
                      {
                        placeholder: `Choisir un ${tiersLabel.toLowerCase()}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clients.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.nom }, t.id)) })
              ] }),
              type === FactureType.Vente && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  onClick: () => setShowNouveauClient(true),
                  title: "Créer un nouveau client",
                  "aria-label": "Créer un nouveau client",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value),
                required: true,
                className: "mt-1",
                "data-ocid": "facture-date-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-semibold", children: "Lignes de facturation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: addLigne,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                  "Ajouter une ligne"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Désignation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20", children: "Qté" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32", children: "Prix HT (DZD)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24", children: "TVA" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-28 text-right", children: "HT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-28 text-right", children: "TTC" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: lignes.map((l) => {
              const { ht, ttc } = calcLigne(l);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: l.designation,
                    onChange: (e) => updateLigne(l.id, "designation", e.target.value),
                    placeholder: "Description du produit/service",
                    className: "h-8"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    value: l.quantite,
                    onChange: (e) => updateLigne(l.id, "quantite", e.target.value),
                    min: "0",
                    step: "0.01",
                    className: "h-8 text-right"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: l.prixUnitaire,
                    onChange: (e) => updateLigne(
                      l.id,
                      "prixUnitaire",
                      e.target.value
                    ),
                    className: "h-8 text-right"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: l.tauxTVA,
                    onValueChange: (v) => updateLigne(l.id, "tauxTVA", v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "0", children: "0%" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "9", children: "9%" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "19", children: "19%" })
                      ] })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: ht.toLocaleString("fr-DZ", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-medium", children: ttc.toLocaleString("fr-DZ", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-destructive hover:text-destructive",
                    onClick: () => removeLigne(l.id),
                    "aria-label": "Supprimer la ligne",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                  }
                ) })
              ] }, l.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg p-4 min-w-64 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total HT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
              totals.ht.toLocaleString("fr-DZ", {
                minimumFractionDigits: 2
              }),
              " ",
              "DZD"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total TVA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
              totals.tva.toLocaleString("fr-DZ", {
                minimumFractionDigits: 2
              }),
              " ",
              "DZD"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold border-t pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total TTC" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-primary", children: [
              totals.ttc.toLocaleString("fr-DZ", {
                minimumFractionDigits: 2
              }),
              " ",
              "DZD"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes / Observations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              className: "mt-1",
              rows: 2
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Annuler" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: createFacture.isPending,
              "data-ocid": "facture-submit-btn",
              children: "Enregistrer en brouillon"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NouveauClientDialog,
      {
        open: showNouveauClient,
        onClose: () => setShowNouveauClient(false),
        onCreated: (id) => setTiersId(id)
      }
    )
  ] });
}
function FactureDetailPanel({
  facture,
  tiersMap
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 bg-muted/30 border-t space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tiers : " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: tiersMap.get(facture.tiersId) ?? facture.tiersId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Date : " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(facture.date) })
      ] }),
      facture.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Notes : " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: facture.notes })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Désignation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20 text-right", children: "Qté" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32 text-right", children: "Prix HT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20 text-right", children: "TVA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32 text-right", children: "Montant HT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32 text-right", children: "Montant TTC" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: facture.lignes.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: l.designation }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono", children: l.quantite }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono", children: formatDZD(l.prixUnitaire) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
          l.tauxTVA,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono", children: formatDZD(l.montantHT) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono font-medium", children: formatDZD(l.montantTTC) })
      ] }, `ligne-detail-${facture.id}-${i}`)) })
    ] }) })
  ] });
}
function FacturesClientsPage() {
  var _a;
  const [exercice, setExercice] = reactExports.useState(currentExercice());
  const [statutFilter, setStatutFilter] = reactExports.useState("all");
  const [showDialog, setShowDialog] = reactExports.useState(false);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const exercicesQuery = useExercices();
  const tiersQuery = useTiers();
  const facturesQuery = useFactures(FactureType.Vente, exercice, 0n);
  const validateFacture = useValidateFacture();
  const deleteFacture = useDeleteFacture();
  const tiersMap = new Map((tiersQuery.data ?? []).map((t) => [t.id, t.nom]));
  const allFactures = ((_a = facturesQuery.data) == null ? void 0 : _a.factures) ?? [];
  const factures = statutFilter === "all" ? allFactures : allFactures.filter((f) => f.statut === statutFilter);
  function handleValidate(id) {
    validateFacture.mutate(id, {
      onSuccess: (res) => {
        if (res.__kind__ === "ok") ue.success("Facture validée");
        else ue.error(res.err);
      }
    });
  }
  function handleDelete(id) {
    deleteFacture.mutate(id, {
      onSuccess: (res) => {
        if (res.__kind__ === "ok") ue.success("Facture supprimée");
        else ue.error(res.err);
      }
    });
  }
  const isLoading = facturesQuery.isLoading || tiersQuery.isLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Factures Clients" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Gestion des factures de vente — Conforme SCF" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setShowDialog(true),
          "data-ocid": "nouvelle-facture-client-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Nouvelle facture"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: exercice.toString(),
          onValueChange: (v) => setExercice(BigInt(v)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "exercice-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (exercicesQuery.data ?? []).map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: ex.annee.toString(), children: [
              "Exercice ",
              ex.annee.toString()
            ] }, ex.annee.toString())) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statutFilter, onValueChange: setStatutFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", "data-ocid": "statut-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Tous les statuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FactureStatut.Brouillon, children: "Brouillon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FactureStatut.Validee, children: "Validée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FactureStatut.Payee, children: "Payée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FactureStatut.Annulee, children: "Annulée" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-sm text-muted-foreground self-center", children: [
        factures.length,
        " facture",
        factures.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-xl overflow-hidden bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "N° Facture" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Total HT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "TVA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Total TTC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Statut" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        isLoading && ["r1", "r2", "r3", "r4", "r5"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"].map(
          (c) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, c)
        ) }, id)),
        !isLoading && factures.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 9,
            className: "text-center py-16 text-muted-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-3",
                "data-ocid": "factures-clients-empty",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Aucune facture trouvée" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Créez votre première facture client" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      onClick: () => setShowDialog(true),
                      "data-ocid": "empty-state-create-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                        "Nouvelle facture"
                      ]
                    }
                  )
                ]
              }
            )
          }
        ) }),
        !isLoading && factures.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "cursor-pointer hover:bg-muted/30 transition-colors",
              onClick: () => setExpandedId(expandedId === f.id ? null : f.id),
              "data-ocid": `facture-client-row-${f.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: expandedId === f.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono font-medium text-primary", children: f.numero }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "tabular-nums", children: formatDate(f.date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: tiersMap.get(f.tiersId) ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono tabular-nums", children: formatDZD(f.totalHT) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono tabular-nums", children: formatDZD(f.totalTVA) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono tabular-nums font-semibold", children: formatDZD(f.totalTTC) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatutBadge, { statut: f.statut }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex items-center justify-end gap-1",
                    onClick: (e) => e.stopPropagation(),
                    onKeyUp: (e) => e.stopPropagation(),
                    children: f.statut === FactureStatut.Brouillon && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                          onClick: () => handleValidate(f.id),
                          title: "Valider",
                          "aria-label": "Valider la facture",
                          "data-ocid": `validate-facture-${f.id}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                          onClick: () => handleDelete(f.id),
                          title: "Supprimer",
                          "aria-label": "Supprimer la facture",
                          "data-ocid": `delete-facture-${f.id}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                        }
                      )
                    ] })
                  }
                ) })
              ]
            },
            f.id
          ),
          expandedId === f.id && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FactureDetailPanel, { facture: f, tiersMap }) }) }, `${f.id}-detail`)
        ] }))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NouvelleFactureDialog,
      {
        open: showDialog,
        onClose: () => setShowDialog(false),
        tiers: tiersQuery.data ?? [],
        exercice,
        type: FactureType.Vente
      }
    )
  ] });
}
export {
  FacturesClientsPage as default
};
