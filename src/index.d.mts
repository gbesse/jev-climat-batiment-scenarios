// Objectif : décrire les types de l’API métier publique.
import type { JevProvider } from "./jev.mjs";
export type SourceRecord = { id: string; text: string; source: { url: string; date: string }; [key: string]: unknown };
export const DECISIONS: Readonly<Record<string, string>>;
export function buildingClimateCase(input: any): SourceRecord;
export function assessClimateScenario(input: any, provider: JevProvider): Promise<any>;
export function runCli(argv: string[], io?: { log(value: string): void }): Promise<void>;
