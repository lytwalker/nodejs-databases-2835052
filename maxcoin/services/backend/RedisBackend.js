/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const Redis = require("ioredis");
const CoinAPI = require("../CoinAPI");

class RedisBackend {
    constructor() {
        this.coinAPI = new CoinAPI();
        this.client = null;
    }

    async connect() {
        this.client = new Redis(7379);
        return this.client;
    }

    async disconnect() {
        return this.client.disconnect();
    }

    async insert() {
        const data = await this.coinAPI.fetch();
        const values = [];
        Object.entries(data.bpi).forEach((entry) => {
            values.push(entry[1]);
            values.push(entry[0]);
        });
        return this.client.zadd("maxcoin:values", values);
    }

    async getMax() {
        return this.client.zrange("maxcoin:values", -1, -1, "WITHSCORES");
    }

    async max() {
        // Begin - Connect
        console.info("Connection to Redis");
        console.time("redis-connect");
        const client = this.connect();
        if (client) {
            console.info("Successfully connected to Redis");
        } else {
            throw new Error("Connecting to Redis failed");
        }
        console.timeEnd("redis-connect");
        // End - Connect

        // Begin - Insert
        console.info("Inserting into Redis");
        console.time("redis-insert");
        const insertResult = await this.insert();
        console.timeEnd("redis-insert");
        console.info(`Inserted ${insertResult} documents into Redis.`);
        // End - Insert

        // Begin - Query - part 1
        console.info("Querying Redis");
        console.time("redis-findone");
        const result = await this.getMax();
        console.timeEnd("redis-findone");
        // End - Query - part 1

        // Begin - Disconnect
        console.info("Disconnecting from Redis");
        console.time("redis-disconnect");
        await this.disconnect();
        console.timeEnd("redis-disconnect");
        // End - Disconnect

        return result;
    }
}

module.exports = RedisBackend;
