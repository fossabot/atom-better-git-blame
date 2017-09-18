'use babel';

import runGitCommand from './runCommand';
import findRepoRoot from './findRepoRoot';
import os from 'os';
import _ from 'lodash';
import * as ConfigManager from '../ConfigManager';

const cpuCount = os.cpus().length;
async function show(filePath, hashes) {
  const useParallel = ConfigManager.get('parallelGitProcessing');
  let processCount = 1;
  if (useParallel) {
    processCount = cpuCount / 2;
  }

  let repoRoot = findRepoRoot(filePath);
  if (!repoRoot) {
    throw new Error('File does not exist inside a git repo');
  }
  const chunkSize = Math.ceil(hashes.length / processCount);
  const chunkedHashes = _.chunk(hashes, chunkSize);
  const promises = chunkedHashes.map(hashes => {
    return runGitCommand(
      repoRoot,
      `show --format==@COMMIT@=%n%H%n%ce%n%cn%n%B --shortstat ${hashes.join(' ')}`
    );
  });

  return Promise.all(promises).then(results => {
    const parsed = results.map(result => {
      const commits = result.split('=@COMMIT@=');
      commits.shift();
      let parsedCommits = [];
      for (const i in commits) {
        const lines = commits[i].trim().split('\n');
        const stats = lines.pop();
        const matchedStats = stats.match(/\D+(\d+)\D+(\d+)?\D+(\d+)?/);
        parsedCommits.push({
          hash: lines.shift(),
          email: lines.shift(),
          author: lines.shift(),
          subject: lines.shift(),
          message: lines.join('\n').trim(),
          filesChanged: matchedStats[1] || 0,
          insertions: matchedStats[2] || 0,
          deletions: matchedStats[3] || 0,
        });
      }
      return parsedCommits;
    });
    return [].concat.apply([], parsed);
  });
}

export default show;
