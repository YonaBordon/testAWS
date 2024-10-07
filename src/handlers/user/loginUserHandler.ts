import { APIGatewayProxyHandler } from "aws-lambda"
import { formatResponse } from "../../utils/response"
import { loginUser } from "../../service/userService"


export const login: APIGatewayProxyHandler = async (event: any) => {
	try {
		const { email, password } = JSON.parse(event.body);

		const validated = email && password;
		if (!validated) {
			return formatResponse(400, {
				message: 'Missing fields',
			});
		}

		const user = await loginUser(email, password);

		return formatResponse(200, {
			message: 'Login successful',
			user,
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