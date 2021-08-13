/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require("mongodb");

const CoinAPI = require("../CoinAPI");

class MongoBackend {
    constructor() {
        this.coinAPI = new CoinAPI();
        this.mongoUrl = "mongodb://localhost:37017/maxcoin";
        this.client = null;
        this.collection = null;
    }

    async connect() {
        const mongoClient = new MongoClient(this.mongoUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        this.client = await mongoClient.connect();
        this.collection = this.client.db("maxcoin").collection("values");
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            return this.client.close();
        }
        return false;
    }

    async insert() {
        const data = await this.coinAPI.fetch();
        const documents = [];
        Object.entries(data.bpi).forEach((entry) => {
            documents.push({
                date: entry[0],
                value: entry[1],
            });
        });
        return this.collection.insertMany(documents);
    }

    async getMax() {
        return this.collection.findOne({}, { sort: { value: 1 } });
    }

    async max() {
        // Begin - Connect
        console.info("Connection to MongoDB");
        console.time("mongodb-connect");
        const client = await this.connect();
        if (client.isConnected()) {
            console.info("Successfully connected to MongoDB");
        } else {
            throw new Error("Connecting to MongoDB failed");
        }
        console.timeEnd("mongodb-connect");
        // End - Connect

        // Begin - Insert
        console.info("Inserting into MongoDB");
        console.time("mongodb-insert");
        const insertResult = await this.insert();
        console.timeEnd("mongodb-insert");
        console.info(`Inserted ${insertResult.result.n} documents into MongoDB.`);
        // End - Insert

        // Begin - Query - part 1
        console.info("Querying MongoDB");
        console.time("mongodb-findone");
        const doc = await this.getMax();
        console.timeEnd("mongodb-findone");
        // End - Query - part 1

        // Begin - Disconnect
        console.info("Disconnecting from MongoDB");
        console.time("mongodb-disconnect");
        await this.disconnect();
        console.timeEnd("mongodb-disconnect");
        // End - Disconnect

        // Begin - Query - part 2
        return {
            date: doc.date,
            value: doc.value,
        };
        // End - Query - part 2
    }
}

module.exports = MongoBackend;
