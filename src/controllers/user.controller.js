import {
  userSignupService,
  userLoginService,
  getUserProfileService,
  updateUserProfileService,
  deleteUserService,
} from "../services/user.service.js";
import {
  signupRequestDTO,
  loginRequestDTO,
  updateUserRequestDTO,
} from "../dtos/user.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, UnauthorizedError } from "../errors.js";

// 회원가입 API
export const handleUserSignup = async (req, res) => {
  /*
#swagger.summary = '회원 가입 API';
#swagger.tags = ['User']
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          name: { 
            type: "string", 
            example: "홍길동",
            description: "사용자 이름"
          },
          service_id: { 
            type: "string", 
            example: "hong12",
            description: "서비스 ID"
          },
          email: { 
            type: "string", 
            example: "hong@example.com",
            description: "이메일 주소"
          },
          password: { 
            type: "string", 
            example: "password123",
            description: "비밀번호"
          }
        },
        required: ["name", "service_id", "email", "password"]
      }
    }
  }
};

#swagger.responses[200] = {
  description: "회원 가입 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "SUCCESS" 
          },
          error: { 
            type: "object", 
            nullable: true, 
            example: null 
          },
          success: {
            type: "object",
            properties: {
              id: { 
                type: "number", 
                example: 2 
              },
              name: { 
                type: "string", 
                example: "최지은" 
              },
              service_id: { 
                type: "string", 
                example: "ji4722" 
              },
              email: { 
                type: "string", 
                example: "ji4722@gachon.ac.kr" 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[400] = {
  description: "필수 필드 누락 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "F001" 
              },
              reason: { 
                type: "string", 
                example: "모든 필드를 입력해주세요." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[409] = {
  description: "아이디 중복 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U002" 
              },
              reason: { 
                type: "string", 
                example: "아이디가 이미 존재합니다." 
              },
              data: {
                type: "object",
                properties: {
                  name: { 
                    type: "string", 
                    example: "최지은" 
                  },
                  serviceId: { 
                    type: "string", 
                    example: "ji4722" 
                  },
                  email: { 
                    type: "string", 
                    example: "ji4722@gachon.ac.kr" 
                  },
                  password: { 
                    type: "string", 
                    example: "$2b$10$lU4c5HcnxnBZs3TBJhXCGOfQznlWJ52Hc9jnJJ6SLKuY6h56Z5RyG" 
                  }
                }
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[409] = {
  description: "이메일 중복 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U001" 
              },
              reason: { 
                type: "string", 
                example: "이매일이 이미 존재합니다." 
              },
              data: {
                type: "object",
                properties: {
                  name: { 
                    type: "string", 
                    example: "최지은" 
                  },
                  serviceId: { 
                    type: "string", 
                    example: "ji472" 
                  },
                  email: { 
                    type: "string", 
                    example: "ji4722@gachon.ac.kr" 
                  },
                  password: { 
                    type: "string", 
                    example: "$2b$10$i.3D2DWXnI.MqsWMR8RSQeOeerH4Ij4by7NdJo01nIIh4dgQ.pAZq" 
                  }
                }
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[500] = {
  description: "서버 에러 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "5001" 
              },
              reason: { 
                type: "string", 
                example: "회원가입에 실패하였습니다" 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};
*/
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
  /*
#swagger.summary = '로그인 API';
#swagger.tags = ['User']
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          service_id: { 
            type: "string", 
            example: "user007",
            description: "서비스 ID"
          },
          password: { 
            type: "string", 
            example: "password444",
            description: "비밀번호"
          }
        },
        required: ["service_id", "password"]
      }
    }
  }
};

#swagger.responses[200] = {
  description: "로그인 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "SUCCESS" 
          },
          error: { 
            type: "object", 
            nullable: true, 
            example: null 
          },
          success: {
            type: "object",
            properties: {
              token: { 
                type: "string", 
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
              },
              user: {
                type: "object",
                properties: {
                  id: { 
                    type: "number", 
                    example: 2 
                  },
                  name: { 
                    type: "string", 
                    example: "최지은" 
                  },
                  email: { 
                    type: "string", 
                    example: "ji4722@gachon.ac.kr" 
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[400] = {
  description: "필수 필드 누락 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "F001" 
              },
              reason: { 
                type: "string", 
                example: "모든 필드를 입력해주세요." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[401] = {
  description: "비밀번호 불일치 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U302" 
              },
              reason: { 
                type: "string", 
                example: "비밀번호가 일치하지 않습니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[404] = {
  description: "회원가입하지 않은 사용자 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U301" 
              },
              reason: { 
                type: "string", 
                example: "존재하지 않는 사용자입니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[500] = {
  description: "서버 에러 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "5001" 
              },
              reason: { 
                type: "string", 
                example: "로그인에 실패하였습니다" 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};
*/
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
  /*
#swagger.summary = '내 정보 조회 API';
#swagger.tags = ['User']
#swagger.security = [{
  "bearerAuth": []
}]

#swagger.responses[200] = {
  description: "내 정보 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "SUCCESS" 
          },
          error: { 
            type: "object", 
            nullable: true, 
            example: null 
          },
          success: {
            type: "object",
            properties: {
              id: { 
                type: "number", 
                example: 1 
              },
              serviceId: { 
                type: "string", 
                example: "user001" 
              },
              name: { 
                type: "string", 
                example: "최지은" 
              },
              email: { 
                type: "string", 
                example: "email@email.com" 
              },
              createdAt: { 
                type: "string", 
                format: "date-time",
                example: "2025-05-20T15:41:58.3" 
              },
              updatedAt: { 
                type: "string", 
                format: "date-time",
                example: "2025-05-22T09:53:03.0" 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[401] = {
  description: "인증 토큰 누락 또는 무효한 토큰 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "A001" 
              },
              reason: { 
                type: "string", 
                example: "인증 토큰이 필요합니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[403] = {
  description: "토큰 만료 또는 유효하지 않은 토큰 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "A002" 
              },
              reason: { 
                type: "string", 
                example: "유효하지 않은 토큰입니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[404] = {
  description: "사용자를 찾을 수 없음 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U301" 
              },
              reason: { 
                type: "string", 
                example: "존재하지 않는 사용자입니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[500] = {
  description: "서버 에러 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "5001" 
              },
              reason: { 
                type: "string", 
                example: "사용자 정보 조회에 실패하였습니다" 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};
*/
  try {
    // userId 사용하여 사용자 정보 확인 (JWT 미들웨어와 호환)
    if (!req.userId) {
      throw new UnauthorizedError("인증이 필요합니다.", null);
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
  /*
#swagger.summary = '내 정보 수정 API';
#swagger.tags = ['User']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.requestBody = {
  required: false,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          name: { 
            type: "string", 
            example: "최지은",
            description: "사용자 이름 (선택사항)"
          },
          email: { 
            type: "string", 
            example: "example@email.com",
            description: "이메일 주소 (선택사항)"
          }
        },
        description: "수정할 필드만 포함하면 됩니다. 3가지 방법 중 하나를 선택하여 요청할 수 있습니다."
      },
      examples: {
        "이름만 수정": {
          value: {
            name: "최지은"
          }
        },
        "이메일만 수정": {
          value: {
            email: "example@email.com"
          }
        },
        "이름과 이메일 모두 수정": {
          value: {
            name: "최지은",
            email: "example@email.com"
          }
        }
      }
    }
  }
};

#swagger.responses[200] = {
  description: "내 정보 수정 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "SUCCESS" 
          },
          error: { 
            type: "object", 
            nullable: true, 
            example: null 
          },
          success: {
            type: "object",
            properties: {
              id: { 
                type: "number", 
                example: 1 
              },
              serviceId: { 
                type: "string", 
                example: "user001" 
              },
              name: { 
                type: "string", 
                example: "최지은" 
              },
              email: { 
                type: "string", 
                example: "email@email.com" 
              },
              createdAt: { 
                type: "string", 
                format: "date-time",
                example: "2025-05-20T15:41:58.3" 
              },
              updatedAt: { 
                type: "string", 
                format: "date-time",
                example: "2025-05-22T10:03:58.0" 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[400] = {
  description: "잘못된 요청 데이터 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "F002" 
              },
              reason: { 
                type: "string", 
                example: "유효하지 않은 데이터입니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[401] = {
  description: "인증 토큰 누락 또는 무효한 토큰 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "A001" 
              },
              reason: { 
                type: "string", 
                example: "인증 토큰이 필요합니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[403] = {
  description: "토큰 만료 또는 유효하지 않은 토큰 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "A002" 
              },
              reason: { 
                type: "string", 
                example: "유효하지 않은 토큰입니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[404] = {
  description: "사용자를 찾을 수 없음 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U301" 
              },
              reason: { 
                type: "string", 
                example: "존재하지 않는 사용자입니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[409] = {
  description: "이메일 중복 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "U001" 
              },
              reason: { 
                type: "string", 
                example: "이메일이 이미 존재합니다." 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};

#swagger.responses[500] = {
  description: "서버 에러 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { 
            type: "string", 
            example: "FAIL" 
          },
          error: {
            type: "object",
            properties: {
              errorCode: { 
                type: "string", 
                example: "5001" 
              },
              reason: { 
                type: "string", 
                example: "사용자 정보 수정에 실패하였습니다" 
              },
              data: { 
                type: "object", 
                nullable: true, 
                example: null 
              }
            }
          },
          success: { 
            type: "object", 
            nullable: true, 
            example: null 
          }
        }
      }
    }
  }
};
*/
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

    res
      .status(StatusCodes.OK)
      .success({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("회원 탈퇴 오류:", error);
    throw error;
  }
};
