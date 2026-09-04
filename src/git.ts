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