import { simpleGit } from "simple-git";

const git = simpleGit();

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

export async function getFileHistory(
  filePath: string
): Promise<Commit[]> {
  const log = await git.log({
    file: filePath,
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
  const fileContents = await git.show([`HEAD:${filePath}`]);
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
    filePath,
  ]);

  const lines = output.split("\n");

  // First line contains:
  // <commit-hash> <original-line> <final-line> <num-lines>
  const firstLine = lines[0].trim();
  const hash = firstLine.split(/\s+/)[0];

  const authorLine = lines.find((line) => line.startsWith("author "));
  const authorTimeLine = lines.find((line) =>
    line.startsWith("author-time ")
  );
  const summaryLine = lines.find((line) =>
    line.startsWith("summary ")
  );

  // The actual source code line starts with a tab.
  const sourceLine = lines.find((line) => line.startsWith("\t"));

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