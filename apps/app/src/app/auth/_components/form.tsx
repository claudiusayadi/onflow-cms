import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from './submit-button';

function Form({
	state,
	action,
	buttonText,
}: {
	state: {
		message?: string;
		errors?: {
			email?: string;
			password?: string[];
		};
		data?: {
			email?: string;
			password?: string;
		};
	};
	action: (formData: FormData) => Promise<void> | void;
	buttonText: string;
}) {
	return (
		<form action={action} className='flex flex-col gap-4 w-full'>
			{!!state?.message && (
				<p className='text-red-500 text-sm'>{state.message}</p>
			)}
			<div>
				<Label htmlFor='email'>Email</Label>
				<Input
					type='email'
					id='email'
					name='email'
					placeholder='e.g. hello@dovely.tech'
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

			<SubmitButton className='mt-2 min-h-10'>{buttonText}</SubmitButton>
		</form>
	);
}
export default Form;
