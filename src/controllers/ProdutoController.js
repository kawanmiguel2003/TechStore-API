const pool = require('../db');

exports.getProdutos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Produto');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProduto = async (req, res) => {
    const { nome, preco, categoriaId } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Produto (nome, preco, categoriaId) VALUES (?, ?, ?)',
            [nome, preco, categoriaId]
        );
        res.json({ id: result.insertId, nome, preco, categoriaId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, preco, categoriaId } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE Produto SET nome = ?, preco = ?, categoriaId = ? WHERE id = ?',
            [nome, preco, categoriaId, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Produto WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
