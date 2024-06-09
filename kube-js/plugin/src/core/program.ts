import { Args } from "../types/args";
import { Vite } from "./vite";

export class Program<TArgs extends Args> {
  private readonly vite;

  constructor(public args: TArgs) {
    this.vite = new Vite(args);
  }

  execute() {
    if (this.args.watch) {
      return this.vite.watch();
    } else {
      return this.vite.build();
    }
  }
}
