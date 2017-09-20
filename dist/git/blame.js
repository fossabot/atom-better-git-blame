'use babel';
import runGitCommand from './runCommand';
import findRepoRoot from './findRepoRoot';
import path from 'path';
async function blame(filePath) {
    let repoRoot = findRepoRoot(filePath);
    if (!repoRoot) {
        throw new Error('File does not exist inside a git repo');
    }
    const relPath = path.relative(repoRoot, filePath);
    return runGitCommand(repoRoot, `blame --show-number --show-name -l --root ${relPath}`);
}
export default blame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvZ2l0L2JsYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQztBQUVaLE9BQU8sYUFBYSxNQUFNLGNBQWMsQ0FBQztBQUN6QyxPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFFeEIsS0FBSyxnQkFBZ0IsUUFBUTtJQUMzQixJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRCxNQUFNLENBQUMsYUFBYSxDQUNsQixRQUFRLEVBQ1IsNkNBQTZDLE9BQU8sRUFBRSxDQUN2RCxDQUFDO0FBQ0osQ0FBQztBQUVELGVBQWUsS0FBSyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBydW5HaXRDb21tYW5kIGZyb20gJy4vcnVuQ29tbWFuZCc7XG5pbXBvcnQgZmluZFJlcG9Sb290IGZyb20gJy4vZmluZFJlcG9Sb290JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5hc3luYyBmdW5jdGlvbiBibGFtZShmaWxlUGF0aCkge1xuICBsZXQgcmVwb1Jvb3QgPSBmaW5kUmVwb1Jvb3QoZmlsZVBhdGgpO1xuICBpZiAoIXJlcG9Sb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIGRvZXMgbm90IGV4aXN0IGluc2lkZSBhIGdpdCByZXBvJyk7XG4gIH1cbiAgY29uc3QgcmVsUGF0aCA9IHBhdGgucmVsYXRpdmUocmVwb1Jvb3QsIGZpbGVQYXRoKTtcbiAgcmV0dXJuIHJ1bkdpdENvbW1hbmQoXG4gICAgcmVwb1Jvb3QsXG4gICAgYGJsYW1lIC0tc2hvdy1udW1iZXIgLS1zaG93LW5hbWUgLWwgLS1yb290ICR7cmVsUGF0aH1gXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJsYW1lO1xuIl19