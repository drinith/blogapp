const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
//Assim que traz o model
require('../models/Categoria')
const Categoria = mongoose.model('categorias')//Essa estrutura tem que ficar atento pois não é muito tradicional
require('../models/Postagem')
const Postagem = mongoose.model('postagens')//Essa estrutura tem que ficar atento pois não é muito tradicional
const {eAdmin} = require('../helpers/eAdmin')



//Acredito que essa rota faria todas as outras seguirem a regra de ser administrador
/*router.use(eAdmin,(req,res,next)=>{
    next()
})*/

//QUando coloco o eAdmin faço essa rota obecer a regra de administrador
router.get('/',eAdmin,(req,res)=>{
    res.render('admin/index')
})

router.get('/posts',eAdmin,(req,res)=>{
    res.send('Página principal do painel ADM')
})

router.get('/categorias',eAdmin,(req,res)=>{
    
    //Listando as categorias

    console.log(Categoria.find())
    Categoria.find().then((categorias)=>{
        res.render('admin/categorias',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
    
})


router.get('/categorias/add',eAdmin,(req,res)=>{
    res.render('admin/addcategorias')
})

router.get('/categorias/edit/:id',(req,res)=>{
    //Pegando o valor que está sendo passado
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias',{categoria:categoria})
    }).catch((err)=>{
        req.flash('error_msg','Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categorias/edit',eAdmin,(req,res)=>{
    console.log('Chegou aqui fora '+req.body.id)
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        console.log('Chegou aqui '+req.body.id)
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg','Categoria editada com sucesso!')
            res.redirect('/admin/categorias');
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria')
            res.redirect('/admin/categorias');
        })
    }).catch((err)=>{
        //Jogando a variável de sessão temporária 
        req.flash('error_msg','Houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/nova',eAdmin,(req,res)=>{
    
    //Validação do formulário
    var erros = []
    //verificações que não foi enviado nome, 
    if(!req.body.nome || typeof(req.body.nome)==undefined || req.body.nome == null){
        erros.push({text:'Nome inválido'})
    }

     //verificações que não foi enviado slug, 
     if(!req.body.slug || typeof(req.body.slug)==undefined || req.body.slug == null){
        erros.push({text:'Slug inválido'})
    }

    if(req.body.nome.length<2){
        erros.push({texto:'Nome da categoria é muito pequeno'})
    } 
    if(erros.length>0){
        res.render('admin/addcategorias',{erros:erros})
    }else{

        const novaCategoria ={
            nome:req.body.nome,
            slug:req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            //Criando uma váriável de sessão é colocando coisa nela
            req.flash('success_msg', 'Categoria criada com sucesso')
            //Se o cadastro ocorrer com sucesso me redireciona
            res.redirect('/admin/categorias');
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao salvar categoria, tente novamente')
            console.log('Erro ao salvar categoria!')
        })
    }

})


router.post('/categorias/deletar',eAdmin,(req,res)=>{
    Categoria.remove({_id:req.body.id}).then(()=>
    {
        req.flash('success_msg','Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')    
    }).catch((err)=>{
        req.flash('error_smg','Houve um erro ao deletar categoria')
        res.redirect('/admin/categorias')
    })
})


//Postagem usando populate para trazer as informações até mesmo de conteudo

router.get('/postagens',eAdmin, (req,res)=>{
    
    Postagem.find().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulário')
        res.redirect('/admin')
    })
})

router.get('/postagens/add',(req,res)=>{
    Categoria.find().sort({nome:'desc'}).then((categorias)=>{
        res.render('admin/addpostagem',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulário')
        res.redirect('/admin')
    })
    
})

router.post('/postagens/nova',(req,res)=>{

    //Lista que vai receber cada erro que vai se acumulando aqui no caso só será feito 1
    var erros=[]

    if(req.body.categoria =='0'){
        erros.push({texto:"Categoria inválida, registre uma categoria"})
    }

    if(erros.length>0){
        req.render('admin/addpostagem',{erros:erros})
    }else{
        const novaPostagem ={
            titulo:req.body.titulo,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria,
            slug:req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg','Postagem criada com sucesso')
            res.redirect('/admin/postagens');
        }).catch((err)=>{
            req.flash('error_msg','houve um erro durante o salvamento da postagem ')
            res.redirect('/admin/postagens')
        })

        //new Postagem(novaPostagem).save()
    }

})

//Presta que esse é o get que joga as coisas no formulário
router.get('/postagens/edit/:id',(req,res)=>{
    //Buscas em seguida no mongo

    Postagem.findOne({_id:req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.render('admin/editpostagens',{categorias:categorias,postagem:postagem})
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg',"Houve um erro ao carregar o formulário de edição")
        res.redirect('/admin/postagens')
    })
})

router.post('/postagem/edit',(req,res)=>{
  
    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash('success_msg','Postagem editada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            //melhor jeito de debugar
            
            req.flash('error_msg',"erro interno")
            res.redirect('/admin/postagens')
        })

    }).catch((err)=>{
        console.log(err)
        req.flash('error_msg','Houve um erro ao salvar/editar a edição')
        res.redirect('/admin/postagens')
    })
})
//Outra forma de deletar
router.get('/postagens/deletar/:id',(req,res)=>{
    Postagem.remove({_id:req.params.id}).then(()=>{
        req.flash('success_msg','Postagem deletada com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro interno')
        res.redirect('/admin/postagens')
    })
})

module.exports = router