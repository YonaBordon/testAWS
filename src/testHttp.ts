export const testPost = async (event: any, context: any, callback: any) => {
	const response = {
		statusCode: 200,
		Headers: {
			'Access-Control-Allow-Origin': '*',
		},
		body: JSON.stringify({
			message: 'Go Serverless v4.0! Your function executed successfully!',
			input: event,
		}), 
	};

	callback(null, response);
};
