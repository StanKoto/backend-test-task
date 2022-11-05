'use strict';

const express = require('express');
const sqlSanitizer = require('sql-sanitizer');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const envVars = require('./envVariables');
const db = require('./models/index');
const clientRouter = require('./routes/clientRoutes');
const positionRouter = require('./routes/positionRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const userRouter = require('./routes/userRoutes');
const { ErrorResponse, handleErrors } = require('./utils/errorHandling');

const app = express();
const PORT = envVars.main.port || 3000;

app.use(express.static('public'));

app.use(express.json());

app.use(sqlSanitizer);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "img-src": [ "'self'", "data:", "https://ik.imagekit.io", "https://loremflickr.com" ]
    }
  }
}));
app.use(xss());

const limiter = rateLimit({
  windowMs: envVars.limiter.windowMS,
  max: envVars.limiter.max
});

app.use(limiter);
app.use(hpp());
app.use(cors());

app.get('/', (req, res, next) => res.redirect('/user-management'));
app.use('/user-management', clientRouter);
app.use('/api/v1/positions', positionRouter);
app.use('/api/v1/token', tokenRouter);
app.use('/api/v1/users', userRouter);
app.use('*', (req, res, next) => next(new ErrorResponse(404, 'Page not found')));
app.use(handleErrors);

db.sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL successfully connected');
    app.listen(PORT, console.log(`Listening on port ${PORT}`));
  })
  .catch(err => console.error(err));