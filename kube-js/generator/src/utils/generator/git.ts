import { CommandExecutor } from "../command-executor";
import { LogPostActions } from "../logger/log-actions";

@LogPostActions("Git")
export class Git extends CommandExecutor {
  constructor() {
    super("git");
  }
}
