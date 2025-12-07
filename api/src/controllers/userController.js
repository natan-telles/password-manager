const db = require("../database/db");
const User = require("../model/User.js");

const createUser = async (req, res) => {
    try {
        //console.log("Requisição recebida para criar usuário:", req.body);]

        const { user, email, password } = req.body;
        const newUser = new User();
        newUser._user = user;
        newUser._email = email;
        newUser._password = password; // Lembre-se de fazer o hash da senha aqui!

        const isUser = await newUser.isUser();
        if(isUser){
            return res.status(400).json({ error: "Usuário já existe." });
        }

        const success = await newUser.create();

        if (success) {
            return res.status(201).json({ message: "Usuário criado com sucesso!", userId: newUser._id });
        } else {
            return res.status(500).json({ error: "Erro ao criar usuário." });
        }
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
    }
};

const getUsers = async (req, res) => {
    try{
        const user = new User();
        const users = await user.readAll();
        return res.status(200).json(users);
        
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    } 
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email e senha são obrigatórios." });
        }

        const user = new User();
        const foundUser = await user.findByEmail(email);

        if (!foundUser) {
            // Usamos uma mensagem genérica por segurança
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        // !! AVISO DE SEGURANÇA !!
        // A comparação de senhas em texto plano é extremamente insegura.
        // No futuro, você deve usar uma biblioteca como 'bcrypt' para comparar o hash.
        // Ex: const isMatch = await bcrypt.compare(password, foundUser.password);
        const isMatch = (password === foundUser.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        // Login bem-sucedido. Em uma aplicação real, você geraria um token (JWT) aqui.
        return res.status(200).json({ message: "Login bem-sucedido!", userId: foundUser.id, username: foundUser.user });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
    }
};

module.exports = { createUser, getUsers, loginUser };