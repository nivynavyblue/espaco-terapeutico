const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Fatura = new Schema({
    cpf_hospede:{
        type: String,
        required: true
    },
    valor_total:{ 
        type: Number,
        default: 0
    }
})

mongoose.model("faturas", Fatura)