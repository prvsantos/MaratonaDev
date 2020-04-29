// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos (css, scripts, etc...)
server.use(express.static('public'))

// habilitar o "body" do formulário
server.use(express.urlencoded({ extended: true}))

// configurar a conexão com o bando de dados
// o .Pool é responsável por manter a conexão ativa com o banco s/ precisar ficar inserindo senhas
const Pool = require('pg').Pool
// new Poll -> criando um novo objeto e atribuindo a variável "db"
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


// configurando a tampleate engine
// um jeito inteligente de trabalhar com o html
const nunjucks = require("nunjucks")
// ./ -> informa q o index.html está na pasta raiz
nunjucks.configure("./", {
// o nunjucks vai aplicar o server dentro do express    
    express: server,
    noCache: true, //boolean ou booleano aceita 2 valores (verdadeiro ou falso)
})

// configurar a apresentação da página
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM doadores", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const doadores = result.rows
        return res.render("index.html", { doadores })
    })
    
})

server.post("/", function(req, res){
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const sangue = req.body.sangue

    // Se o name igual (==) a vazio ""
    // OU (||) o email igual (==) a vazio ""
    // OU (||) o sangue igual (==) a vazio ""
    if (name == "" || email == "" || sangue == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do banco de dados
    const query = `
    INSERT INTO doadores ("name", "email", "sangue")
    VALUES ($1, $2, $3)`
    
    const values = [name, email, sangue]
       
    db.query(query, values, function(err) {
        // fluxo de erro
        if (err) return res.send("erro no banco de dados.")
        
        // fluxo ideal
        return res.redirect("/")
    })

})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor.")
})