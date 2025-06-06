// 인물 노드 생성 요청 DTO
export const createPersonRequestDTO = (req) => {
  return {
    name: req.name,
    categoryId: req.category_id,
    introduction: req.introduction || null,
    note: req.note || null,
    isFavorite: req.is_favorite,
  };
};

// 인물 노드 상세 응답 DTO
export const personDetailResponseDTO = (person) => {
  return {
    id: person.id,
    name: person.name,
    categoryId: person.category_id,
    introduction: person.introduction || null,
    note: person.note || null,
    isFavorite: person.is_favorite,
    likeability: person.likeability || 0,
    createdAt: person.created_at
      ? new Date(person.created_at).toISOString().split("T")[0]
      : null,
  };
};

// 인물 노드 목록 응답 DTO
export const personListResponseDTO = (personList) => {
  return personList.map((person) => ({
    id: person.id,
    name: person.name,
    categoryId: person.category_id,
    categoryName: person.category_name,
    imageUrl: person.image_url || null,
    introduction: person.introduction || null,
    isFavorite: person.is_favorite === 1,
    likeability: person.likeability || 0,
  }));
};

// 인물 노드 수정 요청 DTO
export const updatePersonRequestDTO = (req) => {
  return {
    name: req.name,
    categoryId: req.category_id,
    imageUrl: req.image_url,
    introduction: req.introduction,
    note: req.note,
    likeability: req.likeability,
  };
};

// 카테고리 생성 요청 DTO
export const createCategoryRequestDTO = (req) => {
  return {
    name: req.name,
    parentId: req.parent_id || null,
    color: req.color,
    isRoot: req.is_root,
    userId: req.user_id,
  };
};

// 카테고리 응답 DTO (계층 구조 지원)
export const categoryResponseDTO = (category) => {
  const result = {
    id: category.id,
    name: category.name || category.title,
    parentId: category.parent_id || category.parent_category_id || null,
    isRoot: category.is_root,
    color: category.color || null,
  };

  if (category.children && Array.isArray(category.children)) {
    result.children = category.children.map((child) =>
      categoryResponseDTO(child)
    );
  }

  return result;
};

// 인물 노드 메모리 DTO
export const memoryResponseDTO = (memory) => {
  return {
    id: memory.id,
    personId: memory.person_id,
    content: memory.content,
    registeredAt: memory.registered_at,
    updatedAt: memory.updated_at,
  };
};
