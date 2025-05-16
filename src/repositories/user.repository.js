import { pool } from "../db.config.js";
import { DuplicateUserEmailError, DuplicateUserIDError } from "../errors.js";

// 사용자 추가
export const addUser = async (userData) => {
  const connection = await pool.getConnection();

  // 아이디 중복 확인
  const [existingUser] = await connection.query(
    "SELECT * FROM user WHERE service_id = ?",
    [userData.serviceId]
  );

  if (existingUser.length > 0) {
    connection.release();
    throw new DuplicateUserIDError("아이디가 이미 존재합니다.", userData);
  }

  // 이메일 중복 확인
  const [existingEmail] = await connection.query(
    "SELECT * FROM user WHERE email = ?",
    [userData.email]
  );

  if (existingEmail.length > 0) {
    connection.release();
    throw new DuplicateUserEmailError("이매일이 이미 존재합니다.", userData);
  }

  // 사용자 추가
  const [result] = await connection.query(
    "INSERT INTO user (name, service_id, email, password) VALUES (?, ?, ?, ?)",
    [userData.name, userData.serviceId, userData.email, userData.password]
  );

  connection.release();

  if (result.insertId) {
    // 생성된 사용자 정보 반환
    const [user] = await connection.query(
      "SELECT id, name, service_id, email FROM user WHERE id = ?",
      [result.insertId]
    );

    return user[0];
  }

  return null;
};

// 사용자 정보 조회 (아이디로)
export const findUserByUsername = async (serviceId) => {
  const connection = await pool.getConnection();

  const [rows] = await connection.query(
    "SELECT * FROM user WHERE service_id = ?",
    [serviceId]
  );

  connection.release();

  return rows.length > 0 ? rows[0] : null;
};
