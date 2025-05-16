import { encrypt, comparePassword } from "../middleware/encrypt.js";
import { createJwt } from "../middleware/jwt.js";
import {
  addUser,
  findUserByUsername,
} from "../repositories/user.repository.js";
import { userResponseDTO } from "../dtos/user.dto.js";
import {
  IntervalServerError,
  MismatchedPasswordError,
  UserNotFoundError,
} from "../errors.js";

// 회원가입 서비스
export const userSignupService = async (userData) => {
  // 비밀번호 암호화
  const hashedPassword = encrypt(userData.password);

  // DB에 저장할 사용자 데이터 준비
  const userToSave = {
    ...userData,
    password: hashedPassword,
  };

  // 사용자 추가
  const result = await addUser(userToSave);
  if (!result) {
    throw new IntervalServerError("회원가입에 실패했습니다.", null);
  }

  return result;
};

// 로그인 서비스
export const userLoginService = async (loginData) => {
  // 사용자 조회
  const user = await findUserByUsername(loginData.serviceId);

  // 사용자가 존재하지 않음
  if (!user) {
    throw new UserNotFoundError("존재하지 않는 사용자입니다.", null);
  }

  // 비밀번호 검증
  const isPasswordValid = comparePassword(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new MismatchedPasswordError("비밀번호가 일치하지 않습니다.", null);
  }

  // JWT 토큰 생성
  const token = createJwt(user);

  const data = {
    token,
    user: userResponseDTO(user),
  };

  return data;
};
