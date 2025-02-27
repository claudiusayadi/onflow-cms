function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className=' flex flex-col items-center justify-center min-h-screen bg-slate-100'>
			<div className='flex flex-col max-w-96 justify-stretch  mx-auto p-8 border  border-white shadow-md rounded-md size-full bg-white'>
				{children}
			</div>
		</div>
	);
}
export default AuthLayout;
