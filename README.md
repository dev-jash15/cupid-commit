# 💘 Cupid-Commit

**Tagline:** _Find the code that completes you._

Cupid-Commit is a custom GitHub Copilot CLI extension designed to act as a "Relationship Counselor for Code." Built for the **DEV GitHub CLI Challenge**, this tool analyzes the "personality" of any two remote GitHub repositories and matches them up.

It uses the `gh` CLI to scan codebase patterns, languages, and popularity, then feeds that "DNA" into a custom GitHub Copilot Agent. The result? A beautifully formatted Markdown file containing a **Compatibility Report** and a poetic **Love Letter** from Repo A to Repo B.

## ✨ Features

- **Dynamic Remote Matching:** You don't need to clone repositories locally. Cupid fetches live metadata directly from GitHub's servers using `gh repo view`.
- **The "Personality" Engine:** The custom Copilot Agent categorizes repositories into archetypes like _The Romantic_ (descriptive, frontend), _The Stoic_ (minimalist backend), or _The Socialite_ (high stars).
- **Frictionless Output:** Automatically strips out API telemetry and saves a clean, shareable `.md` file right in your directory.

## 🛠️ Prerequisites

Because this relies on the official GitHub Copilot ecosystem, you must have the following installed and authenticated:

1. [GitHub CLI (`gh`)](https://cli.github.com/)
2. [GitHub Copilot CLI Extension](https://docs.github.com/en/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli) (`gh extension install github/gh-copilot`)

## 🚀 Setup & Installation

1. Clone this repository to your local machine:

   ```bash
   git clone [https://github.com/dev-jash15/cupid-commit.git](https://github.com/dev-jash15/cupid-commit.git)
   cd cupid-commit/gh-cupid-commit
   ```

2. Ensure you have Node.js installed.
3. Make the orchestrator script executable:

   ```bash
   chmod +x index.js
   ```

## 💖 Usage

Cupid needs two to tango! Run the script using Node, passing the owner/repo format for the two codebases you want to match:

```bash
node index.js <Repo-A> <Repo-B>
```

Example:

```bash
node index.js dev-jash15/codebase-cartographer SynkraAI/aios-core
```

**What happens under the hood?**

1. Cupid uses `gh repo view` to scrape the stats, primary languages, and descriptions of both repositories.

It temporarily drops this "DNA" alongside custom instructions (`.cupid.agent.md`) into your working directory to securely bypass the Copilot CLI programmatic sandbox.

It triggers `copilot -p`using the `@file` operator to generate the romance.

It cleans the output and saves a beautiful `CupidMatch-<repoA>-<repoB>.md` file locally.

## 📜 Example Output

Curious what it looks like? Check out the generated match between a visual charting tool and a massive AI orchestration backend:

"Python meets JavaScript - this is the classic 'thoughtful academic' meets 'energetic startup founder' dynamic. Where cartographer says 'let's trace this methodically,' AIOS says 'trust the event loop.' ... You orchestrate. I illuminate. Isn't that what love is?"
