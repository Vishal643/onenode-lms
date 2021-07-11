import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import SingleCourseCard from '../../components/cards/SingleCourseCard';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCorseLessons from '../../components/cards/SingleCorseLessons';

const SingleCourse = ({ course }) => {
	const [showModal, setShowModal] = useState(false);
	const [preview, setPreview] = useState('');

	return (
		<>
			<SingleCourseCard
				showModal={showModal}
				setShowModal={setShowModal}
				preview={preview}
				setPreview={setPreview}
				course={course}
			/>

			<PreviewModal
				showModal={showModal}
				setShowModal={setShowModal}
				preview={preview}
				setPreview={setPreview}
			/>

			{course.lessons && (
				<SingleCorseLessons
					lessons={course.lessons}
					setPreview={setPreview}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

export const getServerSideProps = async ({ query }) => {
	const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
	return {
		props: {
			course: data,
		},
	};
};

export default SingleCourse;
