#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const agentPath = path.join(__dirname, "cupid.agent.md");

// 1. Capture the two remote repositories from the command line
const repoA = process.argv[2];
const repoB = process.argv[3];

if (!repoA || !repoB) {
  console.error("💔 Cupid needs two to tango!");
  console.error("Usage: node index.js <ownerA/repoA> <ownerB/repoB>");
  console.error(
    "Example: node index.js dev-jash15/codebase-cartographer torvalds/linux",
  );
  process.exit(1);
}

// 2. Helper function to aggressively use the 'gh' CLI for remote fetching
function fetchRemoteRepoData(repoTarget) {
  try {
    console.log(`🔍 Scanning ${repoTarget}...`);
    // We only fetch high-level stats to keep the prompt incredibly fast and token-light
    const buffer = execSync(
      `gh repo view ${repoTarget} --json name,description,stargazerCount,primaryLanguage,languages`,
      { stdio: "pipe" },
    );
    const data = JSON.parse(buffer.toString());

    return {
      name: data.name || repoTarget,
      description:
        data.description || "A mysterious codebase with no description.",
      stars: data.stargazerCount || 0,
      primaryLanguage: data.primaryLanguage?.name || "Unknown",
      allLanguages: data.languages
        ? data.languages.map((l) => l.node?.name || l.name)
        : [],
    };
  } catch (error) {
    console.error(
      `\n💔 Failed to fetch data for ${repoTarget}. Are you sure it's public and spelled correctly?`,
    );
    process.exit(1);
  }
}

// Set up our drop-and-clean sandbox bypass
const targetDir = process.cwd();
const localAgentPath = path.join(targetDir, ".cupid.agent.md");
const localDnaPath = path.join(targetDir, ".temp-dna.json");

try {
  console.log("💘 Cupid is stringing its bow...\n");

  // 3. Fetch data for BOTH repositories
  const dataA = fetchRemoteRepoData(repoA);
  const dataB = fetchRemoteRepoData(repoB);

  const combinedDNA = {
    partnerA: dataA,
    partnerB: dataB,
  };

  // 4. Sneak the files into the working directory
  fs.copyFileSync(agentPath, localAgentPath);
  fs.writeFileSync(localDnaPath, JSON.stringify(combinedDNA));

  console.log(
    "\n💌 Match calculated! Writing the compatibility report to a file...\n",
  );

  // 5. Instruct Copilot to analyze the relationship
  const prompt = `Act strictly as the agent defined in @.cupid.agent.md. Analyze the relationship between Partner A and Partner B found in @.temp-dna.json. Generate the Compatibility Report and a Love Letter from Partner A directly to Partner B.`;

  // 6. Execute the CLI and capture the output
  const rawOutput = execSync(`copilot -p "${prompt}"`, {
    stdio: "pipe",
  }).toString();

  // 7. Clean up the output: Remove footer telemetry AND the AI's "thinking" preamble
  let cleanOutput = rawOutput.split("Total usage est:")[0]; // Strip the bottom metrics

  // Find where the actual Markdown report starts (looking for '---' or '# ' at the start of a line)
  const startMatch = cleanOutput.match(/^(---|# )/m);
  if (startMatch) {
    // Slice off everything before the match
    cleanOutput = cleanOutput.substring(startMatch.index).trim();
  } else {
    cleanOutput = cleanOutput.trim(); // Fallback just in case
  }

  // 8. Generate a dynamic filename and write the Markdown file
  const safeNameA = repoA.split("/").pop();
  const safeNameB = repoB.split("/").pop();
  const fileName = `CupidMatch-${safeNameA}-${safeNameB}.md`;

  fs.writeFileSync(fileName, cleanOutput);
} catch (error) {
  console.error("\n💔 Cupid's arrow missed! Something went wrong.");
  console.error("\n--- 🛠️ DEBUG INFO ---");
  console.error(error.message);
  if (error.stderr) console.error(error.stderr.toString());
  console.error("----------------------\n");
} finally {
  // 9. ALWAYS CLEAN UP
  if (fs.existsSync(localAgentPath)) fs.unlinkSync(localAgentPath);
  if (fs.existsSync(localDnaPath)) fs.unlinkSync(localDnaPath);
}
