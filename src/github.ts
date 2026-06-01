import { Octokit } from '@octokit/rest';
import type { GitHubRepo, TargetVisibility, VisibilityChangeResult } from './types.js';

/**
 * Fetch all repositories the authenticated user has admin access to.
 * Includes personal repos and org repos.
 */
export async function fetchAllRepos(token: string): Promise<GitHubRepo[]> {
  const octokit = new Octokit({ auth: token });
  const repos: GitHubRepo[] = [];

  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.repos.listForAuthenticatedUser({
      per_page: perPage,
      page,
      affiliation: 'owner,organization_member',
      sort: 'full_name',
    });

    const adminRepos = response.data.filter(
      (repo) => repo.permissions?.admin === true
    );

    for (const repo of adminRepos) {
      repos.push({
        name: repo.name,
        full_name: repo.full_name,
        owner: { login: repo.owner.login },
        private: repo.private,
        visibility: repo.private ? 'private' : 'public',
        html_url: repo.html_url,
      });
    }

    if (response.data.length < perPage) {
      break;
    }

    page++;
  }

  return repos;
}

/**
 * Change the visibility of multiple repositories.
 */
export async function changeVisibility(
  token: string,
  repos: GitHubRepo[],
  targetVisibility: TargetVisibility
): Promise<VisibilityChangeResult[]> {
  const octokit = new Octokit({ auth: token });
  const results: VisibilityChangeResult[] = [];

  for (const repo of repos) {
    try {
      await octokit.repos.update({
        owner: repo.owner.login,
        repo: repo.name,
        visibility: targetVisibility,
      });

      results.push({
        repo: repo.full_name,
        success: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        repo: repo.full_name,
        success: false,
        error: message,
      });
    }
  }

  return results;
}
