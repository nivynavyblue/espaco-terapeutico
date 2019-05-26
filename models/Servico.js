const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Servico = new Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    ativo: {
        type: Boolean,
        default: true
    } 

})

mongoose.model("servicos", Servico)