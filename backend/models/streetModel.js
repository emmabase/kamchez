import mongoose from 'mongoose';

const townSchema = new mongoose.Schema({

    townId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Town",
        default:null,
    },

    streetName: {type: String}, 

})

const streetModel = mongoose.model("Street", townSchema);

export default streetModel;