'use client';
import { signin } from '../../../lib/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';
import Form from './form';

function SigninForm() {
	const [state, action] = useActionState(signin, undefined);
	return (
		<>
			<h2 className='text-3xl font-bold'>Welcome back!</h2>
			<p className='mb-6'>Resume where you left off.</p>
			<Form state={state} action={action} buttonText='Sign in' />
			<p className='mt-4'>
				Don&apos;t have an account?{' '}
				<Link href='/auth/signup' className='text-blue-500'>
					Sign up
				</Link>
			</p>
		</>
	);
}
export default SigninForm;
