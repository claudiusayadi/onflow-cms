'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { calculatePageNumbers } from '../lib/utils/helper';
import { useEffect, useState } from 'react';

type PaginationProps = {
	totalPages: number;
	currentPage: number;
	pageNeighbors?: number;
	className?: string;
};

type PageButtonProps = {
	href: string;
	isActive?: boolean;
	children: React.ReactNode;
};

const PageButton = ({ href, isActive, children }: PageButtonProps) => (
	<Link href={href}>
		<button
			className={cn(
				'px-3 py-2 rounded-md transition w-full',
				'hover:text-sky-600',
				{
					'bg-slate-200': !isActive,
					'bg-blue-500 text-white': isActive,
				}
			)}>
			{children}
		</button>
	</Link>
);

const NavigationButton = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => (
	<Link href={href}>
		<button className='bg-slate-200 px-3 py-2 rounded-md w-full'>
			{children}
		</button>
	</Link>
);

function Pagination({
	totalPages,
	currentPage,
	pageNeighbors: baseNeighbors = 2,
	className,
}: PaginationProps) {
	const pageNeighbors = useResponsivePagination(baseNeighbors);
	const pageNumbers = calculatePageNumbers({
		pageNeighbors,
		totalPages,
		currentPage,
	});

	return (
		<div className={cn('flex justify-center items-center gap-2', className)}>
			{currentPage > 1 && (
				<NavigationButton href={`?page=${currentPage - 1}`}>
					<ChevronLeft size={20} />
				</NavigationButton>
			)}

			{pageNumbers.map(page =>
				page === '...' ? (
					<span key={page} className='px-2'>
						{page}
					</span>
				) : (
					<PageButton
						key={page}
						href={`?page=${page}`}
						isActive={currentPage === page}>
						{page}
					</PageButton>
				)
			)}

			{currentPage < totalPages && (
				<NavigationButton href={`?page=${currentPage + 1}`}>
					<ChevronRight size={20} />
				</NavigationButton>
			)}
		</div>
	);
}
// Add responsive behavior based on screen size
function useResponsivePagination(baseNeighbors: number = 2) {
	const [pageNeighbors, setPageNeighbors] = useState(baseNeighbors);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setPageNeighbors(1); // Mobile: only show current page
			} else {
				setPageNeighbors(baseNeighbors); // others: show 2 neighbors
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [baseNeighbors]);

	return pageNeighbors;
}
export default Pagination;
