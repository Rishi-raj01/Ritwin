const mongoose = require("mongoose");
//const usermodels=require('../model/usermodel')
//const db_link=  "mongodb+srv://rishirajjnvr448:Rishiraj2002@cluster1.sqbemgr.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster1";
const db_link=process.env.DB_LINK;
//
async function connectToDatabase() {
    try {
      await mongoose.connect(db_link);
     // console.log(`db connected `);
     // const fetched_data = await mongoose.connection.db.collection("usermodels").find({}).toArray();
     //const fetched_data = await usermodels.find({});
    
  //console.log(fetched_data);
    } catch (err) {
      console.log("....", err);
    }
  }
  
  connectToDatabase();
  
  module.exports = connectToDatabase;
