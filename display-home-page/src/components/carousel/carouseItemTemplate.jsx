import React from "react";
import css from "./carousel.module.css";

const CarouselItem = (game) => {
  return (
    <div className={`${css.hero_banner}`}>
      <div className="container-fluid  mb-md-5 mb-1">
        <div className={`${css.banner_content_align}`}>
          <div className="container">
            <div className={`row ${css.banner_content_align}`}>
              <div className="col-md-6">
                <div className={`mb-2  ${css.hero_banner_text}`}>
                  <h4>{game.title}</h4>
                  <h6>{game.heading}</h6>
                  <div className={`${css.game_detail}`}>
                    <a href="#" className={`${css.button_dark}`}>
                      Play Now
                    </a>
                    <a href="#">
                      More Info
                    </a>
                  </div>
                </div>
              </div>
              <div className={`col-md-6 ${css.content_end}`}>
                <div className={`${css.hero_banner_img}`}>
                  <img src={`${game.image}`} alt={game.title} className="w-6 shadow-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
