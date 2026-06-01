#!/usr/bin/env node

import { Command } from 'commander';
import { authenticate } from './auth.js';
import { fetchAllRepos, changeVisibility } from './github.js';
import { promptTargetVisibility, promptSelectRepos, promptConfirmChange } from './prompts.js';

const program = new Command();

program
  .name('ghvis')
  .description('Bulk-change GitHub repository visibility (public ↔ private)')
  .version('1.0.0')
  .action(async () => {
    try {
      // 1. Authenticate
      const token = await authenticate();

      // 2. Fetch all repos
      console.log('Fetching your repositories...\n');
      const repos = await fetchAllRepos(token);

      if (repos.length === 0) {
        console.log('No repositories found with admin access.');
        process.exit(0);
      }

      console.log(`Found ${repos.length} repo(s) with admin access.\n`);

      // 3. Select target visibility
      const targetVisibility = await promptTargetVisibility();

      // 4. Select repos to change
      const selectedRepos = await promptSelectRepos(repos, targetVisibility);

      if (selectedRepos.length === 0) {
        console.log('No repos selected. Exiting.');
        process.exit(0);
      }

      // 5. Confirm
      const confirmed = await promptConfirmChange(selectedRepos, targetVisibility);

      if (!confirmed) {
        console.log('Operation cancelled.');
        process.exit(0);
      }

      // 6. Apply changes
      console.log('\nChanging visibility...\n');
      const results = await changeVisibility(token, selectedRepos, targetVisibility);

      // 7. Summary
      const successes = results.filter((r) => r.success);
      const failures = results.filter((r) => !r.success);

      console.log('--- Summary ---');
      console.log(`Success: ${successes.length}`);
      console.log(`Failed:  ${failures.length}`);

      if (successes.length > 0) {
        console.log('\nChanged successfully:');
        for (const r of successes) {
          console.log(`  ✓ ${r.repo} → ${targetVisibility}`);
        }
      }

      if (failures.length > 0) {
        console.log('\nFailed:');
        for (const r of failures) {
          console.log(`  ✗ ${r.repo} — ${r.error}`);
        }
        process.exit(1);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`\nError: ${message}`);
      process.exit(1);
    }
  });

program.parse();
