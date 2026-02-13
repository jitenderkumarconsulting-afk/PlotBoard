import React from "react";
import { Button } from 'primereact/button';
import css from "./gameItem.module.css";

const GameItem = ({ game }) => {
  return (
    <div className={`card h-100 ${css.games_cards}`}>
      <div className={`${css.card_img}`}>
        <img className={`card-img-top`} src={`${game.image}`} alt={game.title} />
      </div>
      <div className={`${css.game_list_details} ${css.card_bottom_content}`}>
        <h4 className={`mb-2 title ${css.games_card_heading}`}>
          {game.title}
        </h4>
        <h6 className={`mb-4`}>
          {game.heading}
        </h6>
        <p className={`${css.game_card_content} ${css.paragraph} ${css.paragraph_display}`}>{game.description}</p>
        <div className={``}>
          <Button label="Play" className={`p-button-rounded ${css.play_button}`}></Button>
          <Button label="Remix" severity="success" text className={`ms-2 ${css.remix_button}`}></Button>
        </div>
      </div>
    </div>
  );
};

export default GameItem;
