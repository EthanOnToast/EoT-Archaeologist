import { Command } from "commander";
import chalk from "chalk";
import { getFileHistory } from "./git.js";

const program = new Command();

program
  .name("eot-archaeologist")
  .description("Dig through your codebase and discover why things exist.")
  .version("0.1.0");

program
  .command("explain")
  .description("Investigate the history of a file")
  .argument("<file>", "File to investigate")
  .action(async (file: string) => {
    console.log();
    console.log(chalk.bold("🕵️ EoT ARCHAEOLOGIST"));
    console.log("────────────────────────────────────");
    console.log();
    console.log(chalk.bold(`File: ${file}`));
    console.log();

    try {
      const commits = await getFileHistory(file);

      if (commits.length === 0) {
        console.log(chalk.yellow("No Git history found."));
        return;
      }

      console.log(chalk.bold("📜 HISTORY"));
      console.log();

      for (const commit of commits.slice(0, 10)) {
        console.log(
          `${chalk.gray(commit.hash.substring(0, 8))} ` +
          `${commit.date.substring(0, 10)} ` +
          `${commit.author}`
        );

        console.log(`  ${commit.message}`);
        console.log();
      }

      console.log(
        chalk.gray(`Showing ${Math.min(commits.length, 10)} commits.`)
      );
    } catch (error) {
      console.error();
      console.error(chalk.red("Could not inspect this file."));
      console.error(
        chalk.gray(
          "Make sure you're running the command inside a Git repository."
        )
      );
    }
  });

program.parseAsync();