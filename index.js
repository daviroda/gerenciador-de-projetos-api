// Importe os módulos necessários
import express from 'express';
import cors from 'cors';
// Se você estiver usando o db.json localmente (lembre-se das limitações para produção):
import * as fs from 'fs/promises';
import path from 'path';

// Crie uma instância do Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para habilitar CORS (permite requisições de diferentes domínios)
app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Função para ler os dados do db.json (para desenvolvimento local)
async function readDatabase() {
  try {
    const data = await fs.readFile(path.resolve('./db.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o db.json:', error);
    return {};
  }
}

// Função para escrever os dados no db.json (apenas para desenvolvimento local!)
async function writeDatabase(data) {
  try {
    await fs.writeFile(path.resolve('./db.json'), JSON.stringify(data, null, 2), 'utf-8');
    console.log('Dados gravados com sucesso no db.json');
  } catch (error) {
    console.error('Erro ao gravar no db.json:', error);
  }
}

// Defina suas rotas da API aqui

// Exemplo de rota GET para obter todos os itens
app.get('/api/items', async (req, res) => {
  const database = await readDatabase();
  res.json(database.items || []);
});

// Exemplo de rota POST para adicionar um novo item
app.post('/api/items', async (req, res) => {
  const newItem = req.body;
  const database = await readDatabase();
  if (!database.items) {
    database.items = [];
  }
  newItem.id = Date.now(); // Simples geração de ID
  database.items.push(newItem);
  await writeDatabase(database);
  res.status(201).json(newItem);
});

// Outras rotas (GET por ID, PUT, DELETE, etc.) viriam aqui

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Para o Vercel, você precisa exportar o 'app' para que ele possa ser usado como uma função serverless
export default app;