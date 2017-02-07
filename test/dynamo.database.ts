import { DynamoDB } from 'aws-sdk';
import { Database, IPlayerData, IGameServerData } from '../src';
import { AttributeValue } from 'dynamodb-data-types';
import * as winston from 'winston';

export class DynamoDatabase extends Database {
    db = new DynamoDB();
    keys: { [key:string]: any } = {};
    constructor(region: string, serverTable: string, playerTable: string,
        private serverKey: string,
        private playerKey: string) {

        super(serverTable, playerTable);
        this.db.config.region = region;

        this.db.listTables((err, data) => {
            winston.info(JSON.stringify(data));
            winston.info(JSON.stringify(err));
            winston.info('Done');
        });
    }

    GetPlayer(key: string, callback: (err: any, data: IPlayerData) => void) {
        let selector = AttributeValue.wrap({ [this.serverKey]: key });
        let query: DynamoDB.GetItemInput = {
            TableName: this.tables['player'],
            Key: selector
        };
        this.getItem(query, (e, d) => { winston.info(d); });
    }
    GetGameServer(key: string, callback: (err: any, data: IGameServerData) => void) {

    }
    GetGameServers(callback: (err: any, data: IGameServerData[]) => void) {
        return [];
    }

    getItem(query: DynamoDB.GetItemInput, callback:(error, data) => void) {
        this.db.getItem(query, callback);
    }

    getItems(query: DynamoDB.BatchGetItemInput, callback:(error, data) => void) {
        this.db.batchGetItem(query, callback);
    }

    updateItem(query: DynamoDB.UpdateItemInput, callback:(error, data) => void) {
        this.db.updateItem(query, callback);
    }
}