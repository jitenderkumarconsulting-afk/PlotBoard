import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/auth-slice";
import addGameReducer from "../slices/add-game.slice";
import gamesReducer from "../slices/games.slice";
import gameReducer from "../slices/game.slice";
import playgameReducer from "../slices/play-game.slice";

const persistConfig = {
  key: "root",
  storage,
};
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    addGame: addGameReducer,
    games: gamesReducer,
    game: gameReducer,
    playgame: playgameReducer,
    //anotherReducerShortcut:anotherReducer, // add more like this
  },
  middleware: [thunk], // by defaut thunk is included in reactjs-redux so no need of it.
});

export default store;
