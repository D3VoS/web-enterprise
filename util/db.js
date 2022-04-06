// DB Helper, Taken from https://mrvautin.com/re-use-mongodb-database-connection-in-routes/
const mongoClient = require('mongodb').MongoClient
const pass = process.env.DBPASS
const DBUrl = "mongodb+srv://webenterprise:"+pass+"@cluster0.4kxvc.mongodb.net/webenterprise?retryWrites=true&w=majority"
let mongodb;
let client

function connect(callback){
	mongoClient.connect(DBUrl, (err,db) =>{
		if (err) throw err;
		client = db.db("webenterprise");
		mongodb = db;
		callback();
	});
}
function get(){
	return client;
}

function close(){
	mongodb.close();
}

module.exports = {
	connect, get, close
};