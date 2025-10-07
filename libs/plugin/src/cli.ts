import { resolve } from "node:path";

import _ from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import pkg from "../package.json" with { type: "json" };
import { Program } from "./core/program";

export const cli = async (argv = hideBin(process.argv)) => {
  await yargs(argv)
    .command(
      "build",
      "Build the project",
      yargs =>
        yargs
          .option("root", { alias: "r", type: "string" })
          .option("watch", { alias: "w", type: "boolean", default: false }),
      async argv => {
        argv.root = argv.root ? resolve(process.cwd(), argv.root) : process.cwd();
        const program = new Program(_.omit(argv, ["_", "$0"]));
        await program.execute();
      }
    )
    .command(
      "pack",
      "Pack the project for distribution",
      async argv =>
        argv
          // .option("publish", { alias: "p", type: "boolean", default: false })
          .option("outfile", { alias: "o", type: "string" })
          .option("outdir", { alias: "d", type: "string" }),
      async argv => {
        const program = new Program(_.omit(argv, ["_", "$0"]));
        await program.pack({ outfile: argv.outfile, outdir: argv.outdir });
      }
    )
    .scriptName("kubejs")
    .strict()
    .strictOptions()
    .strictCommands()
    .help()
    .version(pkg.version)
    .demandCommand(1, "You need to call one of the given commands or options.")
    .parse();
};

await cli();
