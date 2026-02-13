import React from "react";
import GameItem from "./gameItem";

import css from "./gameList.module.css";

const games = [
  {
    id: 1,
    title: "Top Trumps",
    heading: "Insects",
    image: "./assets/games/lady_bird.png",
    description:
      "Top Trumps is a popular fastpaced card game. Can you win all the cards off the SampleApp Computer?",
  },
  {
    id: 2,
    title: "Top Trumps",
    heading: "Forks of the World",
    image: "./assets/games/fork_with_wheels.png",
    description:
      "Top Trumps is a popular fastpaced card game. Can you win all the cards off the SampleApp Computer?",
  },
  {
    id: 3,
    title: "Top Trumps",
    heading: "Jobs of the World",
    image: "./assets/games/teacher.png",
    description:
      "Top Trumps is a popular fastpaced card game. Can you win all the cards off the SampleApp Computer?",
  },
  {
    id: 4,
    title: "Top Trumps",
    heading: "Friendly Monsters",
    image: "./assets/games/gaint_moth.png",
    description:
      "Top Trumps is a popular fastpaced card game. Can you win all the cards off the SampleApp Computer?",
  },
  {
    id: 5,
    title: "Top Trumps",
    heading: "Dino Attack",
    image: "./assets/games/dino_attack.png",
    description:
      "Top Trumps is a popular fastpaced card game. Can you win all the cards off the SampleApp Computer?",
  },
  {
    id: 6,
    title: "Top Trumps",
    heading: "Black Knights",
    image: "./assets/games/black_knights.png",
    description:
      "Top Trumps is a popular fastpaced card game. Can you win all the cards off the SampleApp Computer?",
  },
];
const GameList = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <div className={`${css.card} ${css.our_games}`}>
            <div className={`${css.games_text}`}>
              <h4>Our Games</h4>
              <h6>
                Every game on SampleApp is free to play and remix! Play games,
                open them in the editor to make your very own version. Add
                cards, create a new deck, or even modify it into a whole new
                game... The stage is yours.
              </h6>
            </div>
          </div>
          <div>
            <div className="row">
              <div className={`mb-3 ${css.game_list_align} ${css.game_list}`}>
                {games.map((game) => (
                  <div key={game.id} className={`col-md-4 ${css.game}`}>
                    <div className={`col-md-12 ${css.game_list_pd}`}>
                      <div className={`col-md-12 ${css.game_list_wrap}`}>
                        <GameItem game={game} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameList;
