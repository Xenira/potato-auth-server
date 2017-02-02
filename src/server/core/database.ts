
export interface IQuery {
    function: 'SELECT' | 'UPDATE' | 'DELETE';
    where: [{ [key:string]:any }];
    from: string;
}

export abstract class Database {
    protected tables: { [key:string]: string } = {};

    constructor(serversDB: string, playersDB: string) {
        this.tables["servers"] = serversDB;
        this.tables["players"] = playersDB;
    }
    public abstract ExecuteCommand(query: IQuery);
    public abstract QueryRows(query: IQuery, callback: (error, row: any) => void);
    public abstract QuerySingleResult(query: IQuery, callback: (error, result: any) => void);
}