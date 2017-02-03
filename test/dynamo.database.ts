import { DynamoDB } from 'aws-sdk';
import { Database, IQuery } from '../src';
import * as winston from 'winston';

export class DynamoDatabase extends Database {
    db = new DynamoDB();
    constructor(serversDB: string, playersDB: string) {
        super(serversDB, playersDB)
        this.db.listTables((err, data) => {
            winston.info(JSON.stringify(data));
            winston.info(JSON.stringify(err));
        })
    }

    public ExecuteCommand(query: IQuery) {
        switch (query.function) {
            case 'SELECT':
                winston.warn(`Selecting from ${this.tables[query.from]} without getting response is not supported.`);
                break;
            case 'UPDATE':

                break;
            case 'DELETE':

                break;
        }
    }
    public QueryRows(query: IQuery, callback: (error, row: any) => void) {

    }
    public QuerySingleResult(query: IQuery, callback: (error, row: any) => void) {
        switch (query.function) {
            case 'SELECT':
                this.getItem(query, callback);
                break;
            case 'UPDATE':

                break;
            case 'DELETE':

                break;
        }
    }

    getItem(query: IQuery, callback:(error, data) => void) {
        this.db.getItem({
            TableName: this.tables[query.from],
            Key: query.where[0]
        }, (err, data) => {
            if (err) {
                callback(err, null);
            }

            callback(null, data);
        });
    }

    getItems(query: IQuery, callback:(error, data) => void) {
        this.db.batchGetItem({
            RequestItems: {
                [this.tables[query.from]]: {
                    Keys: query.where
                }
            }
        }, callback);
    }

    updateItem(query: IQuery, callback:(error, data) => void) {

    }
}