import { pool } from "../db.config.js";

// 모든 인물 노드 조회
export const findAllPersons = async (filter = {}, user_id) => {
  try {
    let query = `
      SELECT p.*, c.title as category_name,
             CASE WHEN f.person_id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
      FROM person p
             INNER JOIN category c ON p.category_id = c.id AND c.user_id = ?
             LEFT JOIN favorite_person f ON p.id = f.person_id AND f.user_id = ?
    `;

    const params = [user_id, user_id];

    if (filter.categoryId) {
      query += ` WHERE p.category_id = ?`;
      params.push(filter.categoryId);
    }

    query += ` ORDER BY is_favorite DESC, p.name ASC`;

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
    const [personRows] = await pool.query(
        `SELECT p.*, c.title as category_name,
                CASE WHEN f.person_id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
         FROM person p
                LEFT JOIN category c ON p.category_id = c.id
                LEFT JOIN favorite_person f ON p.id = f.person_id AND f.user_id = 1
         WHERE p.id = ?`,
        [personId]
    );

    if (personRows.length === 0) return null;

    const person = personRows[0];

    const [extraInfoRows] = await pool.query(
        `SELECT title, info FROM extra_info WHERE person_id = ?`,
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
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
        `INSERT INTO person (
        name, category_id, image_url,
        introduction, note, is_favorite, likeability
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          personData.name,
          personData.categoryId,
          personData.imageUrl,
          personData.introduction,
          personData.note,
          personData.isFavorite ? 1 : 0,
          personData.likeability,
        ]
    );

    const personId = result.insertId;

    if (personData.extraInfo) {
      for (const [key, value] of Object.entries(personData.extraInfo)) {
        await connection.query(
            `INSERT INTO extra_info (person_id, title, info) VALUES (?, ?, ?)`,
            [personId, key, value]
        );
      }
    }

    await connection.commit();
    return await findPersonById(personId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 인물 노드 수정
export const updatePerson = async (personId, personData) => {
  const fields = [];
  const values = [];

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

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    if (fields.length > 0) {
      fields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(personId);

      await connection.query(
          `UPDATE person SET ${fields.join(", ")} WHERE id = ?`,
          values
      );
    }

    if (personData.extraInfo !== undefined) {
      const keys = Object.keys(personData.extraInfo);
      if (keys.length > 0) {
        await connection.query(
            "DELETE FROM extra_info WHERE person_id = ? AND title IN (?)",
            [personId, keys]
        );

        for (const [key, value] of Object.entries(personData.extraInfo)) {
          await connection.query(
              "INSERT INTO extra_info (person_id, title, info) VALUES (?, ?, ?)",
              [personId, key, value]
          );
        }
      }
    }

    await connection.commit();
    return await findPersonById(personId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 인물 노드 삭제
export const deletePerson = async (personId) => {
  try {
    await pool.query("DELETE FROM memory WHERE person_id = ?", [personId]);
    await pool.query("DELETE FROM memory_image WHERE person_id = ?", [personId]);
    await pool.query("DELETE FROM extra_info WHERE person_id = ?", [personId]);

    const [result] = await pool.query("DELETE FROM person WHERE id = ?", [personId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("인물 노드 삭제 오류:", error);
    throw error;
  }
};

// 단일 필드 수정 함수 (한줄소개, 노트, 호감도 등)
export const updatePersonField = async (personId, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return null;

  const sets = keys.map((key) => `${key} = ?`).join(", ");
  const sql = `UPDATE person SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  try {
    await pool.query(sql, [...values, personId]);
    const [rows] = await pool.query("SELECT * FROM person WHERE id = ?", [personId]);
    return rows[0];
  } catch (error) {
    console.error("사람 정보 업데이트 오류:", error);
    throw error;
  }
};
