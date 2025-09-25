const express = require('express')

const defaultRoutes = require('./routes/default')
const restaurantsRoutes = require('./routes/tasks')




const path = require('path')


const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

app.use('/',defaultRoutes)
app.use('/',restaurantsRoutes)


app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

//For all other unsupported routes

app.use(function(req,res){
    res.status(404).render('404')
})

app.use(function(req,res){
    res.status(404).render('404')
})

app.use(function(req,res){
    res.status(500).render('500')
})

app.listen(3000)