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
    const deviceId = req.body.deviceId;

    const newPet = new Pet({
        petName,
        userId,
        species,
        bDate,
        gender,
        weight,
        color,
        breed,
        deviceId
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


router.route("/update/:id").put(async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
        }
        
        res.json({ 
            status: "Pet Updated",
            pet // Return the updated pet
        });
    } catch (err) {
        res.status(500).json({ 
            error: "Error updating pet",
            details: err.message 
        });
    }
});


router.get('/petDetaile/:petId', async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
      res.json({ pet });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

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