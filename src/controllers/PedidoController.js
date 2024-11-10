const pool = require('../db');

exports.getPedidos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Pedido');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addPedido = async (req, res) => {
    const { produtoId, quantidade } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Pedido (produtoId, quantidade) VALUES (?, ?)',
            [produtoId, quantidade]
        );
        res.json({ id: result.insertId, produtoId, quantidade });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePedido = async (req, res) => {
    const { id } = req.params;
    const { produtoId, quantidade } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE Pedido SET produtoId = ?, quantidade = ? WHERE id = ?',
            [produtoId, quantidade, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Pedido WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
