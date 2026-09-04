import { simpleGit } from "simple-git";
const git = simpleGit();
export async function getFileHistory(filePath) {
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
