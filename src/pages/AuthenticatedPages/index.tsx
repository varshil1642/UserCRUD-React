import "../../App.css";
import { Route, Routes } from "react-router-dom";
import { UserForm } from "./User/ManageUser/UserForm";
import UserListTabs from "./User/Listing/UserListTabs";
import { userTypes } from "../../models/user";

import TopHeader from "../../shared/TopHeader";
import { Container } from "@mui/material";

export default function AuthenticatedPages(props: any) {
  return (
    <>
      <TopHeader></TopHeader>
      <Container className="authenticated-pages">
        <Routes>
          <Route
            path=""
            Component={() => <UserListTabs userTypes={userTypes} />}
          ></Route>
          <Route path="Edit/:id" Component={UserForm} />
          <Route path="Add" Component={UserForm} />
        </Routes>
      </Container>
    </>
  );
}
