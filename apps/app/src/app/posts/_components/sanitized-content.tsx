'use client';

import DOMPurify from 'dompurify';

type Props = {
	content: string;
	className?: string;
};

function SanitizedContent({ content, className }: Props) {
	const clean = DOMPurify.sanitize(content);

	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{
				__html: clean,
			}}
		/>
	);
}
export default SanitizedContent;
