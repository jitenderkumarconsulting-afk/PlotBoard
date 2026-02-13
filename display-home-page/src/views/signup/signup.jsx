import React, { useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Toast } from "primereact/toast";

import signupStyles from "./signup.module.css";
import { register } from "../../redux/actions/authentication";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name should be atleast be 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ViewSignup = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.auth);
  let navigate = useNavigate();
  const toast = useRef(null);

  if (state.isAuthenticated) {
    return <Navigate to="/" />;
  }
  const signupClick = (values) => {
    dispatch(
      register(values, (result) => {
        if (result.success) {
          navigate("/");
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.message,
            life: 3000,
          });
        }
      }),
    );
  };
  return (
    <div className={`row g-0 ${signupStyles.signup_container}`}>
      <Toast ref={toast} />
      <div className={`col-md-6 ${signupStyles.signup_left_image}`}>
        <img src="./assets/left-img.png" alt="" />
      </div>
      <div className={`col-md-6 ${signupStyles.signup_right_form}`}>
        <div className={`${signupStyles.register_logo}`}>
          <img src="./assets/signup-logo.png" alt="" />
        </div>
        <div className={`${signupStyles.signup_title}`}>
          <h1>Sign Up for new account!</h1>
          <p>Creating Games Made Easier</p>
        </div>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={signupClick}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form className={`${signupStyles.form_container}`}>
              <div className={`${signupStyles.form_field}`}>
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  autoComplete="off"
                  className={`${signupStyles.textBox} ${touched.email && errors.email ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  component="div"
                  name="name"
                  className={`invalid-field ${signupStyles.form_invalid_form}`}
                />
              </div>
              <div className={`${signupStyles.form_field}`}>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="off"
                  className={`${signupStyles.textBox} ${touched.email && errors.email ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  component="div"
                  name="email"
                  className={`invalid-field ${signupStyles.form_invalid_form}`}
                />
              </div>
              <div className={`${signupStyles.form_field}`}>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`${signupStyles.textBox} ${touched.password && errors.password ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  component="div"
                  name="password"
                  className={`invalid-field ${signupStyles.form_invalid_form}`}
                />
              </div>
              <div className={`${signupStyles.form_field}`}>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`${signupStyles.textBox} ${touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  component="div"
                  name="confirmPassword"
                  className={`invalid-field ${signupStyles.form_invalid_form}`}
                />
              </div>
              <div
                className={`form-check pt-2 pb-3 ${signupStyles.signup_form_check}`}
              >
                <input
                  className={`form-check-input ${signupStyles.signup_form_input}`}
                  type="checkbox"
                  value=""
                  id="defaultCheck1"
                />
                <label
                  className={`form-check-label ${signupStyles.signup_form_label}`}
                  htmlFor="defaultCheck1"
                >
                  I agree to SampleApp{" "}
                  <a href="#" className={`${signupStyles.text_underline}`}>
                    Terms & Policies
                  </a>
                </label>
              </div>
              <button
                className={`btn ${signupStyles.get_start_btn}`}
                type="submit"
              >
                Get Started{" "}
                <i
                  className={`bi bi-arrow-right-circle ${signupStyles.right_arrow}`}
                ></i>
              </button>
            </Form>
          )}
        </Formik>

        <div className={`mt-4 ${signupStyles.signup_login}`}>
          <p>
            Already have an account?
            <Link to="/login" className={`${signupStyles.text_underline}`}>
              {" "}
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewSignup;
