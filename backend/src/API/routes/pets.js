const router = require("express").Router();
import Pet from "../model/pet";


router.route("/add").post((req,res)=>{

    const petName = req.body.petName;
    const userId = req.body.userId;
    const species = req.body.species;
    const age = Number(req.body.age);
    const gender = req.body.gender;
    const weight = req.body.weight;
    const color = req.body.color;
    const breed = req.body.breed;

    const newPet = new Pet({
        petName,
        userId,
        species,
        age,
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

router.route("/").get((req,res)=>{

    Pet.find(),((student) => {
        res.json(student)
    }).catch((err) => {
        console.log(err)
    })
    
})

router.route("/update/:id").put(async(req,res) =>{
    
})



module.exports = router;