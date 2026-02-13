import React from "react";
import { Carousel } from "primereact/carousel";
import CarouselItem from "./carouseItemTemplate";
import css from "./gameCarousel.module.css";

const gameCarouselData = [
  {
    id: 1,
    title: "Black Nights",
    heading: "The knight is considered a minor piece (like a bishop) and is worth three points. It is considerably more valuable than a pawn (which is worth one point), equally valuable as a bishop (also three points), but less valuable than a rook (five points) and a queen (nine points).",
    image: "./assets/carousel/chess.png",

  },
  {
    id: 2,
    title: "Autosport Racing",
    heading: "Racing games are a video game genre in which the player participates in a racing competition. They may be based on anything from real-world racing leagues to fantastical settings. They are distributed along a spectrum between more realistic racing simulations and more fantastical arcade-style racing games.",
    image: "./assets/carousel/racing.png",
  },
  {
    id: 3,
    title: "Dino Attack",
    heading: "Dinosaurs Attack! is a trading card series by Topps released in 1988 and containing 55 base cards and 11 sticker cards. The cards tell the story of dinosaurs transported through time into the present day through a freak accident and wreaking havoc on Earth.The series is notable for its graphic violence and gore, intended to evoke memories of the successful Mars Attacks trading card series of 1962.",
    image: "./assets/carousel/dinoattack.png",
  },

];
const responsiveOptions = [
  {
    breakpoint: "1199px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "991px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 1,
    numScroll: 1,
  },
];

const GameCarousel = () => {
  return (
    <div className={`${css.card}`}>
      <Carousel
        value={gameCarouselData}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={CarouselItem}
        showNavigators={false}
      />
    </div>
  );
};

export default GameCarousel;
