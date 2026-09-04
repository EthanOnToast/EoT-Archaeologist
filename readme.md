🕵️ EoT Archaeologist

Dig through your codebase and discover why things exist.

EoT Archaeologist is an early-stage developer tool that uses Git history
to investigate where code came from and who introduced it.

Instead of manually searching through git log and git blame, you can
ask the Archaeologist to investigate a file or a specific line.

🚧 Project status

Early development / experimental

The project currently works locally against a Git repository and can:

Inspect the history of a file

Investigate the Git commit responsible for a specific line

Show the author, date, commit message, and source line

Show files changed in the originating commit

Give a useful error when an invalid line number is requested

GitHub Pull Request / Issue context and AI-powered explanations are
planned, but are not implemented yet.

📦 Installation

For now, EoT Archaeologist is not published as an npm package.

To try it from source:

git clone https://github.com/EthanOnToast/EoT-Archaeologist.git
cd EoT-Archaeologist
npm install
npm run build

You need:

Node.js 22+

npm

Git

🔍 How to use it

Investigate a file

Run this from inside a Git repository:

npm run dev -- explain package.json

This shows the recent Git history for the file.

Example:

🕵️ EoT ARCHAEOLOGIST

File: package.json

📜 HISTORY

b958730  2026-09-04  EthanOnToast
  Improve CLI description

f0d0b3d  2026-09-04  EthanOnToast
  Initial project setup

Investigate a specific line

You can also investigate an individual line:

npm run dev -- explain src/cli.ts:12

EoT Archaeologist uses git blame to find the commit that introduced
that line.

Example:

🕵️ EoT ARCHAEOLOGIST

Investigating line 12 of src/cli.ts

🔎 LINE ORIGIN

Commit:  b958730...
Author:  EthanOnToast
Date:    2026-09-04T...
Message: Improve CLI description

Code:    .name("eot-archaeologist")

📂 FILES CHANGED

  src/cli.ts

🧪 Try it on your own repository

The easiest way to test the current version is to clone this project,
then use the CLI from another Git repository.

For example:

cd ~/Projects
git clone https://github.com/example/some-project.git
cd some-project

Then run EoT Archaeologist from its source directory:

cd /path/to/EoT-Archaeologist
npm run dev -- explain /path/to/some-project/src/example.ts:42

The file you investigate must belong to a Git repository with Git
history.

Important

The current version does not yet accept a GitHub URL such as:

https://github.com/user/project/blob/main/src/file.ts#L42

That is planned for a future version.

🧠 Why does this exist?

We've all opened an unfamiliar codebase and wondered:

Why is this here?

Who wrote this?

Why was this weird workaround added?

Can I safely remove it?

What problem was this code solving?

Git contains a surprising amount of the history needed to answer those
questions.

EoT Archaeologist is being built to turn that history into something
easier to understand.

The long-term goal is to connect:

Code
  ↓
Git blame
  ↓
Commit
  ↓
Commit diff
  ↓
GitHub Pull Request
  ↓
GitHub Issue
  ↓
Historical context
  ↓
🧠 "Why this code exists"

🗺️ Roadmap

Current

CLI

File history

Line-level investigation

Git blame integration

Commit information

Changed-file information

Invalid line handling

Next

Better commit diff analysis

Investigate files outside the current working directory

GitHub repository URL support

GitHub Pull Request detection

GitHub Issue detection

Link code to the historical problem it solved

Human-readable explanations

Optional AI-powered explanations

VS Code extension

npm package

🤝 Contributing

This project is very early, so feedback and experimentation are welcome.

If you find a bug:

Check the existing issues.

Create a new issue with:

Your OS

Node.js version

Git version

The command you ran

The error/output you received

If you have an idea for the project, open an issue and explain the
problem you think it could solve.

🛠️ Development

Install dependencies:

npm install

Build:

npm run build

Run during development:

npm run dev -- explain <file>

Example:

npm run dev -- explain src/cli.ts:12