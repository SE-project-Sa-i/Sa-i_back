import { StatusCodes } from "http-status-codes";
import {
  AlreadyExistError,
  MissRequiredFieldError,
  NotFoundError,
} from "../errors.js";
import {
  addToFavorites,
  removeFromFavorites,
  getFavoritePersons,
  getFavoritePersonInfo,
} from "../repositories/favorite.repository.js";

// 즐겨찾기 추가 API
export const handleAddToFavorites = async (req, res) => {
  /*
#swagger.summary = '인물 즐겨찾기 추가 API';
#swagger.tags = ['Favorite']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['personId'] = {
  in: 'path',
  description: '즐겨찾기에 추가할 인물 ID',
  required: true,
  schema: {
    type: 'integer',
    example: 1
  }
}

#swagger.responses[200] = {
  description: "즐겨찾기 추가 성공 응답",
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
              favorite_id: { 
                type: "number", 
                example: 13 
              },
              person_id: { 
                type: "number", 
                example: 1 
              },
              name: { 
                type: "string", 
                example: "아버지" 
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
    const { personId } = req.params;
    const userId = req.userId; // JWT 미들웨어에서 설정된 사용자 ID

    if (!userId) {
      throw new MissRequiredFieldError("로그인이 필요합니다.");
    }

    if (!personId) {
      throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    }

    const result = await addToFavorites(userId, personId);
    console.log("즐겨찾기 추가 결과:", result);
    if (!result) {
      throw new AlreadyExistError("이미 즐겨찾기에 추가된 인물입니다.");
    }

    const favoritePerson = await getFavoritePersonInfo(result);
    console.log("즐겨찾기 추가된 인물 정보:", favoritePerson);
    res.status(StatusCodes.OK).success(favoritePerson[0]);
  } catch (error) {
    console.error("즐겨찾기 추가 오류:", error);
    throw error;
  }
};

// 즐겨찾기 삭제 API
export const handleRemoveFromFavorites = async (req, res) => {
  /*
#swagger.summary = '인물 즐겨찾기 해제 API';
#swagger.tags = ['Favorite']
#swagger.security = [{
  "bearerAuth": []
}]
#swagger.parameters['personId'] = {
  in: 'path',
  description: '즐겨찾기에서 해제할 인물 ID',
  required: true,
  schema: {
    type: 'integer',
    example: 1
  }
}

#swagger.responses[200] = {
  description: "즐겨찾기 해제 성공 응답",
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
                example: "즐겨찾기에서 삭제되었습니다." 
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
    const { personId } = req.params;
    const userId = req.userId; // JWT 미들웨어에서 설정된 사용자 ID

    if (!userId) {
      throw new MissRequiredFieldError("로그인이 필요합니다.");
    }

    if (!personId) {
      throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    }

    const result = await removeFromFavorites(userId, personId);
    res
      .status(StatusCodes.OK)
      .success({ message: "즐겨찾기에서 삭제되었습니다." });
  } catch (error) {
    console.error("즐겨찾기 삭제 오류:", error);
    throw error;
  }
};

// 즐겨찾기 목록 조회 API
export const handleGetFavorites = async (req, res) => {
  try {
    const userId = req.userId; // JWT 미들웨어에서 설정된 사용자 ID

    if (!userId) {
      throw new MissRequiredFieldError("로그인이 필요합니다.");
    }

    const result = await getFavoritePersons(userId);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("즐겨찾기 목록 조회 오류:", error);
    throw error;
  }
};
