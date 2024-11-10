const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'MinhaSuperSenha'; // passei o jwt secret direto pois ao passar pelo env estava dando erro e não conseguia autenticar o token
//Abaixo vai ter alguns códigos que estava usando para testar o token, como data que o token foi gerado, e até retornando o token

// Registrar um novo usuário
exports.register = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const hashedSenha = await bcrypt.hash(senha, 10);
        const [result] = await pool.query(
            'INSERT INTO Usuario (email, senha) VALUES (?, ?)',
            [email, hashedSenha]
        );
        res.json({ id: result.insertId, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login do usuário
exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);
        if (rows.length === 0 || !(await bcrypt.compare(senha, rows[0].senha))) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        // Gerar o token com expiração de 1 hora
        const token = jwt.sign({ id: rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        // Log de depuração para verificar a hora de geração
        console.log('Token gerado em:', new Date()); // Exibe o horário da geração

        // Retornar o token gerado
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obter todos os usuários
exports.getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar informações do usuário
exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { email, senha } = req.body;
    try {
        const hashedSenha = await bcrypt.hash(senha, 10);
        const [result] = await pool.query(
            'UPDATE Usuario SET email = ?, senha = ? WHERE id = ?',
            [email, hashedSenha, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar um usuário
exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Usuario WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Middleware para validar o token
exports.validateToken = (req, res, next) => {
    // Obter o cabeçalho Authorization
    const token = req.header('Authorization');

    // Verificar se o token está presente
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido. Faça login.' });
    }

    // Garantir que o token esteja no formato correto 'Bearer <token>'
    if (!token.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Token mal formatado. O prefixo "Bearer" é necessário.' });
    }

    // Extrair o token após o 'Bearer '
    const tokenStripped = token.split(' ')[1]; // Pega a parte do token após "Bearer"
    
    try {
        // Validar o token usando a chave secreta
        const decoded = jwt.verify(tokenStripped, JWT_SECRET);

        // Armazenar os dados do usuário decodificados no request (para acesso nas rotas)
        req.user = decoded;

        // Log de depuração para verificar a validação do token
        console.log('Token validado em:', new Date()); // Exibe o horário da validação

        // Continuar com a requisição
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado. Faça login novamente.' });
    }
};
