// memory.controller.js 파일에 확장 컨트롤러 코드를 병합

import { memoryResponseDTO } from "../dtos/person.dto.js";
import { StatusCodes } from "http-status-codes";
import { MissRequiredFieldError, NotFoundError } from "../errors.js";
import {
    getMemoriesByPersonIdService
} from "../services/memory.service.js";
import {
    createMemory,
    updateMemory,
    deleteMemory
} from "../repositories/memory.repository.js";
import { findPersonById } from "../repositories/person.repository.js";

// 노드 메모 목록 조회 API
export const handleGetMemoriesByPersonId = async (req, res) => {
    try {
        const personId = req.params.personId;
        if (!personId) {
            throw new MissRequiredFieldError("인물 ID가 필요합니다.");
        }

        const result = await getMemoriesByPersonIdService(personId);
        res.status(StatusCodes.OK).success(result);
    } catch (error) {
        console.error("노드 메모 목록 조회 오류:", error);
        throw error;
    }
};

// 메모리 생성 API 컨트롤러
export const handleCreateMemory = async (req, res) => {
    try {
        const personId = req.params.personId;
        if (!personId) {
            throw new MissRequiredFieldError("인물 ID가 필요합니다.");
        }

        // 인물이 존재하는지 확인
        const person = await findPersonById(personId);
        if (!person) {
            throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
        }

        // 필수 필드 확인
        if (!req.body.content) {
            throw new MissRequiredFieldError("내용은 필수입니다.");
        }

        // 메모리 데이터 준비
        const memoryData = {
            personId: parseInt(personId),
            content: req.body.content,
            imageUrls: req.body.image_urls || []
        };

        // 메모리 생성
        const result = await createMemory(memoryData);
        res.status(StatusCodes.CREATED).success(memoryResponseDTO(result));
    } catch (error) {
        console.error("메모리 생성 오류:", error);
        throw error;
    }
};

// 메모리 수정 API 컨트롤러
export const handleUpdateMemory = async (req, res) => {
    try {
        const personId = req.params.personId;
        const memoryId = req.params.memoryId;

        if (!personId || !memoryId) {
            throw new MissRequiredFieldError("인물 ID와 메모리 ID가 필요합니다.");
        }

        // 인물이 존재하는지 확인
        const person = await findPersonById(personId);
        if (!person) {
            throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
        }

        // 메모리 데이터 준비
        const memoryData = {
            content: req.body.content,
            imageUrls: req.body.image_urls
        };

        // 메모리 수정
        const result = await updateMemory(memoryId, memoryData);
        if (!result) {
            throw new NotFoundError("해당 메모리를 찾을 수 없습니다.");
        }

        res.status(StatusCodes.OK).success(memoryResponseDTO(result));
    } catch (error) {
        console.error("메모리 수정 오류:", error);
        throw error;
    }
};

// 메모리 삭제 API 컨트롤러
export const handleDeleteMemory = async (req, res) => {
    try {
        const personId = req.params.personId;
        const memoryId = req.params.memoryId;

        if (!personId || !memoryId) {
            throw new MissRequiredFieldError("인물 ID와 메모리 ID가 필요합니다.");
        }

        // 인물이 존재하는지 확인
        const person = await findPersonById(personId);
        if (!person) {
            throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
        }

        // 메모리 삭제
        const result = await deleteMemory(memoryId);
        if (!result) {
            throw new NotFoundError("해당 메모리를 찾을 수 없습니다.");
        }

        res.status(StatusCodes.OK).success({ message: "메모리가 삭제되었습니다." });
    } catch (error) {
        console.error("메모리 삭제 오류:", error);
        throw error;
    }
};