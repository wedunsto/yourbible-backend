// Request and response shapes for Bible study note categories

export type CreateBibleStudyCategoryRequestDto = {
    userId: string;
    category: string;
}

export type UpdateBibleStudyCategoryRequestDto = {
    category: string;
}

export type BibleStudyCategoryResponseDto = {
    id: string;
    userId: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}
