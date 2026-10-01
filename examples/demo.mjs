// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { assessClimateScenario } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "exemple-1",
  "text": "École orientée plein sud, sans protections solaires extérieures, étudiée sous le scénario France à +4 °C.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "priority_heat", probabilities: {
  "priority_heat": 0.82,
  "priority_water": 0.06,
  "multi_hazard": 0.06,
  "insufficient_data": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await assessClimateScenario(dossier, provider);
assert.equal(résultat.decision, "priority_heat");
assert.equal(résultat.review, false);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
