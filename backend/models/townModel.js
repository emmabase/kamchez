import mongoose from 'mongoose';

const townSchema = new mongoose.Schema({

    lgaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Local",
        default:null,
    },

    townName: {type: String}, 

})

const townModel = mongoose.model("Town", townSchema);

export default townModel;