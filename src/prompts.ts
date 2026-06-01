import { select, checkbox, confirm } from '@inquirer/prompts';
import type { GitHubRepo, TargetVisibility } from './types.js';

/**
 * Prompt user to select target visibility direction.
 */
export async function promptTargetVisibility(): Promise<TargetVisibility> {
  const target = await select({
    message: 'What visibility do you want to set for selected repos?',
    choices: [
      { name: 'private (hide repos)', value: 'private' as const },
      { name: 'public (expose repos)', value: 'public' as const },
    ],
  });

  return target;
}

/**
 * Prompt user to select which repos to change.
 * Only shows repos that have a different visibility than the target.
 */
export async function promptSelectRepos(
  repos: GitHubRepo[],
  targetVisibility: TargetVisibility
): Promise<GitHubRepo[]> {
  // Filter repos that are NOT already the target visibility
  const eligibleRepos = repos.filter(
    (repo) => repo.visibility !== targetVisibility
  );

  if (eligibleRepos.length === 0) {
    console.log(
      `\nNo repos found that can be changed to "${targetVisibility}". All repos already have that visibility.\n`
    );
    return [];
  }

  const currentVisibility = targetVisibility === 'private' ? 'public' : 'private';
  console.log(
    `\nShowing ${eligibleRepos.length} ${currentVisibility} repos that can be made ${targetVisibility}:\n`
  );

  const selected = await checkbox({
    message: `Select repos to make ${targetVisibility}:`,
    choices: eligibleRepos.map((repo) => ({
      name: `${repo.full_name} [${repo.visibility}]`,
      value: repo,
    })),
    pageSize: 20,
    theme: {
      icon: {
        checked: '[x]',
        unchecked: '[ ]',
        cursor: '>',
      },
    },
  });

  return selected;
}

/**
 * Prompt user to confirm the visibility change.
 */
export async function promptConfirmChange(
  repos: GitHubRepo[],
  targetVisibility: TargetVisibility
): Promise<boolean> {
  console.log(`\nYou are about to change ${repos.length} repo(s) to "${targetVisibility}":`);
  for (const repo of repos) {
    console.log(`  - ${repo.full_name}`);
  }
  console.log('');

  const confirmed = await confirm({
    message: 'Are you sure you want to proceed?',
    default: false,
  });

  return confirmed;
}
