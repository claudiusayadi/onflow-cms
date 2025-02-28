'use server';

import { fetcher } from '../fetcher';
import { formSchema } from '../schema/form';
import { print } from 'graphql';
import { SIGN_UP, SIGN_IN } from '../queries';
import { FormState } from '../types/form-state';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSession } from '../session';

export async function signup(
	state: FormState,
	formData: FormData
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
		const data = await fetcher(print(SIGN_UP), {
			input: { ...validateForm.data },
		});

		if (!data || !data.signup) {
			return {
				data: Object.fromEntries(formData.entries()),
				message: 'Signup failed: Something went wrong.',
			};
		}

		redirect('/auth/signin');
	} catch (error) {
		if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
			throw error;
		}

		console.error('Signup error:', error);
		return {
			data: Object.fromEntries(formData.entries()),
			message: error instanceof Error ? error.message : String(error),
		};
	}
}

export async function signin(
	state: FormState,
	formData: FormData
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
		const data = await fetcher(print(SIGN_IN), {
			input: { ...validateForm.data },
		});

		if (!data || !data.signin) {
			return {
				data: Object.fromEntries(formData.entries()),
				message: 'Signin failed: Something went wrong.',
			};
		}

		await createSession({
			user: {
				id: data.signin.id,
				name: data.signin.name,
				avatar: data.signin.avatar,
			},
			accessToken: data.signin.accessToken,
		});

		revalidatePath('/');
		redirect('/');
	} catch (error) {
		if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
			throw error;
		}

		console.error('Signin error:', error);
		return {
			data: Object.fromEntries(formData.entries()),
			message: error instanceof Error ? error.message : String(error),
		};
	}
}
