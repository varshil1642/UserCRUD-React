import axios from "axios";
import { ICustomer } from "../models/customers";
import { IAuthor } from "../models/authors";
import { IPublisher } from "../models/publishers";
import { registerModel } from "../models/registerModel";

export const getUser = async (userType: number, token: string) => {
  var res: any;
  var headers = { Authorization: `Bearer ${token}` };
  await axios
    .get(`https://localhost:7026/Users/GetUsers/${userType}`, { headers })
    .then((response) => {
      res = response.data;
    })
    .catch((error) => {
      res = showError(error);
    });
  return res;
};

export const getSingleUser = async (userId: number, token: string) => {
  var res: any = {} as registerModel;
  var headers = { Authorization: `Bearer ${token}` };
  await axios
    .get(`https://localhost:7026/Users/GetSingleUser/${userId}`, { headers })
    .then((response) => {
      res = response.data.data;
    })
    .catch((error) => {
      res = showError(error);
    });
  return res;
};

export const updateSingleUser = async (model: registerModel, token: string, file: any) => {
  var res: any;
  var headers = { Authorization: `Bearer ${token}` };

  var formData = new FormData();

  formData.append("uploadedImage", file);

  Object.entries(model).map((item) => {
    console.log(item);
    formData.append(item[0], item[1]);
  });

  await axios
    .put("https://localhost:7026/Users/UpdateUser", formData, { headers })
    .then((response) => {
      res = response.data;
    })
    .catch((error) => {
      res = showError(error);
    });
  return res;
};

export const deleteSingleUser = async (userId: number, token: string) => {
  var res: any;
  var headers = { Authorization: `Bearer ${token}` };
  await axios
    .delete(`https://localhost:7026/Users/DeleteUser/${userId}`, { headers })
    .then((response) => {
      res = response.data;
    })
    .catch((error) => {
      res = showError(error);
    });
  return res;
};

const showError = (error: any) => {
  if ("response" in error && error.response.status === 401) {
    return {
      statusCode: error.response.status,
      message: "Please login to access this page",
      data: null,
    };
  } else {
    return {
      statusCode: 500,
      message: "Some error occured",
      data: null,
    };
  }
};
