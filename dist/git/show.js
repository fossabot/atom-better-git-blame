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
        return runGitCommand(repoRoot, `show --format==@COMMIT@=%n%H%n%ce%n%cn%n%B --shortstat ${hashes.join(' ')}`);
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
                let commit = {
                    hash: lines.shift(),
                    email: lines.shift(),
                    author: lines.shift(),
                    subject: lines.shift(),
                    message: lines.join('\n').trim(),
                    filesChanged: 0,
                    insertions: 0,
                    deletions: 0,
                };
                if (matchedStats) {
                    commit.filesChanged = matchedStats[1] || 0;
                    commit.insertions = matchedStats[2] || 0;
                    commit.deletions = matchedStats[3] || 0;
                }
                parsedCommits.push(commit);
            }
            return parsedCommits;
        });
        return [].concat.apply([], parsed);
    });
}
export default show;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9naXQvc2hvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7QUFFWixPQUFPLGFBQWEsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUN2QixPQUFPLEtBQUssYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRWxELE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDbEMsS0FBSyxlQUFlLFFBQVEsRUFBRSxNQUFNO0lBQ2xDLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUMvRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDckIsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoQixZQUFZLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDO0lBQzFELE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTTtRQUN2QyxNQUFNLENBQUMsYUFBYSxDQUNsQixRQUFRLEVBQ1IsMERBQTBELE1BQU0sQ0FBQyxJQUFJLENBQ25FLEdBQUcsQ0FDSixFQUFFLENBQ0osQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDdkMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQy9CLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0MsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN2QixHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxNQUFNLEdBQUc7b0JBQ1gsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7b0JBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFO29CQUNwQixNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7b0JBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtvQkFDaEMsWUFBWSxFQUFFLENBQUM7b0JBQ2YsVUFBVSxFQUFFLENBQUM7b0JBQ2IsU0FBUyxFQUFFLENBQUM7aUJBQ2IsQ0FBQztnQkFDRixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNqQixNQUFNLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDekMsTUFBTSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxDQUFDO2dCQUNELGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUNELE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGVBQWUsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBydW5HaXRDb21tYW5kIGZyb20gJy4vcnVuQ29tbWFuZCc7XG5pbXBvcnQgZmluZFJlcG9Sb290IGZyb20gJy4vZmluZFJlcG9Sb290JztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgQ29uZmlnTWFuYWdlciBmcm9tICcuLi9Db25maWdNYW5hZ2VyJztcblxuY29uc3QgY3B1Q291bnQgPSBvcy5jcHVzKCkubGVuZ3RoO1xuYXN5bmMgZnVuY3Rpb24gc2hvdyhmaWxlUGF0aCwgaGFzaGVzKSB7XG4gIGNvbnN0IHVzZVBhcmFsbGVsID0gQ29uZmlnTWFuYWdlci5nZXQoJ3BhcmFsbGVsR2l0UHJvY2Vzc2luZycpO1xuICBsZXQgcHJvY2Vzc0NvdW50ID0gMTtcbiAgaWYgKHVzZVBhcmFsbGVsKSB7XG4gICAgcHJvY2Vzc0NvdW50ID0gY3B1Q291bnQgLyAyO1xuICB9XG5cbiAgbGV0IHJlcG9Sb290ID0gZmluZFJlcG9Sb290KGZpbGVQYXRoKTtcbiAgaWYgKCFyZXBvUm9vdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBkb2VzIG5vdCBleGlzdCBpbnNpZGUgYSBnaXQgcmVwbycpO1xuICB9XG4gIGNvbnN0IGNodW5rU2l6ZSA9IE1hdGguY2VpbChoYXNoZXMubGVuZ3RoIC8gcHJvY2Vzc0NvdW50KTtcbiAgY29uc3QgY2h1bmtlZEhhc2hlcyA9IF8uY2h1bmsoaGFzaGVzLCBjaHVua1NpemUpO1xuICBjb25zdCBwcm9taXNlcyA9IGNodW5rZWRIYXNoZXMubWFwKGhhc2hlcyA9PiB7XG4gICAgcmV0dXJuIHJ1bkdpdENvbW1hbmQoXG4gICAgICByZXBvUm9vdCxcbiAgICAgIGBzaG93IC0tZm9ybWF0PT1AQ09NTUlUQD0lbiVIJW4lY2UlbiVjbiVuJUIgLS1zaG9ydHN0YXQgJHtoYXNoZXMuam9pbihcbiAgICAgICAgJyAnXG4gICAgICApfWBcbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgY29uc3QgcGFyc2VkID0gcmVzdWx0cy5tYXAocmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IGNvbW1pdHMgPSByZXN1bHQuc3BsaXQoJz1AQ09NTUlUQD0nKTtcbiAgICAgIGNvbW1pdHMuc2hpZnQoKTtcbiAgICAgIGxldCBwYXJzZWRDb21taXRzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGkgaW4gY29tbWl0cykge1xuICAgICAgICBjb25zdCBsaW5lcyA9IGNvbW1pdHNbaV0udHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgY29uc3Qgc3RhdHMgPSBsaW5lcy5wb3AoKTtcbiAgICAgICAgY29uc3QgbWF0Y2hlZFN0YXRzID0gc3RhdHMubWF0Y2goL1xcRCsoXFxkKylcXEQrKFxcZCspP1xcRCsoXFxkKyk/Lyk7XG4gICAgICAgIGxldCBjb21taXQgPSB7XG4gICAgICAgICAgaGFzaDogbGluZXMuc2hpZnQoKSxcbiAgICAgICAgICBlbWFpbDogbGluZXMuc2hpZnQoKSxcbiAgICAgICAgICBhdXRob3I6IGxpbmVzLnNoaWZ0KCksXG4gICAgICAgICAgc3ViamVjdDogbGluZXMuc2hpZnQoKSxcbiAgICAgICAgICBtZXNzYWdlOiBsaW5lcy5qb2luKCdcXG4nKS50cmltKCksXG4gICAgICAgICAgZmlsZXNDaGFuZ2VkOiAwLFxuICAgICAgICAgIGluc2VydGlvbnM6IDAsXG4gICAgICAgICAgZGVsZXRpb25zOiAwLFxuICAgICAgICB9O1xuICAgICAgICBpZiAobWF0Y2hlZFN0YXRzKSB7XG4gICAgICAgICAgY29tbWl0LmZpbGVzQ2hhbmdlZCA9IG1hdGNoZWRTdGF0c1sxXSB8fCAwO1xuICAgICAgICAgIGNvbW1pdC5pbnNlcnRpb25zID0gbWF0Y2hlZFN0YXRzWzJdIHx8IDA7XG4gICAgICAgICAgY29tbWl0LmRlbGV0aW9ucyA9IG1hdGNoZWRTdGF0c1szXSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHBhcnNlZENvbW1pdHMucHVzaChjb21taXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlZENvbW1pdHM7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSwgcGFyc2VkKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNob3c7XG4iXX0=