import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { User } from '../types/User';

const cognito = new CognitoIdentityServiceProvider();
const dynamodb = new DynamoDB.DocumentClient();

const CLIENT_ID = process.env.CLIENT_ID!;

export const registerUser = async (data: {
	email: string;
	name: string;
	password: string;
}): Promise<User> => {
	const { email, name, password } = data;

	// Primero registramos el usuario en Cognito
	try {
		console.log(CLIENT_ID);
		const params = {
			
			ClientId: CLIENT_ID, // ID del cliente de la aplicación (Cognito)
			Username: email,
			Password: password,
			UserAttributes: [
				{
					Name: 'email',
					Value: email,
				},
				{
					Name: 'name',
					Value: name,
				},
			],
		};

		// Crea el usuario en Cognito
		const signupResponse = await cognito.signUp(params).promise();

		// Una vez registrado en Cognito, puedes almacenar información adicional en DynamoDB
		// cognito se encarga de almacenar contrase;a, guardamos los demas datos en DDB
		const newUser: User = {
			userId: uuid(),
			email,
			name,
			created_at: new Date().toISOString(),
		};

		// Almacena la información del usuario en DynamoDB
		await dynamodb
			.put({
				TableName: process.env.TABLE_USER!,
				Item: newUser,
			})
			.promise();

		// Retorna el usuario creado
		return newUser;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to register user: ${error.message}`);
		} else {
			throw new Error('Unknown error occurred during user registration.');
		}
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		const params = {
			AuthFlow: 'USER_PASSWORD_AUTH',
			ClientId: CLIENT_ID, // ID del cliente de la aplicación (Cognito)
			AuthParameters: {
				USERNAME: email,
				PASSWORD: password,
			},
		};

		// Iniciar sesión con las credenciales proporcionadas
		const authResult = await cognito.initiateAuth(params).promise();

		// Retorna el resultado del inicio de sesión (tokens de acceso, ID y actualización)
		return {
			accessToken: authResult.AuthenticationResult?.AccessToken,
			idToken: authResult.AuthenticationResult?.IdToken,
			refreshToken: authResult.AuthenticationResult?.RefreshToken,
		};
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to log in: ${error.message}`);
		} else {
			throw new Error('Unknown error occurred during login.');
		}
	}
};
