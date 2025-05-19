import { encrypt, comparePassword } from "../middleware/encrypt.js";
import { createJwt } from "../middleware/jwt.js";
import {
  addUser,
  findUserByUsername,
  findUserById,           // 추가된 함수
  updateUser,             // 추가된 함수
  deleteUser,             // 추가된 함수
  findUserWithPasswordById // 추가된 함수
} from "../repositories/user.repository.js";
import { userResponseDTO, userProfileResponseDTO } from "../dtos/user.dto.js";
import {
  IntervalServerError,
  MismatchedPasswordError,
  UserNotFoundError,
  NotFoundError,
  UnauthorizedError
} from "../errors.js";
import bcrypt from "bcrypt";

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

// 사용자 프로필 조회 서비스
export const getUserProfileService = async (userId) => {
  try {
    // User.findById(userId) 대신 리포지토리 함수 사용
    const user = await findUserById(userId);

    return userProfileResponseDTO(user);
  } catch (error) {
    throw error;
  }
};

// 사용자 프로필 수정 서비스
export const updateUserProfileService = async (userId, updateData) => {
  try {
    // 현재 비밀번호 확인 (비밀번호 변경 시)
    if (updateData.password) {
      const user = await findUserWithPasswordById(userId);

      // 현재 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(
          updateData.currentPassword,
          user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError("현재 비밀번호가 일치하지 않습니다.");
      }

      // 새 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // 현재 비밀번호 필드 제거
    delete updateData.currentPassword;

    // 사용자 정보 업데이트
    const updatedUser = await updateUser(userId, updateData);

    return userProfileResponseDTO(updatedUser);
  } catch (error) {
    throw error;
  }
};

// 회원 탈퇴 서비스
export const deleteUserService = async (userId, password) => {
  try {
    const user = await findUserWithPasswordById(userId);

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("비밀번호가 일치하지 않습니다.");
    }

    // 회원 탈퇴
    await deleteUser(userId);

    return true;
  } catch (error) {
    throw error;
  }
};