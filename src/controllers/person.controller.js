import {
  createPersonRequestDTO,
  personDetailResponseDTO,
  personListResponseDTO,
  updatePersonRequestDTO,
} from "../dtos/person.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, NotFoundError } from "../errors.js";
import {
  getPersonsService,
  getPersonByIdService,
  createPersonService,
  updatePersonService,
  deletePersonService,
} from "../services/person.service.js";

// 인물 노드 목록 조회 API
export const handleGetPersons = async (req, res) => {
  try {
    // 쿼리 파라미터에서 필터 조건 가져오기
    const filter = {
      categoryId: req.query.category_id,
      nationality: req.query.nationality,
      search: req.query.search,
    };

    const result = await getPersonsService(filter);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 목록 조회 오류:", error);
    throw error;
  }
};

// 인물 노드 상세 조회 API
export const handleGetPersonById = async (req, res) => {
  try {
    const personId = req.params.personId;
    if (!personId) {
      throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    }

    const result = await getPersonByIdService(personId);
    if (!result) {
      throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
    }

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 상세 조회 오류:", error);
    throw error;
  }
};

// 인물 노드 생성 API
export const handleCreatePerson = async (req, res) => {
  try {
    const personData = createPersonRequestDTO(req.body);

    // 필수 필드 확인 (이름과 카테고리는 필수)
    if (!personData.name || !personData.categoryId) {
      throw new MissRequiredFieldError("이름과 카테고리는 필수입니다.");
    }

    const result = await createPersonService(personData);
    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    console.error("인물 노드 생성 오류:", error);
    throw error;
  }
};

// 인물 노드 수정 API
export const handleUpdatePerson = async (req, res) => {
  try {
    const personId = req.params.personId;
    if (!personId) {
      throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    }

    const personData = updatePersonRequestDTO(req.body);
    const result = await updatePersonService(personId, personData);

    if (!result) {
      throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
    }

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 수정 오류:", error);
    throw error;
  }
};

// 인물 노드 삭제 API
export const handleDeletePerson = async (req, res) => {
  try {
    const personId = req.params.personId;
    if (!personId) {
      throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    }

    await deletePersonService(personId);
    res
      .status(StatusCodes.OK)
      .success({ message: "인물 노드가 삭제되었습니다." });
  } catch (error) {
    console.error("인물 노드 삭제 오류:", error);
    throw error;
  }
};
