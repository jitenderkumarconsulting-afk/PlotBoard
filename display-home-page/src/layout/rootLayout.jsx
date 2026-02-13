import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { refreshToken } from "../redux/actions/authentication";
import { authAction } from "../redux/slices/auth-slice";

const RootLayout = () => {
  const authState = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleTokenExpiration = () => {
    const { exp } = jwtDecode(authState?.accessToken);
    if (Date.now() >= exp * 1000 - (1000 * 5 * 60)) {
      dispatch(
        refreshToken(authState?.accessToken, (result) => {
          if (!result.success) {
            dispatch(authAction.resetAuthState());
            navigateTo("/login");
          }
        })
      );
    }
  };

  useEffect(() => {
    if (authState?.accessToken) {
      const tokenCheckInterval = setInterval(handleTokenExpiration, 5000);  // Check every 5 seconds

      // Clean up the interval when the component unmounts
      return () => clearInterval(tokenCheckInterval);
    } else {
      navigateTo("/login");
    }
  }, [authState.accessToken, navigateTo, dispatch]);

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

export default RootLayout;
