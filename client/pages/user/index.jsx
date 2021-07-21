import React, { useContext, useEffect, useState } from 'react';

import { Context } from '../../context/index';

import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';

import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'next/link';

const UserIndex = () => {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const {
		state: { user },
	} = useContext(Context);

	const loadCourses = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get('/api/user-courses');

			setCourses(data);
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};
	useEffect(() => {
		loadCourses();
	}, []);
	return (
		<UserRoute>
			{loading && (
				<SyncOutlined
					spin
					className='d-flex justify-content-center display-1 text-danger p-5'
				/>
			)}
			<h1 className='jumbotron text-center square'>User Dashboard</h1>

			{courses &&
				courses.map((course) => (
					<div className='ps-3 row pb-1 d-flex' key={course._id}>
						<Avatar
							size={80}
							shape='square'
							src={course.image ? course.image.Location : '/course.png'}
						/>
						<div className='col-md-6 ps-4'>
							<Link href={`/user/course/${course.slug}`} className='pointer'>
								<a>
									<h5 className='mt-1 text-primary'>{course.name}</h5>
								</a>
							</Link>
							<p style={{ marginTop: '-10px' }}>
								{course.lessons.length} Lessons
							</p>
							<p style={{ marginTop: '-10px', fontSize: '12px' }}>
								By {course.instructor.name}
							</p>
						</div>
						<div className='col-md-3 mt-3 text-center'>
							<Link href={`/user/course/${course.slug}`} className='pointer'>
								<a>
									<PlayCircleOutlined className='h2  text-primary' />
								</a>
							</Link>
						</div>
					</div>
				))}
		</UserRoute>
	);
};

export default UserIndex;
