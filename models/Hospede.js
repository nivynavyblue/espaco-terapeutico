const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Hospede = new Schema({
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
    observacoes: {
        type: String,
    },
    ativo: {
        type: Boolean,
        required: true,
        default: true
    },
    fatura: {
        type: Schema.Types.ObjectId,
        ref: "faturas",
        required: false
    },
    tem_fatura: {
        type: Boolean,
        default: false
    } 
})

mongoose.model("hospedes", Hospede)