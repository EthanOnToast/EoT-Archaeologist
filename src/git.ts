import { simpleGit, type SimpleGit, type DefaultLogFields } from "simple-git";
import path from "node:path";
import { realpath } from "node:fs/promises";

async function getGitForFile(filePath: string): Promise<{
  git: SimpleGit;
  relativePath: string;
}> {
  const absolutePath = await realpath(filePath);
  const directory = path.dirname(absolutePath);

  const git = simpleGit(directory);

  const root = (
    await git.revparse(["--show-toplevel"])
  ).trim();

  const relativePath = path.relative(root, absolutePath);

  return {
    git: simpleGit(root),
    relativePath,
  };
}

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

export async function getFileHistory(
  filePath: string
): Promise<Commit[]> {
  const { git, relativePath } = await getGitForFile(filePath);

  const log = await git.log<DefaultLogFields>({
    file: relativePath,
  });

  return log.all.map((commit) => ({
    hash: commit.hash,
    author: commit.author_name,
    date: commit.date,
    message: commit.message,
  }));
}

export interface BlameResult {
  hash: string;
  author: string;
  date: string;
  message: string;
  line: string;
}

export async function blameLine(
  filePath: string,
  lineNumber: number
): Promise<BlameResult> {
  const { git, relativePath } = await getGitForFile(filePath);

  const fileContents = await git.show([
    `HEAD:${relativePath}`,
  ]);

  const totalLines = fileContents.split("\n").length;

  if (lineNumber < 1 || lineNumber > totalLines) {
    throw new Error(
      `Invalid line number. ${filePath} only has ${totalLines} lines.`
    );
  }

  const output = await git.raw([
    "blame",
    "--porcelain",
    "-L",
    `${lineNumber},${lineNumber}`,
    "--",
    relativePath,
  ]);

  const lines: string[] = output.split("\n");

  const firstLine = lines[0].trim();
  const hash = firstLine.split(/\s+/)[0];

  const authorLine = lines.find((line: string) =>
    line.startsWith("author ")
  );

  const authorTimeLine = lines.find((line: string) =>
    line.startsWith("author-time ")
  );

  const summaryLine = lines.find((line: string) =>
    line.startsWith("summary ")
  );

  const sourceLine = lines.find((line: string) =>
    line.startsWith("\t")
  );

  if (!hash || !authorLine || !authorTimeLine || !summaryLine) {
    throw new Error("Could not parse Git blame information.");
  }

  const author = authorLine.substring("author ".length);

  const timestamp = Number(
    authorTimeLine.substring("author-time ".length)
  );

  const date = new Date(timestamp * 1000).toISOString();

  const message = summaryLine.substring("summary ".length);

  return {
    hash,
    author,
    date,
    message,
    line: sourceLine?.substring(1) ?? "",
  };
}

export interface CommitDetails {
  hash: string;
  author: string;
  date: string;
  message: string;
  files: string[];
}

export async function getCommitDetails(
  filePath: string,
  hash: string
): Promise<CommitDetails> {
  const { git } = await getGitForFile(filePath);

  const output = await git.raw([
    "show",
    "--format=%H%n%an%n%ad%n%s",
    "--name-only",
    "--no-renames",
    hash,
  ]);

  const lines: string[] = output.trim().split("\n");

  const commitHash = lines[0];
  const author = lines[1];
  const date = lines[2];
  const message = lines[3];

  const files = lines
    .slice(4)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0);

  return {
    hash: commitHash,
    author,
    date,
    message,
    files,
  };
}

export async function getCommitDiff(
  filePath: string,
  hash: string
): Promise<string> {
  const { git, relativePath } = await getGitForFile(filePath);

  const output = await git.raw([
    "show",
    "--format=",
    "--no-ext-diff",
    "--unified=3",
    hash,
    "--",
    relativePath,
  ]);

  const usefulLines = output
    .split("\n")
    .filter((line) => {
      if (line.startsWith("diff --git")) return false;
      if (line.startsWith("index ")) return false;
      if (line.startsWith("new file mode")) return false;
      if (line.startsWith("deleted file mode")) return false;
      if (line.startsWith("--- ")) return false;
      if (line.startsWith("+++ ")) return false;

      return true;
    });

  return usefulLines.join("\n").trim();
}