import { SimVariables } from "../lib/commandMap.js";

export type SessionState = Partial<Record<SimVariables, number>>;
export const sessionState: SessionState = {};