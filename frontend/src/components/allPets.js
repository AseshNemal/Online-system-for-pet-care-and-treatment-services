import axios from "axios";
import React, {useState, useEffect} from "react";

export default function AllPets() { 

    const[pets, setpets] = useState([]);

    useEffect(( ) => {
        function getPet(){
            axios.get("https://online-system-for-pet-care-and-treatment.onrender.com/pet/").then((res) => {
               setpets(res.data);
               
            }).catch((err) =>{
                alert(err.message);
            })
        }
        getPet();
    },[])


    return(
        <div className="container">

        
            
        <h1>All Pets</h1>


        <table class="table table-bordered">
            <thead>
            <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">User ID</th>
            <th scope="col">Species</th>
            <th scope="col">Gender</th>
            <th scope="col">Birthday</th>
            <th scope="col">Weight</th>
            <th scope="col">Color</th>
            <th scope="col">Breed</th>
            </tr>
            </thead>
            <tbody>

            {pets.map((pets, index) => (
                    <tr key={pets._id}>
                    <td>{index + 1}</td>
                    <td>{pets.petName}</td>
                    <td>{pets.userId}</td>
                    <td>{pets.species}</td>
                    <td>{pets.gender}</td>
                    <td>{pets.bDate}</td>
                    <td>{pets.weight}</td>
                    <td>{pets.color}</td>
                    <td>{pets.breed}</td>
                    </tr>
                ))}

            </tbody>
        </table>
            </div>

    )
}