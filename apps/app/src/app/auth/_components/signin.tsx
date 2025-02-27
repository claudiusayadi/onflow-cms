import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from './submit-button';

function SigninForm() {
	return (
		<>
			<h2 className='text-3xl font-bold'>Welcome back!</h2>
			<p className='mb-6'>Resume where you left off.</p>
			<form className='flex flex-col gap-4 w-full'>
				<div>
					<Label htmlFor='email'>Email</Label>
					<Input
						type='email'
						id='email'
						name='email'
						placeholder='Enter your email'
						required
					/>
				</div>
				<div>
					<Label htmlFor='password'>Password</Label>
					<Input
						type='password'
						id='password'
						name='password'
						placeholder='Enter your password'
						required
					/>
				</div>
				<SubmitButton className='mt-2'>Sign in</SubmitButton>
			</form>
		</>
	);
}
export default SigninForm;
