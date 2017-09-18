'use babel';

import * as uuid from 'uuid';
import * as https from 'https';
import childProcess from 'child_process';
import IRange = TextBuffer.IRange;

class StepsizeHelper {
  public static rangesToSelectedLineNumbers(ranges: Array<IRange>) {
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

  public static async fetchIntegrationData(
    repoMetadata,
    commitHashes
  ): Promise<any> {
    const payload = {
      searchId: uuid.v4(),
      repoName: repoMetadata.repoName,
      repoOwner: repoMetadata.repoOwner,
      repoSource: repoMetadata.repoSource,
      commitHashes,
    };
    return new Promise((resolve, reject) => {
      let responseData = '';
      const req = https.request(
        {
          hostname: 'development-stable-layer.stepsize.com',
          path: '/augment-code-search-results',
          method: 'POST',
          headers: {
            'User-Agent': 'Layer-Client',
            'Content-Type': 'application/json',
          },
        },
        function(response) {
          let code = response.statusCode;
          response.on('data', function(chunk) {
            responseData += chunk;
          });
          response.on('end', function() {
            if (code < 400) {
              resolve(JSON.parse(responseData));
            } else {
              reject(responseData);
            }
          });
        }
      );
      req.on('error', function(error) {
        reject(error.message);
      });
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  public static checkLayerInstallation(){
    return new Promise((resolve, reject) => {
      childProcess.exec('ls | grep \'Layer.app\'', {cwd: '/Applications'}, (err) => {
        if(err) {
          return reject(new Error('Could not detect Layer installation'))
        }
        resolve();
      })
    })
  }

}

export default StepsizeHelper;
