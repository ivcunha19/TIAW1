const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const router = jsonServer.router('db.json'); // Nosso roteador da API
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000;

// Configuração para servir os arquivos estáticos (HTML, CSS, JS)
// Esta linha deve vir ANTES do roteador da API
app.use(express.static(path.join(__dirname, '')));

// Configuração do JSON Server como API
app.use('/api', router); // Usaremos /api para a API do JSON Server
app.use(middlewares);

// Rota de fallback para redirecionar para o index se a rota não for encontrada
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});