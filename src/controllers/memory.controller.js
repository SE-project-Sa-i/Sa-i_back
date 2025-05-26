// memory.controller.js 파일에 확장 컨트롤러 코드를 병합

import { memoryResponseDTO } from "../dtos/person.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, NotFoundError } from "../errors.js";
import { findPersonById } from "../repositories/person.repository.js";
import {
  findMemoriesByPersonId,
  findMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
} from "../repositories/memory.repository.js";

// 노드 메모 목록 조회 API
// GET /api/v1/persons/:personId/memories
export const handleGetMemoriesByPersonId = async (req, res) => {
  try {
    const personId = req.params.personId;
    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");

    const person = await findPersonById(personId);
    if (!person) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    const memories = await findMemoriesByPersonId(personId);
    res.status(StatusCodes.OK).success(memories.map(memoryResponseDTO));
  } catch (error) {
    console.error("메모 목록 오류:", error);
    throw error;
  }
};

// 노드 메모 생성 API
// POST /api/v1/persons/:personId/info/memory
export const handleCreateMemory = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { content } = req.body;

    if (!personId) throw new MissRequiredFieldError("인물 ID가 필요합니다.");
    if (!content) throw new MissRequiredFieldError("내용은 필수입니다.");

    const person = await findPersonById(personId);
    if (!person) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    console.log("메모 생성 요청 데이터:", person);

    const memoryData = {
      personId: parseInt(person.id), // 숫자형 ID 변환
      content,
    };

    console.log("메모 생성 데이터:", memoryData);

    const createdId = await createMemory(memoryData);
    const memory = await findMemoryById(createdId);
    res.status(StatusCodes.CREATED).success(memoryResponseDTO(memory));
  } catch (error) {
    console.error("메모 생성 오류:", error);
    throw error;
  }
};

// 노드 메모 수정 API
// PUT /api/v1/persons/:personId/info/memory
export const handleUpdateMemory = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { memory_id, content } = req.body;

    // memory_id는 body로부터 받아야 함 (명세서 기준)
    if (!personId || !memory_id)
      throw new MissRequiredFieldError("인물 ID와 메모리 ID가 필요합니다.");

    const person = await findPersonById(personId);
    if (!person) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    const memoryData = {
      content,
    };

    const updated = await updateMemory(memory_id, memoryData);
    if (!updated) throw new NotFoundError("해당 메모리를 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success(memoryResponseDTO(updated));
  } catch (error) {
    console.error("메모 수정 오류:", error);
    throw error;
  }
};

// 노드 메모 삭제 API
// DELETE /api/v1/persons/:personId/info/memory
export const handleDeleteMemory = async (req, res) => {
  try {
    const personId = req.params.personId;
    const { memory_id } = req.body;

    if (!personId || !memory_id)
      throw new MissRequiredFieldError("인물 ID와 메모리 ID가 필요합니다.");

    const person = await findPersonById(personId);
    if (!person) throw new NotFoundError("해당 인물을 찾을 수 없습니다.");

    const success = await deleteMemory(memory_id);
    if (!success) throw new NotFoundError("해당 메모리를 찾을 수 없습니다.");

    res.status(StatusCodes.OK).success({ message: "메모리가 삭제되었습니다." });
  } catch (error) {
    console.error("메모 삭제 오류:", error);
    throw error;
  }
};
