import { execSync } from 'node:child_process';
import { input, password } from '@inquirer/prompts';

/**
 * Attempt to get GitHub token from `gh` CLI auth.
 * Returns the token string or null if gh is not available/authenticated.
 */
function getTokenFromGhCli(): string | null {
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (token) {
      return token;
    }
  } catch {
    // gh CLI not installed or not authenticated
  }
  return null;
}

/**
 * Prompt user to input a GitHub Personal Access Token.
 */
async function promptForToken(): Promise<string> {
  const token = await password({
    message: 'Enter your GitHub Personal Access Token (PAT):',
    mask: '*',
  });

  if (!token || token.trim().length === 0) {
    throw new Error('Token cannot be empty.');
  }

  return token.trim();
}

/**
 * Authenticate with GitHub.
 * 1. Try gh CLI auth first
 * 2. If not available, prompt for PAT
 */
export async function authenticate(): Promise<string> {
  console.log('Authenticating with GitHub...\n');

  // Try gh CLI first
  const ghToken = getTokenFromGhCli();
  if (ghToken) {
    console.log('Authenticated via GitHub CLI (gh).\n');
    return ghToken;
  }

  // Fallback to interactive PAT prompt
  console.log('GitHub CLI not found or not authenticated.');
  console.log('Please provide a Personal Access Token with "repo" scope.\n');

  const token = await promptForToken();
  return token;
}
