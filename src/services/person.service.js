import {
    findAllPersons,
    findPersonById,
    createPerson,
    updatePerson,
    deletePerson
} from "../repositories/person.repository.js";
import { personDetailResponseDTO, personListResponseDTO } from "../dtos/person.dto.js";
import { NotFoundError, IntervalServerError } from "../errors.js";

// 인물 노드 목록 조회 서비스
export const getPersonsService = async (filter = {}) => {
    try {
        const persons = await findAllPersons(filter);
        return personListResponseDTO(persons);
    } catch (error) {
        throw error;
    }
};

// 인물 노드 상세 조회 서비스
export const getPersonByIdService = async (personId) => {
    try {
        const person = await findPersonById(personId);

        if (!person) {
            throw new NotFoundError("해당 인물을 찾을 수 없습니다.");
        }

        return personDetailResponseDTO(person);
    } catch (error) {
        throw error;
    }
};

// 인물 노드 생성 서비스
export const createPersonService = async (personData) => {
    try {
        const newPerson = await createPerson(personData);

        if (!newPerson) {
            throw new IntervalServerError("인물 노드 생성에 실패했습니다.");
        }

        return personDetailResponseDTO(newPerson);
    } catch (error) {
        throw error;
    }
};

// 인물 노드 수정 서비스
export const updatePersonService = async (personId, personData) => {
    try {
        // 존재하는 인물인지 확인
        const existingPerson = await findPersonById(personId);

        if (!existingPerson) {
            throw new NotFoundError("수정할 인물을 찾을 수 없습니다.");
        }

        // 수정할 데이터에서 undefined 필드 제거
        Object.keys(personData).forEach(key => {
            if (personData[key] === undefined) {
                delete personData[key];
            }
        });

        const updatedPerson = await updatePerson(personId, personData);
        return personDetailResponseDTO(updatedPerson);
    } catch (error) {
        throw error;
    }
};

// 인물 노드 삭제 서비스
export const deletePersonService = async (personId) => {
    try {
        // 존재하는 인물인지 확인
        const existingPerson = await findPersonById(personId);

        if (!existingPerson) {
            throw new NotFoundError("삭제할 인물을 찾을 수 없습니다.");
        }

        await deletePerson(personId);
        return true;
    } catch (error) {
        throw error;
    }
};