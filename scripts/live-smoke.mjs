// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessClimateScenario } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessClimateScenario({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
