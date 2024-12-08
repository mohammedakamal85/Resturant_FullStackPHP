import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Footer from './../components/Footer';
import Header from './../components/Header';
import breakfast from "./../pic/breakfast.jpg";
import lunch from "./../pic/lunch.jpg";
import drinks from "./../pic/drinks.jpg";
import desserts from "./../pic/desserts.jpg";

const HomePage = () => {
  return (
    <Fragment>
    <Header />
      <div className="home-section">
          <h1>Welcome to Fishman</h1>
          <p>We are a top-notch restaurant serving delicious food.</p>
          <Link to="/menu">Our Menu</Link>
        </div>
        <div className="about__menu">
          <h1>Fishman Dishes</h1>
          <div className="cards">
            <div className="card">
              <img src={breakfast} alt="breakfast" />
              <h3>Breakfast</h3>
              <p>Start your day with some healthy breakfast.</p>
            </div>
            <div className="card">
              <img src={lunch} alt="lunch" />
              <h3>Lunch</h3>
              <p>We offer a variety of lunch options.</p>
            </div>
            <div className="card">
              <img src={drinks} alt="drinks" />
              <h3>Drinks</h3>
              <p>We offer a variety of drinks.</p>
            </div>
            <div className="card">
              <img src={desserts} alt="desserts" />
              <h3>Desserts</h3>
              <p>Desserts are always a good choice.</p>
            </div>
          </div>
        </div>
        <Footer />
    </Fragment>
  );
};

export default HomePage;
