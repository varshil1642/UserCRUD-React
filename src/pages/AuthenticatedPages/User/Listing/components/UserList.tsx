import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router";
import { genders } from "../../../../../models/user";
import {
  deleteSingleUser,
  getUser,
} from "../../../../../services/user-services";
import { ICustomer } from "../../../../../models/customers";
import { IAuthor } from "../../../../../models/authors";
import { IPublisher } from "../../../../../models/publishers";

import {
  FormSnackBar,
  ConfirmDeleteBox,
} from "../../../../../shared/formik-components/FormikComponents";

import { startCase } from "lodash";
import { connect, useSelector } from "react-redux";
import { registerModel } from "../../../../../models/registerModel";
import { setUserList } from "../../../../../redux/actions";

const UserList = (props: any) => {
  console.log(props);

  type userTypes = ICustomer[] | IAuthor[] | IPublisher[];

  const [responseMsg, setResponseMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const userType = props.userType ? (props.userType as unknown as number) : 1;

  useEffect(() => {
    setUserList();
  }, []);

  const setUserList = async () => {
    var userLists = await getUser(userType, props.token);

    if (Array.isArray(userLists.data)) {
      (userLists.data as userTypes).forEach((user) => {
        user.dateofBirth = new Date(user.dateofBirth).toLocaleDateString(
          "es-UY"
        );
        user.gender = genders[user.gender as number];
      });

      props.setUserList(userLists.data!);
    } else {
      setResponseMsg(userLists.message);
      setSeverity("error");
      setOpenSnackBar(true);
    }
  };

  return (
    <>
      {(props.userList as registerModel[]) && props.userList.length > 0 ? (
        <CustomTable
          data={props.userList}
          ignore={["password", "userId", "userType", "profileImage"]}
          afterdelete={setUserList}
        ></CustomTable>
      ) : null}
      <FormSnackBar
        onClose={() => {
          setOpenSnackBar(false);
        }}
        open={openSnackBar}
        severity={severity}
        message={responseMsg}
      />
    </>
  );
};

const CustomTable = (props: any) => {
  const navigate = useNavigate();

  var ignoreFields = !props.ignore ? [] : props.ignore;

  const token = useSelector((state: any) => state.token);

  const [responseMsg, setResponseMsg] = useState("");
  const [severity, setSeverity] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(0);

  const openDialog = (userId: number) => {
    setDeletingUserId(userId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async (getUpdatedList: () => {}) => {
    let response = await deleteSingleUser(deletingUserId, token);
    setOpenDialog(false);
    if (response.statusCode === 200) {
      setSeverity("success");
    } else if (response.statusCode === 500) {
      setSeverity("error");
    }
    setResponseMsg(response.message);
    setOpenSnackBar(true);
    getUpdatedList();
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
              {/* <TableCell>Action</TableCell> */}
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
                  {/* <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
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
                  </TableCell> */}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDeleteBox
        open={isDialogOpen}
        onclose={handleDialogClose}
        onconfirm={() => {
          handleConfirmDelete(props.afterdelete);
        }}
        title="Are you sure, you want to delete this user ?"
      ></ConfirmDeleteBox>
    </>
  );
};

const mapStateToProps = (state: any, ownProps: any) => {
  return { ...state, ...ownProps };
};

const mapDispachToProps = (dispatch: any) => {
  return {
    setUserList: (userList: registerModel[]) => dispatch(setUserList(userList)),
  };
};

export default connect(mapStateToProps, mapDispachToProps)(UserList);
