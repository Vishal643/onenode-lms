import { useState } from 'react';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.table({ name, email, password });
	};
	return (
		<>
			<h1 className='jumbotron text-center bg-primary square'>Register</h1>
			<div className='container col-md-4 offset-md-4 pb-5'>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						className='form-control mb-4 p-3'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Write your name...'
					/>

					<input
						type='email'
						className='form-control mb-4 p-3'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Write your password...'
					/>

					<input
						type='password'
						className='form-control mb-4 p-3'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Enter your password...'
					/>
					<button
						className='btn btn-block btn-primary register-btn'
						type='submit'>
						Register
					</button>
				</form>
			</div>
		</>
	);
};

export default Register;
