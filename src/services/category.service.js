import { createCategory, findAllCategories, findCategoryById } from "../repositories/category.repository.js";
import { categoryResponseDTO } from "../dtos/person.dto.js";
import { IntervalServerError, NotFoundError } from "../errors.js";

// 카테고리 생성 서비스
export const createCategoryService = async (categoryData) => {
    try {
        const newCategory = await createCategory(categoryData);

        if (!newCategory) {
            throw new IntervalServerError("카테고리 생성에 실패했습니다.");
        }

        return categoryResponseDTO(newCategory);
    } catch (error) {
        throw error;
    }
};

// 카테고리 목록 조회 서비스
export const getCategoriesService = async () => {
    try {
        const categories = await findAllCategories();
        return categories.map(category => categoryResponseDTO(category));
    } catch (error) {
        throw error;
    }
};

// 카테고리 상세 조회 서비스
export const getCategoryByIdService = async (categoryId) => {
    try {
        const category = await findCategoryById(categoryId);

        if (!category) {
            throw new NotFoundError("해당 카테고리를 찾을 수 없습니다.");
        }

        return categoryResponseDTO(category);
    } catch (error) {
        throw error;
    }
};