'use babel';
import { createSocket } from 'dgram';
import fs from 'fs';
import StepsizeHelper from './StepsizeHelper';
import { version } from '../../package.json';
class StepsizeOutgoing {
    constructor() {
        this.readyTries = 1;
        // sendError - sends error message to Stepsize
        this.sendError = data => {
            let editor = atom.workspace.getActiveTextEditor();
            if (!editor) {
                return;
            }
            let event = {
                source: 'atom',
                action: 'error',
                filename: fs.realpathSync(editor.getPath()),
                selected: JSON.stringify(data),
                plugin_id: this.pluginId,
            };
            this.send(event);
        };
        this.pluginId = `atom_v${version}`;
        this.DEBUG = false;
        this.UDP_HOST = '127.0.0.1';
        this.UDP_PORT = 49369;
        this.OUTGOING_SOCK = createSocket('udp4');
        this.layerReady = false;
        this.OUTGOING_SOCK.on('message', msg => {
            const parsedMessage = JSON.parse(msg);
            if (parsedMessage.type === 'ready' && parsedMessage.source.name === 'Layer') {
                this.layerReady = true;
                this.readyTries = 1;
                if (this.cachedMessage) {
                    this.send(this.cachedMessage);
                    this.cachedMessage = null;
                }
                clearInterval(this.readyInterval);
            }
        });
    }
    checkLayerIsReady() {
        if (this.layerReady) {
            return;
        }
        this.sendReady();
        this.readyCheckTimer();
    }
    readyCheckTimer() {
        this.readyRetryTimer = 3 * (Math.pow(this.readyTries / 10, 2) + 1);
        this.readyInterval = setTimeout(() => {
            this.readyTries++;
            this.sendReady();
            this.readyCheckTimer();
        }, this.readyRetryTimer * 1000);
    }
    send(event, callback) {
        StepsizeHelper.checkLayerRunning()
            .then(() => {
            let msg = JSON.stringify(event);
            this.OUTGOING_SOCK.send(msg, 0, msg.length, this.UDP_PORT, this.UDP_HOST, callback);
        })
            .catch(() => {
            this.layerReady = false;
            if (event.type !== 'ready') {
                this.cachedMessage = event;
                this.checkLayerIsReady();
                if (callback) {
                    callback();
                }
            }
        });
    }
    sendReady() {
        const event = {
            type: 'ready',
            source: { name: 'BetterGitBlame', version: version },
        };
        this.send(event);
    }
    buildSelectionEvent(editor) {
        const ranges = editor.selections.map(selection => {
            return selection.getBufferRange();
        });
        return this.buildEvent(editor, ranges, 'selection');
    }
    buildEvent(editor, ranges, action, shouldPerformSearch = false) {
        const selectedLineNumbers = StepsizeHelper.rangesToSelectedLineNumbers(ranges);
        return {
            source: 'atom',
            action: action,
            filename: editor.getPath() || null,
            plugin_id: this.pluginId,
            selectedLineNumbers,
            shouldPerformSearch: shouldPerformSearch,
        };
    }
}
export default StepsizeOutgoing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RlcHNpemVPdXRnb2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdGVwc2l6ZS9TdGVwc2l6ZU91dGdvaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQztBQUVaLE9BQU8sRUFBVSxZQUFZLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDN0MsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sY0FBYyxNQUFNLGtCQUFrQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU3QztJQVlFO1FBSlEsZUFBVSxHQUFXLENBQUMsQ0FBQztRQW9FL0IsOENBQThDO1FBQzlDLGNBQVMsR0FBRyxJQUFJO1lBQ2QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUM7WUFDVCxDQUFDO1lBQ0QsSUFBSSxLQUFLLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsUUFBUSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUMzQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQzlCLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUTthQUN6QixDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUM7UUE3RUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLE9BQU8sRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzVCLElBQUksQ0FBQyxR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O1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBa0JELG1CQUFtQixDQUFDLE1BQU07UUFDeEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUztZQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixHQUFHLEtBQUs7UUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsMkJBQTJCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0UsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSTtZQUNsQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDeEIsbUJBQW1CO1lBQ25CLG1CQUFtQixFQUFFLG1CQUFtQjtTQUN6QyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsZUFBZSxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBTb2NrZXQsIGNyZWF0ZVNvY2tldCB9IGZyb20gJ2RncmFtJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgU3RlcHNpemVIZWxwZXIgZnJvbSAnLi9TdGVwc2l6ZUhlbHBlcic7XG5pbXBvcnQgVGltZXIgPSBOb2RlSlMuVGltZXI7XG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vLi4vcGFja2FnZS5qc29uJztcblxuY2xhc3MgU3RlcHNpemVPdXRnb2luZyB7XG4gIHByaXZhdGUgcGx1Z2luSWQ7XG4gIHByaXZhdGUgREVCVUc6IGJvb2xlYW47XG4gIHByaXZhdGUgVURQX0hPU1Q6IHN0cmluZztcbiAgcHJpdmF0ZSBVRFBfUE9SVDogbnVtYmVyO1xuICBwcml2YXRlIE9VVEdPSU5HX1NPQ0s6IFNvY2tldDtcbiAgcHJpdmF0ZSBsYXllclJlYWR5OiBib29sZWFuO1xuICBwcml2YXRlIHJlYWR5SW50ZXJ2YWw6IFRpbWVyO1xuICBwcml2YXRlIHJlYWR5VHJpZXM6IG51bWJlciA9IDE7XG4gIHByaXZhdGUgcmVhZHlSZXRyeVRpbWVyOiBudW1iZXI7XG4gIHByaXZhdGUgY2FjaGVkTWVzc2FnZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGx1Z2luSWQgPSBgYXRvbV92JHt2ZXJzaW9ufWA7XG4gICAgdGhpcy5ERUJVRyA9IGZhbHNlO1xuICAgIHRoaXMuVURQX0hPU1QgPSAnMTI3LjAuMC4xJztcbiAgICB0aGlzLlVEUF9QT1JUID0gNDkzNjk7XG4gICAgdGhpcy5PVVRHT0lOR19TT0NLID0gY3JlYXRlU29ja2V0KCd1ZHA0Jyk7XG4gICAgdGhpcy5sYXllclJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5PVVRHT0lOR19TT0NLLm9uKCdtZXNzYWdlJywgbXNnID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZE1lc3NhZ2UgPSBKU09OLnBhcnNlKG1zZyk7XG4gICAgICBpZiAocGFyc2VkTWVzc2FnZS50eXBlID09PSAncmVhZHknICYmIHBhcnNlZE1lc3NhZ2Uuc291cmNlLm5hbWUgPT09ICdMYXllcicpIHtcbiAgICAgICAgdGhpcy5sYXllclJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWFkeVRyaWVzID0gMTtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkTWVzc2FnZSkge1xuICAgICAgICAgIHRoaXMuc2VuZCh0aGlzLmNhY2hlZE1lc3NhZ2UpO1xuICAgICAgICAgIHRoaXMuY2FjaGVkTWVzc2FnZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJlYWR5SW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0xheWVySXNSZWFkeSgpIHtcbiAgICBpZiAodGhpcy5sYXllclJlYWR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2VuZFJlYWR5KCk7XG4gICAgdGhpcy5yZWFkeUNoZWNrVGltZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZHlDaGVja1RpbWVyKCkge1xuICAgIHRoaXMucmVhZHlSZXRyeVRpbWVyID0gMyAqIChNYXRoLnBvdyh0aGlzLnJlYWR5VHJpZXMgLyAxMCwgMikgKyAxKTtcbiAgICB0aGlzLnJlYWR5SW50ZXJ2YWwgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucmVhZHlUcmllcysrO1xuICAgICAgdGhpcy5zZW5kUmVhZHkoKTtcbiAgICAgIHRoaXMucmVhZHlDaGVja1RpbWVyKCk7XG4gICAgfSwgdGhpcy5yZWFkeVJldHJ5VGltZXIgKiAxMDAwKTtcbiAgfVxuXG4gIHB1YmxpYyBzZW5kKGV2ZW50LCBjYWxsYmFjaz8pIHtcbiAgICBTdGVwc2l6ZUhlbHBlci5jaGVja0xheWVyUnVubmluZygpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGxldCBtc2cgPSBKU09OLnN0cmluZ2lmeShldmVudCk7XG4gICAgICAgIHRoaXMuT1VUR09JTkdfU09DSy5zZW5kKG1zZywgMCwgbXNnLmxlbmd0aCwgdGhpcy5VRFBfUE9SVCwgdGhpcy5VRFBfSE9TVCwgY2FsbGJhY2spO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMubGF5ZXJSZWFkeSA9IGZhbHNlO1xuICAgICAgICBpZiAoZXZlbnQudHlwZSAhPT0gJ3JlYWR5Jykge1xuICAgICAgICAgIHRoaXMuY2FjaGVkTWVzc2FnZSA9IGV2ZW50O1xuICAgICAgICAgIHRoaXMuY2hlY2tMYXllcklzUmVhZHkoKTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHNlbmRSZWFkeSgpIHtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHR5cGU6ICdyZWFkeScsXG4gICAgICBzb3VyY2U6IHsgbmFtZTogJ0JldHRlckdpdEJsYW1lJywgdmVyc2lvbjogdmVyc2lvbiB9LFxuICAgIH07XG4gICAgdGhpcy5zZW5kKGV2ZW50KTtcbiAgfVxuXG4gIC8vIHNlbmRFcnJvciAtIHNlbmRzIGVycm9yIG1lc3NhZ2UgdG8gU3RlcHNpemVcbiAgc2VuZEVycm9yID0gZGF0YSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICBzb3VyY2U6ICdhdG9tJyxcbiAgICAgIGFjdGlvbjogJ2Vycm9yJyxcbiAgICAgIGZpbGVuYW1lOiBmcy5yZWFscGF0aFN5bmMoZWRpdG9yLmdldFBhdGgoKSksXG4gICAgICBzZWxlY3RlZDogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBwbHVnaW5faWQ6IHRoaXMucGx1Z2luSWQsXG4gICAgfTtcbiAgICB0aGlzLnNlbmQoZXZlbnQpO1xuICB9O1xuXG4gIGJ1aWxkU2VsZWN0aW9uRXZlbnQoZWRpdG9yKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gZWRpdG9yLnNlbGVjdGlvbnMubWFwKHNlbGVjdGlvbiA9PiB7XG4gICAgICByZXR1cm4gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRFdmVudChlZGl0b3IsIHJhbmdlcywgJ3NlbGVjdGlvbicpO1xuICB9XG5cbiAgYnVpbGRFdmVudChlZGl0b3IsIHJhbmdlcywgYWN0aW9uLCBzaG91bGRQZXJmb3JtU2VhcmNoID0gZmFsc2UpIHtcbiAgICBjb25zdCBzZWxlY3RlZExpbmVOdW1iZXJzID0gU3RlcHNpemVIZWxwZXIucmFuZ2VzVG9TZWxlY3RlZExpbmVOdW1iZXJzKHJhbmdlcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogJ2F0b20nLFxuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBmaWxlbmFtZTogZWRpdG9yLmdldFBhdGgoKSB8fCBudWxsLFxuICAgICAgcGx1Z2luX2lkOiB0aGlzLnBsdWdpbklkLFxuICAgICAgc2VsZWN0ZWRMaW5lTnVtYmVycyxcbiAgICAgIHNob3VsZFBlcmZvcm1TZWFyY2g6IHNob3VsZFBlcmZvcm1TZWFyY2gsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGVwc2l6ZU91dGdvaW5nO1xuIl19