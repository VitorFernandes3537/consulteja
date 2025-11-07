import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Caminhos ABSOLUTOS corretos
const DB_PATH = path.join(__dirname, "produtos.json");
const ASSETS_PATH = path.join(__dirname, "assets");

// Middleware
app.use(cors());
app.use(express.json());

// Servir a pasta de imagens estáticas
// Exemplo: http://localhost:3001/assets/cafe-premium.webp
app.use("/assets", express.static(ASSETS_PATH));

// ---------- Funções auxiliares ----------
function lerProdutos() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Se não existir, cria um array vazio
      fs.writeFileSync(DB_PATH, "[]", "utf-8");
      return [];
    }

    const data = fs.readFileSync(DB_PATH, "utf-8");
    if (!data.trim()) return [];

    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler o arquivo produtos.json:", err);
    throw err;
  }
}

function salvarProdutos(produtos) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(produtos, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar o arquivo produtos.json:", err);
    throw err;
  }
}

// ========== ENDPOINT PRINCIPAL (documentação resumida) ==========
app.get("/", (req, res) => {
  res.json({
    sistema: "ConsulteJá API",
    status: "Online",
    versao: "1.0.0",
    descricao:
      "API responsável por cadastrar, consultar e listar produtos do sistema ConsulteJá. Também fornece acesso direto às imagens armazenadas localmente.",
    rotas: {
      "/api/produtos": {
        GET: "Lista todos os produtos ou busca por código (?codigo=123)",
        POST:
          "Cadastra um novo produto (JSON com codigo, nome, descricao, preco, imagemUrl opcional)",
      },
      "/assets": {
        GET: "Retorna imagens estáticas armazenadas em api/assets. Ex: /assets/cafe-premium.webp",
      },
    },
    exemplo_produto: {
      codigo: "7891000000010",
      nome: "Café Premium 500g",
      descricao: "Café torrado e moído, seleção especial de grãos.",
      preco: 19.9,
      imagemUrl: `http://localhost:${PORT}/assets/cafe-premium.webp`,
    },
    autor: "Equipe ConsulteJá",
    atualizado_em: new Date().toLocaleString("pt-BR"),
  });
});

// ========== ENDPOINT GET /api/produtos ==========
app.get("/produtos", (req, res) => {
  try {
    const produtos = lerProdutos();
    const { codigo } = req.query;

    // Se veio ?codigo=..., retorna só um
    if (codigo) {
      const produto = produtos.find((p) => p.codigo === String(codigo));
      if (!produto) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }
      return res.json(produto);
    }

    // Senão, lista todos
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler produtos." });
  }
});

// ========== ENDPOINT POST /api/produtos ==========
app.post("/produtos", (req, res) => {
  const { codigo, nome, descricao, preco, imagemUrl } = req.body;

  if (!codigo || !nome || !descricao || preco == null) {
    return res
      .status(400)
      .json({ mensagem: "Campos obrigatórios: codigo, nome, descricao, preco." });
  }

  const produtos = lerProdutos();

  const jaExiste = produtos.some((p) => p.codigo === codigo);
  if (jaExiste) {
    return res
      .status(409)
      .json({ mensagem: "Já existe um produto com esse código." });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  let imagemUrlFinal;
  if (!imagemUrl || imagemUrl.trim() === "") {
    // se o usuário não informar nada, usa placeholder
    imagemUrlFinal = `${baseUrl}/assets/placeholder.png`;
  } else if (imagemUrl.startsWith("http://") || imagemUrl.startsWith("https://")) {
    // se ele colar uma URL completa, mantém
    imagemUrlFinal = imagemUrl;
  } else {
    // se for só nome de arquivo, monta com /assets
    imagemUrlFinal = `${baseUrl}/assets/${imagemUrl}`;
  }

  const novoProduto = {
    codigo: String(codigo),
    nome,
    descricao,
    preco: Number(preco),
    imagemUrl: imagemUrlFinal,
  };

  produtos.push(novoProduto);
  salvarProdutos(produtos);

  res.status(201).json(novoProduto);
});


// ========== ENDPOINT GET /assets ==========
// fallback explicativo pra /assets
app.get("/assets", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    mensagem: "Acesse as imagens informando o nome do arquivo na URL.",
    exemplo_uso: `${baseUrl}/assets/cafe-premium.webp`,
    detalhes: {
      pasta_fisica: ASSETS_PATH,
      formatos_suportados: ["png", "jpg", "jpeg", "webp", "svg", "gif"],
      observacao:
        "O nome do arquivo precisa ser idêntico ao que está na pasta api/assets."
    }
  });
});


// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ API ConsulteJá rodando em http://localhost:${PORT}`);
  console.log(`🖼️  Imagens disponíveis em http://localhost:${PORT}/assets`);
});
