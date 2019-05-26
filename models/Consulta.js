const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Consulta = new Schema({
    clinico: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "hospedes",
        required: true
    },
    servico: {
        type: Schema.Types.ObjectId,
        ref: "servicos",
        required: true
    },
    fatura: {
        type: Schema.Types.ObjectId,
        ref: "faturas",
    },
    sala: {
        type: String,
        required: true
    },
    data_consulta: {
        type: Date,
        required: true
    },
    horario: {
        type: String,
        required: true
    }
    
})

mongoose.model("consultas", Consulta)