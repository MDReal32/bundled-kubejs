import _ from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { Program } from "./core/program";

export const cli = async (argv = hideBin(process.argv)) => {
  await yargs(argv)
    .command(
      "build",
      "Build the project",
      yargs => yargs.option("watch", { alias: "w", type: "boolean", default: false }),
      async argv => {
        const program = new Program(_.omit(argv, ["_", "$0"]));
        await program.execute();
      }
    )
    .command(
      "pack",
      "Pack the project for distribution",
      async argv =>
        argv
          .option("publish", { alias: "p", type: "boolean", default: false })
          .option("outfile", { alias: "o", type: "string" })
          .option("outdir", { alias: "d", type: "string" }),
      async argv => {
        const program = new Program(_.omit(argv, ["_", "$0"]));
        await program.pack({ outfile: argv.outfile, outdir: argv.outdir });
      }
    )
    .parse();
};
