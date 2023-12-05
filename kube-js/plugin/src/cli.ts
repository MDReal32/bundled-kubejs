import _ from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { Program } from "./core/program";

export const cli = async (argv = hideBin(process.argv)) => {
  const parsedArgs = await yargs(argv)
    .command("build", "Build the project", yargs =>
      yargs.option("watch", { alias: "w", type: "boolean" })
    )
    .parse();

  const program = new Program(
    parsedArgs._[0],
    parsedArgs._.slice(1),
    _.omit(parsedArgs, ["_", "$0"])
  );
  await program.execute();
};
