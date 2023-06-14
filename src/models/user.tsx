export interface IUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateofBirth: string;
  mobileNo: string;
  gender: number | string;
  profileImage?: string | null;
}

export enum genders {
  Male = 1,
  Female = 2,
  "Preferred not to say" = 3,
}

export const userTypes = [
  { key: 1, value: "Author" },
  { key: 2, value: "Customer" },
  { key: 3, value: "Publisher" },
];
