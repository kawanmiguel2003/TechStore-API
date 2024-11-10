const jwt = require('jsonwebtoken');
const secret = 'MinhaSuperSenha';

module.exports = (req, res, next) => {
    // 1. Obter o cabeçalho Authorization
    const token = req.header('Authorization');

    // 2. Verificar se o token está presente
    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
    }

    // 3. Garantir que o token esteja no formato correto 'Bearer <token>'
    if (!token.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Token mal formatado. O prefixo "Bearer" é necessário.' });
    }

    // 4. Extrair o token após o 'Bearer '
    const tokenStripped = token.split(' ')[1]; // Pega a parte do token após "Bearer"
    
    try {
        // 5. Validar o token usando a chave secreta
        const decoded = jwt.verify(tokenStripped, secret);

        // 6. Armazenar os dados do usuário decodificados no request (para acesso nas rotas)
        req.user = decoded;
        
        // 7. Continuar com a requisição
        next();
    } catch (err) {
        // 8. Se o token for inválido ou expirado, o cliente precisa se autenticar novamente.
        if (err.name === 'TokenExpiredError') {
            // O token expirou, podemos gerar um novo token para o usuário
            const newToken = jwt.sign({ id: req.user.id }, secret, { expiresIn: '1h' });

            // Opcional: Adicione o novo token ao cabeçalho de resposta
            res.setHeader('x-new-token', newToken); // Pode ser útil informar ao cliente o novo token

            // Retorne um status 401 (não autorizado) junto com a mensagem de token expirado
            return res.status(401).json({ 
                message: 'Token expirado, novo token gerado', 
                newToken
            });
        }

        // Se o erro não for de expiração, retornamos erro de token inválido
        return res.status(401).json({ message: 'Token inválido ou expirado. Por favor, faça login novamente.' });
    }
};
