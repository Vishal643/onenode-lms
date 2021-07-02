import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, Tooltip } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const CourseView = () => {
	const [course, setCourse] = useState({});
	const router = useRouter();
	const { slug } = router.query;

	const loadCourse = async () => {
		try {
			const { data } = await axios.get(`/api/course/${slug}`);
			setCourse(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		loadCourse();
	}, [slug]);
	return (
		<div className='container-fluid pt-3'>
			{course && (
				<div className='media pt-2 d-flex'>
					<Avatar
						size={80}
						src={course.image ? course.image.Location : '/course.png'}
					/>

					<div className='media-body ps-2 mt-1' style={{ flexGrow: '2' }}>
						<div className='row'>
							<div className='col'>
								<h5 className='text-primary'>{course.name}</h5>

								<p style={{ marginTop: '-10px' }}>
									{course.lessons && course.lessons.length} Lessons
								</p>

								<p style={{ marginTop: '-15px', fontSize: '15px' }}>
									{course.category}
								</p>
							</div>

							<div className='col-md-2'>
								<Tooltip title='Edit'>
									<EditOutlined className='h5 pinter text-warning me-4' />
								</Tooltip>
								<Tooltip title='Publish'>
									<CheckOutlined className='h5 pinter text-danger mr-4' />
								</Tooltip>
							</div>
						</div>
						<div className='row'>
							<div className='col'>
								<ReactMarkdown children={course.description} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CourseView;
