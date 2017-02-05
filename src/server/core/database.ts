
export interface IPlayerData {
    session: string;
    key: string;
    data: any;
}

export interface IGameServerData {
    key: string
    data: any
}

export abstract class Database {
    protected tables: { [key:string]: string } = {};
    constructor (serverTable: string, playerTable: string) {
        this.tables['server'] = serverTable;
        this.tables['player'] = playerTable;
    }

    abstract GetPlayer(key: string, callback: (err: any, data: IPlayerData) => void);
    abstract GetGameServer(key: string, callback: (err: any, data: IGameServerData) => void);
    abstract GetGameServers(callback: (err: any, data: IGameServerData[]) => void);
}