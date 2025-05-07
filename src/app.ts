import express from 'express';
import db from './config/db';
import cors from 'cors';
import config from './config/configSetup';
import { isAuthorized } from './middleware/authorize';
import routes from './routes/routes';
import { logRoutes } from './middleware/logRoutes';
import * as appInsights from 'applicationinsights';
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

    appInsights?.setup(config.APPINSIGHTS_INSTRUMENTATIONKEY)  // Fetch from environment variables
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, true)
        .setUseDiskRetryCaching(true)
        .start();

    appInsights?.defaultClient.trackEvent({ name: "App Started Successfully" });
})
    .catch(err => console.error('Error connecting to the database', err));

