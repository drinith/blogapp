const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categoria = new Schema({
    nome:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})
//Assim que dá retorno do model é um pouco diferente
mongoose.model('categorias',Categoria)