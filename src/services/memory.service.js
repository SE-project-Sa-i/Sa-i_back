import { memoryResponseDTO } from "../dtos/person.dto.js";
import { findMemoriesByPersonId } from "../repositories/memory.repository.js";
import { NotFoundError } from "../errors.js";
import { findPersonById } from "../repositories/person.repository.js";

// 노드 메모 목록 조회 서비스
export const getMemoriesByPersonIdService = async (personId) => {
    try {
        // 인물이 존재하는지 확인
        const person = await findPersonById(personId);

        if (!person) {
            throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
        }

        const memories = await findMemoriesByPersonId(personId);
        return memories.map(memory => memoryResponseDTO(memory));
    } catch (error) {
        throw error;
    }
};

// 메모리 생성 서비스 (필요시 추가)
export const createMemoryService = async (memoryData) => {
    try {
        // 여기서는 repository 함수를 직접 사용하고 있으므로 controller에서 repository 함수를 직접 호출해도 됩니다.
        // 추가 로직이 필요한 경우 이 함수를 구현하세요.
        return memoryData;
    } catch (error) {
        throw error;
    }
};

// 메모리 수정 서비스 (필요시 추가)
export const updateMemoryService = async (memoryId, memoryData) => {
    try {
        // 추가 로직이 필요한 경우 이 함수를 구현하세요.
        return memoryData;
    } catch (error) {
        throw error;
    }
};

// 메모리 삭제 서비스 (필요시 추가)
export const deleteMemoryService = async (memoryId) => {
    try {
        // 추가 로직이 필요한 경우 이 함수를 구현하세요.
        return true;
    } catch (error) {
        throw error;
    }
};