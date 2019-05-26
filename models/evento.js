const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Evento = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    acontecer: {
        type: Boolean,
        default: true
    }
})

mongoose.model("eventos", Evento)