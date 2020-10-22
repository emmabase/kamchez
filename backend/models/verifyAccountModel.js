import mongoose from 'mongoose';

const verifyAccountSchema = new mongoose.Schema({
    email: {
        type: String,
        default: null,
    },
    ip: {
        type: String, default: null
    },
    token: {
        type: Number,
        default: null,
    },
    tokenTime: {
        type: String,
        default: new Date().toString()
    }
});


const verifyAccountModel = mongoose.model("VerifyAccount", verifyAccountSchema);

export default verifyAccountModel;
