import { History } from 'history';

export class Route {
    constructor (
        private _history:History,
    ) { }

    public go (path:string) {
        this._history.push(path);
        this._history.goForward();
    }

    public channelTag (channelId:number, tagId:number) {
        this.go(`/threads/?channels=[${channelId}]&tags=[${tagId}]`);
    }
    public thread (threadId:number) {
        this.go(`/thread/${threadId}`);
    }

    public user (userId:number) {
        this.go(`/user/${userId}`);
    }
}