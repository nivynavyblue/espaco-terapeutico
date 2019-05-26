const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    data_nascimento: {
        type: Date,
        required: true
    },
    rg: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    telefone_1: {
        type: String,
        required: true
    },
    telefone_2: {
        type:String
    },
    email: {
        type: String,
    },
    nivel_usuario: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
    }
})

mongoose.model("usuarios", Usuario)