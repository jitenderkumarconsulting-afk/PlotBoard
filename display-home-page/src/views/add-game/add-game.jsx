import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Toast } from "primereact/toast";

import { appBaseUrl } from "../../utils/utils";
import { createGame } from "../../redux/actions/game";
import { initialGameScriptData } from "./initial-game-script-data";
import styles from "./add-games.module.css";

// Validation schema using Yup
const addGameSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  visibility: Yup.string()
});

const ViewAddGame = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let { id } = useParams();
 
  const game = useSelector((state) => state.addGame);
  const { gameData } = props;
  let toast;

  const handleSubmit = (values, actions) => {
    //before submitting, add game script to values
    values['game_script'] = initialGameScriptData;
    values['visibility'] = 'PUBLIC';

    if (values['thumbnail_image_url'] === "") {
      values['thumbnail_image_url'] = appBaseUrl+"/assets/logo-sm.png";
    }
    //set original_image_url from thumbnail_image_url
    values['original_image_url'] = values?.thumbnail_image_url
    console.log(values);
    dispatch(
      createGame(values, id, (result) => {
        console.log(result);
        if (result.success) {
          // message
          toast.show({
            severity: "success",
            summary: "Success",
            detail: "Game created successfully!",
            life: 3000,
          });
          actions.setSubmitting(false);

          navigate('/edit-game/' + result.data.id);

        } else {
          toast.show({
            severity: "error",
            summary: "Error",
            detail: "Error while creating the game. Please try again later.",
            life: 3000,
          });

          actions.setSubmitting(false);
        }
      })
    );
  };

  return (
    <div className={`${styles.add_games_container}`}>
      <div className={`${styles.left_form}`}>
        <div className={`mb-4 ${styles.add_games_heading}`}>
          <h1>Add Game</h1>
          <p>
            Creating Your Favourite Games in a Jiffy.
          </p>
        </div>
        <Toast ref={(el) => (toast = el)} />
        <Formik
          enableReintialize={true}
          initialValues={gameData ?? game}
          validationSchema={addGameSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form className={`${styles.form_container}`}>
              <div className="mb-4">
                <Field type="text"
                  id="name" name="name"
                  className={`${styles.textBox}`}
                  placeholder="Name" />
                {touched.name && errors.name && (
                  <div className={`error ${styles.form_invalid_form}`}>{errors.name}</div>
                )}

              </div>
              <div className="mb-3">
                <Field as="textarea"
                  rows="6"
                  id="description"
                  name="description"
                  className={`${styles.input_textarea}`}
                  placeholder="Description" />
                {touched.description && errors.description && (
                  <div className={`mt-0 error ${styles.form_invalid_form}`}>{errors.description}</div>
                )}
              </div>
              <div className="mb-3">
                <Field
                  type="text"
                  id="thumbnail_image_url"
                  name="thumbnail_image_url"
                  className={`${styles.textBox}`}
                  placeholder="Thumbnail Image URL"
                />
                {touched.thumbnail_image_url && errors.thumbnail_image_url && (
                  <div className={`error ${styles.form_invalid_form}`}>{errors.thumbnail_image_url}</div>
                )}
              </div>

              <div className={`pt-3 ${styles.submit_cancel_btn}`}>
                <div className={`${styles.add_games_btn}`}>
                  <span className="me-2">
                    <button type="submit" className={`${styles.submit_btn}`} disabled={isSubmitting}>
                      Submit
                    </button>
                  </span>
                  <span className="ms-2">
                    <Link to="/my-games" className={`${styles.cancel_btn}`}>Cancel</Link>
                  </span>
                </div>
                {isSubmitting && <div>Loading...</div>}
              </div>

            </Form>
          )}
        </Formik>
      </div>
      <div className={`${styles.right_img}`}>
        <img src="images/add-game-img.png" alt="" />
      </div>
    </div>
  );
};

export default ViewAddGame;
