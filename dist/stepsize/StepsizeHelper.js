'use babel';
import * as uuid from 'uuid';
import * as https from 'https';
import childProcess from 'child_process';
class StepsizeHelper {
    static rangesToSelectedLineNumbers(ranges) {
        if (ranges) {
            return ranges
                .map(range => {
                let numbers = [];
                for (let i = range.start.row; i < range.end.row; i = i + 1) {
                    numbers.push(i + 1);
                }
                return numbers;
            })
                .reduce((acc, val) => {
                return acc.concat(val);
            }, []);
        }
        return [];
    }
    static async fetchIntegrationData(repoMetadata, commitHashes) {
        const payload = {
            searchId: uuid.v4(),
            repoName: repoMetadata.repoName,
            repoOwner: repoMetadata.repoOwner,
            repoSource: repoMetadata.repoSource,
            commitHashes,
        };
        return new Promise((resolve, reject) => {
            let responseData = '';
            const req = https.request({
                hostname: 'development-stable-layer.stepsize.com',
                path: '/augment-code-search-results',
                method: 'POST',
                headers: {
                    'User-Agent': 'Layer-Client',
                    'Content-Type': 'application/json',
                },
            }, function (response) {
                let code = response.statusCode;
                response.on('data', function (chunk) {
                    responseData += chunk;
                });
                response.on('end', function () {
                    if (code < 400) {
                        resolve(JSON.parse(responseData));
                    }
                    else {
                        reject(responseData);
                    }
                });
            });
            req.on('error', function (error) {
                reject(error.message);
            });
            req.write(JSON.stringify(payload));
            req.end();
        });
    }
    static checkLayerInstallation() {
        return new Promise((resolve, reject) => {
            childProcess.exec("ls | grep 'Layer.app'", { cwd: '/Applications' }, err => {
                if (err) {
                    return reject(new Error('Could not detect Layer installation'));
                }
                resolve();
            });
        });
    }
}
export default StepsizeHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RlcHNpemVIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvc3RlcHNpemUvU3RlcHNpemVIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBRVosT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBR3pDO0lBQ1MsTUFBTSxDQUFDLDJCQUEyQixDQUFDLE1BQXFCO1FBQzdELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsTUFBTTtpQkFDVixHQUFHLENBQUMsS0FBSztnQkFDUixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsQ0FBQztnQkFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztpQkFDRCxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRztnQkFDZixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDWCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUN0QyxZQUFZLEVBQ1osWUFBWTtRQUVaLE1BQU0sT0FBTyxHQUFHO1lBQ2QsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDbkIsUUFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRO1lBQy9CLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUztZQUNqQyxVQUFVLEVBQUUsWUFBWSxDQUFDLFVBQVU7WUFDbkMsWUFBWTtTQUNiLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdEIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FDdkI7Z0JBQ0UsUUFBUSxFQUFFLHVDQUF1QztnQkFDakQsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFO29CQUNQLFlBQVksRUFBRSxjQUFjO29CQUM1QixjQUFjLEVBQUUsa0JBQWtCO2lCQUNuQzthQUNGLEVBQ0QsVUFBUyxRQUFRO2dCQUNmLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQy9CLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVMsS0FBSztvQkFDaEMsWUFBWSxJQUFJLEtBQUssQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7b0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN2QixDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUNGLENBQUM7WUFDRixHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQUs7Z0JBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNuQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsc0JBQXNCO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLFlBQVksQ0FBQyxJQUFJLENBQ2YsdUJBQXVCLEVBQ3ZCLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxFQUN4QixHQUFHO2dCQUNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLENBQUM7Z0JBQ0QsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsZUFBZSxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0ICogYXMgdXVpZCBmcm9tICd1dWlkJztcbmltcG9ydCAqIGFzIGh0dHBzIGZyb20gJ2h0dHBzJztcbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgSVJhbmdlID0gVGV4dEJ1ZmZlci5JUmFuZ2U7XG5cbmNsYXNzIFN0ZXBzaXplSGVscGVyIHtcbiAgcHVibGljIHN0YXRpYyByYW5nZXNUb1NlbGVjdGVkTGluZU51bWJlcnMocmFuZ2VzOiBBcnJheTxJUmFuZ2U+KSB7XG4gICAgaWYgKHJhbmdlcykge1xuICAgICAgcmV0dXJuIHJhbmdlc1xuICAgICAgICAubWFwKHJhbmdlID0+IHtcbiAgICAgICAgICBsZXQgbnVtYmVycyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSByYW5nZS5zdGFydC5yb3c7IGkgPCByYW5nZS5lbmQucm93OyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgIG51bWJlcnMucHVzaChpICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudW1iZXJzO1xuICAgICAgICB9KVxuICAgICAgICAucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICAgIHJldHVybiBhY2MuY29uY2F0KHZhbCk7XG4gICAgICAgIH0sIFtdKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBhc3luYyBmZXRjaEludGVncmF0aW9uRGF0YShcbiAgICByZXBvTWV0YWRhdGEsXG4gICAgY29tbWl0SGFzaGVzXG4gICk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgIHNlYXJjaElkOiB1dWlkLnY0KCksXG4gICAgICByZXBvTmFtZTogcmVwb01ldGFkYXRhLnJlcG9OYW1lLFxuICAgICAgcmVwb093bmVyOiByZXBvTWV0YWRhdGEucmVwb093bmVyLFxuICAgICAgcmVwb1NvdXJjZTogcmVwb01ldGFkYXRhLnJlcG9Tb3VyY2UsXG4gICAgICBjb21taXRIYXNoZXMsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlRGF0YSA9ICcnO1xuICAgICAgY29uc3QgcmVxID0gaHR0cHMucmVxdWVzdChcbiAgICAgICAge1xuICAgICAgICAgIGhvc3RuYW1lOiAnZGV2ZWxvcG1lbnQtc3RhYmxlLWxheWVyLnN0ZXBzaXplLmNvbScsXG4gICAgICAgICAgcGF0aDogJy9hdWdtZW50LWNvZGUtc2VhcmNoLXJlc3VsdHMnLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdVc2VyLUFnZW50JzogJ0xheWVyLUNsaWVudCcsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgbGV0IGNvZGUgPSByZXNwb25zZS5zdGF0dXNDb2RlO1xuICAgICAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSArPSBjaHVuaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXNwb25zZS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29kZSA8IDQwMCkge1xuICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVzcG9uc2VEYXRhKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJlcS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICAgIHJlcS53cml0ZShKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgICByZXEuZW5kKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGNoZWNrTGF5ZXJJbnN0YWxsYXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNoaWxkUHJvY2Vzcy5leGVjKFxuICAgICAgICBcImxzIHwgZ3JlcCAnTGF5ZXIuYXBwJ1wiLFxuICAgICAgICB7IGN3ZDogJy9BcHBsaWNhdGlvbnMnIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ0NvdWxkIG5vdCBkZXRlY3QgTGF5ZXIgaW5zdGFsbGF0aW9uJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RlcHNpemVIZWxwZXI7XG4iXX0=