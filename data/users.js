import bcrypt from "bcryptjs";

const users = [
  {
    fname: "utkarsh",
    phone: "7021993130",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    fname: "sushil",
    phone: "8692836221",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
