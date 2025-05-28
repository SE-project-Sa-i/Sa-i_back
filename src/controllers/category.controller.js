import { StatusCodes } from "http-status-codes";
import {
  findAllCategories,
  findCategoryById,
} from "../repositories/category.repository.js";
import {
  categoryResponseDTO,
  createCategoryRequestDTO,
} from "../dtos/person.dto.js";
import { MissRequiredFieldError, NotFoundError } from "../errors.js";
import { createCategoryService } from "../services/category.service.js";

// 카테고리 생성 API
export const handleCreateCategory = async (req, res) => {
  /*
#swagger.summary = '카테고리 생성 API';
#swagger.tags = ['Category']
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
          name: { 
            type: "string", 
            example: "대학교",
            description: "카테고리 이름"
          },
          parent_id: { 
            type: "number", 
            example: 1,
            description: "부모 카테고리 ID"
          },
          color: { 
            type: "string", 
            example: "#121212",
            description: "카테고리 색상 (hex 코드)"
          },
          is_root: { 
            type: "boolean", 
            example: false,
            description: "루트 카테고리 여부"
          },
          user_id: { 
            type: "number", 
            example: 1,
            description: "사용자 ID"
          }
        },
        required: ["name", "parent_id", "color", "is_root", "user_id"]
      }
    }
  }
};

#swagger.responses[200] = {
  description: "카테고리 생성 성공 응답",
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
                example: 18 
              },
              name: { 
                type: "string", 
                example: "대학교" 
              },
              description: { 
                type: "string", 
                nullable: true,
                example: null 
              },
              parentId: { 
                type: "string", 
                nullable: true,
                example: null 
              },
              isRoot: { 
                type: "boolean", 
                example: false 
              },
              color: { 
                type: "string", 
                example: "#121212" 
              }
            }
          }
        }
      }
    }
  }
};

#swagger.responses[400] = {
  description: "카테고리 이름은 필수입니다 실패 응답",
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
                example: "카테고리 이름은 필수입니다." 
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
    const categoryData = createCategoryRequestDTO(req.body);

    // 필수 필드 확인
    if (!categoryData.name) {
      throw new MissRequiredFieldError("카테고리 이름은 필수입니다.");
    }

    const result = await createCategoryService(categoryData);
    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    console.error("카테고리 생성 오류:", error);
    throw error;
  }
};

// 카테고리 목록 조회 API
export const handleGetCategories = async (req, res) => {
  /*
#swagger.summary = '카테고리 목록 조회 API';
#swagger.tags = ['Category']
#swagger.security = [{
  "bearerAuth": []
}]

#swagger.responses[200] = {
  description: "카테고리 목록 조회 성공 응답",
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
                  example: 17 
                },
                name: { 
                  type: "string", 
                  example: "나" 
                },
                parentId: { 
                  type: "string", 
                  nullable: true,
                  example: null 
                },
                isRoot: { 
                  type: "number", 
                  example: 1 
                },
                color: { 
                  type: "string", 
                  example: "#FFCC00" 
                },
                children: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { 
                        type: "number", 
                        example: 18 
                      },
                      name: { 
                        type: "string", 
                        example: "초등학교" 
                      },
                      parentId: { 
                        type: "number", 
                        example: 17 
                      },
                      isRoot: { 
                        type: "number", 
                        example: 0 
                      },
                      color: { 
                        type: "string", 
                        example: "#343434" 
                      },
                      children: {
                        type: "array",
                        items: {},
                        example: []
                      }
                    }
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
*/
  try {
    const userId = req.userId;
    const categories = await findAllCategories(userId);

    // 카테고리 목록을 계층 구조로 응답
    const formattedCategories = categories.map((category) =>
      categoryResponseDTO(category)
    );

    res.status(StatusCodes.OK).success(formattedCategories);
  } catch (error) {
    console.error("카테고리 목록 조회 오류:", error);
    throw error;
  }
};

// 카테고리 상세 조회 API
export const handleGetCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      throw new MissRequiredFieldError("카테고리 ID가 필요합니다.");
    }

    const category = await findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundError("해당 카테고리를 찾을 수 없습니다.");
    }

    res.status(StatusCodes.OK).success(categoryResponseDTO(category));
  } catch (error) {
    console.error("카테고리 상세 조회 오류:", error);
    throw error;
  }
};
