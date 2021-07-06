import React from 'react';
import { Button, Progress, Tooltip } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

const AddLessonForm = (props) => {
	const {
		values,
		setValues,
		uploading,
		uploadButtonText,
		progress,
		handleAddLesson,
		handleVideo,
		handleVideoRemove,
	} = props;
	return (
		<div className='container pt-3'>
			<form>
				<input
					type='text'
					className='form-control square'
					onChange={(e) => setValues({ ...values, title: e.target.value })}
					value={values.title}
					placeholder='Title'
					autoFocus
					required
				/>
				<textarea
					className='form-control mt-3'
					cols='7'
					rows='7'
					onChange={(e) => setValues({ ...values, content: e.target.value })}
					value={values.content}
					placeholder='Content'
				/>

				<div className='d-flex justify-content-center'>
					<label className='btn btn-dark text-start gen-btn mt-3'>
						{uploadButtonText}
						<input onChange={handleVideo} type='file' accept='video/*' hidden />
					</label>
					{!uploading && values.video.Location && (
						<Tooltip title='Remove'>
							<span onClick={handleVideoRemove} className='pt-1 ps-3'>
								<CloseCircleFilled className='text-danger d-flex justify-content-center pt-4 pointer' />
							</span>
						</Tooltip>
					)}
				</div>

				{progress > 0 && (
					<Progress
						className='d-flex justify-content-center pt-2'
						percent={progress}
						steps={0}
					/>
				)}
				<Button
					onClick={handleAddLesson}
					className='col mt-3 gen-btn'
					size='large'
					type='primary'
					loading={uploading}
					shape='round'>
					Save
				</Button>
			</form>
		</div>
	);
};

export default AddLessonForm;
