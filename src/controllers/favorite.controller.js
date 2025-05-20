import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, NotFoundError } from "../errors.js";
import {
    addToFavorites,
    removeFromFavorites,
    getFavoritePersons
} from "../repositories/favorite.repository.js";

// 즐겨찾기 추가 API
export const handleAddToFavorites = async (req, res) => {
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
        res.status(StatusCodes.OK).success({ message: "즐겨찾기에 추가되었습니다." });
    } catch (error) {
        console.error("즐겨찾기 추가 오류:", error);
        throw error;
    }
};

// 즐겨찾기 삭제 API
export const handleRemoveFromFavorites = async (req, res) => {
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
        res.status(StatusCodes.OK).success({ message: "즐겨찾기에서 삭제되었습니다." });
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