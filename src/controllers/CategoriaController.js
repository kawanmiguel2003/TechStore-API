const pool = require('../db');

exports.getCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Categoria');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCategoria = async (req, res) => {
    const { nome } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Categoria (nome) VALUES (?)', [nome]);
        res.json({ id: result.insertId, nome });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        const [result] = await pool.query('UPDATE Categoria SET nome = ? WHERE id = ?', [nome, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.json({ message: 'Categoria atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Categoria WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.json({ message: 'Categoria deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
