'use server';

import { fetcher } from '../fetcher';
import { formSchema } from '../schema/form';
import { print, DocumentNode } from 'graphql';
import { SIGN_IN, SIGN_UP } from '../queries';
import { FormState } from '../types/form-state';
import { redirect } from 'next/navigation';

async function action(
	state: FormState,
	formData: FormData,
	query: DocumentNode,
	responseField: string,
	url: string
): Promise<FormState> {
	const validateForm = formSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validateForm.success) {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: validateForm.error.flatten().fieldErrors,
		};
	}

	try {
		const data = await fetcher(print(query), {
			input: { ...validateForm.data },
		});

		if (data.errors) {
			return {
				data: Object.fromEntries(formData.entries()),
				message: `Operation failed! No ${responseField} in response.`,
			};
		}

		redirect(url);
	} catch (error) {
		if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
			throw error;
		}

		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(
			'Action error:',
			errorMessage,
			error instanceof Error ? error.stack : ''
		);

		return {
			data: Object.fromEntries(formData.entries()),
			message: `${errorMessage}`,
		};
	}
}

export async function signup(
	state: FormState,
	formData: FormData
): Promise<FormState> {
	return action(state, formData, SIGN_UP, 'signup', '/auth/signin');
}

export async function signin(
	state: FormState,
	formData: FormData
): Promise<FormState> {
	return action(state, formData, SIGN_IN, 'signin', '/');
}
