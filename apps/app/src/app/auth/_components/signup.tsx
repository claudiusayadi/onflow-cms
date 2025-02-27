'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from './submit-button';
import { signup } from '../../../lib/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';

function SignupForm() {
	const [state, actions] = useActionState(signup, undefined);
	return (
		<>
			<h2 className='text-3xl font-bold'>Sign up</h2>
			<p className='mb-6'>Create an account to explore.</p>
			<form action={actions} className='flex flex-col gap-4 w-full'>
				{!!state?.message && (
					<p className='text-red-500 text-sm'>{state.message}</p>
				)}
				<div>
					<Label htmlFor='email'>Email</Label>
					<Input
						type='email'
						id='email'
						name='email'
						placeholder='Enter your email'
						required
						defaultValue={state?.data?.email}
						className='min-h-10 border border-slate-200'
					/>
				</div>
				{!!state?.errors?.email && (
					<p className='text-red-500 text-sm'>{state.errors.email}</p>
				)}

				<div>
					<Label htmlFor='password'>Password</Label>
					<Input
						type='password'
						id='password'
						name='password'
						placeholder='Enter your password'
						required
						defaultValue={state?.data?.password}
						className='min-h-10 border border-slate-200'
					/>
				</div>
				{!!state?.errors?.password && (
					<div>
						<p>Password must:</p>
						<ul className='text-red-500 text-sm'>
							{state.errors.password.map(error => (
								<li key={error}>{error}</li>
							))}
						</ul>
					</div>
				)}

				<SubmitButton className='mt-2 min-h-10'>Sign up</SubmitButton>
			</form>

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
