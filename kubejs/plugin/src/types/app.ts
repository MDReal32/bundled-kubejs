import { AppState } from "./app-states";

export interface App {
  state: AppState;
  transformedModules: number;
}
