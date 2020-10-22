import mongoose from 'mongoose';

const professionsSchema = new mongoose.Schema({
     name: {
         type: String
     },

     abbreviation:{
         type: String
     }
});

const professionsModel = mongoose.model("Professions", professionsSchema);

export default professionsModel;