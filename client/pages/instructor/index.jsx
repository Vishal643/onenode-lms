import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
			<pre>{JSON.stringify(courses, null, 4)}</pre>
		</InstructorRoute>
	);
};

export default InstructorIndex;
