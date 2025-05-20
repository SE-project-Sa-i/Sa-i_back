import { pool } from "../db.config.js";
import { findAllPersons } from "./person.repository.js";

// 즐겨찾기 추가
export const addToFavorites = async (userId, personId) => {
    try {
        // 이미 즐겨찾기에 있는지 확인
        const [existingFavorite] = await pool.query(
            "SELECT * FROM favorite_person WHERE user_id = ? AND person_id = ?",
            [userId, personId]
        );

        // 이미 즐겨찾기에 있으면 추가하지 않음
        if (existingFavorite.length > 0) {
            return true;
        }

        // 즐겨찾기에 추가
        const [result] = await pool.query(
            "INSERT INTO favorite_person (user_id, person_id) VALUES (?, ?)",
            [userId, personId]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error("즐겨찾기 추가 오류:", error);
        throw error;
    }
};

// 즐겨찾기 삭제
export const removeFromFavorites = async (userId, personId) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM favorite_person WHERE user_id = ? AND person_id = ?",
            [userId, personId]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error("즐겨찾기 삭제 오류:", error);
        throw error;
    }
};

// 즐겨찾기 목록 조회
export const getFavoritePersons = async (userId) => {
    try {
        // 사용자의 즐겨찾기 인물 목록을 조회
        return await findAllPersons({ userId, favorite: true });
    } catch (error) {
        console.error("즐겨찾기 목록 조회 오류:", error);
        throw error;
    }
};