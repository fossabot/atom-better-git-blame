'use babel';
import findRepoRoot from './findRepoRoot';
import runGitCommand from './runCommand';
async function getFirstCommitDate(filePath) {
    const repoRoot = findRepoRoot(filePath);
    try {
        const firstCommit = await runGitCommand(repoRoot, 'log --reverse --date-order --pretty=%ad | head -n 1', true);
        return new Date(firstCommit);
    }
    catch (e) {
        throw e;
    }
}
export default getFirstCommitDate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyc3RDb21taXREYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2dpdC9maXJzdENvbW1pdERhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBRVosT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxhQUFhLE1BQU0sY0FBYyxDQUFDO0FBRXpDLEtBQUssNkJBQTZCLFFBQVE7SUFDeEMsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLElBQUksQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLE1BQU0sYUFBYSxDQUNyQyxRQUFRLEVBQ1IscURBQXFELEVBQ3JELElBQUksQ0FDTCxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxDQUFDLENBQUM7SUFDVixDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZpbmRSZXBvUm9vdCBmcm9tICcuL2ZpbmRSZXBvUm9vdCc7XG5pbXBvcnQgcnVuR2l0Q29tbWFuZCBmcm9tICcuL3J1bkNvbW1hbmQnO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRGaXJzdENvbW1pdERhdGUoZmlsZVBhdGgpIHtcbiAgY29uc3QgcmVwb1Jvb3QgPSBmaW5kUmVwb1Jvb3QoZmlsZVBhdGgpO1xuICB0cnkge1xuICAgIGNvbnN0IGZpcnN0Q29tbWl0ID0gYXdhaXQgcnVuR2l0Q29tbWFuZChcbiAgICAgIHJlcG9Sb290LFxuICAgICAgJ2xvZyAtLXJldmVyc2UgLS1kYXRlLW9yZGVyIC0tcHJldHR5PSVhZCB8IGhlYWQgLW4gMScsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IERhdGUoZmlyc3RDb21taXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRGaXJzdENvbW1pdERhdGU7XG4iXX0=