const router = require("express").Router();
//import { useId } from "react";
import Pet from "../model/pet";


router.route("/add").post((req,res)=>{

    const petName = req.body.petName;
    const userId = req.body.userId;
    const species = req.body.species;
    const bDate = req.body.bDate;
    const gender = req.body.gender;
    const weight = req.body.weight;
    const color = req.body.color;
    const breed = req.body.breed;

    const newPet = new Pet({
        petName,
        userId,
        species,
        bDate,
        gender,
        weight,
        color,
        breed
    })
    newPet.save().then(()=>{
        res.json("Pet Added")
    }).catch((err) => {
        console.log(err);
    })

})

router.route("/").get((req, res) => {
    Pet.find()
        .then((pets) => {
            res.json(pets);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching pets", details: err.message });
        });
});


router.route("/update/:id").put(async(req,res) =>{
    
    let petid = req.body.id;
    
    const {petName,userID,species,age,gender,weight,color,breed} = req.body;
    
    const updatePet ={
        petName,
        userID,
        species,
        age,
        gender,
        weight,
        color,
        breed 
    }


    const update = await Pet.findByIdAndUpdate(petid,updatePet).then(()=>{
        if (!update) {
            return res.status(404).json({ status: "Pet not found" });
        }
        res.status(200).send({status: "Pet Updated",user: update})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "Error with updatating data"});
    })

    

})

router.route("/delete/:id").delete(async(req,res) =>{
    let petid = req.params.id;

    await Pet.findByIdAndDelete(petid)
    .then(() => {
        res.status(200).send({status: "User deleted"})
    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete user",eror: err.message});
    })

} )

router.route("/find/:uid").get(async (req, res) => {
    try {
        const userId = req.params.uid;
        const pets = await Pet.find({ userId });

        if (!pets || pets.length === 0) {
            return res.status(404).json({ status: "No pets found for this user" });
        }

        res.status(200).json({ status: "Pets fetched", pets });
    } catch (err) {
        console.error("Error fetching pets:", err);
        res.status(500).json({ status: "Error fetching pets", error: err.message });
    }
});



module.exports = router;