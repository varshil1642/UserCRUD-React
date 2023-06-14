import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/Auth/LoginForm";

import { useSelector } from "react-redux";
import AuthenticatedPages from "./pages/AuthenticatedPages";
import { UserForm } from "./pages/AuthenticatedPages/User/ManageUser/UserForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LoginForm} />
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
