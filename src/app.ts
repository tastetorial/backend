import express from 'express';
import db from './config/db';
import cors from 'cors';
import config from './config/configSetup';
import { isAuthorized } from './middleware/authorize';
import routes from './routes/routes';
import { logRoutes } from './middleware/logRoutes';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

//serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(logRoutes);

app.get('/', (req, res) => {
    res.send('Hello world! The API is working.');
});

app.all('*', isAuthorized);
app.use('/api', routes);


db.sync({}).then(() => {
    app.listen(config.PORT, () => console.log(`Server is running on http://localhost:${config.PORT}`));
})
    .catch(err => console.error('Error connecting to the database', err));

