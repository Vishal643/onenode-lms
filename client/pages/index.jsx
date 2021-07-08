import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';

const Index = ({ courses }) => {
	// const [courses, setCourses] = useState([]);

	// const fetchCourses = async () => {
	// 	const { data } = await axios.get('/api/courses');
	// 	setCourses(data);
	// };
	// useEffect(() => {
	// 	fetchCourses();
	// }, []);
	return (
		<>
			<h1 className='display-4 jumbotron text-center bg-primary square'>
				One Stop Learning Guide
			</h1>

			<div className='container-fluid'>
				<div className='row'>
					{courses.map((course) => (
						<div key={course._id} className='col-md-4'>
							<CourseCard course={course} />
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const { data } = await axios.get(`${process.env.API}/courses`);
	return {
		props: {
			courses: data,
		},
	};
};

export default Index;
