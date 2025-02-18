import React from "react";
import { Link } from "react-router-dom";


function Header(){
    return(
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="/">PetWellness</a>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item active">
          <Link to="/" class="nav-link">Home <span class="sr-only"></span></Link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/">Shopping</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="/">Appointment</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="/">New Pet</a>
        </li>

        <li className="nav-item">
  <Link to="/pet" className="nav-link">Medical History</Link>
</li>


        <li class="nav-item">
          <a class="nav-link" href="/">About us</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="/">Chat with</a>
        </li>
        
        
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
    )

}

export default Header;