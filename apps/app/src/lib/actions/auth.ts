'use server';
import { fetcher } from '../fetcher';
import { formSchema } from '../schema/form';
import { print } from 'graphql';
import { SIGN_UP } from '../queries';
import { SignupFormState } from '../types/form-state';
import { redirect } from 'next/navigation';

export async function signup(
	state: SignupFormState,
	formData: FormData
): Promise<SignupFormState> {
	const validateForm = formSchema.safeParse(
		Object.fromEntries(formData.entries())
	);
	if (!validateForm.success) {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: validateForm.error.flatten().fieldErrors,
		};
	}

	const data = await fetcher(print(SIGN_UP), {
		input: { ...validateForm.data },
	});

	if (data?.errors)
		return {
			data: Object.fromEntries(formData.entries()),
			message: 'Something went wrong!',
			errors: {},
		};
	redirect('/auth/signin');
}
