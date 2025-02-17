'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
	variant?: BadgeVariant;
	children: React.ReactNode;
	className?: string;
}

export function Badge({
	variant = 'default',
	children,
	className,
}: BadgeProps) {
	const variants = {
		default: 'bg-gray-100 text-gray-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		error: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-blue-800',
	};

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit',
				variants[variant],
				className
			)}>
			{children}
		</span>
	);
}
