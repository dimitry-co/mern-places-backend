import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required:true},
    address: {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' } // ref: 'User' tells mongoose that this field is a reference to the User model. Types.ObjectId is a special mongoose type that tells mongoose that this is an id of another object stored in another collection
});

export default mongoose.model('Place', placeSchema); // mongoose.model takes 2 arguments - name of model and schema to use for model - returns a constructor function - new Place()