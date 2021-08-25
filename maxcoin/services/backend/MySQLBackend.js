/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const mysql = require("mysql2/promise");
const CoinAPI = require("../CoinAPI");

class MySQLBackend {
    constructor() {
        this.coinAPI = new CoinAPI();
        this.connection = null;
    }

    async connect() {
        this.connection = await mysql.createConnection({
            host: "localhost",
            port: 3406,
            user: "root",
            password: "mypassword",
            database: "maxcoin",
        });
        return this.connection;
    }

    async disconnect() {
        return this.connection.end();
    }

    async insert() {
        const data = await this.coinAPI.fetch();
        const sql = "INSERT INTO coinvalues (valuedate, coinvalue) VALUES ?";
        const values = [];
        Object.entries(data.bpi).forEach((entry) => {
            values.push([entry[0], entry[1]]);
        });
        return this.connection.query(sql, [values]);
    }

    async getMax() {
        return this.connection.query("SELECT * FROM coinvalues Order By coinvalue DESC Limit 0,1");
    }

    async max() {
        // Begin - Connect
        console.info("Connection to MySQL");
        console.time("mySQL-connect");
        const connection = this.connect();
        if (connection) {
            console.info("Successfully connected to MySQL");
        } else {
            throw new Error("Connecting to MySQL failed");
        }
        console.timeEnd("mySQL-connect");
        // End - Connect

        // Begin - Insert
        console.info("Inserting into MySQL");
        console.time("mySQL-insert");
        const insertResult = await this.insert();
        console.timeEnd("mySQL-insert");
        console.info(`Inserted ${insertResult[0].affectedRows} documents into MySQL.`);
        // End - Insert

        // Begin - Query - part 1
        console.info("Querying MySQL");
        console.time("mySQL-findone");
        const result = await this.getMax();
        const row = result[0][0];
        console.timeEnd("mySQL-findone");
        // End - Query - part 1

        // Begin - Disconnect
        console.info("Disconnecting from MySQL");
        console.time("mySQL-disconnect");
        await this.disconnect();
        console.timeEnd("mySQL-disconnect");
        // End - Disconnect

        return row;
    }
}

module.exports = MySQLBackend;
