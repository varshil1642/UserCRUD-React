import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ConfirmDeleteBox } from "./formik-components/FormikComponents";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const TopHeader = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();
  const state = useSelector((state: any) => state);

  const navigate = useNavigate();

  console.log(state.user)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ backgroundColor: "#002e5c" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="top-header-user"
          >
            {state.user.profileImage && (
              <img className="profile-image" src={state.user.profileImage} />
            )}
            <Button
              variant="text"
              onClick={() => navigate(`Edit/${state.user.userId}`)}
              color="inherit"
              style={{ fontSize: "15px" }}
            >
              {state.user.firstName + " " + state.user.lastName}
            </Button>
          </Typography>

          <Button
            variant="text"
            onClick={() => {
              setOpenDialog(true);
            }}
            color="inherit"
            endIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <ConfirmDeleteBox
        open={openDialog}
        onclose={() => {
          setOpenDialog(false);
        }}
        onconfirm={() => {
          dispatch(logoutUser());
        }}
        title="Are you sure, you want to logout ?"
      ></ConfirmDeleteBox>
    </Box>
  );
};

export default TopHeader;
