import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verify } from "./middleware/jwt.js";
import {
  handleUserSignup,
  handleUserLogin,
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleDeleteUser
} from "./controllers/user.controller.js";

// 추가된 컨트롤러 import
import {
  handleGetPersons,
  handleGetPersonById,
  handleCreatePerson,
  handleUpdatePerson,
  handleDeletePerson
} from "./controllers/person.controller.js";
import {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategoryById
} from "./controllers/category.controller.js";
import {
  handleGetMemoriesByPersonId,
  handleCreateMemory,
  handleUpdateMemory,
  handleDeleteMemory
} from "./controllers/memory.controller.js";
import {
  handleAddToFavorites,
  handleRemoveFromFavorites,
  handleGetFavorites
} from "./controllers/favorite.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// JWT 검증 미들웨어 적용
app.use(verify);

// 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입
app.post("/api/v1/auth/signup", handleUserSignup);
// 로그인
app.post("/api/v1/auth/login", handleUserLogin);

// 사용자 프로필 관련 라우트 추가
// 내 정보 조회
app.get("/api/v1/users/me", handleGetUserProfile);
// 내 정보 수정
app.put("/api/v1/users/me", handleUpdateUserProfile);
// 회원 탈퇴
app.delete("/api/v1/users/me", handleDeleteUser);

// 인물 노드 관련 라우트
app.get("/api/v1/persons", handleGetPersons);
app.get("/api/v1/persons/:personId", handleGetPersonById);
app.post("/api/v1/persons", handleCreatePerson);
app.put("/api/v1/persons/:personId", handleUpdatePerson);
app.delete("/api/v1/persons/:personId", handleDeletePerson);

// 카테고리 관련 라우트
app.post("/api/v1/categories", handleCreateCategory);
app.get("/api/v1/categories", handleGetCategories);
app.get("/api/v1/categories/:categoryId", handleGetCategoryById);

// 메모리 관련 라우트
app.get("/api/v1/persons/:personId/memories", handleGetMemoriesByPersonId);
app.post("/api/v1/persons/:personId/memories", handleCreateMemory);
app.put("/api/v1/persons/:personId/memories/:memoryId", handleUpdateMemory);
app.delete("/api/v1/persons/:personId/memories/:memoryId", handleDeleteMemory);

// 즐겨찾기 관련 라우트
app.post("/api/v1/persons/:personId/favorite", handleAddToFavorites);
app.delete("/api/v1/persons/:personId/favorite", handleRemoveFromFavorites);
app.get("/api/v1/favorites", handleGetFavorites);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;