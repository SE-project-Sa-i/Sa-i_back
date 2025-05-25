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
