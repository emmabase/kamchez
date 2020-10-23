import mongoose from 'mongoose';

const userDevicesSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null,
    },

    token: {
        type: String, default:null,
    }
});


const userDevicesModel = mongoose.model("UserDevices", userDevicesSchema);

export default userDevicesModel;
