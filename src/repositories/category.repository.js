import { pool } from "../db.config.js";
// 카테고리 생성
export const createCategory = async (categoryData) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO category (title, parent_category_id, color, is_root, user_id) VALUES (?, ?, ?, ?, ?)",
      [
        categoryData.name,
        categoryData.parentId,
        categoryData.color,
        categoryData.isRoot,
        categoryData.userId,
      ]
    );

    if (result.insertId) {
      const [rows] = await pool.query("SELECT * FROM category WHERE id = ?", [
        result.insertId,
      ]);

      return rows.length > 0 ? rows[0] : null;
    }

    return null;
  } catch (error) {
    console.error("카테고리 생성 오류:", error);
    throw error;
  }
};

// 모든 카테고리 조회 (계층 구조 적용)
export const findAllCategories = async (userId) => {
  try {
    // 모든 카테고리 조회
    const [allCategories] = await pool.query(
      `
            SELECT c.*,
                   (SELECT COUNT(*) FROM person p WHERE p.category_id = c.id) as person_count
            FROM category c
            WHERE c.user_id = ?
            ORDER BY c.title ASC
        `,
      [userId]
    );

    // 계층 구조로 변환
    const categoryMap = {};
    const rootCategories = [];

    // 먼저 모든 카테고리를 Map에 추가
    allCategories.forEach((category) => {
      // title을 name으로 매핑
      category.name = category.title;
      categoryMap[category.id] = { ...category, children: [] };
    });

    // 부모-자식 관계 설정
    allCategories.forEach((category) => {
      if (category.parent_category_id === null) {
        rootCategories.push(categoryMap[category.id]);
      } else {
        const parent = categoryMap[category.parent_category_id];
        if (parent) {
          parent.children.push(categoryMap[category.id]);
        }
      }
    });

    return rootCategories;
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    throw error;
  }
};

// ID로 카테고리 조회
export const findCategoryById = async (categoryId) => {
  try {
    const [rows] = await pool.query("SELECT * FROM category WHERE id = ?", [
      categoryId,
    ]);

    if (rows.length > 0) {
      // title을 name으로 매핑
      rows[0].name = rows[0].title;
      return rows[0];
    }

    return null;
  } catch (error) {
    console.error("카테고리 상세 조회 오류:", error);
    throw error;
  }
};
