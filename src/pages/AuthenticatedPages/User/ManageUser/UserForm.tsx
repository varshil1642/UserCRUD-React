import { Button, Container, Grid, Link } from "@mui/material";
import { TextField } from "formik-material-ui";
import { Form, Formik } from "formik";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { registerModel } from "../../../../models/registerModel";
import { updateSingleUser } from "../../../../services/user-services";
import { userTypes } from "../../../../models/user";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormikInputField,
  FormSnackBar,
  SelectDropdown,
} from "../../../../shared/formik-components/FormikComponents";
import { getSingleUser } from "../../../../services/user-services";
import { addUser } from "../../../../services/auth-services";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./../../../../redux/actions";

export const UserForm = () => {
  var emptyInitialObj: registerModel = {
    userId: 0,
    userType: 0,
    firstName: "",
    lastName: "",
    gender: 0,
    email: "",
    dateofBirth: "",
    password: "",
    mobileNo: "",
    publisherName: "",
  };

  const navigate = useNavigate();
  const params = useParams();

  const [inputFile, setInputFile] = useState(null);
  const [userType, setUserType] = useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [updatingUser, setUpdatingUser] =
    useState<registerModel>(emptyInitialObj);

  const token = useSelector((state: any) => state.token);

  const currentState = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setInitialValue();
  }, []);

  const setInitialValue = async () => {
    if (params.id) {
      let user = await getSingleUser(params.id as unknown as number, token);
      user.dateofBirth = new Date(user.dateofBirth).toLocaleDateString("fr-CA");
      user.password = "Abcd1234";
      setUpdatingUser(user);
      setUserType(user.userType);
      dispatch(setUser(user));
    }
  };

  const addUpdateUser = async (user: registerModel): Promise<registerModel> => {
    var response: any;
    var newInitialValues: registerModel = {} as registerModel;

    if (params.id) {
      response = await updateSingleUser(user, currentState.token, inputFile);
    } else {
      response = await addUser(user, inputFile);
    }

    if (response.statusCode === 200) {
      setSeverity("success");
      if (user.userId === currentState.user.userId) {
        if (inputFile) {
          user.profileImage = URL.createObjectURL(inputFile);
          console.log(user);
        }
        dispatch(setUser(user));
        newInitialValues = user;
      } else {
        newInitialValues = emptyInitialObj;
        navigate("/Users");
      }
    } else if (response.statusCode === 500) {
      setSeverity("error");
      newInitialValues = initialValues;
    }
    setResponseMsg(response.message);
    setOpenSnackBar(true);
    return newInitialValues;
  };

  const handleFileChange = (e: any) => {
    let file = e.target.files[0];

    let validImageRegex = new RegExp(
      /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
    );

    if (validImageRegex.test(file.name)) {
      console.log(file);
      setInputFile(e.target.files[0]);
    } else {
      alert("Only image files can be uploaded");
    }
  };

  const validationSchema = yup.object().shape({
    userType: yup.number().nullable().moreThan(0, "required"),

    firstName: yup
      .string()
      .required("required")
      .max(15, "Name must be less than 15 characters")
      .matches(/^[A-Z a-z]+$/, "Only alphabets are allowed"),

    lastName: yup
      .string()
      .required("required")
      .max(15, "Name must be less than 15 characters")
      .matches(/^[A-Z a-z]+$/, "Only alphabets are allowed"),

    gender: yup.number().nullable().moreThan(0, "required"),

    email: yup
      .string()
      .required("required")
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{1,4}$/, "Invalid email address"),

    dateofBirth: yup.date().required("required"),

    password: yup
      .string()
      .required("required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Invalid password"
      ),

    mobileNo: yup
      .string()
      .required("required")
      .length(10, "Mobile number must have 10 digits"),

    publisherName: yup
      .string()
      .nullable()
      .when("userType", {
        is: 3,
        then: yup.string().required("required"),
        otherwise: yup.string().nullable(),
      }),
  });

  var selectGenderData = [
    { key: 1, value: "Male" },
    { key: 2, value: "Female" },
    { key: 3, value: "Prefer not to say" },
  ];

  var initialValues = updatingUser;

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

      <h2>{params.id ? "Update" : "Add New"} User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values: any, { resetForm }) => {
          console.log(values);
          resetForm({ values: await addUpdateUser(values) });
        }}
        enableReinitialize
      >
        {(props: any) => {
          return (
            <Form>
              <Grid container className="add-update-grid">
                <Button
                  className="image-upload-btn"
                  variant="text"
                  component="label"
                  style={
                    inputFile || currentState.user.profileImage
                      ? {
                          backgroundImage: `url("${
                            inputFile
                              ? URL.createObjectURL(inputFile)
                              : currentState.user.profileImage +
                                `?${new Date().toString()}`
                          }")`,
                        }
                      : {}
                  }
                >
                  <input
                    name="profileImage"
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {/* <input type="file" className="image-upload-btn" /> */}
                <SelectDropdown
                  {...props}
                  name="userType"
                  label="User Type"
                  onChange={(e: any) => {
                    setUserType(e.target.value);
                    props.setFieldValue("userType", e.target.value);
                    props.handleChange(e);
                  }}
                  onBlur={props.handleBlur}
                  selectdata={userTypes}
                  errormsg="required"
                  disabled={params.id ? true : false}
                />

                <FormikInputField
                  type="text"
                  component={TextField}
                  name="firstName"
                  label="First Name"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                <FormikInputField
                  type="text"
                  component={TextField}
                  name="lastName"
                  label="Last Name"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                <FormikInputField
                  type="email"
                  component={TextField}
                  name="email"
                  label="Email"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  disabled={params.id ? true : false}
                />

                <FormikInputField
                  type="password"
                  component={TextField}
                  name="password"
                  label="Password"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  disabled={params.id ? true : false}
                />

                <FormikInputField
                  type="date"
                  component={TextField}
                  name="dateofBirth"
                  label="Birth Date"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <FormikInputField
                  type="text"
                  component={TextField}
                  name="mobileNo"
                  label="Mobile Number"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />

                {userType === 3 ? (
                  <FormikInputField
                    type="text"
                    component={TextField}
                    name="publisherName"
                    label="Publisher Name"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                ) : null}

                <SelectDropdown
                  {...props}
                  name="gender"
                  label="Gender"
                  onChange={(e: any) => {
                    props.setFieldValue("gender", e.target.value);
                  }}
                  onBlur={props.handleBlur}
                  selectdata={selectGenderData}
                  errormsg="required"
                />

                <Grid
                  item
                  md={8}
                  style={{ textAlign: "center" }}
                  className="buttons-grid"
                >
                  <Button variant="contained" color="primary" type="submit">
                    {params.id ? "Update" : "Register"}
                  </Button>
                  {params.id && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        navigate("/Users");
                      }}
                      type="button"
                      style={{ backgroundColor: "#646464" }}
                    >
                      Back
                    </Button>
                  )}
                </Grid>

                {!params.id && (
                  <Grid item md={8} style={{ textAlign: "center" }}>
                    <p style={{ margin: "0" }}>
                      Already registered?{" "}
                      <Link href="/" style={{ textDecoration: "none" }}>
                        Login Now
                      </Link>
                    </p>
                  </Grid>
                )}
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};
