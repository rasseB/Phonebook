const express = require('express')
const cors = require('cors')
const app = express()

// Tehtävä 3.1 - 3.2: Henkilöiden data ja listaus
let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

// Middleware
app.use(cors())
app.use(express.json())

// Tehtävä 3.1: Info-sivu
app.get('/info', (request, response) => {
  const now = new Date()
  const personsCount = persons.length
  
  response.send(`
    <p>Phonebook has info for ${personsCount} people</p>
    <p>${now}</p>
  `)
})

// Tehtävä 3.2: Kaikkien henkilöiden listaus
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Tehtävä 3.3: Yksittäisen henkilön tietojen haku
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Tehtävä 3.4: Henkilöiden poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

// Tehtävä 3.5: Uuden henkilön lisäys
const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Tehtävä 3.6: Virheiden käsittely
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // Tarkista että nimi ei ole jo käytössä
  const nameExists = persons.find(person => person.name === body.name)
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})