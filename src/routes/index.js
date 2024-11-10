const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');
const CategoriaController = require('../controllers/CategoriaController');
const PedidoController = require('../controllers/PedidoController');
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../routes/authMiddleware');

// Rotas para produtos
router.get('/produtos', ProdutoController.getProdutos);
router.post('/produto', authMiddleware, ProdutoController.addProduto); // Protegido
router.put('/produto/:id', authMiddleware, ProdutoController.updateProduto); // Protegido
router.delete('/produto/:id', authMiddleware, ProdutoController.deleteProduto); // Protegido

// Rotas para categorias
router.get('/categorias', CategoriaController.getCategorias);
router.post('/categoria', authMiddleware, CategoriaController.addCategoria); // Protegido
router.put('/categoria/:id', authMiddleware, CategoriaController.updateCategoria); // Protegido
router.delete('/categoria/:id', authMiddleware, CategoriaController.deleteCategoria); // Protegido

// Rotas para pedidos
router.get('/pedidos', PedidoController.getPedidos);
router.post('/pedido', authMiddleware, PedidoController.addPedido); // Protegido
router.put('/pedido/:id', authMiddleware, PedidoController.updatePedido); // Protegido
router.delete('/pedido/:id', authMiddleware, PedidoController.deletePedido); // Protegido

// Rotas para usuários
router.get('/usuarios', UsuarioController.getUsuarios);
router.post('/register', UsuarioController.register); // Não protegido
router.post('/login', UsuarioController.login); // Não protegido
router.put('/usuario/:id', authMiddleware, UsuarioController.updateUsuario); // Protegido
router.delete('/usuario/:id', authMiddleware, UsuarioController.deleteUsuario); // Protegido

module.exports = router;
