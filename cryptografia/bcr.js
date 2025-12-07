require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { config } = require('process');

const app = express();
const port = 3002;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, "login.html"));
})

// Rota POST que recebe os dados do formulário
app.post('/register', (req, res) => {
    // 1. CAPTURAR A SENHA DO FRONT-END:
    const password = req.body.password;
    const username = req.body.username;
    
    if (!password) {
        return res.status(400).send('Erro: A senha é obrigatória.');
    }

    // 2. EXECUTAR O HASHING:
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            console.error('Erro ao hashear a senha:', err);
            return res.status(500).send('Erro interno do servidor durante o registro.');
        }

        if(password && username){
            res.redirect("/login");
        }else{

        }

        // 3. ARMAZENAR NO BANCO DE DADOS:
        console.log(`Usuário: ${username}`);
        //console.log('Senha PLANA recebida:', password);
        console.log('Senha HASHEADA (para o BD):', hash);
        
        // Simulação de salvamento no banco de dados:
        // db.saveUser({ username: username, passwordHash: hash }); 

        /*if(){

        }else{

        }*/

        //res.send(`Registro bem-sucedido para ${username}! Hash da senha: ${hash}`);
    });

});


//busca a senha em hash do usuario e o usuario
//o .env vai subir de exemplo nessa parte do desenvolvimento mas não iriemos manter nada do tipo em produção
const nameOfUsers = process.env.nameOfUsers.split(',').map(name => name.trim());
const passwordDBhash = process.env.passwordDBhash 

app.get("/logado", (req, res)=>{
    res.sendFile(path.join(__dirname, "logado.html"));
})

//rota para consutar a hash do usuario e fazer ele logar ou ser rejeitado por meio da senha incorreta
app.post("/logando", async (req, res)=>{
    const {name, password2 } = req.body;
    console.log(`recebemos nom ${name}`)

    if (!nameOfUsers.includes(name)) {
        return res.status(401).send('Erro: Usuário ou senha inválidos.');
    }


    try {
        
        const match = await bcrypt.compare(password2, passwordDBhash);// password é a senha PLANA vinda do input do front-end // storedHash é o HASH salvo no banco de dados
    
        if (match) {
           
            res.redirect("/logado");
            
            console.log(`SUCESSO! Redirecionamento deveria ter ocorrido.`)
            //res.send(`Sucesso! Login efetuado para o usuário ${username}.`); // As senhas correspondem! // Aqui você criaria uma sessão ou enviaria um token JWT.
        
        } else {
            // Senha incorreta.
            res.status(401).send('Erro: Usuário ou senha inválidos.');
            console.log(`Erro: Usuário ou senha inválidos.`)
        }

    } catch (error) {
        console.error('Erro na comparação do bcrypt:', error);
        res.status(500).send('Erro interno do servidor.');
    }
})

/*bcrypt.hash(textoPlanoInput, saltRounds, function(err, hash) {

    if(err){
        console.log(hash)
        return;
    }
    
    console.log('senha hashead', hash)
})*/

//rota para cryptografar senha da "redesocial"
//aqui iremos hashear as senhas que os usuarios desejam guardar
app.get("/criptografar", (req, res)=>{
    res.sendFile(path.join(__dirname, "criptografar.html"));
})

app.post("/criptografando", async (req, res)=>{
    const senhaRede = req.body.senhaRede

    bcrypt.hash(senhaRede, saltRounds, function(err, hash){
        if(err){
            console.error('Erro ao hashear:', err);
            
            return res.status(500).send('Erro interno ao processar a senha.');
        }
        // ENVIA SUCESSO e o hash de volta ao cliente (para fins de teste)
        console.log('Senha hasheada:', hash);
        res.send(`Senha hasheada com sucesso! Hash: ${hash}`);
        
        // Em um projeto real:
        // res.redirect('/sucesso');
    
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});