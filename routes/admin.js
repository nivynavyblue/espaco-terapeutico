const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Usuario_Desativado")
require("../models/Evento")
const Evento = mongoose.model("eventos")
const Usuario_Desativado = mongoose.model("usuarios_desativados")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const handlebars = require('express-handlebars');
const moment = require('moment')
require("../models/Hospede")
const Hospede = mongoose.model("hospedes")

router.get('/cadastro-evento', (req,res) => {
    res.render("eventos/cadastro-evento")
})

router.post('/cadastro-evento', (req,res) => {
    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({texto: "Titulo inválido."})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({texto: "descricao inválida."})
    }
    if(erros.length > 0) {
        res.render("eventos/cadastro-evento", {erros: erros})
    } else {
        var novaData = moment(req.body.data, "YYYY-MM-DD")
        const novoEvento = new Evento({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            horario: req.body.horario,
            data: novaData
        })
        novoEvento.save().then(() => {
            req.flash("success_msg", "Evento criado com sucesso!")
            res.redirect("/dashboard")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao criar o evento.")
            res.redirect("/dashboard")
        })
    }
})

router.get("/alterar-evento/:id", (req, res) => {
    Evento.findOne({_id: req.params.id}).then((evento) => {
        res.render("eventos/alterar-evento", {evento: evento})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar evento")
        res.redirect("/dashboard")
    })
})

router.post("/alterar-evento", (req, res) => {
    Evento.findOne({_id: req.body.id}).then((evento) => {
        var novaData = moment(req.body.data, "YYYY-MM-DD")
        evento.titulo = req.body.titulo
        evento.descricao = req.body.descricao
        evento.horario = req.body.horario
        evento.data = novaData
        evento.save().then(() => {
            req.flash("success_msg", "Evento alterado com sucesso!")
            res.redirect("/dashboard")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar dados")
            req.redirect("/dashboard")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar evento.")
        res.redirect("/dashboard")
    })
})

router.get("/desativar-evento/:id", (req, res) => {
    Evento.findOne({_id: req.params.id}).then((evento) => {
        res.render("eventos/desativar-evento", {evento: evento})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar postagem.")
        req.render("dashboard")
    })
})

router.post("/desativar-evento", (req, res) => {
    Evento.findOne({_id: req.body.id}).then((evento) => {
        evento.acontecer = false
        evento.save().then(() => {
            req.flash("success_msg", "Evento desativado com sucesso.")
            res.redirect("/dashboard")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao desativar evento.")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar o evento.")
        res.redirect("/dashboard")
    })
})






module.exports = router