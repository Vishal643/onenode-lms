import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Tooltip, Button, Modal, List, Menu } from 'antd';
import {
	EditOutlined,
	CheckOutlined,
	UploadOutlined,
	QuestionOutlined,
	CloseOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';

const { Item } = List;
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
	const handleAddLesson = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				`/api/course/lesson/${slug}/${course.instructor._id}`,
				values,
			);
			// console.log(data);
			setVisible(false);
			setProgress(0);
			setUploadButtonText('Upload Video');
			setCourse(data);
			setValues({ ...values, title: '', content: '', video: {} });
			toast.success('Lesson Added Successfully!!!');
		} catch (err) {
			console.log(err);
			toast.error('Lesson adding failed');
		}
	};

	const handleVideo = async (e) => {
		try {
			const file = e.target.files[0];
			setUploadButtonText(file.name);
			setUploading(true);

			const videoData = new FormData();
			videoData.append('video', file);

			//save progress bar and send video as form data to backend
			const { data } = await axios.post(
				`/api/course/video-upload/${course.instructor._id}`,
				videoData,
				{
					onUploadProgress: (e) =>
						setProgress(Math.round((100 * e.loaded) / e.total)),
				},
			);
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
				`/api/course/video-remove/${course.instructor._id}`,
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

	const handlePublish = async (e, courseId) => {
		try {
			let answer = window.confirm(
				'Once you publish your course it will be live in the marketplace for users to enroll',
			);
			if (!answer) return;
			const { data } = await axios.put(`/api/course/publish/${courseId}`);
			setCourse(data);
			toast.success('Congrats your course is now live');
		} catch (err) {
			toast.error('Course Publish failed. Try Again');
		}
	};

	const handleUnPublish = async (e, courseId) => {
		try {
			let answer = window.confirm(
				'Once you unpublish your course it will be not be available for users to enroll',
			);
			if (!answer) return;
			const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
			setCourse(data);
			toast.info('Your course is unpublished');
		} catch (err) {
			console.log(err);
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
								<Tooltip
									title='Edit'
									onClick={() =>
										router.push(`/instructor/course/edit/${slug}`)
									}>
									<EditOutlined className='h5 pinter text-warning me-4' />
								</Tooltip>

								{course.lessons && course.lessons.length < 5 ? (
									<Tooltip title='Min-5 Lessons required to publish'>
										<QuestionOutlined className='h5 pointer text-danger' />
									</Tooltip>
								) : course.published ? (
									<Tooltip
										onClick={(e) => handleUnPublish(e, course._id)}
										title='Unpublish'
										className='text-danger h5 pointer'>
										<CloseOutlined />
									</Tooltip>
								) : (
									<Tooltip
										onClick={(e) => handlePublish(e, course._id)}
										title='Publish'
										className='text-success h5 pointer'>
										<CheckOutlined />
									</Tooltip>
								)}
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

						{/* Lessons List */}
						<div className='row pb-5'>
							<div className='col lesson-list'>
								<h4>
									{course && course.lessons && course.lessons.length} Lessons
								</h4>

								<List
									itemLayout='horizontal'
									dataSource={course && course.lessons}
									renderItem={(item, index) => (
										<Item>
											<Item.Meta
												avatar={<Avatar>{index + 1}</Avatar>}
												title={item.title}></Item.Meta>
										</Item>
									)}></List>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CourseView;
