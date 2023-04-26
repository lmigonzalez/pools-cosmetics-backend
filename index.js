const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const categoriesRouter = require('./routers/categoriesRouter');
const productsRouter = require('./routers/productsRouter')
const ordersRouter = require('./routers/ordersRouter')
const mailRouter = require('./routers/mailRouter')
const loginRouter = require('./routers/loginRouter')


mongoose.set('strictQuery', false);

mongoose
  .connect('mongodb://localhost:27017/', {
    dbName: 'pool-cosmetics',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api', categoriesRouter);

app.use('/api', productsRouter);

app.use('/api', ordersRouter);

app.use('/api', mailRouter);

app.use('/api', loginRouter);


app.listen(process.env.PORT || 3100, () => {
  console.log(`connected to port 30100`);
});
