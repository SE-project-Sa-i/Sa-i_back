import {
  createPersonRequestDTO,
  personDetailResponseDTO,
  personListResponseDTO,
  updatePersonRequestDTO,
} from "../dtos/person.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, NotFoundError } from "../errors.js";
import {
  getPersonsService,
  getPersonByIdService,
  createPersonService,
  updatePersonService,
  deletePersonService,
  updatePersonFieldService,
  getPersonAllInfoService,
} from "../services/person.service.js";

// 인물 노드 목록 조회 API
export const handleGetPersons = async (req, res) => {
  /*
#swagger.summary = '인물 노드 목록 조회 API';
#swagger.tags = ['Person']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['category_id'] = {
  in: 'query',
  description: '카테고리 ID (선택사항)',
  required: false,
  schema: {
    type: 'integer',
    example: 5
  }
}

#swagger.responses[200] = {
  description: "인물 목록 조회 성공 응답",
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
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { 
                  type: "number", 
                  example: 7 
                },
                name: { 
                  type: "string", 
                  example: "정다은" 
                },
                categoryId: { 
                  type: "number", 
                  example: 10 
                },
                categoryName: { 
                  type: "string", 
                  example: "대학교" 
                },
                imageUrl: { 
                  type: "string", 
                  example: "https://example.com/image.jpg" 
                },
                nationality: { 
                  type: "string", 
                  nullable: true,
                  example: null 
                },
                introduction: { 
                  type: "string", 
                  example: "대학교 동아리 친구" 
                },
                isFavorite: { 
                  type: "boolean", 
                  example: true 
                },
                likeability: { 
                  type: "number", 
                  example: 4 
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
  description: "잘못된 쿼리 파라미터 실패 응답",
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
                example: "유효하지 않은 카테고리 ID입니다." 
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
                example: "인물 목록 조회에 실패하였습니다" 
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
    const filter = { categoryId: req.query.category_id };
    const user_id = req.userId;

    const result = await getPersonsService(filter, user_id);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 목록 조회 오류:", error);
    throw error;
  }
};

// 인물 노드 상세 조회 API
export const handleGetPersonById = async (req, res) => {
  /*
#swagger.summary = '인물 노드 정보 파업 조회 API';
#swagger.tags = ['Person']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['personId'] = {
  in: 'path',
  description: '인물 ID',
  required: true,
  schema: {
    type: 'integer',
    example: 1
  }
}

#swagger.responses[200] = {
  description: "인물 정보 조회 성공 응답",
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
              name: { 
                type: "string", 
                example: "아버지" 
              },
              categoryId: { 
                type: "number", 
                example: 5 
              },
              introduction: { 
                type: "string", 
                example: "항상 든든한 우리 아버지" 
              },
              note: { 
                type: "string", 
                example: "생신: 3월 15일, 좋아하는 음식: 갈비탕" 
              },
              isFavorite: { 
                type: "number", 
                example: 0 
              },
              likeability: {
                type: "number",
                example: 5
              },
              createdAt: {
                type: "string",
                example: "2024-05-05"
              },
            }
          }
        }
      }
    }
  }
};
*/
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    const result = await getPersonByIdService(personId, userId);
    if (!result) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 상세 조회 오류:", error);
    throw error;
  }
};

// 인물 노드 생성 API
export const handleCreatePerson = async (req, res) => {
  /*
#swagger.summary = '인물 노드 생성 API';
#swagger.tags = ['Person']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          category_id: { 
            type: "number", 
            example: 2,
            description: "카테고리 ID"
          },
          name: { 
            type: "string", 
            example: "김아무개",
            description: "인물 이름"
          },
          introduction: { 
            type: "string", 
            example: "내 친구",
            description: "한줄 소개"
          },
          note: { 
            type: "string", 
            example: "소프트웨어공학 팀플에서 만나서 친해짐",
            description: "메모"
          },
          is_favorite: { 
            type: "boolean", 
            example: true,
            description: "즐겨찾기 여부"
          }
        },
        required: ["category_id", "name", "introduction", "note", "is_favorite"]
      }
    }
  }
};

#swagger.responses[200] = {
  description: "인물 생성 성공 응답",
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
                example: 12 
              },
              name: { 
                type: "string", 
                example: "김아무개" 
              },
              categoryId: { 
                type: "number", 
                example: 2 
              },
              introduction: { 
                type: "string", 
                example: "내 친구" 
              },
              note: { 
                type: "string", 
                example: "소프트웨어공학 팀플에서 만나서 친해짐" 
              },
              isFavorite: { 
                type: "number", 
                example: 1 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[400] = {
  description: "이름과 카테고리는 필수입니다 실패 응답",
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
                example: "이름과 카테고리는 필수입니다." 
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
    const personData = createPersonRequestDTO(req.body);
    if (!personData.name || !personData.categoryId) {
      throw new MissRequiredFieldError("이름과 카테고리는 필수입니다.");
    }

    const userId = req.userId;

    const result = await createPersonService(personData, userId);
    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    console.error("인물 노드 생성 오류:", error);
    throw error;
  }
};

// 인물 노드 수정 API
export const handleUpdatePerson = async (req, res) => {
  /*
#swagger.summary = '노드 수정 API';
#swagger.tags = ['Person']
#swagger.description = '즐겨찾기, 호감도 다른 api 사용'
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['personId'] = {
  in: 'path',
  description: '수정할 노드의 ID',
  required: true,
  type: 'integer',
  example: 9
}
#swagger.requestBody = {
  required: false,
  content: {
    "application/json": {
      schema: {
        type: "object",
        description: "모든 요소 optional로 처리 가능",
        properties: {
          name: { 
            type: "string", 
            example: "김맹맹",
            description: "인물 이름"
          },
          introduction: { 
            type: "string", 
            example: "내 친구",
            description: "인물 소개"
          },
          note: { 
            type: "string", 
            example: "초등학교 때 만나서 지금까지 친하게 지내고 있음",
            description: "인물에 대한 메모"
          },
          likeability: { 
            type: "number", 
            example: 100,
            description: "호감도"
          }
        }
      }
    }
  }
};

#swagger.responses[200] = {
  description: "노드 수정 성공 응답",
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
                example: 9 
              },
              name: { 
                type: "string", 
                example: "강맹맹" 
              },
              categoryId: { 
                type: "number", 
                example: 12 
              },
              introduction: { 
                type: "string", 
                example: "팀장님" 
              },
              note: { 
                type: "string", 
                example: "좋아하는 음식: 삼겹살, 싫어하는 것: 늦는 것" 
              },
              isFavorite: { 
                type: "number", 
                example: 0 
              },
              likeability: { 
                type: "number", 
                example: 100 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[404] = {
  description: "수정할 인물을 찾을 수 없음 실패 응답",
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
                example: "not_found" 
              },
              reason: { 
                type: "string", 
                example: "수정할 인물을 찾을 수 없습니다." 
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
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    const personData = updatePersonRequestDTO(req.body);
    const result = await updatePersonService(personId, personData, userId);

    if (!result) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 수정 오류:", error);
    throw error;
  }
};

// 인물 노드 삭제 API
export const handleDeletePerson = async (req, res) => {
  /*
#swagger.summary = '인물 노드 삭제 API';
#swagger.tags = ['Person']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['personId'] = {
  in: 'path',
  description: '삭제할 인물 ID',
  required: true,
  schema: {
    type: 'integer',
    example: 1
  }
}

#swagger.responses[200] = {
  description: "인물 삭제 성공 응답",
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
              message: { 
                type: "string", 
                example: "인물 노드가 삭제되었습니다." 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[404] = {
  description: "삭제할 인물을 찾을 수 없음 실패 응답",
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
                example: "not_found" 
              },
              reason: { 
                type: "string", 
                example: "삭제할 인물을 찾을 수 없습니다." 
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
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    await deletePersonService(personId, userId);
    res
      .status(StatusCodes.OK)
      .success({ message: "인물 노드가 삭제되었습니다." });
  } catch (error) {
    console.error("인물 노드 삭제 오류:", error);
    throw error;
  }
};

// 한줄소개 수정 API
export const handleUpdateOneLineIntro = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    const { one_line } = req.body;

    if (!one_line) throw new MissRequiredFieldError("한줄소개가 필요합니다.");

    const result = await updatePersonFieldService(
      personId,
      {
        introduction: one_line,
      },
      userId
    );
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("한줄소개 수정 오류:", error);
    throw error;
  }
};

// 노트 수정 API
export const handleUpdateNote = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { note } = req.body;

    if (!note) throw new MissRequiredFieldError("노트가 필요합니다.");

    const result = await updatePersonFieldService(personId, { note });
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("노트 수정 오류:", error);
    throw error;
  }
};

// 호감도 수정 API
export const handleUpdateLikeability = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { likeability } = req.body;

    if (likeability === undefined || isNaN(likeability)) {
      throw new MissRequiredFieldError("호감도는 숫자여야 합니다.");
    }

    const result = await updatePersonFieldService(personId, { likeability });
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("호감도 수정 오류:", error);
    throw error;
  }
};

export const handleGetAllPersonInfo = async (req, res) => {
  /*
#swagger.summary = '노드 메모 전체 조회 API (추억, 추가 정보들 포함)';
#swagger.tags = ['Person']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['personId'] = {
  in: 'path',
  description: '인물 ID',
  required: true,
  schema: {
    type: 'integer',
    example: 1
  }
}

#swagger.responses[200] = {
  description: "노드 전체 정보 조회 성공 응답",
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
              name: { 
                type: "string", 
                example: "아버지" 
              },
              image_url: { 
                type: "string", 
                example: "https://example.com/image.jpg" 
              },
              introduction: { 
                type: "string", 
                example: "항상 든든한 우리 아버지" 
              },
              note: { 
                type: "string", 
                example: "생신: 3월 15일, 좋아하는 음식: 갈비탕" 
              },
              likeability: { 
                type: "number", 
                example: 5 
              },
              created_at: { 
                type: "string", 
                format: "date-time",
                example: "2024-05-05T05:00:00.000Z" 
              },
              is_favorite: { 
                type: "number", 
                example: 1 
              },
              allPath: { 
                type: "string", 
                example: "나 > 가족 > 부모님 > 아버지" 
              },
              extraInfos: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { 
                      type: "number", 
                      example: 1 
                    },
                    title: { 
                      type: "string", 
                      example: "직업" 
                    },
                    info: { 
                      type: "string", 
                      example: "공무원" 
                    }
                  }
                },
                example: [
                  {
                    id: 1,
                    title: "직업",
                    info: "공무원"
                  },
                  {
                    id: 2,
                    title: "취미",
                    info: "골프"
                  }
                ]
              },
              memories: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { 
                      type: "number", 
                      example: 1 
                    },
                    content: { 
                      type: "string", 
                      example: "아버지와 함께 치킨을 먹었다" 
                    },
                    registeredAt: { 
                      type: "string", 
                      format: "date-time",
                      example: "2024-05-10T00:00:00.000Z" 
                    }
                  }
                },
                example: [
                  {
                    id: 1,
                    content: "아버지와 함께 치킨을 먹었다",
                    registeredAt: "2024-05-10T00:00:00.000Z"
                  },
                  {
                    id: 2,
                    content: "아버지 생신에 치킨을 선물했다",
                    registeredAt: "2024-05-10T00:00:00.000Z"
                  },
                  {
                    id: 13,
                    content: "둘이 공원 다녀왔는데 정말 좋았다",
                    registeredAt: "2025-05-26T00:00:00.000Z"
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[404] = {
  description: "해당 인물을 찾을 수 없음 실패 응답",
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
                example: "not_found" 
              },
              reason: { 
                type: "string", 
                example: "해당 인물을 찾을 수 없습니다." 
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

#swagger.responses[400] = {
  description: "인물 ID가 필요함 실패 응답",
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
                example: "인물 ID가 필요합니다." 
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
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    const personIsExist = await getPersonByIdService(personId, userId);

    const result = await getPersonAllInfoService(personId);
    if (!result) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 정보 전체 조회 오류:", error);
    throw error;
  }
};
