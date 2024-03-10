require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth.route.js");
const productRoute = require('./routes/product.route.js');
const categoryRoute = require('./routes/category.route.js');
const userRoute = require('./routes/user.route.js');
const cartRoute = require('./routes/cart.route.js');
const { AdminValidateToken , userValidateToken } = require('./jwt');
const {checkOfferExpiry} = require('./controllers/product.controller.js')
const app = express();
const cors = require('cors');
const Product = require('./models/product.model.js');
app.use(cors({
    origin: '*',
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

app.use((req,res,next) => {
    console.log(req.path, req.method);
    next();
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/category",categoryRoute);
app.use("/api/user",userValidateToken,userRoute);
app.use("/api/cart",userValidateToken,cartRoute);

app.get("/api/search/:input", async (req, res) => {
  try {
    const query = req.params.input;
    const keywords = query.split(" ");
    const results = await searchInDatabase(keywords);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

async function searchForKeyword(keyword) {
  const results = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ],
  }).exec();

  return results;
}

async function searchInDatabase(keywords) {
  const results = [];

  for (const keyword of keywords) {
    const keywordResults = await searchForKeyword(keyword);
    results.push(...keywordResults);
  }

  return results;
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`; // Set the filename to be unique
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('images'), async (req, res) => {
  console.log('req.files:', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).send('Please upload at least one file');
  }

  const filePaths = req.files.map((file) => file.path); // Get the file paths of the uploaded images
  console.log('filePaths:', filePaths);

  try {
    // Upload images to Cloudinary
    const results = await Promise.all(
      filePaths.map(async (filePath) => await cloudinary.uploader.upload(filePath))
    );
    console.log('results:', results);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading images');
  }
});


//connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });

    checkOfferExpiry();
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });

