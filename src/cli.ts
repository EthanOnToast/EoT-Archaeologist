import { Command } from "commander";

const program = new Command();

program
  .name("pr-archaeologist")
  .description("Understand why your code exists.")
  .version("0.1.0");

program
  .command("explain")
  .description("Investigate the history of a file")
  .argument("<file>", "File to investigate")
  .action((file: string) => {
    console.log(`🕵️ Investigating: ${file}`);
  });

program.parse();