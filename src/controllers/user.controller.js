import {
  userSignupService,
  userLoginService,
  getUserProfileService,
  updateUserProfileService,
  deleteUserService
} from "../services/user.service.js";
import {
  signupRequestDTO,
  loginRequestDTO,
  updateUserRequestDTO
} from "../dtos/user.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, UnauthorizedError } from "../errors.js";

// 회원가입 API
export const handleUserSignup = async (req, res) => {
  try {
    const userData = signupRequestDTO(req.body);

    // 필수 필드 확인
    if (
        !userData.name ||
        !userData.serviceId ||
        !userData.email ||
        !userData.password
    ) {
      throw new MissRequiredFieldError("모든 필드를 입력해주세요.", null);
    }

    const result = await userSignupService(userData);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};

// 로그인 API
export const handleUserLogin = async (req, res) => {
  try {
    const loginData = loginRequestDTO(req.body);

    // 필수 필드 확인
    if (!loginData.serviceId || !loginData.password) {
      throw new MissRequiredFieldError("모든 필드를 입력해주세요.");
    }

    const result = await userLoginService(loginData);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
};

// 내 정보 조회 API
export const handleGetUserProfile = async (req, res) => {
  try {
    // userId 사용하여 사용자 정보 확인 (JWT 미들웨어와 호환)
    if (!req.userId) {
      throw new UnauthorizedError("인증이 필요합니다.");
    }

    const userId = req.userId;
    const result = await getUserProfileService(userId);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    throw error;
  }
};

// 내 정보 수정 API
export const handleUpdateUserProfile = async (req, res) => {
  try {
    // userId 사용하여 사용자 정보 확인 (JWT 미들웨어와 호환)
    if (!req.userId) {
      throw new UnauthorizedError("인증이 필요합니다.");
    }

    const userId = req.userId;
    const updateData = updateUserRequestDTO(req.body);

    // 필수 필드 확인 (필요한 경우)
    if (updateData.password && !updateData.currentPassword) {
      throw new MissRequiredFieldError("현재 비밀번호를 입력해주세요.");
    }

    const result = await updateUserProfileService(userId, updateData);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("사용자 정보 수정 오류:", error);
    throw error;
  }
};

// 회원 탈퇴 API
export const handleDeleteUser = async (req, res) => {
  try {
    // userId 사용하여 사용자 정보 확인 (JWT 미들웨어와 호환)
    if (!req.userId) {
      throw new UnauthorizedError("인증이 필요합니다.");
    }

    const userId = req.userId;

    // 회원 탈퇴 요청에 비밀번호 확인이 필요한 경우
    if (!req.body.password) {
      throw new MissRequiredFieldError("비밀번호를 입력해주세요.");
    }

    await deleteUserService(userId, req.body.password);

    res.status(StatusCodes.OK).success({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("회원 탈퇴 오류:", error);
    throw error;
  }
};