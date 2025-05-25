import { pool } from "../db.config.js";
import {
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
    const [result] = await connection.query("DELETE FROM user WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows === 0) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return true;
  } finally {
    connection.release();
  }
};

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
