import mongoose from 'mongoose';

const servicePointSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null,
    },

    profession: {type: Array, default:[]},
});

const servicePointModel = mongoose.model("ServicePoint", servicePointSchema);

export default servicePointModel;