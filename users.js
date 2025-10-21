import bcrypt from "bcryptjs";

export const users = [
  { username: "adam", password: bcrypt.hashSync("tajne123", 8) },
  { username: "maria", password: bcrypt.hashSync("solar2025", 8) }
];

export function verifyUser(username, password){
  const u = users.find(x => x.username === username);
  if(!u) return false;
  return bcrypt.compareSync(password, u.password);
}
