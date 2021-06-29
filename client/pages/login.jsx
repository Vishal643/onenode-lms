import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { useRouter } from 'next/router';

import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { Context } from '../context/index';

const Login = () => {
	const [email, setEmail] = useState('vishalkumar199812@gmail.com');
	const [password, setPassword] = useState('111111');
	const [loading, setLoading] = useState(false);

	//global state
	const { state, dispatch } = useContext(Context);

	const { user } = state;

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const payload = {
				email,
				password,
			};
			const { data } = await axios.post('/api/login', payload);

			dispatch({
				type: 'LOGIN',
				payload: data,
			});

			//save logged in user in localstorage
			window.localStorage.setItem('user', JSON.stringify(data));
			router.push('/');
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
			<h1 className='jumbotron text-center bg-primary square'>Sign In</h1>
			<div className='container col-md-4 offset-md-4 pb-5'>
				<form onSubmit={handleSubmit}>
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
						className='btn btn-block btn-primary login-btn'
						type='submit'
						disabled={!email || !password || loading}>
						{loading ? <SyncOutlined spin /> : 'Sign In'}
					</button>
				</form>
				<p className='text-center pt-3'>
					Don't have an account?{' '}
					<Link href='/register'>
						<a>Signup</a>
					</Link>
				</p>
				<p className='text-center '>
					<Link href='/forgot-password'>
						<a className='text-danger'>Forgot Password?</a>
					</Link>
				</p>
			</div>
		</>
	);
};

export default Login;
