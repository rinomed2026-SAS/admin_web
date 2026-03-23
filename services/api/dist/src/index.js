import { app } from './app.js';
import { config } from './lib/config.js';
app.listen(config.port, () => {
    console.log(`RINOMED API listening on ${config.port}`);
});
