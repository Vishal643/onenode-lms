import React, { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import { SyncOutlined } from '@ant-design/icons';

const UserRoute = ({ children }) => {
	const [ok, setOk] = useState(false);

	const fetchUser = async () => {
		try {
			const { data } = await axios.get('/api/current-user');
			if (data.ok) {
				setOk(true);
			}
		} catch (err) {
			console.log(err);
			setOk(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<>
			{!ok ? (
				<SyncOutlined
					spin
					className='d-flex justify-content-center display-1 text-primary p-5'
				/>
			) : (
				<>{children}</>
			)}
		</>
	);
};

export default UserRoute;
