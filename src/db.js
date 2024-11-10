const mysql = require('mysql2/promise');

const createDatabaseAndTables = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Kmo20*3s@',
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS techstore');
    await connection.query('USE techstore');

    await connection.query(`
        CREATE TABLE IF NOT EXISTS Categoria (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS Produto (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            preco DECIMAL(10, 2) NOT NULL,
            categoriaId INT,
            FOREIGN KEY (categoriaId) REFERENCES Categoria(id)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS Pedido (
            id INT AUTO_INCREMENT PRIMARY KEY,
            produtoId INT,
            quantidade INT NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (produtoId) REFERENCES Produto(id)
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS Usuario (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
        );
    `);

    connection.end();
    console.log('Banco de dados e tabelas criados com sucesso!');
};

createDatabaseAndTables();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Kmo20*3s@',
    database: 'techstore', 
    waitForConnections: true,
    connectionLimit: 10,   
    queueLimit: 0          
});

module.exports = pool;
