import { app } from '@shared/http/app';
import { serverConfig } from '@config/server';

const port = serverConfig.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API prefix: ${serverConfig.apiPrefix}`);
});

