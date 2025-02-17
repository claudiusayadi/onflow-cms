'use client';

import React, { ReactNode, createContext, useContext, JSX } from 'react';
import { cn } from '@/lib/utils';

const CardContext = createContext<boolean | null>(null);

interface CardProps {
	element?:
		| keyof JSX.IntrinsicElements
		| React.ComponentType<{ className?: string }>
		| undefined;
	children: ReactNode;
	className?: string;
}

export function Card({
	element: Element = 'article',
	children,
	className,
}: CardProps) {
	return (
		<CardContext.Provider value={true}>
			<Element
				className={cn(
					'flex flex-col relative bg-cover rounded-lg shadow-xl overflow-hidden transition-all duration-300',
					className
				)}>
				{children}
			</Element>
		</CardContext.Provider>
	);
}

export function CardHead({
	element: Element = 'figure',
	children,
	className,
}: CardProps) {
	const isWithinCard = useContext(CardContext);

	if (!isWithinCard) {
		throw new Error('CardHead must be used within a Card component');
	}

	return (
		<Element
			className={cn(
				'inline-block size-full max-h-fit relative m-0',
				className
			)}>
			{children}
		</Element>
	);
}

export function CardBody({
	element: Element = 'div',
	children,
	className,
}: CardProps) {
	const isWithinCard = useContext(CardContext);

	if (!isWithinCard) {
		throw new Error('CardBody must be used within a Card component');
	}

	return (
		<Element
			className={cn(
				'w-full flex flex-wrap flex-col gap-4 p-4 flex-grow',
				className
			)}>
			{children}
		</Element>
	);
}
