import React, { Suspense } from "react";
import { getGame } from "../../redux/actions/game";
import { Await, defer, useLoaderData } from "react-router-dom";
import ViewEditGame from "./edit-game";

const EditGameContainer = () => {
  const { gameData } = useLoaderData();
  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={gameData}>
          {(loadGame) => <ViewEditGame gameData={gameData} />}
        </Await>
      </Suspense>
    </>
  );
};

export default EditGameContainer;

export const loader = async ({ request, params }) => {
  const id = params.id;

  let userData = localStorage.getItem("persist:root");
  const token = JSON.parse(userData).accessToken;

  var gameData;
  await getGame(id, JSON.parse(token))
    .then((result) => {
      gameData = result.data.data;
    })
    .catch((error) => console.log(error));

  return defer({ gameData: gameData });
};
