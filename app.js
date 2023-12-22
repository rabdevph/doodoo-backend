const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const colors = require('colors');

const connectToDb = require('./utils/dbUtils');
const userRoutes = require('./routes/userRoutes');
const { logErrors, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectToDb();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow listed origins
      const allowedOrigins = ['http://localhost:3000'];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed connection'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`request path: ${req.path.cyan}`);
  console.log(`request method: ${req.method.cyan}`);
  next();
});

app.use('/api/users', userRoutes);

app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
