const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const cookieParser = require('cookie-parser');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect DB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Prevent HTTP param pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100
});
app.use(limiter);

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS
app.use(xss());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Co-working Space Reservation API',
      version: '1.0.0',
      description: 'API for Co-working Space Reservation System'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
const auth = require('./routes/auth');
const coworkingSpaces = require('./routes/coworkingSpaces');
const reservations = require('./routes/reservations');
const reviewRoutes = require('./routes/reviews');


app.use('/api/v1/auth', auth);
app.use('/api/v1/coworkingspaces', coworkingSpaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/reviews', reviewRoutes);

// Set query parser
app.set('query parser', 'extended');

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    'Server running in',
    process.env.NODE_ENV,
    'mode on port',
    PORT
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});