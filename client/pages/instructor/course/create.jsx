import React, { useState, useEffect } from 'react';
import InstructorRoute from '../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';

import { toast } from 'react-toastify';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { useRouter } from 'next/router';

const CreateCourse = () => {
	const [values, setValues] = useState({
		name: '',
		description: '',
		price: '9.99',
		uploading: false,
		paid: true,
		loading: false,
		category: '',
	});

	const router = useRouter();

	const [preview, setPreview] = useState('');
	const [uploadButtonText, setUploadButtonText] = useState('Upload Image');
	const [image, setImage] = useState({});

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
			const { data } = await axios.post('/api/course', {
				...values,
				image,
			});
			toast.success('Great now you can start adding lessons');
			router.push('/instructor');
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	return (
		<InstructorRoute>
			<h1 className='jumbotron text-center square'>Create Course</h1>
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
					/>
				}
			</div>
		</InstructorRoute>
	);
};

export default CreateCourse;
