import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({ person, deleteButtonHandler }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => deleteButtonHandler(person.id)}>Delete</button>
    </li>
  )
}

const AddPersonForm = ({ addPerson, newName, newNumber, handleNewNameChange, handleNewNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input
           value={newName}
           onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input
           value={newNumber}
           onChange={handleNewNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const index = persons.findIndex(person => person.name === newName)
    if (index !== -1) {
      alert(`${newName} henkilö on jo listassa`)
    } else {
      const person = { name: newName, number: newNumber }
      axios
        .post('http://localhost:3001/persons', person)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons


  const deleteButtonHandler = (id) => {
    if (window.confirm(`Delete person with id ${id}?`)) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <AddPersonForm 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber}
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}

      />
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person =>
           <Person key={person.id} person={person} deleteButtonHandler={deleteButtonHandler} />)}
      </ul>
    </div>
  )
}

export default App