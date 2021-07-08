export const currencyFormatter = (data) => {
	const amount = Math.ceil(data.amount * 74.83);
	return amount.toLocaleString(data.currency, {
		style: 'currency',
		currency: data.currency,
	});
};
