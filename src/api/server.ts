import { createApp } from './app';
import { environment } from '../infrastructure/config/environment';

const app = createApp();

app.listen(environment.port, () => {
  console.log(`Servidor study-groups-ms-sql iniciado na porta ${environment.port}`);
});

