import { Button, Container, Grid, Link } from "@mui/material";
import { TextField } from "formik-material-ui";
import { Form, Formik } from "formik";
import { ILogin } from "../../models/login";
import { login } from "../../services/auth-services";
import {
  FormikInputField,
  FormSnackBar,
} from "../../shared/formik-components/FormikComponents";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { logoutUser, setToken } from "../../redux/actions";
import { setUser } from "./../../redux/actions";
import { registerModel } from "./../../models/registerModel";

const LoginForm = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, []);

  const initialValues: ILogin = {
    email: "",
    password: "",
  };

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [credentials, setCredentials] = useState(initialValues);

  const navigate = useNavigate();

  const loginUser = async (credentials: ILogin) => {
    var response = await login(credentials);
    setResponseMsg(response.message);

    if (response.statusCode === 200) {
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user as registerModel));
      setSeverity("success");
      navigate("/Users");
      setCredentials(initialValues);
    } else {
      setCredentials(credentials);
      setSeverity("error");
    }
    setOpenSnackBar(true);
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("required")
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{1,4}$/, "Invalid email address"),

    password: yup
      .string()
      .required("required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Invalid password"
      ),
  });

  return (
    <Container className="form-container">
      {openSnackBar && (
        <FormSnackBar
          onClose={() => {
            setOpenSnackBar(false);
          }}
          open={openSnackBar}
          severity={severity}
          message={responseMsg}
        />
      )}

      <h2>Login</h2>
      <Formik
        initialValues={credentials}
        validationSchema={validationSchema}
        onSubmit={async (values: any) => {
          await loginUser(values);
        }}
        enableReinitialize
      >
        {(props: any) => {
          return (
            <Form>
              <Grid container className="add-update-grid">
                <FormikInputField
                  type="text"
                  component={TextField}
                  name="email"
                  label="Email"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                <FormikInputField
                  type="password"
                  component={TextField}
                  name="password"
                  label="Password"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                <Grid
                  item
                  md={8}
                  style={{ textAlign: "center" }}
                  className="buttons-grid"
                >
                  <Button variant="contained" color="primary" type="submit">
                    Login
                  </Button>
                </Grid>

                <Grid item md={8} style={{ textAlign: "center" }}>
                  <p style={{ margin: "0" }}>
                    Don't have an account?{" "}
                    <Link href="/Add" style={{ textDecoration: "none" }}>
                      Register Now
                    </Link>
                  </p>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default LoginForm;
