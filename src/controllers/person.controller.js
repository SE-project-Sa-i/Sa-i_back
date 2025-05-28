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
  updatePersonFieldService,
  getPersonAllInfoService,
} from "../services/person.service.js";

// 인물 노드 목록 조회 API
export const handleGetPersons = async (req, res) => {
  try {
    const filter = { categoryId: req.query.category_id };
    const user_id = req.userId;

    const result = await getPersonsService(filter, user_id);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 목록 조회 오류:", error);
    throw error;
  }
};

// 인물 노드 상세 조회 API
export const handleGetPersonById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    const result = await getPersonByIdService(personId, userId);
    if (!result) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

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
    if (!personData.name || !personData.categoryId) {
      throw new MissRequiredFieldError("이름과 카테고리는 필수입니다.");
    }

    const userId = req.userId;

    const result = await createPersonService(personData, userId);
    res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    console.error("인물 노드 생성 오류:", error);
    throw error;
  }
};

// 인물 노드 수정 API
export const handleUpdatePerson = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    const personData = updatePersonRequestDTO(req.body);
    const result = await updatePersonService(personId, personData, userId);

    if (!result) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 노드 수정 오류:", error);
    throw error;
  }
};

// 인물 노드 삭제 API
export const handleDeletePerson = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    await deletePersonService(personId, userId);
    res
      .status(StatusCodes.OK)
      .success({ message: "인물 노드가 삭제되었습니다." });
  } catch (error) {
    console.error("인물 노드 삭제 오류:", error);
    throw error;
  }
};

// 한줄소개 수정 API
export const handleUpdateOneLineIntro = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    const { one_line } = req.body;

    if (!one_line) throw new MissRequiredFieldError("한줄소개가 필요합니다.");

    const result = await updatePersonFieldService(
      personId,
      {
        introduction: one_line,
      },
      userId
    );
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("한줄소개 수정 오류:", error);
    throw error;
  }
};

// 노트 수정 API
export const handleUpdateNote = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { note } = req.body;

    if (!note) throw new MissRequiredFieldError("노트가 필요합니다.");

    const result = await updatePersonFieldService(personId, { note });
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("노트 수정 오류:", error);
    throw error;
  }
};

// 호감도 수정 API
export const handleUpdateLikeability = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { likeability } = req.body;

    if (likeability === undefined || isNaN(likeability)) {
      throw new MissRequiredFieldError("호감도는 숫자여야 합니다.");
    }

    const result = await updatePersonFieldService(personId, { likeability });
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("호감도 수정 오류:", error);
    throw error;
  }
};

export const handleGetAllPersonInfo = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) throw new MissRequiredFieldError("사용자 ID가 필요합니다.");
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    const personIsExist = await getPersonByIdService(personId, userId);

    const result = await getPersonAllInfoService(personId);
    if (!result) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    console.error("인물 정보 전체 조회 오류:", error);
    throw error;
  }
};
