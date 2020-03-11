const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
//Assim que traz o model
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/',(req,res)=>{
    res.render('admin/index')
})

router.get('/posts',(req,res)=>{
    res.send('Página principal do painel ADM')
})

router.get('/categorias',(req,res)=>{
    
    //Listando as categorias

    console.log(Categoria.find())
    Categoria.find().then((categorias)=>{
        res.render('admin/categorias',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
    
})

router.get('/categorias/add',(req,res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova',(req,res)=>{
    
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

module.exports = router