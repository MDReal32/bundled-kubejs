import simpleGit from "simple-git";

import { LogActions, Logger } from "@kubejs/core";

import { type GitOptions } from "../../types/commands/git-options";

@LogActions("GeneratorExtension")
export class GeneratorExtension {
  private declare logger: Logger;

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
    } else {
      this.logger.warn("No git user provided, skipping commit stage");
    }
  }
}
