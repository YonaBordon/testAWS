import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB, S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new S3();

export const createRecipe: APIGatewayProxyHandler = async (event: any) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const data = JSON.parse(event.body);

    if (!data.name || !data.description || !data.ingredients || !data.image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing recipe data' }),
      };
    }

    const recipeId = uuid();
    const createdAt = new Date().toISOString();

    // Convertir la imagen base64 en un buffer
    const base64Image = data.image;
    const buffer = Buffer.from(base64Image, 'base64');

    // Parámetros para subir la imagen a S3
    const uploadParams = {
      Bucket: process.env.RECIPES_BUCKET_NAME!,
      Key: `recipes/${recipeId}.jpg`,
      Body: buffer,
      ContentType: 'image/jpeg',
    };

    // Subir imagen a S3
    const uploadResult = await s3.upload(uploadParams).promise();

    // Nueva receta
    const newRecipe = {
      recipeId,
      userId,
      name: data.name,
      description: data.description,
      ingredients: data.ingredients,
      imageUrl: uploadResult.Location,
      createdAt,
    };

    // Guardar receta en DynamoDB
    await dynamodb
      .put({
        TableName: process.env.TABLE_RECIPES!,
        Item: newRecipe,
      })
      .promise();

    // Respuesta exitosa
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Recipe created successfully',
        recipe: newRecipe,
      }),
    };
  } catch (error) {
    console.error('Error creating recipe:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating recipe' }),
    };
  }
};

