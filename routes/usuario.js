const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Usuario_Desativado")
const Usuario_Desativado = mongoose.model("usuarios_desativados")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const handlebars = require('express-handlebars');
const moment = require('moment')
require("../models/Evento")
const Evento = mongoose.model("eventos")
require("../models/Servico")
const Servico = mongoose.model("servicos")
require("../models/Hospede")
const Hospede = mongoose.model("hospedes")
require("../models/Fatura")
const Fatura = mongoose.model("faturas")
require("../models/Consulta")
const Consulta = mongoose.model("consultas")

router.get('/cadastro-funcionario', (req, res) => {
    res.render("funcionarios/cadastro-funcionario")
})

router.post('/cadastro-funcionario', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.data_nascimento || typeof req.body.data_nascimento == undefined || req.body.data_nascimento == null) {
        erros.push({texto: "Data de nascimento inválida."})
    }

    if(!req.body.rg || typeof req.body.rg == undefined || req.body.rg == null) {
        erros.push({texto: "RG inválido"})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        erros.push({texto: "CPF inválido"})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        erros.push({texto: "CPF inválido"})
    }

    if(!req.body.telefone_1 || typeof req.body.telefone_1 == undefined || req.body.telefone_1 == null) {
        erros.push({texto: "Telefone 1 inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: "Telefone 1 inválido"})
    }

    if(erros.length > 0) {
        res.render("funcionarios/cadastro-funcionario", {erros: erros})
    }else {
        Usuario.findOne({rg: req.body.rg}).then((usuario) => {
            if(usuario) {
                req.flash("error_msg", "Já existe um funcionário com este RG.")
                res.redirect("/cadastro-funcionario")
            } else {
                if (req.body.telefone_2) {
                    tel2 = req.body.telefone_2
                } else {
                    tel2 = 0
                }
                var novaData = moment(req.body.data_nascimento, "YYYY-MM-DD")
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    data_nascimento: novaData,
                    rg: req.body.rg,
                    cpf: req.body.cpf,
                    telefone_1: req.body.telefone_1,
                    telefone_2: tel2,
                    email: req.body.email,
                    nivel_usuario: req.body.nivel_usuario,
                    senha: req.body.rg
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do funcionário")
                            res.redirect("/dashboard")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Funcionário criado com sucesso!")
                            res.redirect("/dashboard")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o funcionário")
                            res.redirect("/cadastro-funcionario")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno!")
            res.redirect("/dashboard")
        })
        
    }
})

router.get('/alterar-senha', (req, res) => {
    res.render('funcionarios/alterar-senha')
})

router.post('/alterar-senha', (req, res) => {
    erros = []

    if(req.body.senha_nova1 != req.body.senha_nova2) {
        erros.push({texto: "As senhas não são iguais!"})
    }

    if(erros.length > 0) {
        res.render("funcionarios/alterar-senha", {erros: erros})
    }else {
        Usuario.findOne({_id: req.body.id}).then((usuario) => {
            novaSenha = req.body.senha_nova1
            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(novaSenha, salt, (erro, hash) => {
                    if(erro) {
                        req.flash("error_msg", "Houve um erro ao alterar a senha.")
                        res.redirect("/")
                    }
                    usuario.senha = hash
                    usuario.save().then(() => {
                        req.flash("success_msg", "Senha alterada com sucesso!")
                        res.redirect("/dashboard")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao alterar a senha.")
                        res.redirect("/usuario/alterar-senha")
                    })
                })
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao encontrar o cadastro no banco de dados.")
            res.redirect("/usuario/alterar-senha")
        })
    }
})

router.get("/alterar-funcionario", (req, res) => {
    res.render("funcionarios/alterar-funcionario")
})

router.post("/busca-alterar-funcionario", (req, res) => {
    Usuario.findOne({cpf: req.body.busca_cpf}).then((usuario) => {
        if(usuario) {
            res.render("funcionarios/alterar-funcionario", {usuario: usuario})
        }else {
            req.flash("error_msg", "Não encontramos um funcionario com este CPF.")
            res.redirect("alterar-funcionario")
        }
    }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao encontrar o funcionario.")
    })
})
    
router.post("/alterar-funcionario", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.data_nascimento || typeof req.body.data_nascimento == undefined || req.body.data_nascimento == null) {
        erros.push({texto: "Data de nascimento inválida."})
    }

    if(!req.body.rg || typeof req.body.rg == undefined || req.body.rg == null) {
        erros.push({texto: "RG inválido"})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        erros.push({texto: "CPF inválido"})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        erros.push({texto: "CPF inválido"})
    }

    if(!req.body.telefone_1 || typeof req.body.telefone_1 == undefined || req.body.telefone_1 == null) {
        erros.push({texto: "Telefone 1 inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: "Telefone 1 inválido"})
    }

    if(erros.length > 0) {
        res.render("funcionarios/alterar-funcionario", {erros: erros})
    }else {
        Usuario.findOne({cpf: req.body.cpf}).then((usuario) => {
            if (req.body.telefone_2) {
                tel2 = req.body.telefone_2
            } else {
                tel2 = 0
            }

            var novaData = moment(req.body.data_nascimento, "YYYY-MM-DD")

            usuario.nome = req.body.nome;
            usuario.data_nascimento = novaData;
            usuario.rg = req.body.rg;
            usuario.cpf = req.body.cpf;
            usuario.telefone_1 = req.body.telefone_1;
            usuario.telefone_2 = tel2;
            usuario.email = req.body.email;
            usuario.nivel_usuario = req.body.nivel_usuario;
            console.log("Usuario" + usuario.data_nascimento + "/n form: " + req.body.data_nascimento)
            
            usuario.save().then(() => {
                req.flash("success_msg", "Usuário alterado com sucesso!");
                res.redirect("/dashboard")
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar usuário!")
            })

        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar edição.")
            res.redirect("/dashboard")
            console.log(err)
        })
    }
})

router.get("/desativar-funcionario", (req, res) => {
    res.render("funcionarios/desativar-funcionario")
})

router.post("/busca-desativar-usuario", (req, res) => {
    Usuario.findOne({cpf: req.body.busca_cpf}).then((usuario) => {
        if(usuario) {
            res.render("funcionarios/desativar-funcionario", {usuario: usuario})
        }else {
            req.flash("error_msg", "Não encontramos um funcionario com este CPF.")
            res.redirect("alterar-funcionario")
        }
    }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao encontrar o funcionario.")
    })
})

router.post("/desativar-usuario", (req, res) => {
    const desativarUsuario = new Usuario_Desativado({
        nome: req.body.nome,
        data_nascimento: req.body.data_nascimento,
        rg: req.body.rg,
        cpf: req.body.cpf,
        telefone_1: req.body.telefone_1,
        telefone_2: req.body.telefone_2,
        email: req.body.email,
        nivel_usuario: req.body.nivel_usuario,
    })
    desativarUsuario.save().then(() => {
        Usuario.deleteOne({cpf: req.body.cpf}).then(() => {
            req.flash("success_msg", "Usuário deletado com sucesso!")
            res.redirect("/dashboard")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao desativar usuário.")
            res.redirect("/desativar-usuario")  
            console.log(err + "No primeiro DELETE")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao desativar usuário.")
        res.redirect("/desativar-usuario")
        console.log(err + "No SAVE")
    })   
})

router.get("/servicos", (req, res) => {
    Servico.find().sort({nome: "desc"}).then((servicos) => {
        res.render("clinicos/servicos", {servicos: servicos})
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível buscar os serviços.")
        res.redirect("/usuarios/servicos")
    })
})

router.get("/cadastro-servico", (req, res) => {
    res.render("clinicos/cadastro-servico")
})

router.post("/cadastro-servico", (req, res) => {

    const novoServico = new Servico({
        nome: req.body.titulo,
        descricao: req.body.descricao,
        valor: req.body.valor
    }) 
    novoServico.save().then(() => {
        req.flash("success_msg", "Serviço cadastrado com sucesso!")
        res.redirect("/usuario/servicos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao cadastrar o serviço.")
        res.redirect("/usuario/cadastro-servico")
    })

})

router.get("/desativar-servico/:id", (req, res) => {
    Servico.findOne({_id: req.params.id}).then((servico) => {
        res.render("clinicos/desativar-servico", {servico: servico})
    }).catch((err) => {
        req.flash("seccess_msg", "Falha ao encontrar serviço")
        res.redirect("/usuario/servicos")
    })
})

router.post("/desativar-servico", (req, res) => {
    Servico.findOne({_id: req.body.id}).then((servico) => {
        servico.ativo = false
        servico.save().then(() => {
            req.flash("success_msg", "Serviço desativado.")
            res.redirect("/usuario/servicos")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar desativação")
            res.redirect("/usuario/servicos")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar serviço")
        res.redirect("/usuario/servicos")
        console.log(err)
    })
})

router.get("/alterar-servico/:id", (req, res) => {
    Servico.findOne({_id: req.params.id}).then((servico) => {
        res.render("clinicos/alterar-servico", {servico:servico})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar servico.")
        res.redirect("/usuario/servicos")
    })
})

router.post("/alterar-servico", (req, res) => {
    Servico.findOne({_id: req.body.id}).then((servico) => {
        servico.nome = req.body.titulo
        servico.descricao = req.body.descricao
        servico.valor = req.body.valor
        servico.save().then(() => { 
            req.flash("success_msg", "Alterações realizadas com sucesso!")
            res.redirect("/usuario/servicos")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar alterações")
            res.redirect("/usuario/servicos")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao encontrar servico")
        res.redirect("/usuario/servicos")
    })
})  


router.get("/cadastro-hospedes", (req, res) => {
    res.render("hospedes/cadastro-hospede")
})

router.post("/cadastro-hospedes", (req, res) => {
    Hospede.findOne({cpf: req.body.cpf}).then((hospede) => {
        if (hospede) {
            req.flash("error_msg", "Erro, já existe um hóspede com este CPF")
            res.redirect("/usuario/cadastro-hospedes")
        } else {
            if (req.body.telefone_2) {
                tel2 = req.body.telefone_2
            } else {
                tel2 = 0
            }
            var novaData = moment(req.body.data_nascimento, "YYYY-MM-DD")

            const novoHospede = new Hospede({
                nome: req.body.nome,
                data_nascimento: novaData,
                rg: req.body.rg,
                cpf: req.body.cpf,
                telefone_1: req.body.telefone_1,
                telefone_2: tel2,
                email: req.body.email,
                observacoes: req.body.observacoes
            })

            novoHospede.save().then(() => {
                req.flash("success_msg", "Hóspede cadastrado com sucesso")
                res.redirect("/dashboard")
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar hóspede no banco")
                res.redirect("/usuario/cadastro-hospede")
            })
        }
    })
})

router.get("/alterar-hospedes", (req, res) => {
    res.render("hospedes/alterar-hospedes")
})

router.post("/busca-alterar-hospedes", (req, res) => {
    Hospede.findOne({cpf: req.body.busca_cpf}).then((hospede) => {
        if(hospede && hospede.ativo == true){
            res.render("hospedes/alterar-hospedes", {hospede: hospede})
        }else {
            req.flash("error_msg", "Não foi possível encontrar um hóspede com este CPF")
            res.redirect("/usuario/alterar-hospedes")
        }
        
    }).catch((err) => {
        req.flash("error_msg", "Erro ao buscar o CPF no banco.")
        res.redirect("/usuario/alterar-hospede")
    })
})

router.post("/alterar-hospedes", (req, res) => {
    Hospede.findOne({cpf: req.body.cpf_antigo}).then((hospede) => {
        if(hospede && hospede.ativo == true) {
            if (req.body.telefone_2) {
                tel2 = req.body.telefone_2
            } else {
                tel2 = 0
            }
            var novaData = moment(req.body.data_nascimento, "YYYY-MM-DD")

            hospede.nome = req.body.nome,
            hospede.data_nascimento = novaData,
            hospede.rg = req.body.rg,
            hospede.cpf = req.body.cpf,
            hospede.telefone_1 = req.body.telefone_1,
            hospede.telefone_2 = tel2,
            hospede.email = req.body.email,
            hospede.observacoes = req.body.observacoes

            hospede.save().then(() => {
                req.flash("success_msg", "Hóspede alterado com sucesso!")
                res.redirect("/dashboard")
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar alterações, tente novamente")
                res.render("hospedes/alterar-hospedes", {hospede: hospede})
            })
        }else{
            req.flash("error_msg", "Houve um erro ao alterar o hóspede")
            res.redirect("/usuario/alterar-hospedes")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao sincronizar com o cpf, tente novamente")
        res.redirect("/usuario/alterar-hospedes")
    })
})

router.get("/desativar-hospedes", (req, res) => {
    res.render("hospedes/desativar-hospedes")
})

router.post("/busca-desativar-hospedes", (req, res) => {
    Hospede.findOne({cpf: req.body.busca_cpf}).then((hospede) => {
        if(hospede && hospede.ativo == true){
            res.render("hospedes/desativar-hospedes", {hospede: hospede})
        }else {
            req.flash("error_msg", "Não foi possível encontrar um hóspede com este CPF")
            res.redirect("/usuario/desativar-hospedes")
        }
        
    }).catch((err) => {
        req.flash("error_msg", "Erro ao buscar o CPF no banco.")
        res.redirect("/usuario/desativar-hospede")
    })
})

router.post("/desativar-hospedes", (req, res) => {
    Hospede.findOne({cpf: req.body.cpf_antigo}).then((hospede) => {
        hospede.ativo = false
        hospede.save().then(() => {
            req.flash("success_msg", "Hóspede desativado com sucesso")
            res.redirect("/dashboard")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao executar desativação")
            res.redirect("/usuario/desativar-hospedes")
        })
    })
})

router.get("/escolher-clinico", (req, res) => {
    Usuario.find().then((usuarios) => {
        res.render("clinicos/escolher-clinico", {usuarios: usuarios})
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível buscar os clínicos")
        res.redirect("/dashboard")
    })
})

router.get("/agendar-atendimento/:id", (req, res) => {
    Usuario.findOne({_id: req.params.id}).then((usuario) => {
        Servico.find().then((servicos) => {
            res.render("clinicos/agendar-atendimento", {usuario: usuario, servicos: servicos})
        }).catch((err) => {
            req.flash("error_msg", "Não foi possível encontrar os serviços")
            res.redirect("/dashboard")
        })
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível encontrar o clínico.")
        res.redirect("/dashboard")
    })
})

router.post("/agendar-atendimento", (req, res) => {
    Hospede.findOne({cpf: req.body.cpf_hospede}).then((hospede) => {
        if(hospede.tem_fatura == true) {
            Servico.findOne({_id: req.body.servico}).then((ser_e) => {
                const novaConsulta = new Consulta({
                    clinico: req.body.id_clinico,
                    cliente: hospede._id,
                    servico: ser_e,
                    fatura: hospede.fatura._id,
                    sala: req.body.sala,
                    data_consulta: req.body.data_consulta,
                    horario: req.body.horario
                })
    
                novaConsulta.save().then(() => {
                    hospede.fatura.valor_total = hospede.fatura.valor_total + novaConsulta.servico.valor
                    hospede.save().then(() => {
                        req.flash("success_msg", "Consulta agendada!")
                        res.redirect("/dashboard")
                    }).catch((err) => {
                        req.flash("error_msg", "Erro ao atualizar fatura")
                        res.redirect("/dashboard")
                        console.log("ErRO: ", err)
                    })
                }).catch((err) => {
                    req.flash("error_msg", "Erro ao salvar consulta.")
                    res.redirect("/dashboard")
                    console.log("Erro: ", err)
                })
            })
        }else {
            const novaFatura = new Fatura({
                cpf_hospede: hospede.cpf,
            })
            novaFatura.save().then(() => {
                hospede.fatura = novaFatura._id
                hospede.save().then(() => {
                    const novaConsulta = new Consulta({
                        clinico: req.body.id_clinico,
                        cliente: hospede._id,
                        servico: req.body.servico,
                        fatura: hospede.fatura._id,
                        sala: req.body.sala,
                        data_consulta: req.body.data_consulta,
                        horario: req.body.horario
                    })
        
                    novaConsulta.save().then(() => {
                        hospede.fatura.valor_total = hospede.fatura.valor_total + novaConsulta.servico.valor
                        hospede.save().then(() => {
                            req.flash("success_msg", "Consulta agendada!")
                            res.redirect("/dashboard")
                        }).catch((err) => {
                            req.flash("error_msg", "Erro ao atualizar fatura")
                            res.redirect("/dashboard")
                            console.log("ErRO: ", err)
                        })
                    }).catch((err) => {
                        req.flash("error_msg", "Erro ao salvar consulta.")
                        res.redirect("/dashboard")
                        console.log("Erro: ", err)
                    })
                }).catch((err) => {
                    req.flash("error_msg", "Não foi possível salvar a fatura.")
                    res.redirect("/dashboard")
                    console.log("ERRO: ", err)
                })
            }).catch((err) => {
                req.flash("error_msg", "Não foi possível salvar a fatura.")
                res.redirect("/dashboard")
                console.log("ERRO: ", err)
            })
        }
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível encontrar o hospede.")
        res.redirect("/usuario/escolher-clinico")
    })
})

router.get("/atendimentos-marcados", (req, res) => {
    Consulta.find().populate("servico").populate("cliente").populate("clinico").then((consultas) => {
        res.render("clinicos/atendimentos-marcados", {consultas: consultas})
    }).catch((err) => {
        req.flash("Não foi possível encontrar as consultas.")
        res.redirect("/dashboard")
    })
})

router.get("/check-in", (req, res) => {
    res.render("hospedes/check-in")
})

router.get("/cupom", (req, res) => {
    res.render("hospedes/cupom-fiscal")
})


module.exports = router