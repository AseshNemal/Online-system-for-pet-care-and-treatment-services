import mongoose from "mongoose";
const { Schema } = mongoose;


const petSchema = new Schema({

    petName : { type : String, required : true},
    userId : {type : String, required : true},
    species : { type : String, required : true},
    bDate : {type : String, required : true},
    gender : { type : String, required : true},
    weight : { type : String, required : false},
    color : { type : String, required : false},
    breed : { type : String, required : false},
    deviceId : { type : Number, required : false},


})

const Pet = mongoose.model("Pet" , petSchema);

export default Pet;