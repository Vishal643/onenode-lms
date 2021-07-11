import ReactMarkdown from 'react-markdown';
import { Badge } from 'antd';
import { currencyFormatter } from '../../utils/helper';
import ReactPlayer from 'react-player';

const SingleCourseCard = ({
	course,
	preview,
	setPreview,
	showModal,
	setShowModal,
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
		<div className='jumbotron bg-primary square'>
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
								className='react-player-div'
								url={lessons[0].video.Location}
								light={image.Location}
								width='100%'
								height='225px'
							/>
						</div>
					) : (
						<img src={image.Location} alt={name} className='img img-fluid' />
					)}
				</div>
			</div>
		</div>
	);
};

export default SingleCourseCard;
