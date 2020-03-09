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
    res.render('admin/categorias')
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
        res.render('addcategorias',{erros:erros})
    }

    const novaCategoria ={
        nome:req.body.nome,
        slug:req.body.slug
    }
    new Categoria(novaCategoria).save().then(()=>{
        console.log('Cateforia salva com sucesso')
    }).catch((err)=>{
        console.log('Erro ao salvar categoria!')
    })
})

module.exports = router