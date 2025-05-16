import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// JWT 토큰 생성
export const createJwt = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    issuer: "sa-i_API_Server",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

// JWT 토큰 검증 미들웨어
export const verify = (req, res, next) => {
  const excludedPaths = ["/api/v1/auth/signup", "/api/v1/auth/login"];

  // 인증이 필요없는 경로는 바로 통과
  if (excludedPaths.includes(req.path)) {
    return next();
  }

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token 형식에서 토큰 분리

    if (!token) {
      return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
      }

      // 검증된 유저 정보를 요청 객체에 담음
      req.userId = decoded.userId;
      req.username = decoded.username;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "서버 에러", error: err.message });
  }
};

// 토큰 형식 확인
export const checkFormat = (req) => {
  if (req && req.startsWith("Bearer ")) {
    return req.split(" ")[1];
  } else {
    return null;
  }
};
