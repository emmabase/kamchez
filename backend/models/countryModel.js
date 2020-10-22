import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({

    name: {
        type: String
    }

})

const countryModel = mongoose.model("Country", countrySchema);

export default countryModel;