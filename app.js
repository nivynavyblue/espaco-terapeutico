//Carregando módulos.
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express()
const path = require("path")
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
require("./config/auth")(passport)
require("./models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const rotas_usuario = require("./routes/usuario")
const rotas_admin = require("./routes/admin")
const moment = require('moment')
require("./models/Evento")
const Evento = mongoose.model("eventos")

//Configurações
//Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

//Flash
    app.use(flash())

//Middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next();
    })

//Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

//handlebars

    app.engine('handlebars', handlebars({defaultLayout: 'main', helpers: {
        select: function(value, options) {
            return options.fn(this)
            .split('\n')
            .map(function(v) {
                var t = 'value="' + value + '"'
                return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
            })
            .join('\n')
        },
        dateFormat: function(date) {
            return moment(date).format('DD-MM-YYYY')
        },
        dateFormatiso: function(date) {
            return moment(date).format('YYYY-MM-DD')
        },
        ifcond: function(v1, operator, v2, options){
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        grouped_each: function(every, context, options){
            var out = "", subcontext = [], i;
            if (context && context.length > 0) {
                for (i = 0; i < context.length; i++) {
                    if (i > 0 && i % every === 0) {
                        out += options.fn(subcontext);
                        subcontext = [];
                    }
                    subcontext.push(context[i]);
                }
                out += options.fn(subcontext);
            }
            return out;
        },
    }}))
    app.set('view engine', 'handlebars')
    


//Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/Terra-Sol", {useNewUrlParser: true }).then(() => {
        console.log("Conectado ao mongo")
    }).catch((err) => {
        console.log("Erro ao conectar: " + err)
    })

//Public
    app.use(express.static(path.join(__dirname, "public")))


//Rotas
    //Rota para renderizar a página inicial do sistema.
    app.get('/', (req, res) => {
        if(req.user) {
            res.redirect("/dashboard")
        } else {
            res.render("index")
        }
    })

    //Rota para renderizar o dashboar após o login.
    app.get('/dashboard', (req, res) => {
        Evento.find().sort({data: "desc"}).then((eventos) => {
            res.render("dashboard", {eventos: eventos})
        })
    })

    //Rota para realizar o login.
    app.post('/login', (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/",
            failureFlash: true
        })(req, res, next)
    })

    app.get("/logout", (req, res) => {
        req.logout()
        req.flash("success_msg", "Deslogado com sucesso!")
        res.redirect("/")
    })

    app.use('/usuario', rotas_usuario)
    app.use('/admin', rotas_admin)

//Outros
    const PORT = 8081
    app.listen(PORT, () => {
        console.log("Servidor Rodando");
    })
