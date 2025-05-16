import {
  userSignupService,
  userLoginService,
} from "../services/user.service.js";
import { signupRequestDTO, loginRequestDTO } from "../dtos/user.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError } from "../errors.js";

// 회원가입 API
export const handleUserSignup = async (req, res) => {
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
};

// 로그인 API
export const handleUserLogin = async (req, res) => {
  const loginData = loginRequestDTO(req.body);

  // 필수 필드 확인
  if (!loginData.serviceId || !loginData.password) {
    throw new MissRequiredFieldError("모든 필드를 입력해주세요.");
  }

  const result = await userLoginService(loginData);

  res.status(StatusCodes.OK).success(result);
};
