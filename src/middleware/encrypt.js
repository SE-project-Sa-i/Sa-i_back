import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// 비밀번호 암호화
export const encrypt = (password) => {
  const saltRound = parseInt(process.env.USER_PASS_SALT);
  const salt = bcrypt.genSaltSync(saltRound);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

// 비밀번호 검증
export const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
