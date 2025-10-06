import { CommandExecutor } from "../command/command-executor";

export class Git extends CommandExecutor {
  constructor() {
    super("git");
  }
}
