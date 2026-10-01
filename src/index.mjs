// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";
export const DECISIONS = Object.freeze({
  "priority_heat": "priorité_chaleur",
  "priority_water": "priorité_eau",
  "multi_hazard": "risques_multiples",
  "insufficient_data": "données_insuffisantes"
});
const CRITERIA = Object.freeze({
  "priority_heat": "priorité chaleur",
  "priority_water": "priorité eau",
  "multi_hazard": "risques multiples",
  "insufficient_data": "données insuffisantes"
});
export function buildingClimateCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}
export async function assessClimateScenario(input, provider) {
  const record = buildingClimateCase(input);
  if (record.horizon === null) return { decision: "insufficient_data", label: DECISIONS["insufficient_data"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce scénario bâtiment-climat à partir des seuls éléments sourcés. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni droit applicable, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}
export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-climat-batiment-scenarios <dossier.json>");
  const dossier = buildingClimateCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier, prochaineÉtape: "Transmettez ce dossier à assessClimateScenario avec un fournisseur Jev configuré." }, null, 2));
}
