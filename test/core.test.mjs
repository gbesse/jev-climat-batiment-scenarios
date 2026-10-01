// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { buildingClimateCase, assessClimateScenario } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "horizon": null
};
const casPrincipal = {
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
const casÀRevoir = {
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
test("exige une source", () => assert.throws(() => buildingClimateCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await assessClimateScenario(casLimite, provider)).decision, "insufficient_data");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "priority_heat", probabilities: {
  "priority_heat": 0.82,
  "priority_water": 0.06,
  "multi_hazard": 0.06,
  "insufficient_data": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await assessClimateScenario(casPrincipal, provider);
  assert.equal(résultat.decision, "priority_heat");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "multi_hazard", probabilities: {
  "priority_heat": 0.16,
  "priority_water": 0.16,
  "multi_hazard": 0.52,
  "insufficient_data": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await assessClimateScenario(casÀRevoir, provider);
  assert.equal(résultat.decision, "multi_hazard");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
