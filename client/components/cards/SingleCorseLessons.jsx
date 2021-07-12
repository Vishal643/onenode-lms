import { List, Avatar } from 'antd';
import React from 'react';

const { Item } = List;
const SingleCorseLessons = ({
	lessons,
	showModal,
	setShowModal,
	setPreview,
}) => {
	return (
		<div className='container mt-4'>
			<div className='row'>
				<div className='col lesson-list'>
					{lessons && <h4>{lessons.length} Lessons</h4>}
					<hr />
					<List
						itemLayout='horizontal'
						dataSource={lessons}
						renderItem={(item, index) => (
							<Item>
								<Item.Meta
									avatar={<Avatar>{index + 1}</Avatar>}
									title={item.title}
								/>
								{item.video && item.video !== null && item.free_preview && (
									<span
										onClick={() => {
											setPreview(item.video.Location);
											setShowModal(!showModal);
										}}
										className='text-primary pointer'>
										Preview
									</span>
								)}
							</Item>
						)}
					/>
				</div>
			</div>
		</div>
	);
};

export default SingleCorseLessons;
