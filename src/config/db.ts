import { Sequelize } from "sequelize-typescript";
import config from "./configSetup";
import * as models from "../models/Models"

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: config.DBHOST,
    port: Number(config.DBPORT),
    username: config.DBUSERNAME,
    password: config.DBPASSWORD || undefined,
    database: config.DBNAME,
    models: Object.values(models),
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
    logging: false,
});


// console.log('DB_CONNECTION_STRING:', config.DB_CONNECTION_STRING);

// const sequelize = new Sequelize(
//     config.DB_CONNECTION_STRING || 'test',
//     {
//         dialect: 'mssql',
//         models: Object.values(models),
//         dialectOptions: {
//             options: {
//                 encrypt: false,
//                 trustServerCertificate: true,
//                 instanceName: 'SQLEXPRESS'
//             }
//         }
//     }
// );

sequelize.authenticate().then(() => {
    console.log('Database connection successful!.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

export default sequelize;
