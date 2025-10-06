import { SpawnOptions, spawn } from "node:child_process";

import { LogActions, Logger } from "@kubejs/core";

import { CommandBuilder } from "./command-builder";

@LogActions("CommandExecutor")
export class CommandExecutor {
  protected readonly commandBuilder: CommandBuilder;
  protected declare logger: Logger;

  constructor(baseCommand: string) {
    this.commandBuilder = new CommandBuilder(baseCommand);
  }

  protected exec(command: string | CommandBuilder, options?: Pick<SpawnOptions, "cwd">) {
    const [commandName, ...args] = (
      command instanceof CommandBuilder ? command.build() : command
    ).split(" ");

    this.logger.info(`>>> ${commandName} ${args.join(" ")}`);
    return new Promise<void>((resolve, reject) => {
      const child = spawn(commandName, args, {
        shell: true,
        stdio: "pipe",
        env: {},
        ...options
      });
      child.stdout.map(data => this.logger.template(data)).pipe(process.stdout);
      child.on("error", reject);
      child.on("close", resolve);
    });
  }

  protected async await(seconds: number) {
    await new Promise<void>(resolve => setTimeout(resolve, seconds * 1000));
  }
}
