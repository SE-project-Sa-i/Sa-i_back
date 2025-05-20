import { pool } from "../db.config.js";

// 인물 ID로 메모리 조회
export const findMemoriesByPersonId = async (personId) => {
    try {
        const [rows] = await pool.query(
            `SELECT m.*, 
            (SELECT GROUP_CONCAT(mi.image_url) 
             FROM memory_image mi 
             WHERE mi.memory_id = m.id) as images
            FROM memory m
            WHERE m.person_id = ? 
            ORDER BY m.created_at DESC`
            [personId]
        );

        // images 문자열을 배열로 변환
        return rows.map(row => {
            if (row.images) {
                row.imageUrls = row.images.split(',');
                delete row.images;
            } else {
                row.imageUrls = [];
            }
            return row;
        });
    } catch (error) {
        console.error("메모리 조회 오류:", error);
        throw error;
    }
};

// ID로 메모리 조회
export const findMemoryById = async (memoryId) => {
    try {
        const [rows] = await pool.query(
            `SELECT m.*, 
            (SELECT GROUP_CONCAT(mi.image_url) 
             FROM memory_image mi 
             WHERE mi.memory_id = m.id) as images
            FROM memory m
            WHERE m.id = ?`,
            [memoryId]
        );

        if (rows.length === 0) {
            return null;
        }

        const memory = rows[0];
        memory.imageUrls = memory.images ? memory.images.split(',') : [];
        delete memory.images;

        return memory;
    } catch (error) {
        console.error("메모리 상세 조회 오류:", error);
        throw error;
    }
};

// 메모리 생성
export const createMemory = async (memoryData) => {
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [result] = await connection.query(
                `INSERT INTO memory (person_id, content) VALUES (?, ?)`,
                [memoryData.personId, memoryData.content]
            );

            const memoryId = result.insertId;

            if (memoryData.imageUrls && memoryData.imageUrls.length > 0) {
                const imageValues = memoryData.imageUrls.map(url => [memoryId, memoryData.personId, url]);

                await connection.query(
                    `INSERT INTO memory_image (memory_id, person_id, image_url) VALUES ?`,
                    [imageValues]
                );
            }

            await connection.commit();
            return await findMemoryById(memoryId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("메모리 생성 오류:", error);
        throw error;
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

        if (memoryData.date !== undefined) {
            fields.push("date = ?");
            values.push(memoryData.date);
        }

        if (memoryData.location !== undefined) {
            fields.push("location = ?");
            values.push(memoryData.location);
        }

        if (memoryData.mood !== undefined) {
            fields.push("mood = ?");
            values.push(memoryData.mood);
        }

        if (fields.length === 0 && (!memoryData.imageUrls || memoryData.imageUrls.length === 0)) {
            return await findMemoryById(memoryId);
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            if (fields.length > 0) {
                fields.push("updated_at = CURRENT_TIMESTAMP");
                values.push(memoryId);

                await connection.query(
                    `UPDATE memory SET ${fields.join(", ")} WHERE id = ?`,
                    values
                );
            }

            if (memoryData.imageUrls !== undefined) {
                await connection.query(
                    "DELETE FROM memory_image WHERE memory_id = ?",
                    [memoryId]
                );

                if (memoryData.imageUrls.length > 0) {
                    const [personIdQuery] = await connection.query(
                        "SELECT person_id FROM memory WHERE id = ?",
                        [memoryId]
                    );
                    const personId = personIdQuery[0].person_id;
                    const imageValues = memoryData.imageUrls.map(url => [memoryId, personId, url]);

                    await connection.query(
                        `INSERT INTO memory_image (memory_id, person_id, image_url) VALUES ?`,
                        [imageValues]
                    );
                }
            }

            await connection.commit();
            return await findMemoryById(memoryId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
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
            await connection.query(
                "DELETE FROM memory_image WHERE memory_id = ?",
                [memoryId]
            );

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
