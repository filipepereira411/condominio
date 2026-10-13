import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis do .env.local
dotenv.config({ path: '.env.local' });

const app = express();

// CONFIGURAÇÃO DA API E PASTA PÚBLICA
app.use(express.json());
app.use(express.static('public')); // Permite ler o index.html da pasta public

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error("Erro: Falta definir VITE_SUPABASE_ANON_KEY no ficheiro .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const PORT = process.env.PORT || 8080;

// Rota 1: Listar todas as frações autónomas
app.get('/api/fracoes', async (req, res) => {
  const { data, error } = await supabase.from('fracoes').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Rota 2: Adicionar uma nova fração ao condomínio
app.post('/api/fracoes', async (req, res) => {
  const { identificacao, permilagem, proprietario_nome } = req.body;
  const { data, error } = await supabase
    .from('fracoes')
    .insert([{ identificacao, permilagem, proprietario_nome }])
    .select();
    
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Rota 3: Listar todas as avarias/ocorrências do prédio
app.get('/api/ocorrencias', async (req, res) => {
  const { data, error } = await supabase
    .from('ocorrencias')
    .select('*')
    .order('data_criacao', { ascending: false });
    
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Rota 4: Registar uma nova avaria
app.post('/api/ocorrencias', async (req, res) => {
  const { titulo, descricao } = req.body;
  const { data, error } = await supabase
    .from('ocorrencias')
    .insert([{ titulo, descricao }])
    .select();
    
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor do condomínio ativo!`);
  console.log(`👉 Aceda em: http://localhost:${PORT}`);
});
