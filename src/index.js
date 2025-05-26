import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verify } from "./middleware/jwt.js";

import {
  handleUserSignup,
  handleUserLogin,
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleDeleteUser,
} from "./controllers/user.controller.js";

import {
  handleGetPersons,
  handleGetPersonById,
  handleCreatePerson,
  handleUpdatePerson,
  handleDeletePerson,
  handleUpdateOneLineIntro,
  handleUpdateNote,
  handleUpdateLikeability,
  handleGetAllPersonInfo,
} from "./controllers/person.controller.js";

import {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategoryById,
} from "./controllers/category.controller.js";

import {
  handleGetMemoriesByPersonId,
  handleCreateMemory,
  handleUpdateMemory,
  handleDeleteMemory,
} from "./controllers/memory.controller.js";

import {
  handleAddToFavorites,
  handleRemoveFromFavorites,
  handleGetFavorites,
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(verify);

app.get("/", (req, res) => res.send("Hello World!"));

// 인증
app.post("/api/v1/auth/signup", handleUserSignup);
app.post("/api/v1/auth/login", handleUserLogin);

// 사용자
app.get("/api/v1/users/me", handleGetUserProfile);
app.put("/api/v1/users/me", handleUpdateUserProfile);
app.delete("/api/v1/users/me", handleDeleteUser);

// 인물
app.get("/api/v1/persons", handleGetPersons);
app.get("/api/v1/persons/:personId", handleGetPersonById);
app.post("/api/v1/persons", handleCreatePerson);
app.get("/api/v1/persons/:personId/info/all", handleGetAllPersonInfo);
// 인물 정보 수정
app.put("/api/v1/persons/:personId", handleUpdatePerson);
app.delete("/api/v1/persons/:personId", handleDeletePerson);

// 추가된 인물 정보 수정 엔드포인트
// 위의 인물 정보 수정 엔드포인트로 대체
// app.put("/api/v1/persons/:personId/info/one-line", handleUpdateOneLineIntro);
// app.put("/api/v1/persons/:personId/info/note", handleUpdateNote);
// app.put("/api/v1/persons/:personId/info/likes", handleUpdateLikeability);

// 카테고리
app.post("/api/v1/categories", handleCreateCategory);
app.get("/api/v1/categories", handleGetCategories);
app.get("/api/v1/categories/:categoryId", handleGetCategoryById);

// 메모리
app.get("/api/v1/persons/:personId/memories", handleGetMemoriesByPersonId);
app.post("/api/v1/persons/:personId/info/memory", handleCreateMemory);
app.put("/api/v1/persons/:personId/info/memory", handleUpdateMemory);
app.delete("/api/v1/persons/:personId/info/memory", handleDeleteMemory);

// 즐겨찾기
app.post("/api/v1/persons/:personId/favorites", handleAddToFavorites);
app.delete("/api/v1/persons/:personId/favorites", handleRemoveFromFavorites);
// app.get("/api/v1/favorites", handleGetFavorites); 필요 X

// 에러 핸들링
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
