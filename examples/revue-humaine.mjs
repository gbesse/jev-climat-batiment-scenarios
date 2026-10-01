// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { assessClimateScenario } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "revue-1",
  "text": "Résidence avec surchauffe estivale et jardin très minéral, mais sans zone climatique ni horizon de simulation précisés.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "multi_hazard", probabilities: {
  "priority_heat": 0.16,
  "priority_water": 0.16,
  "multi_hazard": 0.52,
  "insufficient_data": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 140, output_tokens: 0 } }));
const résultat = await assessClimateScenario(dossier, provider);
assert.equal(résultat.decision, "multi_hazard");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
