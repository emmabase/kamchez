import mongoose from 'mongoose';

const localSchema = new mongoose.Schema({
    stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default:null,
    },
    name: {
        type: String
    }
});

const localModel = mongoose.model("Local", localSchema);

export default localModel;