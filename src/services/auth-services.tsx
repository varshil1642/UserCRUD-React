import axios from "axios";
import { ILogin } from "../models/login";
import { registerModel } from "../models/registerModel";

export const login = async (credentials: ILogin) => {
  var res: any;
  await axios
    .post("https://localhost:7026/Auth/Login", credentials)
    .then((response) => {
      res = response.data;
    });
  return res;
};

export const addUser = async (model: registerModel, file: any) => {
  var res: any;
  var formData = new FormData();

  formData.append("uploadedImage", file);

  Object.entries(model).map((item) => {
    console.log(item);
    formData.append(item[0], item[1]);
  });

  await axios
    .post("https://localhost:7026/Auth/AddUser", formData)
    .then((response: any) => {
      res = response.data;
    });
  return res;
};
