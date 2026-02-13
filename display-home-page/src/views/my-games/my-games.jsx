import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";

import gameStyles from "./my-games.module.css";
import { getGames, deleteGame } from "../../redux/actions/game";
import { list } from "../../redux/slices/games.slice";

const ViewMyGames = (props) => {
  const dispatch = useDispatch();
  const games = useSelector((state) => state.games);
  let toast;

  const removeGame = (id) => (event) => {
    event.preventDefault();

    if (!window.confirm("Are you sure to Delete this game?")) {
      return;
    }
    dispatch(
      deleteGame(id, (result) => {
        if (result.success) {
          toast.show({
            severity: "success",
            summary: "Delete",
            detail: result.message,
            life: 3000,
          });
        } else {
          toast.show({
            severity: "error",
            summary: "Error",
            detail: result.message,
            life: 3000,
          });
        }
      }),
    );
  };

  useEffect(() => {
    // Load all games
    dispatch(
      getGames((result) => {
        if (result.success) {
          dispatch(list(result.data));
        } else {
          toast.show({
            severity: "error",
            summary: "Error",
            detail: "Unable to load games, kindly try again later!",
            life: 3000,
          });
        }
      }),
    );
  }, []);
  return (
    <>
      <div className={`mb-4 ${gameStyles.card_container}`}>
        <Toast ref={(el) => (toast = el)} />
        <div className={`mb-3 ${gameStyles.card_heading_btn}`}>
          <div className="">
            <h1 className={`${gameStyles.card_heading}`}>My Games</h1>
            <p className={`mb-0 ${gameStyles.card_text}`}>
              Every game on SampleApp is free to play and remix!
            </p>
          </div>
          <div className={`${gameStyles.add_game_btn_container}`}>
            <Link className={`${gameStyles.add_games_btn}`} to="/add-game">
              Add Games
            </Link>
          </div>
        </div>
        <div className="row ">
          {games.items.map((game) => {
            return (
              <div
                key={game.id}
                className="col-lg-3 col-md-4 col-sm-6 col-12 p-2  px-md-2  py-lg-4 px-lg-3"
              >
                <div className={`card  h-100 ${gameStyles.games_cards}`}>
                  <div className={`${gameStyles.card_img}`}>
                    <img
                      className={`card-img-top`}
                      src={game.original_image_url}
                      alt=""
                    />
                  </div>
                  <div className={`${gameStyles.card_bottom_content}`}>
                    <h2 className={`mb-2 ${gameStyles.games_card_heading}`}>
                      {game.name}
                    </h2>
                    <p className={`mb-4 ${gameStyles.game_card_content}`}>
                      {game.description}
                    </p>
                    <div className={`${gameStyles.card_bottom_actions}`}>
                      <span>
                        <Link
                          className={`ms-2 ${gameStyles.delt_btn}`}
                          to={`/edit-game/${game.id}`}
                        >
                          <i className={`bi bi-pencil`}></i>
                        </Link>
                      </span>
                      <span>
                        <button
                          onClick={removeGame(game.id)}
                          className={`ms-2 ${gameStyles.delt_btn}`}
                        >
                          <i className={`bi bi-trash3`}></i>
                        </button>
                      </span>
                      {/* <span>
                        <Link
                          className={`ms-2 ${gameStyles.delt_btn}`}
                          to={`/preview-game/${game.id}`}
                        >
                          <i className={`bi bi-play`}></i>
                        </Link>
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ViewMyGames;
