export const formatResponse = (status: number, body: any) => {
	return {
		statusCode: status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
		body: JSON.stringify(body),
	};
};
