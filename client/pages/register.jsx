import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { Context } from '../context/index';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const {
		state: { user },
	} = useContext(Context);

	const router = useRouter();

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
			toast.success(data.message);
			setName('');
			setPassword('');
			setEmail('');
		} catch (err) {
			setLoading(false);
			toast.error(err.response.data);
		}
	};

	useEffect(() => {
		if (user !== null) {
			router.push('/');
		}
	}, [user]);

	return (
		<>
			<h1 className='jumbotron text-center bg-primary square'>Sign Up</h1>
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
						{loading ? <SyncOutlined spin /> : 'Sign Up'}
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
