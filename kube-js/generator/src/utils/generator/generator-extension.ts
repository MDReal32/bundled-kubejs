import simpleGit from "simple-git";

import { type GitOptions } from "../../types/commands/git-options";
import { type YarnOptions } from "../../types/commands/yarn";
import { LogActions, LogPostActions } from "../logger/log-actions";
import { Logger } from "../logger/logger";
import { Yarn } from "./pm/yarn";

@LogActions("GeneratorExtension")
export class GeneratorExtension {
  private declare logger: Logger;

  @LogPostActions("Git")
  async setupGit(options: GitOptions) {
    const git = simpleGit(options.cwd, {});
    await git.init();

    if (options.gitRepo) {
      this.logger.info(`Fetching remote ${options.gitRepo}`);
      await git.addRemote("origin", options.gitRepo);
      await git.fetch();
    } else {
      this.logger.warn("No git repo provided, skipping remote setup");
    }

    return async () => {
      if (options.username && options.email) {
        this.logger.info(`Setting up git user ${options.username} <${options.email}>`);
        await git.addConfig("user.name", options.username);
        await git.addConfig("user.email", options.email);

        this.logger.info(`Committing`);
        await git.add(".");
        await git.commit("Initial commit");
        if (options.gitRepo) {
          this.logger.info(`Pushing to remote`);
          await git.push("origin", "master");
        }
      }
    };
  }

  @LogPostActions("Yarn")
  async setupYarn(options: YarnOptions) {
    const yarn = new Yarn();
    await yarn.init(options);
    await yarn.set.version(options);

    return async () => {
      await yarn.install(options);
    };
  }
}
