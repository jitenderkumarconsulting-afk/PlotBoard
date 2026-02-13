import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const GameRoomLayout = () => {
  const authState = useSelector((store) => store.auth);

  return (
    <>
      <Header />
      <main>
        <div className="row">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GameRoomLayout;
