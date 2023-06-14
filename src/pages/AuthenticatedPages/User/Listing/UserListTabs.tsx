import { Box, Button, Tab, Tabs } from "@mui/material";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserList from "./components/UserList";
import { memo, SyntheticEvent, useEffect, useState, useMemo } from "react";
import { ConfirmDeleteBox } from "../../../../shared/formik-components/FormikComponents";
import { logoutUser } from "../../../../redux/actions";
import { connect } from 'react-redux';

const UserListTabs = (props: any) => {
  console.log("rendered")
  const navigate = useNavigate();

  // const [cookie] = useCookies();

  const userTypes = props.userTypes ? props.userTypes : undefined;
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const TabPanel = (props: any) => {
    return props.value === props.index ? <props.component {...props} /> : null;
  };
  return (
    <>
      {userTypes && userTypes.length > 0 && (
        <>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              marginBottom: "20px",
            }}
          >
            <Tabs value={value} onChange={handleChange}>
              {userTypes.map((user: { key: number; value: string }) => (
                <Tab label={user.value} key={user.key} />
              ))}
            </Tabs>
          </Box>
          {userTypes.map(
            (user: { key: number; value: string }, index: number) => (
              <TabPanel
                key={index}
                value={value}
                index={index}
                component={UserListMemo}
                //component={() => (<UserListMemo userType={user.key}></UserListMemo>)}
                userType={user.key}
              />
            )
          )}
        </>
      )}
    </>
  );
};

const UserListMemo = memo((props: any) => {

  var userType = useMemo(() => {
    return props.userType
  }, [props.userType])

  return (
    <UserList userType={userType}></UserList>
  )
}
)

const mapDispatchToProps = (dispatch: any) => {
  return {
    onLogoutClick: () => dispatch(logoutUser())
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListTabs);
