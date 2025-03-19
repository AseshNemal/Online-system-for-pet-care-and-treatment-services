const router = require("express").Router();



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