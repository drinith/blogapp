//Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routers/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')//Flash tipo de sessão que só carrega uma vez
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routers/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)

//Configurações
    //Sessão
    app.use(session({
        secret:'qualquercoisa',
        resave:true,
        saveUninitialized:true
    }))
    //configurando a parte de passport
    app.use(passport.initialize())
    app.use(passport.session())
    

    app.use(flash())
    //Middlewate
    app.use((req,res,next)=>{
        //Criação de variáveis globais que serão usadas no futuro
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg=req.flash('error_msg')
        res.locals.error = req.flash('error')
        //Variavel da sessão com os dados do usuário logado
        res.locals.user = req.user||null;
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
    //Rota Principal
    app.get('/',(req,res)=>{
        Postagem.find().populate('categoria').sort({data:'desc'}).then((postagens)=>{
            res.render('index',{postagens:postagens})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/404');
        })
    })
    
    app.get('/postagem/:slug',(req,res)=>{
        Postagem.findOne({slug:req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render('postagem/index',{postagem:postagem})
            }else{
                req.flash('error_msg',"Esta postagem não existe")
                 res.redirect('/');
            }
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno')
             res.redirect('/');
        })
    })
    
    app.get('/categorias',(req,res)=>{
        Categoria.find().then((categorias)=>{
            res.render('categorias/index',{categorias:categorias})
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno ao listar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug',(req,res)=>{
       
        Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
            //Encontrou a categoria
            if(categoria){
                
                //buscar as postagens dessa categoria
              
                Postagem.find({categoria:categoria._id}).then((postagens)=>{
                   
                   
                    res.render('categorias/postagens',{postagens:postagens,categoria:categoria})   
                    console.log("Chegou aqui") 
                
                
                }).catch((err)=>{
                    req.flash('error_msg','Houve um erro ao listar os posts!')
                    res.redirect('/')
                })
            //Não encontrou a categoria
            }else{
                req.flash('error_msg','Esta categoria não existe')
                res.redirect('/')
            }

        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao listar os Posts!')
            res.redirect('/')
        })
    })

  

    //Rota de erro 
    app.get('/404',(req,res)=>{
        res.send('Erro 404')
    })
    
    //Rotas externas
    //Rotas de grupo então as rotas estão lá no admin que foi importado
    app.use('/admin',admin)
    app.use('/usuarios',usuarios)

//Outros
const PORT=8081
app.listen(PORT,()=>{
    console.log('Servidor rodando !')
})