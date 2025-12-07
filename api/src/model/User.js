const db = require("../database/db");

class User {
    constructor(){
        this._id = null;
        this._user = '';
        this._email = '';
        this._password = '';
    }

    get id(){
        return this._id;
    }

    set id(id){
        this._id = id;
    }

    get user(){
        return this._user;
    }

    set user(user){
        this._user = user;
    }

    get email(){
        return this._email;
    }

    set email(email){
        this._email = email;
    }

    get password(){
        return this._password;
    }

    set password(password){
        this._password = password;
    }

    async create(){
        try {
            const { rows } = await db.query('INSERT INTO users ("user", email, password) VALUES ($1, $2, $3) RETURNING id', [this._user, this._email, this._password]);
            this._id = rows[0].id;
            console.log("User created with ID:", this._id);
            return true;

        } catch(error){
            console.error("Error while creating user:", error);
            return false;
        }
    }

    async readAll(){
        try {
            const { rows } = await db.query('SELECT id, "user", email FROM users ORDER BY id ASC;');
            return rows;
        } catch (error) {
            console.error("Error while reading users:", error);
            return [];
        }
    }

    async readById(){
        try {
            const { rows } = await db.query('SELECT id, "user", email, password FROM users WHERE id = $1', [this._id]);
            return rows[0];
        } catch (error) {
            console.error("Error while reading user:", error);
            return null;
        }
    }

    async update(){
        try {
            const result = await db.query('UPDATE users SET "user" = $1, email = $2, password = $3 WHERE id = $4', [this._user, this._email, this._password, this._id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error while updating user:", error);
            return false;
        }
    }

    async delete(){
        try {
            const result = await db.query("DELETE FROM users WHERE id = $1", [this._id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error while deleting user:", error);
            return false;
        }
    }

    async isUser(){
        try {
            const { rows } = await db.query('SELECT COUNT(*) AS qtd FROM users WHERE "user" = $1 OR email = $2', [this._user, this._email]);
            return rows[0].qtd > 0;
        } catch (error) {
            console.error("Error while checking user:", error);
            return false;
        }
    }

    async findByEmail(email) {
        try {
            const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (rows.length > 0) {
                const userData = rows[0];
                this._id = userData.id;
                this._user = userData.user;
                this._email = userData.email;
                this._password = userData.password; // Isso retornará a senha (hash) do banco
                return this;
            }
            return null; // Retorna nulo se nenhum usuário for encontrado
        } catch (error) {
            console.error("Erro ao buscar usuário por email:", error);
            return null;
        }
    }

}

module.exports = User;