import { APIGatewayProxyHandler } from 'aws-lambda';
import { loginUser, registerUser } from '../../service/userService';
import { formatResponse } from '../../utils/response';

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
