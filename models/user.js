import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema; // create schema object from mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true }, // store path to image,
  places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}],
});

userSchema.plugin(uniqueValidator); // use uniqueValidator plugin to check for unique email

export default mongoose.model('User', userSchema);