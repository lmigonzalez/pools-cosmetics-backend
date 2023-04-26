const multer = require('multer');
const sharp = require('sharp');
const Image = require('../models/imageModel');
const router = require('express').Router();

// const {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
// } = require('@aws-sdk/client-s3');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const crypto = require('crypto');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post('/upload-img', upload.single('image'), async (req, res) => {
  console.log(req.file);
  const file = req.file;

  try {
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: 'contain' })
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
    console.log('!!!!!!!!!!!!!!!!!!!!');

    // Save the image name to the database. Any other req.body data can be saved here too but we don't need any other image data.

    const newImage = new Image({
      fileName: fileName,
    });

    const result = await newImage.save();

    res.status(201).json(result);
  } catch (err) {
	console.log(err)
    res.status(400).json({ error: err });
  }
});



// get categories pictures

router.get('/', async (req, res) => {
   // Get all posts from the database

  for (let post of posts) {
    // For each post, generate a signed URL and save it to the post object
    post.imageUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: imageName,
      }),
      { expiresIn: 604800 } // 1 week
    );
  }

  res.send(posts);
});

// app.delete('/api/posts/:id', async (req, res) => {
//   const id = +req.params.id;
//   const post = await prisma.posts.findUnique({ where: { id } });

//   const deleteParams = {
//     Bucket: bucketName,
//     Key: post.imageName,
//   };

//   return s3Client.send(new DeleteObjectCommand(deleteParams));

//   await prisma.posts.delete({ where: { id } });
//   res.send(post);
// });

module.exports = router;
