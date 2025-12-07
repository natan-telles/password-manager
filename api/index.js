require("dotenv").config();
const express = require("express");
const cors = require("cors");

const passwordRoutes = require("./src/routes/passwordRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilita o CORS para permitir que seu frontend acesse a API
app.use(express.json()); // Permite que o Express entenda requisições com corpo em JSON

// Rota de teste
app.get("/", (req, res) => {
  res.send("API do Gerenciador de Senhas está no ar!");
});

// Rotas da aplicação
app.use("/api", passwordRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});

// http://localhost:3001/users/