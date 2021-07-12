import ReactMarkdown from 'react-markdown';
import { Badge, Button } from 'antd';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';
import { currencyFormatter } from '../../utils/helper';
import ReactPlayer from 'react-player';

const SingleCourseCard = ({
	course,
	setPreview,
	showModal,
	setShowModal,
	loading,
	handleFreeEnrollment,
	handlePaidEnrollment,
	user,
	enrolled,
}) => {
	const {
		name,
		description,
		instructor,
		updatedAt,
		lessons,
		image,
		price,
		paid,
		category,
	} = course;
	return (
		<div className='jumbotron bg-primary square ps-4'>
			<div className='row'>
				<div className='col-md-8'>
					<h1 className='text-light font-weight-bold'>{name}</h1>

					{
						<ReactMarkdown
							children={description && description.substring(0, 155)}
						/>
					}

					<Badge
						count={category}
						style={{ backgroundColor: 'red' }}
						className='pb-4 me-2'
					/>
					<p>Created by {instructor.name}</p>
					<p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>
					<h4 className='text-light'>
						{paid
							? currencyFormatter({
									amount: price,
									currency: 'inr',
							  })
							: 'Free'}
					</h4>
				</div>
				<div className='col-md-4'>
					{lessons[0].video && lessons[0].video.Location ? (
						<div
							onClick={() => {
								setPreview(lessons[0].video.Location);
								setShowModal(!showModal);
							}}>
							<ReactPlayer
								className='react-player-div me-2'
								url={lessons[0].video.Location}
								light={image.Location}
								width='95%'
								height='225px'
							/>
						</div>
					) : (
						<img
							src={image.Location}
							alt={name}
							className='img img-fluid me-2'
							style={{ width: '400px' }}
						/>
					)}
					{loading ? (
						<div className='d-flex justify-content-center'>
							<LoadingOutlined className='h1 text-danger' />
						</div>
					) : (
						<Button
							className='mb-3 mt-3 ms-2'
							block
							type='danger'
							shape='round'
							icon={<SafetyOutlined />}
							size='large'
							style={{ width: '90%' }}
							disabled={loading}
							onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}>
							{user
								? enrolled.status
									? 'Go to Course'
									: 'Enroll'
								: 'Login to Enroll'}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SingleCourseCard;
