import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import _, { startCase } from "lodash";
import { Field } from "formik";
import { useNavigate } from "react-router-dom";
import { IPublisher } from "../../models/publishers";
import { IAuthor } from "../../models/authors";
import { ICustomer } from "../../models/customers";
import { deleteSingleUser } from "../../services/user-services";
import { useState } from "react";
import { useSelector } from "react-redux";

export const SelectDropdown = (props: any) => {
  var isValid = Boolean(
    _.get(props.touched, props.name) && _.get(props.errors, props.name)
  );

  return (
    <FormControl fullWidth size={props.size}>
      <InputLabel error={isValid}>{props.label}</InputLabel>
      <Select
        {...props}
        label={props.label}
        name={props.name}
        onChange={props.onChange}
        onBlur={props.onBlur}
        error={isValid}
        //value={props.values[props.name] || ""}
      >
        {props.selectdata.map((obj: any) => (
          <MenuItem value={obj.key} key={obj.key}>
            {obj.value}
          </MenuItem>
        ))}
      </Select>
      {isValid && <FormHelperText error>{props.errormsg}</FormHelperText>}
    </FormControl>
  );
};

export const CustomTable = (props: any) => {
  const navigate = useNavigate();

  var ignoreFields = !props.ignore ? [] : props.ignore;

  const [responseMsg, setResponseMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(0);

  const token = useSelector((state: any) => state.token);

  const openDialog = (userId: number) => {
    setDeletingUserId(userId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    let response = await deleteSingleUser(deletingUserId, token);
    setOpenDialog(false);
    if (response.statusCode === 200) {
      setSeverity("success");
    } else if (response.statusCode === 500) {
      setSeverity("error");
    }
    setResponseMsg(response.message);
    setOpenSnackBar(true);
    navigate("/");
  };

  return (
    <>
      <FormSnackBar
        onClose={() => {
          setOpenSnackBar(false);
        }}
        open={openSnackBar}
        severity={severity}
        message={responseMsg}
      />
      <TableContainer component={Paper}>
        <Table id="custom-table">
          <TableHead className="table-head">
            <TableRow>
              {Object.keys(props.data[0])?.map(
                (key: string) =>
                  !ignoreFields.includes(key) && (
                    <TableCell key={key}>{startCase(key)}</TableCell>
                  )
              )}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map(
              (item: ICustomer | IAuthor | IPublisher, index: number) => (
                <TableRow key={index}>
                  {Object.entries(item).map(
                    (entry) =>
                      !ignoreFields.includes(entry[0]) && (
                        <TableCell key={entry[0]}>{entry[1]}</TableCell>
                      )
                  )}
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        navigate(`Edit/${item.userId}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="delete-btns"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        openDialog(item.userId);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDeleteBox
        open={isDialogOpen}
        onclose={handleDialogClose}
        onconfirmdelete={handleConfirmDelete}
      ></ConfirmDeleteBox>
    </>
  );
};

export const FormikInputField = (props: any) => {
  return (
    <Grid item lg={12} className="single-input-field">
      <Field
        {...props}
        component={props.component}
        type={props.type}
        name={props.name}
        disabled={props.disabled}
        label={props.label}
        style={{ width: "100%" }}
        onChange={props.onChange ? props.onChange : undefined}
        onBlur={props.onBlur ? props.onBlur : undefined}
        InputLabelProps={props.InputLabelProps}
        selectdata={props.selectdata}
        size="large"
      />
    </Grid>
  );
};

export const FormSnackBar = (props: any) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={props.onClose}
      className="form-snackbar"
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export const ConfirmDeleteBox = (props: any) => {
  return (
    <Dialog
      open={props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onclose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={props.onconfirm}
          autoFocus
          variant="contained"
          color="error"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
