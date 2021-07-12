import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import SingleCourseCard from '../../components/cards/SingleCourseCard';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCorseLessons from '../../components/cards/SingleCorseLessons';
import { Context } from '../../context/index';

const SingleCourse = ({ course }) => {
	const [showModal, setShowModal] = useState(false);
	const [preview, setPreview] = useState('');
	const [loading, setLoading] = useState(false);
	const [enrolled, setEnrolled] = useState({});
	const router = useRouter();
	const {
		state: { user },
	} = useContext(Context);

	const handlePaidEnrollment = () => {
		console.log('Handle Paid Enrollment');
	};

	const handleFreeEnrollment = async (e) => {
		e.preventDefault();
		try {
			//check if user is logged in
			if (!user) router.push('/login');

			//check if already enrolled
			if (enrolled.status) {
				return router.push(`/user/course/${enrolled.course.slug}`);
			}
			setLoading(true);
			const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
			toast.success(data.message);
			setLoading(false);
			router.push(`/user/course/${data.course.slug}`);
		} catch (err) {
			toast.error('Enrollement Failed. Try Again');
			setLoading(false);
		}
	};

	const checkEnrollment = async () => {
		const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
		console.log('data', data);
		setEnrolled(data);
	};
	useEffect(() => {
		if (user && course) checkEnrollment();
	}, [user, course]);

	return (
		<>
			<SingleCourseCard
				showModal={showModal}
				setShowModal={setShowModal}
				preview={preview}
				setPreview={setPreview}
				course={course}
				loading={loading}
				user={user}
				enrolled={enrolled}
				handleFreeEnrollment={handleFreeEnrollment}
				handlePaidEnrollment={handlePaidEnrollment}
			/>

			<PreviewModal
				showModal={showModal}
				setShowModal={setShowModal}
				preview={preview}
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
