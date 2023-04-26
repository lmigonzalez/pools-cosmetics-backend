const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const sharp = require('sharp');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function saveImage(file) {
  const fileBuffer = await sharp(file.buffer)
    .resize({
      height: 500,
      width: 500,
      fit: 'contain',
      background: {r: 0, g: 0, b: 0, alpha: 0},
    })
    .toBuffer();

  // Configure the upload details to send to S3
  const fileName = generateFileName();
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: file.mimetype,
  };

  // Send the upload to S3
  await s3Client.send(new PutObjectCommand(uploadParams));

  return fileName;
}

async function saveImageOnProduct(files) {
  const filesArray = [];

  for (let file of files) {
    const fileBuffer = await sharp(file.buffer)
      .resize({
        height: 500,
        width: 500,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 },
      })
      .toBuffer();

    const fileName = generateFileName();
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    filesArray.push({ fileName, fileSize: file.size });
  }

  return filesArray;
}

async function getImage(categories) {
  const newCategories = categories.map(async (category) => {
    let url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: category.picture.fileName,
      }),
      { expiresIn: 604800 } // 1 week
    );

    return { ...category, imageUrl: url };
  });

  const updatedCategories = await Promise.all(newCategories);

  return updatedCategories;
}

async function deleteImage(imageName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: imageName,
  };

  s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function getAllProductsImage(products) {
  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      const productImg = await Promise.all(
        product.pictures.map(async (fileName) => {
          let url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: bucketName,
              Key: fileName.fileName,
            }),
            { expiresIn: 604800 } // 1 week
          );
          return {
            ...fileName,
            fileUrl: url,
          };
        })
      );
      return {
        ...product,
        pictures: productImg,
      };
    })
  );

  return updatedProducts;
}

async function getProductImagesById(product) {
  const updatedProduct = await Promise.all(
    product.pictures.map(async (item) => {
      let url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: item.fileName,
        }),
        { expiresIn: 604800 } // 1 week
      );
      return { ...item, url };
    })
  );

  return { ...product, imagesUrl: updatedProduct };
}

async function deleteProductImages(images) {
	
	const deletedFiles = images.map(async (image) => {
		const deleteParams = {
			Bucket: bucketName,
			Key: image.fileName,
		};
		const result = await s3Client.send(new DeleteObjectCommand(deleteParams));
		return result

	});
	const results = await Promise.all(deletedFiles)

  return results;
}

module.exports = {
  saveImage,
  saveImageOnProduct,
  getImage,
  deleteImage,
  getAllProductsImage,
  getProductImagesById,
  deleteProductImages,
};
