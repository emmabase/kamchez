import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    realName: {type: String, default: null},
    profileValue: {type: String, default:null},
    kci: {type: String, default:null},
    online: {type: Number, default: 0},
    confirmed: {type: Number, default: 0},
    phoneConfirmed: {type: Number, default: 0},
    phoneUnique: {type: Number, default: 0},
    notificationKey: {type:String, default:null},
    lastSeen: {type: Date},
    email: {type: String, unique: true, required: true},
    firstName: {type: String, default: null},
    lastName: {type: String, default:null},
    phone: {type: String, default:null},
    password: {type: String},
    gender: {type: String, default:null},
    maritalStatus: {type: Number, default:null},
    numberOfChildren: {type: Number, default:null},
    fatherName: {type: String, default:null},
    motherName: {type: String, default:null},
    village: {type: String, default:null},
    villageOfResidence: {type:String, default:null},

    localGovernment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Local",
        default:null,
    },
    localOfResidence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Local",
        default:null,
    },

    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default:null,
    },

    stateOfResidence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default:null,
    },

    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
        default:null,
    },

    town:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Town",
        default:null,
    },

    street: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Street",
        default:null,
    },

    idNumber: {type: Number, default:null},
    zipCode: {type: String, default: null},
    address:{type: String, default:null},
    addressOfResidence : {type: String, default: null},
    religion : {type: String, default: null},
    languages: {type: Array, default: []},
    image:{type: String, default:null},
    imageMini:{type: String, default:null},
    dateOfBirth: {type: Date},
    bustop: {type:String},
    userType: {type: Number, default:0},
    accountStatus: {type: Boolean, default: false},
    blocked: {type: Number, default: false},
    dateVerified: {type: String, default:null},    
    verifiedBy: {type: String, default:null},

    maritalSeen: {type:Boolean, default: false},
    addressSeen: {type:Boolean, default: false},
    spouseSeen: {type:Boolean, default: false},
    kciSeen: {type: Boolean, default: false},
    emailSeen: {type: Boolean, default: false},
    phoneSeen: {type: Boolean, default: false},
    childrenSeen: {type: Boolean, default: false},
    parentSeen: {type: Boolean, default: false},
    parentSeen: {type: Boolean, default: false},
    languageSeen: {type: Boolean, default: false},
    dateOfBirthSeen: {type: Boolean, default: false},
    bustopSeen: {type: Boolean, default: false},

    isAdmin: {type: Boolean,  default: false},
    
},
{
    timestamps: true,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;