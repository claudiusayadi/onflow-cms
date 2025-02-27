'use client';
import { signup } from '../../../lib/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';
import Form from './form';

function SignupForm() {
	const [state, action] = useActionState(signup, undefined);
	return (
		<>
			<h2 className='text-3xl font-bold'>Sign up</h2>
			<p className='mb-6'>Create an account to explore.</p>
			<Form state={state} action={action} buttonText='Sign up' />
			<p className='mt-4'>
				Already have an account?{' '}
				<Link href='/auth/signin' className='text-blue-500'>
					Sign in
				</Link>
			</p>
		</>
	);
}
export default SignupForm;
