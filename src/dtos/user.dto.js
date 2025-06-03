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

// 사용자 프로필 수정 DTO
export const updateUserRequestDTO = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    currentPassword: body.currentPassword,
    // 추가 필드가 있다면 여기에 넣으세요
  };
};

// 사용자 프로필 응답 DTO (민감한 정보 제외)
export const userProfileResponseDTO = (user) => {
  return {
    id: user.id,
    serviceId: user.serviceId,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    // 추가 필드가 있다면 여기에 넣으세요 (비밀번호는 제외)
  };
};

// 사용자 노드 응답 DTO
export const responseAllNodesDTO = (nodes) => {
  return nodes.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  }));
};
