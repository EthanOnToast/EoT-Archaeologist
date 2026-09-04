import { Command } from "commander";
import chalk from "chalk";
import {
  getFileHistory,
  blameLine,
  getCommitDetails,
  getCommitDiff,
} from "./git.js";

const program = new Command();

program
  .name("eot-archaeologist")
  .description("Dig through your codebase and discover why things exist")
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

    const match = file.match(/^(.+):(\d+)$/);

    try {
      if (match) {
        const filePath = match[1];
        const lineNumber = Number(match[2]);

        console.log(
          chalk.bold(
            `Investigating line ${lineNumber} of ${filePath}`
          )
        );
        console.log();

        const result = await blameLine(filePath, lineNumber);

        console.log(chalk.bold("🔎 LINE ORIGIN"));
        console.log();
        console.log(`Commit:  ${result.hash}`);
        console.log(`Author:  ${result.author}`);
        console.log(`Date:    ${result.date}`);
        console.log(`Message: ${result.message}`);
        console.log();
        console.log(`Code:    ${result.line}`);

        const details = await getCommitDetails(
          filePath,
          result.hash
        );

        console.log();
        console.log(chalk.bold("📂 FILES CHANGED"));
        console.log();

        for (const changedFile of details.files) {
          console.log(`  ${changedFile}`);
        }

        const diff = await getCommitDiff(filePath, result.hash);

        console.log();
        console.log(chalk.bold("📝 COMMIT DIFF"));
        console.log();

        if (diff.trim()) {
        for (const line of diff.split("\n")) {
        if (line.startsWith("+")) {
            console.log(chalk.green(line));
        } else if (line.startsWith("-")) {
            console.log(chalk.red(line));
        } else if (line.startsWith("@@")) {
            console.log(chalk.cyan(line));
        } else {
            console.log(chalk.gray(line));
        }
        }
        } else {
        console.log(chalk.gray("No diff available for this file."));
        }

      } else {
        console.log(chalk.bold(`File: ${file}`));
        console.log();

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
          chalk.gray(
            `Showing ${Math.min(commits.length, 10)} commits.`
          )
        );
      }
    } catch (error) {
      console.error();
      console.error(
        chalk.red("❌ Could not investigate this code.")
      );
      console.error();
      console.error(
        chalk.yellow(String(error))
      );
    }
  });

program.parseAsync();