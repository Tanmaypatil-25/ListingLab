import { createServer } from './server.js';
import { config } from './config.js';

const app = createServer();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` ListingLab Backend running on port ${config.port} (0.0.0.0)`);
  console.log(` Provider : ${config.ai.provider}`);
  console.log(` Model    : ${config.ai.model}`);
  console.log(` Base URL : ${config.ai.baseUrl}`);
  console.log(` Local    : ${config.ai.isLocal}`);
  console.log(` Status   : http://localhost:${config.port}/api/status`);
  console.log(` Health   : http://localhost:${config.port}/api/health`);
  console.log(`===============================================`);
});
