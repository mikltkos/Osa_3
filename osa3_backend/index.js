require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')


app.use(bodyParser.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/*
const generateId = () => {
    const id = Math.floor((Math.random() * 10000) + 1)
    return id
} */


app.get('/api/persons', (_req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
    .catch(error => {
      next(error)
    })
})

app.get('/info', (req, res, next) => {
  // console.log('info')
  const d = new Date()
  Person.find({}).then(persons => {
    persons.map(person => person.toJSON())
    const phonebookInfo = `<div>Phonebook has info for ${persons.length} people</div>`
    const fullDate = `<div>${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()} ${d.toTimeString()}</div>`
    res.send(phonebookInfo + '<br />' + fullDate)
  })
    .catch(error => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person.toJSON())
      } else {
        console.log(`Person with id: ${request.params.id}, not found`)
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  console.log(`name ${body.name}, number: ${body.number}`)
  if(!body.number){
    return res.status(400).json({ error: 'number is missing' })
  }
  const person = {
    name: body.name,
    number: body.number
  }
  console.log('id: ', req.params.id)
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log('put response', updatedPerson)
      res.status(200).json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if(!body.name || !body.number){
    console.log('name or number is missing')
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log('person', person)

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
    .catch(error => {
      next(error)
    })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if(result === null){
        console.log('Nimeä ei löytynyt')
        return response.status(404).json({ error: 'item not found' })
      }
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('errorHandler')
  console.log('virhe: ', error)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    console.log(error.name, error.kind)
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    console.log('validationError: ', error.message)
    return response.status(400).json({ error: error.message })
  }
  console.log('else error: ', error.name)

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
