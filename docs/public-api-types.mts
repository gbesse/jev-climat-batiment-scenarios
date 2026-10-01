// Objectif : vérifier que les types publics sont importables.
import { buildingClimateCase, assessClimateScenario } from "../src/index.mjs";
const dossier = buildingClimateCase({
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
});
void assessClimateScenario(dossier, { decide: async () => ({}) });
