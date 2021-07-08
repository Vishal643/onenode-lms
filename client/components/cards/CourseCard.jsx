import Link from 'next/link';
import { Card, Badge } from 'antd';
import { currencyFormatter } from '../../utils/helper';

const { Meta } = Card;
const CourseCard = ({ course }) => {
	const { name, instructor, price, image, slug, paid, category } = course;
	return (
		<Link href={`/course/${slug}`}>
			<a>
				<Card
					className='mb-4'
					cover={
						<img
							src={image.Location}
							alt={name}
							style={{ height: '200px', objectFit: 'cover' }}
							className='p-1'
						/>
					}>
					<h2 className='font-weight-bold'>{name}</h2>
					<p>by {instructor.name}</p>
					<Badge count={category} className='pb-2 mr-2' />
					<h4 className='pt-2'>
						{paid
							? currencyFormatter({
									amount: price,
									currency: 'inr',
							  })
							: 'Free'}
					</h4>
				</Card>
			</a>
		</Link>
	);
};

export default CourseCard;
