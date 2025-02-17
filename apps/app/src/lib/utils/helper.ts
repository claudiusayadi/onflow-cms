import { DEFAULT_PAGE_SIZE } from '../constants';

export function transformSkipTake({
	page,
	limit,
}: {
	page?: number;
	limit?: number;
}) {
	const validPage = Math.max(1, page ?? 1);
	return {
		skip: (validPage - 1) * (limit ?? DEFAULT_PAGE_SIZE),
		take: limit ?? DEFAULT_PAGE_SIZE,
	};
}

export function calculatePageNumbers({
	pageNeighbors,
	totalPages,
	currentPage,
}: {
	pageNeighbors: number;
	totalPages: number;
	currentPage: number;
}) {
	const totalNumbers = pageNeighbors * 2 + 1;
	const totalBlocks = totalNumbers + 2;

	if (totalPages <= totalBlocks) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const leftBound = currentPage - pageNeighbors;
	const rightBound = currentPage + pageNeighbors;
	const leftEllipsis = leftBound > 4;
	const rightEllipsis = rightBound < totalPages - 3;

	if (!leftEllipsis && rightEllipsis) {
		const leftRange = Array.from({ length: totalNumbers + 2 }, (_, i) => i + 1);
		return [...leftRange, '...', totalPages];
	}

	if (leftEllipsis && !rightEllipsis) {
		const rightRange = Array.from(
			{ length: totalNumbers + 2 },
			(_, i) => totalPages - totalNumbers - 1 + i
		);
		return [1, '...', ...rightRange];
	}

	if (leftEllipsis && rightEllipsis) {
		const middleRange = Array.from(
			{ length: totalNumbers },
			(_, i) => leftBound + i
		);
		return [1, '...', ...middleRange, '...', totalPages];
	}

	const range = Array.from({ length: totalPages }, (_, i) => i + 1);
	return range;
}
