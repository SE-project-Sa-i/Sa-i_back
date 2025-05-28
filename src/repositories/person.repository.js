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
export const findPersonById = async (personId, userId) => {
  try {
    const [personRows] = await pool.query(
      `SELECT p.*, c.title as category_name,
                CASE WHEN f.person_id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
         FROM person p
                LEFT JOIN category c ON p.category_id = c.id
                LEFT JOIN favorite_person f ON p.id = f.person_id AND f.user_id = ?
         WHERE p.id = ?`,
      [userId, personId]
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
export const createPerson = async (personData, userId) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // person 테이블에 인물 추가
    const [result] = await connection.query(
      `INSERT INTO person (
        name, category_id,
        introduction, note
      ) VALUES (?, ?, ?, ?)`,
      [
        personData.name,
        personData.categoryId,
        personData.introduction,
        personData.note,
      ]
    );

    const personId = result.insertId;

    // 2. 즐겨찾기가 체크되어 있다면 favorite_person 테이블에 추가
    if (personData.isFavorite === true) {
      await connection.query(
        `INSERT INTO favorite_person (user_id, person_id) VALUES (?, ?)`,
        [userId, personId]
      );
    }

    await connection.commit();

    // 3. 생성된 인물 정보를 다시 조회해서 반환
    return await findPersonById(personId, userId);
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
    const memoryId = await pool.query(
      "SELECT id FROM memory WHERE person_id = ?",
      [personId]
    );
    await pool.query("DELETE FROM memory WHERE person_id = ?", [personId]);
    await pool.query("DELETE FROM extra_info WHERE person_id = ?", [personId]);

    const [result] = await pool.query("DELETE FROM person WHERE id = ?", [
      personId,
    ]);
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
    const [rows] = await pool.query("SELECT * FROM person WHERE id = ?", [
      personId,
    ]);
    return rows[0];
  } catch (error) {
    console.error("사람 정보 업데이트 오류:", error);
    throw error;
  }
};

export const findPersonAllInfoById = async (personId) => {
  const conn = await pool.getConnection();
  try {
    const [info] = await conn.query(
      `select p.id,
       p.name,
       p.image_url,
       p.introduction,
       p.note,
       p.likeability,
       p.created_at,
       CASE WHEN fp.person_id IS NOT NULL THEN 1 ELSE 0 END as is_favorite
       from person p
join favorite_person fp on p.id = fp.person_id
where p.id = ?;`,
      [personId]
    );

    const [extraInfos] = await conn.query(
      `select id, title, info from extra_info where person_id = ?;`,
      [personId]
    );

    const [memories] = await conn.query(
      `select id, content, registered_at from memory where person_id = ? order by registered_at;`,
      [personId]
    );

    const [path] = await conn.query(
      `WITH RECURSIVE category_path AS (
    -- 기본 케이스: 특정 인물의 카테고리부터 시작
    SELECT
        c.id,
        c.title,
        c.parent_category_id,
        c.title as path,
        0 as level
    FROM category c
    JOIN person p ON p.category_id = c.id
    WHERE p.id = ? -- 인물 ID를 여기에 입력

    UNION ALL

    -- 재귀 케이스: 부모 카테고리들을 계속 찾아감
    SELECT
        parent.id,
        parent.title,
        parent.parent_category_id,
        CONCAT(parent.title, ' > ', cp.path) as path,
        cp.level + 1
    FROM category parent
    JOIN category_path cp ON parent.id = cp.parent_category_id
)
SELECT
    p.id as person_id,
    p.name as person_name,
    CONCAT(
        COALESCE(
            (SELECT path FROM category_path ORDER BY level DESC LIMIT 1),
            (SELECT title FROM category WHERE id = p.category_id)
        ),
        ' > ',
        p.name
    ) as category_path
FROM person p
WHERE p.id = ?;`,
      [personId, personId]
    );

    const allPath = path[0].category_path;

    const data = {
      ...info[0],
      allPath,
      extraInfos: extraInfos.map((ei) => ({
        id: ei.id,
        title: ei.title,
        info: ei.info,
      })),
      memories: memories.map((m) => ({
        id: m.id,
        content: m.content,
        registeredAt: m.registered_at,
      })),
    };

    console.log("인물 전체 정보 조회 성공:", data);

    return data;
  } catch (error) {
    console.error("인물 전체 정보 조회 오류:", error);
    throw error;
  }
};
