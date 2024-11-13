import { MongoClient } from "mongodb";
//const uri='mongodb://tarunpahade6969:P0qXYu6jfXSgHbqU@ac-ofodjrr-shard-00-00.qjozxso.mongodb.net:27017,ac-ofodjrr-shard-00-01.qjozxso.mongodb.net:27017,ac-ofodjrr-shard-00-02.qjozxso.mongodb.net:27017/?ssl=true&replicaSet=atlas-10oyrf-shard-0&authSource=admin&retryWrites=true&w=majority'
const uri =process.env.MONGODB_URI!
export async function connect() {
    try {
        
        //await mongoose.connect(process.env.MONGO_URI!);
       
        // const connection = mongoose.connection;
        // console.log('>>> Database is connected');

        // connection.on('connected', ()=>{
        //     console.log('>>> Mongoose is connected to the database');
        // })
        // connection.on('error', (err)=>{
        //     console.log('Error while connecting to the database: ', err);
        // })
        

        return db;
    } catch (error) {
        console.log('>>> Error: ', error);
    }
}
const client = new MongoClient(uri, {
    connectTimeoutMS: 30000,
  });
 
 const db = client.db("test");
const Users = db.collection("users");
 export default Users;  