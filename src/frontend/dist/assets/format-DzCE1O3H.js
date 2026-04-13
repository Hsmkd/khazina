function formatDZD(amount) {
  const num = Number(amount) / 100;
  const formatted = num.toLocaleString("fr-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${formatted.replace(/\u202f/g, " ")} DZD`;
}
function formatAmount(amount) {
  const num = Number(amount) / 100;
  return num.toLocaleString("fr-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function formatDate(ts) {
  const ms = Number(ts / 1000000n);
  const date = new Date(ms);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function dateToTimestamp(date) {
  return BigInt(date.getTime()) * 1000000n;
}
function parseDZD(input) {
  const cleaned = input.replace(/\s/g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num)) return 0n;
  return BigInt(Math.round(num * 100));
}
function formatFactureStatut(statut) {
  const labels = {
    Brouillon: "Brouillon",
    Validee: "Validée",
    Payee: "Payée",
    Annulee: "Annulée"
  };
  return labels[statut] ?? statut;
}
function currentExercice() {
  return BigInt((/* @__PURE__ */ new Date()).getFullYear());
}
export {
  formatDate as a,
  formatAmount as b,
  currentExercice as c,
  dateToTimestamp as d,
  formatFactureStatut as e,
  formatDZD as f,
  parseDZD as p
};
