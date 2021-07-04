import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

import InstructorRoute from '../../components/routes/InstructorRoute';

const InstructorIndex = () => {
	const [courses, setCourses] = useState([]);

	const loadCourses = async () => {
		const { data } = await axios.get('/api/instructor-courses');
		setCourses(data);
	};
	useEffect(() => {
		loadCourses();
	}, []);
	return (
		<InstructorRoute>
			<h1 className='jumbotron text-center square'>Instructor dashboard</h1>
			{courses &&
				courses.map((course) => (
					<React.Fragment key={course._id}>
						<div className='media pt-2 d-flex'>
							<Avatar
								size={80}
								src={course.image ? course.image.Location : '/course.png'}
							/>

							<div className='media-body ps-2 mt-2' style={{ flexGrow: '2' }}>
								<div className='row'>
									<div className='col'>
										<Link
											href={`/instructor/course/view/${course.slug}`}
											className='pointer'>
											<a>
												<h5 className='text-primary'>{course.name}</h5>
											</a>
										</Link>
										<p style={{ marginTop: '-5px' }}>
											{course.lessons.length} Lessons
										</p>
										{course.lessons.length < 5 ? (
											<p
												style={{ marginTop: '-10px' }}
												className='text-warning'>
												At least 5 lessons are required to publish a course.
											</p>
										) : course.published ? (
											<p
												style={{ marginTop: '-10px' }}
												className='text-success'>
												Your course is live in the marketplace.
											</p>
										) : (
											<p
												style={{ marginTop: '-10px' }}
												className='text-success'>
												Your course is ready to be published.
											</p>
										)}
									</div>
									<div className='col-md-3 mt-3 text-center'>
										{course.published ? (
											<div>
												<CheckCircleOutlined className='h5 pointer text-success' />
											</div>
										) : (
											<div>
												<CloseCircleOutlined className='h5 pointer text-warning' />
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</React.Fragment>
				))}
		</InstructorRoute>
	);
};

export default InstructorIndex;
