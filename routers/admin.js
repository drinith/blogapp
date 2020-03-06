const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('admin/index')
})

router.get('/posts',(req,res)=>{
    res.send('Página principal do painel ADM')
})

router.get('/categorias',(req,res)=>{
    res.send('Página principal do painel ADM')
})

module.exports = router