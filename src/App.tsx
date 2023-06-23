import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/Auth/LoginForm";

import { useSelector } from "react-redux";
import AuthenticatedPages from "./pages/AuthenticatedPages";
import { UserForm } from "./pages/AuthenticatedPages/User/ManageUser/UserForm";
import Editor from "./pages/RichTextEditor/JoditEditor";
import CkEditor from "./pages/RichTextEditor/CKEditor";
import ReactRte from "./pages/RichTextEditor/ReactRte";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Editor} />
        <Route path="/CkEditor" Component={CkEditor} />
        <Route path="/ReactRte" Component={ReactRte} />
        <Route path="/Add" Component={UserForm} />
        <Route
          path="/Users/*"
          Component={() => (
            <AuthenticatedComponents component={AuthenticatedPages} />
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

const AuthenticatedComponents = (props: any) => {
  const token: string = useSelector((state: any) => state.token);
  return token !== null ? (
    <props.component {...props}></props.component>
  ) : (
    <Navigate to="/" />
  );
};
