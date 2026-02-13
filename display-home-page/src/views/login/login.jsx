import React, { useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Toast } from 'primereact/toast';

import loginStyles from './login.module.css';
import { login } from '../../redux/actions/authentication';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be 8 characters at minimum")
        .required("Password is required"),
});

const ViewLogin = (props) => {

    const dispatch = useDispatch();
    const state = useSelector((store) => store.auth)
    let navigate = useNavigate();
    const toast = useRef(null);

    if (state.isAuthenticated) {
        return <Navigate to="/" />;
    }

    const loginClick = (values) => {
        dispatch(login(values, (result) => {
            if (result.success) {
                navigate('/')
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: result.message,
                    life: 3000
                })
            }
        }));
    }

    return (
        <div className={`row g-0 ${loginStyles.signup_container}`}>
            <Toast ref={toast} />
            <div className={`col-md-6 ${loginStyles.signup_left_image}`}>
                <img src='./assets/left-img.png' alt='' />
            </div>
            <div className={`col-md-6 ${loginStyles.signup_right_form}`}>
                <div className={`${loginStyles.register_logo}`}>
                    <img src='./assets/signup-logo.png' alt='' />
                </div>
                <div className={`${loginStyles.signup_title}`}>
                    <h1>Let's get started</h1>
                    <p>Creating Games Made Easier</p>
                </div>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={loginClick}
                >
                    {({ touched, errors, isSubmitting, values }) => (
                        <Form className={`${loginStyles.form_container}`}>
                            <div className={`${loginStyles.form_field}`}>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    className={`${loginStyles.textBox} ${touched.email && errors.email ? "is-invalid" : ""}`
                                    }
                                />
                                <ErrorMessage
                                    component="div"
                                    name="email"
                                    className={`invalid-field ${loginStyles.form_invalid_form}`}
                                />
                                {/* <input placeholder='Email' /> */}
                            </div>
                            <div className={`${loginStyles.form_field}`}>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className={`${loginStyles.textBox} ${touched.password && errors.password ? "is-invalid" : ""}`
                                    }
                                />
                                <ErrorMessage
                                    component="div"
                                    name="password"
                                    className={`invalid-field ${loginStyles.form_invalid_form}`}
                                />
                            </div>

                            <div className={`form-check pt-2 pb-3 ${loginStyles.signup_form_check}`}>
                                <span className={`d-flex justify-content-start align-items-center`}>
                                    <input className={`form-check-input ${loginStyles.signup_form_input}`} type="checkbox" value="" id="defaultCheck1" />
                                    <label className={`form-check-label ${loginStyles.signup_form_label}`} htmlFor="defaultCheck1">
                                        Remember Me
                                    </label>
                                </span>
                                <span className={`${loginStyles.text_underline}`}><a href="#">Forgot Password</a></span>
                            </div>

                            <button className={`btn ${loginStyles.get_start_btn}`} type='submit'>
                                Login <i className={`bi bi-arrow-right-circle ${loginStyles.right_arrow}`}></i>
                            </button>

                        </Form>
                    )}
                </Formik>

                <div className={`mt-4 ${loginStyles.signup_login}`}>
                    <p>Don't have an account?
                        <Link to="/signup" className={`${loginStyles.text_underline}`}> Get Started</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ViewLogin
