const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const positionRouter = require('./routes/positionRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const userRouter = require('./routes/userRoutes');

dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res, next) => res.redirect('/api/v1/users/1'));
app.use('/api/v1/positions', positionRouter);
app.use('/api/v1/token', tokenRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, console.log(`Listening on port ${PORT}`));