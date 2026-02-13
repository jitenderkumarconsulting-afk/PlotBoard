import PrivateRoute from "./privateRoute";
import RootLayout from "../layout/rootLayout";
import { createBrowserRouter } from "react-router-dom";
import ViewHome from "../views/home/home";
import ViewLogin from "../views/login/login";
import ViewSignup from "../views/signup/signup";
import ViewMyGames from "../views/my-games/my-games";
import ViewBrowseGames from "../views/browse-games/browse-games";
import ViewAddGame from "../views/add-game/add-game";
import ViewProfile from "../views/profile/profile";
import { loader as gameDataToEditLoader } from "../views/add-game/edit-game-from-list";
import { loader as gameLoader } from "../views/edit-game/edit-game-container";
import EditGameContainer from "../views/edit-game/edit-game-container";
import PlayGameContainer, { loader as playGameLoader } from "../views/preview-game/play-game-container";
import GameRoomContainer from "../views/game-room/game-room-container";
import GameRoomLayout from "../layout/gameRoomLayout";
import PlayGameRoom from "../views/game-play/play-game";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ViewHome />,
      },
      {
        path: "/my-games",
        // element: <PrivateRoute component={ViewMyGames} />,
        element: <ViewMyGames />,
      },
      {
        path: "/add-game",
        element: <ViewAddGame />,
      },
      {
        path: "/preview-game/:id",
        element: <PlayGameContainer />,
        loader: playGameLoader
      },
      {
        path: "/edit-game",
        element: <PrivateRoute component={EditGameContainer} />,
        loader: gameLoader
      },
      {
        path: "/edit-game/:id",
        element: <EditGameContainer />,
        loader: gameDataToEditLoader
      },
      {
        path: "/profile",
        element: <PrivateRoute component={ViewProfile} />,
      },
      {
        path: "/browse-games",
        element: <ViewBrowseGames />,
      },
    ],

  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: "game-room/:token",
        element: <GameRoomContainer />,
      },
      {
        path: "play-game/:token",
        element: <PlayGameRoom />,
      }
    ]
  },
  {
    path: "/login",
    element: <ViewLogin />,
  },
  {
    path: "/signup",
    element: <ViewSignup />,
  },
]);
