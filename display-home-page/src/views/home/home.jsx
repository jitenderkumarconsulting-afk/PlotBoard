import {  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/actions/authentication";

import css from "./home.module.css";
import GameCarousel from "../../components/carousel/gameCarousel";
import GameList from "../../components/games/gameList";

const ViewHome = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const logoutClick = () => {
    dispatch(
      logout((result) => {
        console.log(result);
        navigate("/");
      })
    );
  };

  
  return (
    <>
      <div className={`row g-0 ${css.home_container}`}></div>
      <GameCarousel />
      <GameList />
    </>
  );
};

export default ViewHome;
