'use strict';

const express = require('express');
const envVars = require('./envVariables');
const db = require('./models/index');
const positionRouter = require('./routes/positionRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const userRouter = require('./routes/userRoutes');
const { ErrorResponse, handleErrors } = require('./utils/errorHandling');

const app = express();
const PORT = envVars.main.port || 3000;

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res, next) => res.sendFile(__dirname + '/views/index.html'));
app.get('/users', (req, res, next) => res.sendFile(__dirname + '/views/users.html'));
app.get('/new-user-form', (req, res, next) => res.sendFile(__dirname + '/views/registrationForm.html'));
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