import { pool } from "../db.config.js";
import {
  DBError,
  DuplicateUserEmailError,
  DuplicateUserIDError,
  NotFoundError,
} from "../errors.js";

// 사용자 추가
export const addUser = async (userData) => {
  const connection = await pool.getConnection();

  try {
    // 아이디 중복 확인
    const [existingUser] = await connection.query(
      "SELECT * FROM user WHERE service_id = ?",
      [userData.serviceId]
    );

    if (existingUser.length > 0) {
      throw new DuplicateUserIDError("아이디가 이미 존재합니다.", userData);
    }

    // 이메일 중복 확인
    const [existingEmail] = await connection.query(
      "SELECT * FROM user WHERE email = ?",
      [userData.email]
    );

    if (existingEmail.length > 0) {
      throw new DuplicateUserEmailError("이메일이 이미 존재합니다.", userData);
    }

    // 사용자 추가
    const [result] = await connection.query(
      "INSERT INTO user (name, service_id, email, password) VALUES (?, ?, ?, ?)",
      [userData.name, userData.serviceId, userData.email, userData.password]
    );

    if (result.insertId) {
      // 생성된 사용자 정보 반환
      const [user] = await connection.query(
        "SELECT id, name, service_id as serviceId, email, created_at as createdAt, updated_at as updatedAt FROM user WHERE id = ?",
        [result.insertId]
      );

      return user[0];
    }

    return null;
  } finally {
    connection.release();
  }
};

export const createMeNode = async (userId) => {
  const conn = await pool.getConnection();

  try {
    // 사용자 노드 생성
    const [result] = await conn.query(
      "INSERT INTO category (parent_category_id, user_id, title, color, is_root) VALUES (null, ?, '나', '#FFCC00', true)",
      [userId]
    );

    return null;
  } finally {
    conn.release();
  }
};

// 사용자 정보 조회 (아이디로)
export const findUserByUsername = async (serviceId) => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT id, name, service_id as serviceId, email, password, created_at as createdAt, updated_at as updatedAt FROM user WHERE service_id = ?",
      [serviceId]
    );

    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

// 사용자 정보 조회 (ID로) - getUserProfileService에서 필요
export const findUserById = async (userId) => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT id, name, service_id as serviceId, email, created_at as createdAt, updated_at as updatedAt FROM user WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return rows[0];
  } finally {
    connection.release();
  }
};

// 사용자 정보 업데이트 - updateUserProfileService에서 필요
export const updateUser = async (userId, updateData) => {
  const connection = await pool.getConnection();

  try {
    // 업데이트할 필드 구성
    const updateFields = [];
    const updateValues = [];

    if (updateData.name) {
      updateFields.push("name = ?");
      updateValues.push(updateData.name);
    }

    if (updateData.email) {
      updateFields.push("email = ?");
      updateValues.push(updateData.email);
    }

    if (updateData.password) {
      updateFields.push("password = ?");
      updateValues.push(updateData.password);
    }

    // 업데이트할 필드가 없으면 바로 사용자 정보 반환
    if (updateFields.length === 0) {
      return await findUserById(userId);
    }

    // updated_at 자동 업데이트
    updateFields.push("updated_at = CURRENT_TIMESTAMP()");

    // 쿼리 실행
    const updateQuery = `UPDATE user SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;
    updateValues.push(userId);

    const [result] = await connection.query(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 업데이트된 사용자 정보 반환
    return await findUserById(userId);
  } finally {
    connection.release();
  }
};

// 사용자 삭제 - deleteUserService에서 필요
export const deleteUser = async (userId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. 해당 사용자의 모든 카테고리를 계층 순서대로 조회 (자식부터)
    const [allCategories] = await connection.query(
      `SELECT id, parent_category_id FROM category WHERE user_id = ? ORDER BY parent_category_id DESC`,
      [userId]
    );

    if (allCategories.length > 0) {
      // 2. 카테고리를 계층 순서로 정렬 (자식 → 부모 순)
      const sortedCategories = sortCategoriesByHierarchy(allCategories);
      const categoryIds = sortedCategories.map((cat) => cat.id);

      // 3. 각 카테고리에 속한 인물들의 ID 조회
      const [persons] = await connection.query(
        `SELECT id FROM person WHERE category_id IN (${categoryIds
          .map(() => "?")
          .join(",")})`,
        categoryIds
      );

      if (persons.length > 0) {
        const personIds = persons.map((person) => person.id);

        // 4. 추억(memory) 테이블에서 해당 인물들의 데이터 삭제
        await connection.query(
          `DELETE FROM memory WHERE person_id IN (${personIds
            .map(() => "?")
            .join(",")})`,
          personIds
        );

        // 5. 추가정보(extra_info) 테이블에서 해당 인물들의 데이터 삭제
        await connection.query(
          `DELETE FROM extra_info WHERE person_id IN (${personIds
            .map(() => "?")
            .join(",")})`,
          personIds
        );
      }

      // 6. 인물(person) 테이블에서 해당 카테고리의 인물들 삭제
      await connection.query(
        `DELETE FROM person WHERE category_id IN (${categoryIds
          .map(() => "?")
          .join(",")})`,
        categoryIds
      );

      // 7. 카테고리를 자식부터 역순으로 삭제
      for (const category of sortedCategories) {
        await connection.query(`DELETE FROM category WHERE id = ?`, [
          category.id,
        ]);
      }
    }

    // 8. 즐겨찾기(favorite_person) 테이블에서 해당 사용자의 데이터 삭제
    await connection.query(`DELETE FROM favorite_person WHERE user_id = ?`, [
      userId,
    ]);

    // 9. 마지막으로 사용자(user) 테이블에서 사용자 삭제
    const [result] = await connection.query("DELETE FROM user WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 카테고리를 계층 구조에 따라 정렬하는 헬퍼 함수 (자식부터)
function sortCategoriesByHierarchy(categories) {
  const categoryMap = new Map();
  const roots = [];
  const result = [];

  // 카테고리 맵 생성
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // 부모-자식 관계 설정 및 루트 카테고리 찾기
  categories.forEach((cat) => {
    if (cat.parent_category_id === null) {
      roots.push(categoryMap.get(cat.id));
    } else {
      const parent = categoryMap.get(cat.parent_category_id);
      if (parent) {
        parent.children.push(categoryMap.get(cat.id));
      }
    }
  });

  // DFS로 자식부터 역순으로 수집
  function collectInReverseOrder(node) {
    // 먼저 자식들을 처리
    node.children.forEach((child) => {
      collectInReverseOrder(child);
    });
    // 그 다음 자신을 추가
    result.push(node);
  }

  // 모든 루트부터 시작
  roots.forEach((root) => {
    collectInReverseOrder(root);
  });

  return result;
}

// 비밀번호 확인용 사용자 조회 - deleteUserService에서 필요
export const findUserWithPasswordById = async (userId) => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      "SELECT id, password FROM user WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return rows[0];
  } finally {
    connection.release();
  }
};

export const getAllNodesbyUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    // 모든 카테고리와 인물을 플랫하게 조회
    const [allCategories] = await conn.query(
      `SELECT 
        id,
        title as name,
        parent_category_id as parentId,
        is_root as isRoot,
        color,
        'CATEGORY' as type
      FROM category 
      WHERE user_id = ?
      ORDER BY id ASC`,
      [userId]
    );

    const [allPersons] = await conn.query(
      `SELECT 
        p.id,
        p.name,
        p.category_id as parentId,
        0 as isRoot,
        NULL as color,
        'PERSON' as type
      FROM person p
      JOIN category c ON p.category_id = c.id
      WHERE c.user_id = ?
      ORDER BY p.id ASC`,
      [userId]
    );

    // 카테고리와 인물을 합친 전체 노드 배열
    const allNodes = [...allCategories, ...allPersons];

    // 계층 구조로 변환
    const nodeMap = {};
    const rootNodes = [];

    // 먼저 모든 노드를 Map에 추가
    allNodes.forEach((node) => {
      nodeMap[`${node.type}_${node.id}`] = { ...node, children: [] };
    });

    // 부모-자식 관계 설정
    allNodes.forEach((node) => {
      const nodeKey = `${node.type}_${node.id}`;

      if (node.type === "CATEGORY" && node.parentId === null) {
        // 루트 카테고리
        rootNodes.push(nodeMap[nodeKey]);
      } else if (node.parentId !== null) {
        // 자식 노드 (카테고리의 자식 카테고리 또는 카테고리의 인물)
        const parentKey = `CATEGORY_${node.parentId}`;
        const parent = nodeMap[parentKey];
        if (parent) {
          parent.children.push(nodeMap[nodeKey]);
        }
      }
    });

    return rootNodes;
  } catch (error) {
    console.error("DB 접근 중에 문제가 발생하였습니다.", error);
    throw new DBError("DB 접근 중에 문제가 발생하였습니다.", null);
  } finally {
    conn.release();
  }
};
