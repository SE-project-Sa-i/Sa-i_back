import { pool } from "../db.config.js";

// 인물 ID로 메모리 조회
export const findMemoriesByPersonId = async (personId) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*
             FROM memory m
             WHERE m.person_id = ?
             ORDER BY m.registered_at DESC`,
      [personId]
    );

    console.log("조회된 메모리:", rows);

    // images 문자열을 배열로 변환
    return rows;
  } catch (error) {
    console.error("메모리 조회 오류:", error);
    throw error;
  }
};

// ID로 메모리 조회
export const findMemoryById = async (memoryId) => {
  try {
    console.log("메모리 상세 조회 요청 ID:", memoryId);
    const [rows] = await pool.query(
      `SELECT m.*
             FROM memory m
             WHERE m.id = ?`,
      [memoryId]
    );

    console.log("조회된 메모리 상세:", rows);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("메모리 상세 조회 오류:", error);
    throw error;
  }
};

// 메모리 생성
export const createMemory = async (memoryData) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      `INSERT INTO memory (person_id, content) VALUES (?, ?)`,
      [memoryData.personId, memoryData.content]
    );

    const memoryId = result.insertId;

    return memoryId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 메모리 수정
export const updateMemory = async (memoryId, memoryData) => {
  try {
    const fields = [];
    const values = [];

    if (memoryData.content !== undefined) {
      fields.push("content = ?");
      values.push(memoryData.content);
    }

    // 업데이트할 필드가 없으면 기존 메모리 반환
    if (fields.length === 0) {
      return await findMemoryById(memoryId);
    }

    // 단순 UPDATE는 트랜잭션 없이 처리
    try {
      fields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(memoryId);

      await pool.query(
        `UPDATE memory SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      return await findMemoryById(memoryId);
    } catch (error) {
      console.error("메모리 수정 쿼리 오류:", error);
      throw error;
    }
  } catch (error) {
    console.error("메모리 수정 오류:", error);
    throw error;
  }
};

// 메모리 삭제
export const deleteMemory = async (memoryId) => {
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query("DELETE FROM memory_image WHERE memory_id = ?", [
        memoryId,
      ]);

      const [result] = await connection.query(
        "DELETE FROM memory WHERE id = ?",
        [memoryId]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("메모리 삭제 오류:", error);
    throw error;
  }
};
