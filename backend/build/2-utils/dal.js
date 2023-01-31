"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const app_config_1 = __importDefault(require("./app-config"));
// Create a pool of connection to MySQL:
const connection = mysql_1.default.createPool({
    host: app_config_1.default.host,
    user: app_config_1.default.user,
    password: app_config_1.default.password,
    database: app_config_1.default.database
});
function execute(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}
exports.default = {
    execute
};
