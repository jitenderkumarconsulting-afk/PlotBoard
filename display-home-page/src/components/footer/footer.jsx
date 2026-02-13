import React from "react";
import { Link } from "react-router-dom";
import css from "./footer.module.css";

const Footer = () => {
  return (
    <>
      <div className={`${css.footer_wrap}`}>
        <div className={`${css.footer_copyright}`}>
          <span>© 2023 SampleApp</span>
        </div>
        <div className={`${css.footer_listing}`}>
          <Link to="/" className={`list_mgn`}>
            About Us
          </Link>
          <Link to="/" className={`list_mgn`}>
            Privacy Policy
          </Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
