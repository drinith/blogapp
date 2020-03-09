//Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routers/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

//Configurações
    //Sessão
    app.use(session({
        secret:'qualquercoisa',
        resave:true,
        saveUninitialized:true
    }))
    app.use(flash())
    //Middlewate
    app.use((req,res,next)=>{
        //Criação de variáveis globais que serão usadas no futuro
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg=req.flash('error_msg')
        next()
    })
    //Body Parser
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout:'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log('Conectado ao mongo')
        }).catch((err)=>{
            console.log('Erro ao se conectar: '+err)
        })
    //
    //Public onde __dirname é o caminho absoluto 
    app.use(express.static(path.join(__dirname,'public')))
//Rotas
    //Rotas sem prefixo
    app.get('/',(req,res)=>{
        res.send("HOMEZÃO BROTHER")
    })
    //Rotas de grupo então as rotas estão lá no admin que foi importado
    app.use('/admin',admin)

//Outros
const PORT=8081
app.listen(PORT,()=>{
    console.log('Servidor rodando !')
})