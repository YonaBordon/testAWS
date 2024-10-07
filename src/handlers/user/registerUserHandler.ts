import { APIGatewayProxyHandler } from "aws-lambda"
import { registerUser } from "../../service/userService"
import { formatResponse } from "../../utils/response"

export const register: APIGatewayProxyHandler = async (event: any) => {
	try {
		const data = JSON.parse(event.body);
		// TODO: validate data function

		const validated = data.name && data.email && data.password;
		if (!validated) {
			return formatResponse(400, {
				message: 'Missing fields',
			});
		}

		const newUser = await registerUser(data);
		return formatResponse(200, {
			message: 'User created successfully',
			user: newUser,
		});
	} catch (error) {
		if (error instanceof Error) {
			return formatResponse(500, {
				message: error.message,
			});
		} else {
			return formatResponse(500, {
				message: 'An unknown error occurred',
			});
		}
	}
};