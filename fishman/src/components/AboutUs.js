import React from "react";
import Footer from "./../components/Footer";
import Header from './../components/Header';

const AboutUs = () => {
  return (
    <div>
    <Header />
      <div className="about__us">
        <h1>About Us</h1>
        <div className="cards__container">
          <div className="about__card">
            <h3>Our Story</h3>
            <p>
              At Fishman Restaurant, our story begins with a passion for
              exceptional seafood and a commitment to delivering a unique dining
              experience. Founded in [Year] by [Founder's Name], our restaurant
              has grown from a humble local eatery into a beloved destination
              for seafood lovers. With a focus on quality ingredients,
              sustainable practices, and a warm, welcoming atmosphere, we take
              pride in serving dishes that not only taste amazing but also
              reflect our dedication to excellence.
            </p>
          </div>
          <div className="about__card">
            <h3>Mission</h3>
            <p>
              Our mission at Fishman Restaurant is to provide an unparalleled
              seafood dining experience that delights the senses and exceeds
              expectations. We are dedicated to sourcing the freshest
              ingredients, supporting sustainable fishing practices, and
              delivering outstanding service. Our goal is to create memorable
              meals that bring people together and celebrate the rich flavors of
              the sea.
            </p>
          </div>
          <div className="about__card">
            <h3>Vision</h3>
            <p>
              Our vision is to be recognized as the leading seafood restaurant
              in the region, renowned for our commitment to quality, innovation,
              and sustainability. We aspire to inspire a love for seafood in our
              community and beyond, while continuously evolving to meet the
              changing tastes and preferences of our guests. Through our
              dedication to excellence and responsible practices, we aim to set
              the standard for seafood dining and make a positive impact on the
              environment and our community.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
