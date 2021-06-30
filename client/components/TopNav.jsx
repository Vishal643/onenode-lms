import { useState, useEffect, useContext } from 'react';

import { Menu } from 'antd';
import {
	AppstoreOutlined,
	LoginOutlined,
	UserAddOutlined,
	CoffeeOutlined,
	CarryOutOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Context } from '../context/index';

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
	const [currentState, setCurrentState] = useState('');

	const router = useRouter();

	const { state, dispatch } = useContext(Context);

	const { user } = state;

	useEffect(() => {
		process.browser && setCurrentState(window.location.pathname);
	}, [process.browser && window.location.pathname]);

	const handleLogout = async () => {
		dispatch({
			type: 'LOGOUT',
		});
		window.localStorage.removeItem('user');

		const { data } = await axios.get('/api/logout');

		toast.success(data.message);

		router.push('/login');
	};

	return (
		<Menu mode='horizontal' selectedKeys={[currentState]} className='mb-2'>
			<Item
				key='/'
				icon={<AppstoreOutlined />}
				onClick={(e) => setCurrentState(e.key)}>
				<Link href='/'>
					<a>App</a>
				</Link>
			</Item>

			{user && user.role && user.role.includes('Instructor') ? (
				<Item
					key='/instructor/course/create'
					icon={<CarryOutOutlined />}
					onClick={(e) => setCurrentState(e.key)}>
					<Link href='/instructor/course/create'>
						<a>Create Course</a>
					</Link>
				</Item>
			) : (
				<Item
					key='/user/become-instructor'
					icon={<TeamOutlined />}
					onClick={(e) => setCurrentState(e.key)}>
					<Link href='/user/become-instructor'>
						<a>Become an Instructor</a>
					</Link>
				</Item>
			)}

			{user === null && (
				<>
					<Item
						key='/login'
						icon={<LoginOutlined />}
						onClick={(e) => setCurrentState(e.key)}>
						<Link href='/login'>
							<a>Login</a>
						</Link>
					</Item>

					<Item
						key='/register'
						icon={<UserAddOutlined />}
						onClick={(e) => setCurrentState(e.key)}>
						<Link href='/register'>
							<a>Register</a>
						</Link>
					</Item>
				</>
			)}

			{user && user.role && user.role.includes('Instructor') && (
				<Item
					className='ms-auto'
					key='/instructor'
					icon={<TeamOutlined />}
					onClick={(e) => setCurrentState(e.key)}>
					<Link href='/instructor'>
						<a>Instructor</a>
					</Link>
				</Item>
			)}
			{user !== null && (
				<SubMenu
					key='/submenu'
					icon={<CoffeeOutlined />}
					title={user && user.name}>
					<ItemGroup>
						<Item key='/user'>
							<Link href='/user'>
								<a>Dashboard</a>
							</Link>
						</Item>
						<Item onClick={handleLogout} key='/logout'>
							Logout
						</Item>
					</ItemGroup>
				</SubMenu>
			)}
		</Menu>
	);
};

export default TopNav;
