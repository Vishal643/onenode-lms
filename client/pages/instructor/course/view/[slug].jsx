import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Tooltip, Button, Modal } from 'antd';
import { EditOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';

const CourseView = () => {
	const [course, setCourse] = useState({});
	const [visible, setVisible] = useState(false);

	const [values, setValues] = useState({
		title: '',
		content: '',
		video: {},
	});

	const [uploading, setUploading] = useState(false);
	const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
	const [progress, setProgress] = useState(0);

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

	//functions for addding lessons
	const handleAddLesson = (e) => {
		e.preventDefault();
		console.log(values);
	};

	const handleVideo = async (e) => {
		try {
			const file = e.target.files[0];
			setUploadButtonText(file.name);
			setUploading(true);

			const videoData = new FormData();
			videoData.append('video', file);

			//save progress bar and send video as form data to backend
			const { data } = await axios.post('/api/course/video-upload', videoData, {
				onUploadProgress: (e) =>
					setProgress(Math.round((100 * e.loaded) / e.total)),
			});

			console.log(data);
			setValues({ ...values, video: data });
			setUploading(false);
		} catch (err) {
			console.log(err);
			setUploading(false);
			toast.error('Video upload failed.');
		}
	};

	const handleVideoRemove = async (e) => {
		try {
			setUploading(true);
			const { data } = await axios.post(
				'/api/course/video-remove',
				values.video,
			);
			setValues({ ...values, video: {} });
			setUploading(false);
			setUploadButtonText('Upload another video');
		} catch (err) {
			console.log(err);
			setUploading(false);
			toast.error('Video remove failed.');
		}
	};

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
						<div className='row'>
							<Button
								onClick={() => setVisible(true)}
								className='col-md-6 offset-md-3 text-center'
								type='primary'
								shape='round'
								icon={<UploadOutlined />}
								size='large'>
								Add Lesson
							</Button>
						</div>
						<br />
						<Modal
							title='+ Add Lesson'
							centered
							visible={visible}
							onCancel={() => setVisible(false)}
							footer={null}>
							<AddLessonForm
								values={values}
								setValues={setValues}
								uploading={uploading}
								setUploading={setUploading}
								uploadButtonText={uploadButtonText}
								setUploadButtonText={setUploadButtonText}
								progress={progress}
								handleAddLesson={handleAddLesson}
								handleVideo={handleVideo}
								handleVideoRemove={handleVideoRemove}
							/>
						</Modal>
					</div>
				</div>
			)}
		</div>
	);
};

export default CourseView;
