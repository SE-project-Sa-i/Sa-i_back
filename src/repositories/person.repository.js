import { pool } from "../db.config.js";

// 모든 인물 노드 조회
export const findAllPersons = async (filter = {}) => {
  try {
    let query = `
            SELECT p.*, c.title as category_name,
                   CASE WHEN f.person_id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
            FROM person p
                     LEFT JOIN category c ON p.category_id = c.id
                     LEFT JOIN favorite_person f ON p.id = f.person_id AND f.user_id = ?
            WHERE 1=1
        `;

    // 사용자 ID (로그인 상태에 따라 달라질 수 있음)
    const userId = filter.userId || 1; // 기본값 1 (필요에 따라 변경)
    const params = [userId];

    // 필터 적용
    if (filter.categoryId) {
      query += ` AND p.category_id = ?`;
      params.push(filter.categoryId);
    }

    if (filter.nationality) {
      query += ` AND p.nationality = ?`;
      params.push(filter.nationality);
    }

    if (filter.search) {
      query += ` AND (p.name LIKE ? OR p.introduction LIKE ? OR p.note LIKE ?)`;
      const searchParam = `%${filter.search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (filter.favorite) {
      query += ` AND f.person_id IS NOT NULL`;
    }

    if (filter.likeability) {
      query += ` AND p.likeability >= ?`;
      params.push(filter.likeability);
    }

    // 그룹화 및 정렬
    query += ` ORDER BY p.name ASC`;

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("인물 노드 조회 오류:", error);
    throw error;
  }
};

// ID로 인물 노드 조회
export const findPersonById = async (personId) => {
  try {
    // 기본 인물 정보 조회
    const [personRows] = await pool.query(
      `SELECT p.*, c.title as category_name,
                    CASE WHEN f.person_id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
             FROM person p
                      LEFT JOIN category c ON p.category_id = c.id
                      LEFT JOIN favorite_person f ON p.id = f.person_id AND f.user_id = 1
             WHERE p.id = ?`,
      [personId]
    );

    if (personRows.length === 0) {
      return null;
    }

    const person = personRows[0];

    // 추가 정보 조회
    const [extraInfoRows] = await pool.query(
      `SELECT title, info
             FROM extra_info
             WHERE person_id = ?`,
      [personId]
    );

    person.extra_info = {};
    extraInfoRows.forEach((row) => {
      person.extra_info[row.title] = row.info;
    });

    return person;
  } catch (error) {
    console.error("인물 노드 상세 조회 오류:", error);
    throw error;
  }
};

// 인물 노드 생성
export const createPerson = async (personData) => {
  try {
    // 트랜잭션 시작
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 기본 인물 정보 저장
      const [result] = await connection.query(
        `INSERT INTO person (
                    name, category_id, image_url, nationality,
                    introduction, note, is_favorite, likeability
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          personData.name,
          personData.categoryId,
          personData.imageUrl,
          personData.nationality,
          personData.introduction,
          personData.note,
          personData.isFavorite ? 1 : 0,
          personData.likeability,
        ]
      );

      const personId = result.insertId;

      // 추가 정보가 있으면 extra_info 테이블에 저장
      if (personData.extraInfo) {
        for (const [key, value] of Object.entries(personData.extraInfo)) {
          await connection.query(
            `INSERT INTO extra_info (person_id, title, info) VALUES (?, ?, ?)`,
            [personId, key, value]
          );
        }
      }

      // 트랜잭션 커밋
      await connection.commit();

      // 생성된 인물 조회 및 반환
      return await findPersonById(personId);
    } catch (error) {
      // 오류 발생 시 롤백
      await connection.rollback();
      throw error;
    } finally {
      // 연결 반환
      connection.release();
    }
  } catch (error) {
    console.error("인물 노드 생성 오류:", error);
    throw error;
  }
};

// 인물 노드 수정
export const updatePerson = async (personId, personData) => {
  try {
    const fields = [];
    const values = [];

    // 제공된 필드만 업데이트
    if (personData.name !== undefined) {
      fields.push("name = ?");
      values.push(personData.name);
    }

    if (personData.categoryId !== undefined) {
      fields.push("category_id = ?");
      values.push(personData.categoryId);
    }

    if (personData.imageUrl !== undefined) {
      fields.push("image_url = ?");
      values.push(personData.imageUrl);
    }

    if (personData.nationality !== undefined) {
      fields.push("nationality = ?");
      values.push(personData.nationality);
    }

    if (personData.introduction !== undefined) {
      fields.push("introduction = ?");
      values.push(personData.introduction);
    }

    if (personData.note !== undefined) {
      fields.push("note = ?");
      values.push(personData.note);
    }

    if (personData.isFavorite !== undefined) {
      fields.push("is_favorite = ?");
      values.push(personData.isFavorite ? 1 : 0);
    }

    if (personData.likeability !== undefined) {
      fields.push("likeability = ?");
      values.push(personData.likeability);
    }

    // 트랜잭션 시작
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 기본 인물 정보 업데이트
      if (fields.length > 0) {
        fields.push("updated_at = CURRENT_TIMESTAMP");

        // ID 추가
        values.push(personId);

        await connection.query(
          `UPDATE person SET ${fields.join(", ")} WHERE id = ?`,
          values
        );
      }

      // 추가 정보 업데이트
      if (personData.extraInfo !== undefined) {
        // 기존 추가 정보 삭제 (업데이트할 키에 대해서만)
        const extraInfoKeys = Object.keys(personData.extraInfo);
        if (extraInfoKeys.length > 0) {
          await connection.query(
            "DELETE FROM extra_info WHERE person_id = ? AND title IN (?)",
            [personId, extraInfoKeys]
          );

          // 새 추가 정보 저장
          for (const [key, value] of Object.entries(personData.extraInfo)) {
            await connection.query(
              "INSERT INTO extra_info (person_id, title, info) VALUES (?, ?, ?)",
              [personId, key, value]
            );
          }
        }
      }

      // 트랜잭션 커밋
      await connection.commit();

      // 업데이트된 인물 조회 및 반환
      const updatedPerson = await findPersonById(personId);
      return updatedPerson;
    } catch (error) {
      // 오류 발생 시 롤백
      await connection.rollback();
      throw error;
    } finally {
      // 연결 반환
      connection.release();
    }
  } catch (error) {
    console.error("인물 노드 수정 오류:", error);
    throw error;
  }
};

// 인물 노드 삭제
export const deletePerson = async (personId) => {
  try {
    // 관련 메모리 삭제 (외래 키 제약 조건이 있다면)
    await pool.query("DELETE FROM memory WHERE person_id = ?", [personId]);

    // 관련 메모리 이미지 삭제
    await pool.query("DELETE FROM memory_image WHERE person_id = ?", [
      personId,
    ]);

    // 관련 추가 정보 삭제
    await pool.query("DELETE FROM extra_info WHERE person_id = ?", [personId]);

    // 인물 삭제
    const [result] = await pool.query("DELETE FROM person WHERE id = ?", [
      personId,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("인물 노드 삭제 오류:", error);
    throw error;
  }
};
