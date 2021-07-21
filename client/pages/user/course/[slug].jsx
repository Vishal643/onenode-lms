import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import StudentRoute from '../../../components/routes/StudentRoute';

import axios from 'axios';

const SingleCourse = () => {
	const [loading, setLoading] = useState(false);
	const [course, setCourse] = useState({ lessons: [] });

	//router
	const router = useRouter();
	const { slug } = router.query;

	const loadCourse = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(`/api/user/course/${slug}`);
			setCourse(data);
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};
	useEffect(() => {
		if (slug) loadCourse();
	}, [slug]);
	return (
		<StudentRoute>
			<h1>Course slug is: {JSON.stringify(course, null, 4)}</h1>
		</StudentRoute>
	);
};

export default SingleCourse;
