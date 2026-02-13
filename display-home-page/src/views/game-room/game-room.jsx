import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

import gameRoomStyle from "./game-room.module.css";
import { createGameState } from "../../redux/actions/game-state";

const GameRoomSetup = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let toast;
  const { gameToken } = props;

  const auth = useSelector((state) => state.auth);

  const [maxPlayerLimit, setMaxPlayerLimit] = useState();
  const [playerName, SetPlayerName] = useState();

  console.log("user:gameToken,  ", auth.user, gameToken);
  
  const onPlayerNameChange = (e) => {
    SetPlayerName(e.target.value);
  };

  const onGameRoomEnterClick = (e) => {
    e.preventDefault();

    console.log("playerName", playerName);

    if (auth.accessToken !== "") {
      navigate("/play-game/" + gameToken);
    }
    if (playerName !== "" && playerName !== undefined) {
      navigate("/play-game/" + gameToken + "?name=" + playerName);
    }
  };

  useEffect(() => {
    if (gameToken && auth.accessToken !== "") {
      dispatch(
        createGameState(gameToken, (result) => {
          console.log("check for max player limit: ", result);
          if (result?.code?.toString() === "409") {
            setMaxPlayerLimit(true);
            console.log("createGameState error: ", result);
            toast.show({
              severity: "error",
              summary: "Max Limit Reached!",
              detail: "Maximum player limit reached.",
              life: 3000
            })
          }else{
            
          }
        })
      );
    }
  }, [gameToken]);

  useEffect(() => { }, [maxPlayerLimit]);

  return (
    <div className={`my-5 row ${gameRoomStyle.game_room_container}`}>
      <Toast ref={(el) => (toast = el)} />
      {auth.accessToken !== "" && (
        <>
          <div
            className={`py-5 px-4 col-md-6 ${gameRoomStyle.game_room_login_container}`}
          >
            <h1>
              Welcome to the game <b>{auth.user.name}</b>
            </h1>
            <p className="mt-2">
              {!maxPlayerLimit && <p>Waiting for the other player to join</p>}
              {maxPlayerLimit && <p className={`${gameRoomStyle.max_limit_reached}`} >Max player limit reached!</p>}
            </p>
            {!maxPlayerLimit && (
              <input
                className={`mt-3 ${gameRoomStyle.start_btn}`}
                type="button"
                onClick={onGameRoomEnterClick}
                value="Start Game"
              />
            )}
            {maxPlayerLimit && (
              <input
                className={`mt-3 ${gameRoomStyle.start_btn}`}
                type="button"
                onClick={() => navigate("/")}
                value="Home Page"
              />
            )}
          </div>
        </>
      )}
      {auth.accessToken === "" && (
        <div
          className={`px-4 py-5 col-md-6 ${gameRoomStyle.game_room_login_container}`}
        >
          {!maxPlayerLimit && (
            <>
              {" "}
              <h1>Enter your name to enter the game : </h1>
              <input
                type="text"
                onChange={onPlayerNameChange}
                value={playerName}
                className={`mt-3 ${gameRoomStyle.game_login_input}`}
              />
            </>
          )}
          {maxPlayerLimit && <p>Max player limit reached!</p>}
          <div>
            {!maxPlayerLimit && (
              <input
                className={`mt-3 ${gameRoomStyle.start_btn}`}
                type="button"
                onClick={onGameRoomEnterClick}
                value="Start Game"
              />
            )}
            {maxPlayerLimit && (
              <input
                className={`mt-3 ${gameRoomStyle.start_btn}`}
                type="button"
                onClick={() => navigate("/")}
                value="Home Page"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoomSetup;
