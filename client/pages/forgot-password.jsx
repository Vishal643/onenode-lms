import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context/index';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
	const {
		state: { user },
	} = useContext(Context);

	const router = useRouter();

	//state
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState(false);
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const { data } = await axios.post('/api/forgot-password', { email });
			setSuccess(true);
			toast.success('Check your email for the reset password link');
			setLoading(false);
		} catch (err) {
			setLoading(false);
			toast.error(err.response.data);
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await axios.post('/api/reset-password', {
				email,
				code,
				newPassword,
			});
			setEmail('');
			setCode('');
			setNewPassword('');
			setLoading(false);
			toast.success(
				'Password reset success!. Now you can login with your new password',
			);
		} catch (err) {
			setLoading(false);
			toast.error(err.response.data);
		}
	};
	useEffect(() => {
		if (user !== null) {
			router.push('/');
		}
	}, []);
	return (
		<>
			<h1 className='jumbotron text-center bg-primary square'>
				Forgot Password
			</h1>

			<div className='container col-md-4 offset-md-4 pb-5'>
				<form onSubmit={success ? handleResetPassword : handleSubmit}>
					<input
						type='email'
						value={email}
						className='form-control mb-4 p-3'
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Enter your email'
						required
					/>

					{success && (
						<>
							<input
								type='text'
								value={code}
								className='form-control mb-4 p-3'
								onChange={(e) => setCode(e.target.value)}
								placeholder='Enter your secret code'
								required
							/>
							<input
								type='password'
								value={newPassword}
								className='form-control mb-4 p-3'
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder='Enter new password'
								required
							/>
						</>
					)}

					<button
						className='btn btn-primary btn-block p-2 login-btn'
						disabled={loading || !email}>
						{loading ? <SyncOutlined spin /> : 'Submit'}
					</button>
				</form>
			</div>
		</>
	);
};

export default ForgotPassword;
