import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
  name: {type: String}

});

const stateModel = mongoose.Model("State", stateSchema);

export default stateModel;