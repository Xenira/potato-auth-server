import * as winston from 'winston';
import { IPlayerData } from './server/core/database';

// Set up logging
winston.configure({
    transports: [
        new winston.transports.File({ filename: 'server.log' }),
        new winston.transports.Console()
    ]
})

export { Server } from './server/server';
export { Controller } from './server/controller';
export { Database, IGameServerData, IPlayerData } from './server/core/database';
