import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { User } from '../types/User';

const dynamodb = new DynamoDB.DocumentClient();

export const registerUser = async (data: {
	email: string;
	name: string;
	password: string;
}): Promise<User> => {
	const newUser: User = {
		...data,
		userId: uuid(),
		created_at: new Date().toISOString(),
	};

	await dynamodb
		.put({
			TableName: process.env.TABLE_USER!,
			Item: newUser,
		})
		.promise();

	return newUser;
};
