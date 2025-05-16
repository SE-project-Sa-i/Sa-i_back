// 회원가입 요청 데이터 변환
export const signupRequestDTO = (req) => {
  return {
    name: req.name,
    serviceId: req.service_id,
    email: req.email,
    password: req.password,
  };
};

// 로그인 요청 데이터 변환
export const loginRequestDTO = (req) => {
  return {
    serviceId: req.service_id,
    password: req.password,
  };
};

// 사용자 응답 데이터 변환
export const userResponseDTO = (user) => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  };
};
