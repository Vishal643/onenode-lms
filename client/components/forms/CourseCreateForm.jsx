import { Select, Button, Avatar, Badge } from 'antd';

const { Option } = Select;

const CourseCreateForm = (props) => {
	const {
		handleChange,
		handleImage,
		handleImageRemove,
		handleSubmit,
		setValues,
		values,
		preview,
		uploadButtonText,
	} = props;

	const { name, description, price, uploading, paid, loading, category } =
		values;

	const children = [];

	for (let i = 9.99; i <= 100.99; i++) {
		children.push(<Option key={i.toFixed(2)}>{`${i.toFixed(2)}`}</Option>);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='form-group pt-3'>
				<input
					type='text'
					className='form-control'
					name='name'
					value={name}
					onChange={handleChange}
				/>
			</div>
			<div className='form-group pt-3'>
				<textarea
					className='form-control'
					name='description'
					value={description}
					cols='7'
					rows='7'
					onChange={handleChange}></textarea>
			</div>

			<div className='form-row pt-3 d-flex'>
				<div className='col-md-10'>
					<div className='form-group'>
						<Select
							onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
							value={paid}
							style={{ width: '100%' }}
							size='large'>
							<Option value={true}>Paid</Option>
							<Option value={false}>Free</Option>
						</Select>
					</div>
				</div>
				{paid && (
					<div className='col-md-2'>
						<div className='form-group'>
							<Select
								defaultValue='$9.99'
								style={{ width: '100%' }}
								onChange={(v) => setValues({ ...values, price: v })}
								tokenSeparators={[,]}
								size='large'>
								{children}
							</Select>
						</div>
					</div>
				)}
			</div>
			<div className='form-group pt-3'>
				<input
					type='text'
					className='form-control'
					name='category'
					placeholder='Category...'
					value={category}
					onChange={handleChange}
				/>
			</div>
			<div className='form-row pt-3'>
				<div className='col'>
					<div className='form-group'>
						<label className='btn btn-outline-secondary gen-btn text-start'>
							{uploadButtonText}
							<input
								type='file'
								name='image'
								onChange={handleImage}
								accept='image/*'
								hidden
							/>
						</label>
					</div>
				</div>
				<div className='pt-3'>
					{preview && (
						<Badge count='X' onClick={handleImageRemove} className='pointer'>
							<Avatar width={200} src={preview} />
						</Badge>
					)}
				</div>
			</div>
			<div className='row pt-3'>
				<div className='col'>
					<Button
						onClick={handleSubmit}
						disabled={loading || uploading}
						type='primary'
						size='large'
						shape='round'
						className='btn btn-primary'
						loading={loading}>
						{loading ? 'Saving...' : 'Save and Continue'}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default CourseCreateForm;
