import React, { useState, useEffect } from 'react';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';

import { List, Avatar, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { useRouter } from 'next/router';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const CreateEdit = () => {
	const [values, setValues] = useState({
		name: '',
		description: '',
		price: '9.99',
		uploading: false,
		paid: true,
		loading: false,
		category: '',
		lessons: [],
	});

	const { Item } = List;

	const router = useRouter();
	const { slug } = router.query;

	const [preview, setPreview] = useState('');
	const [uploadButtonText, setUploadButtonText] = useState('Upload Image');
	const [image, setImage] = useState({});

	//state for updating the lessons
	const [visible, setVisible] = useState(false);
	const [current, setCurrent] = useState({});
	const [uploadVideoButtonText, setUploadVideoButtonText] =
		useState('Upload Video');
	const [progress, setProgress] = useState(0);
	const [uploading, setUploading] = useState(false);

	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleImage = (e) => {
		let file = e.target.files[0];
		setPreview(window.URL.createObjectURL(file));
		setUploadButtonText(file.name);
		setValues({ ...values, loading: true });

		//file resizer
		Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
			try {
				let { data } = await axios.post('/api/course/upload-image', {
					image: uri,
				});

				setImage(data);
				setValues({ ...values, loading: false });
			} catch (err) {
				console.log(err);
				setValues({ ...values, loading: false });
				toast.error('Image upload failed. Try later.');
			}
		});
	};

	const handleImageRemove = async () => {
		try {
			setValues({ ...values, loading: true });
			const res = await axios.post('/api/course/remove-image', { image });

			setImage({});
			setPreview('');
			setUploadButtonText('Upload Image');
			setValues({ ...values, loading: true });
		} catch (err) {
			console.log(err);
			setValues({ ...values, loading: false });
			toast.error('Image Upload Failed.');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.put(`/api/course/${slug}`, {
				...values,
				image,
			});
			toast.success('Course Updated Successfully');
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	const loadCourse = async () => {
		try {
			const { data } = await axios.get(`/api/course/${slug}`);

			if (data) setValues(data);
			if (data && data.image) setImage(data.image);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDrag = (e, index) => {
		e.dataTransfer.setData('itemIndex', index);
	};

	const handleDrop = async (e, index) => {
		const movingItemIndex = e.dataTransfer.getData('itemIndex');
		const targetItemIndex = index;

		let allLessons = values.lessons;

		//clicked/dragged item to re-order
		let movingItem = allLessons[movingItemIndex];

		//remove 1 item from given index
		allLessons.splice(movingItemIndex, 1);

		//push item after target item index
		allLessons.splice(targetItemIndex, 0, movingItem);

		setValues({ ...values, lessons: [...allLessons] });

		//save the new lessons order in db
		await axios.put(`/api/course/${slug}`, {
			...values,
			image,
		});
	};

	useEffect(() => {
		loadCourse();
	}, [slug]);

	const handleDelete = async (index) => {
		try {
			const answer = window.confirm('Are you sure you want to delete?');
			if (!answer) return;

			let allLessons = values.lessons;

			const removed = allLessons.splice(index, 1);
			setValues({ ...values, lessons: [...allLessons] });

			const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
			// toast.info('Lesson Deleted!!!');
			console.log(data);
		} catch (err) {
			toast.error(err);
		}
	};

	// Lesson Update Functions

	const handleVideo = async (e) => {
		//remove previous video
		if (current.video && current.video.Location) {
			const res = await axios.post(
				`/api/course/video-remove/${values.instructor._id}`,
				current.video,
			);
		}

		//upload new video
		const file = e.target.files[0];
		setUploadVideoButtonText(file.name);
		setUploading(true);

		//send video as form data
		const videoData = new FormData();
		videoData.append('video', file);
		videoData.append('courseId', values._id);

		//save progress bar and send video as form data to backend
		const { data } = await axios.post(
			`/api/course/video-upload/${values.instructor._id}`,
			videoData,
			{
				onUploadProgress: (e) =>
					setProgress(Math.round((100 * e.loaded) / e.total)),
			},
		);
		setUploading(false);
		setCurrent({ ...current, video: data });
	};

	const handleUpdateLesson = async (e) => {
		e.preventDefault();

		const { data } = await axios.put(
			`/api/course/lesson/${slug}/${current._id}`,
			current,
		);

		setUploadVideoButtonText('Upload Video');
		setVisible(false);
		setCurrent(data);
		setProgress(0);
		if (data.ok) {
			let arr = values.lessons;
			const index = arr.findIndex((el) => el._id === current._id);
			arr[index] = current;
			setValues({ ...values, lessons: arr });
			toast.success('Lesson Updated.');
		}
	};

	return (
		<InstructorRoute>
			<h1 className='jumbotron text-center square'>Update Course</h1>

			<div className='pt-3 pb-3'>
				{
					<CourseCreateForm
						handleSubmit={handleSubmit}
						handleImage={handleImage}
						handleChange={handleChange}
						values={values}
						setValues={setValues}
						preview={preview}
						uploadButtonText={uploadButtonText}
						handleImageRemove={handleImageRemove}
						editPage={true}
					/>
				}
			</div>

			<br />
			<hr />
			{/* Lesson Lists */}
			<div className='row pb-5'>
				<div className='col lesson-list'>
					<h4>{values && values.lessons && values.lessons.length} Lessons</h4>

					<List
						onDragOver={(e) => e.preventDefault()}
						itemLayout='horizontal'
						dataSource={values && values.lessons}
						renderItem={(item, index) => (
							<Item
								draggable
								onDragStart={(e) => handleDrag(e, index)}
								onDrop={(e) => handleDrop(e, index)}>
								<Item.Meta
									style={{ cursor: 'pointer' }}
									onClick={() => {
										setVisible(true);
										setCurrent(item);
									}}
									avatar={<Avatar>{index + 1}</Avatar>}
									title={item.title}></Item.Meta>

								<DeleteOutlined
									onClick={() => handleDelete(index)}
									className='text-danger float-end'
								/>
							</Item>
						)}></List>
				</div>
			</div>

			<Modal
				title='Update Lesson'
				centered
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}>
				<UpdateLessonForm
					current={current}
					setCurrent={setCurrent}
					handleVideo={handleVideo}
					handleUpdateLesson={handleUpdateLesson}
					uploadVideoButtonText={uploadVideoButtonText}
					progress={progress}
					uploading={uploading}
				/>
			</Modal>
		</InstructorRoute>
	);
};

export default CreateEdit;
