// 인물 노드 생성 요청 DTO
export const createPersonRequestDTO = (req) => {
    return {
        name: req.name,
        categoryId: req.category_id,
        imageUrl: req.image_url || null,
        nationality: req.nationality || null,
        introduction: req.introduction || null,
        note: req.note || null,
        isFavorite: req.is_favorite || false,
        likeability: req.likeability || 0
    };
};

// 인물 노드 상세 응답 DTO
export const personDetailResponseDTO = (person) => {
    return {
        id: person.id,
        name: person.name,
        categoryId: person.category_id,
        imageUrl: person.image_url || null,
        nationality: person.nationality || null,
        introduction: person.introduction || null,
        note: person.note || null,
        isFavorite: person.is_favorite === 1,
        likeability: person.likeability || 0,
        createdAt: person.created_at,
        updatedAt: person.updated_at,
        extraInfo: person.extra_info || {}
    };
};

// 인물 노드 목록 응답 DTO
export const personListResponseDTO = (personList) => {
    return personList.map(person => ({
        id: person.id,
        name: person.name,
        categoryId: person.category_id,
        categoryName: person.category_name,
        imageUrl: person.image_url || null,
        nationality: person.nationality || null,
        introduction: person.introduction || null,
        isFavorite: person.is_favorite === 1,
        likeability: person.likeability || 0
    }));
};

// 인물 노드 수정 요청 DTO
export const updatePersonRequestDTO = (req) => {
    return {
        name: req.name,
        birthYear: req.birth_year,
        deathYear: req.death_year,
        nationality: req.nationality,
        description: req.description,
        occupation: req.occupation,
        categoryId: req.category_id,
        imageUrl: req.image_url,
    };
};

// 카테고리 생성 요청 DTO
export const createCategoryRequestDTO = (req) => {
    return {
        name: req.name,
        description: req.description || null,
        parentId: req.parent_id || null,
        color: req.color || null,
        isRoot: req.is_root || false,
        userId: req.user_id || 1 // 기본값으로 1 사용
    };
};

// 카테고리 응답 DTO (계층 구조 지원)
export const categoryResponseDTO = (category) => {
    const result = {
        id: category.id,
        name: category.name || category.title, // title을 name으로 사용
        description: category.description || null,
        parentId: category.parent_id || category.parent_category_id || null,
        isRoot: category.is_root === 1,
        color: category.color || null,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
    };

    // 하위 카테고리가 있는 경우
    if (category.children && Array.isArray(category.children)) {
        result.children = category.children.map(child => categoryResponseDTO(child));
    }

    return result;
};

// 인물 노드 메모리 DTO 확장
export const memoryResponseDTO = (memory) => {
    return {
        id: memory.id,
        personId: memory.person_id,
        content: memory.content,
        date: memory.date,
        location: memory.location || null,
        mood: memory.mood || null,
        imageUrls: memory.imageUrls || [],
        createdAt: memory.created_at,
        updatedAt: memory.updated_at,
    };
};