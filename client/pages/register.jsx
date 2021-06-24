import { useState } from 'react';
import axios from 'axios';

import Link from 'next/link';

import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const payload = {
				name,
				email,
				password,
			};
			const { data } = await axios.post('/api/register', payload);
			setLoading(false);
			toast.success(data.msg);
		} catch (err) {
			setLoading(false);
			toast.error(err.response.data);
		}
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
						placeholder='Write your email...'
					/>

					<input
						type='password'
						className='form-control mb-4 p-3'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Write your password...'
					/>
					<button
						className='btn btn-block btn-primary register-btn'
						type='submit'
						disabled={!name || !email || !password || loading}>
						{loading ? <SyncOutlined spin /> : 'Register'}
					</button>
				</form>
				<p className='text-center p-3'>
					Already have an account?{' '}
					<Link href='/login'>
						<a>Login</a>
					</Link>
				</p>
			</div>
		</>
	);
};

export default Register;
