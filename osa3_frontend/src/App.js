import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ showAll, setShowAll ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState({
    className: '',
    message: ''
  })

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        console.log('response: ', initialPersons)
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()
    console.log('button clicked', event.target.value)
    const person = persons.filter(person => person.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if(person.length > 0){
      const id = person[0].id
      
      const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(result === true){
        personService
          .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setErrorMessage({
              className: 'notice', 
              message: `Edited ${returnedPerson.name}`
            })
            setTimeout(() => {
              const empty = {
                className: '',
                message: ''
              }
              setErrorMessage(empty)
            }, 3000)
          })
          .catch(error => {
            console.log(error.response.data.error)        
            setTimeout(() => {
              const empty = {
                className: '',
                message: ''
              }
              setErrorMessage(empty)
            }, 5000)

         // setPersons(persons.filter(person => 
         //   person.id !== id
         // ))
        })
      }
    }else{
      personService
        .create(personObject)
        .then(createdPerson => {
          console.log(createdPerson)
          setPersons(persons.concat(createdPerson))
          setErrorMessage({
            className: 'notice',
            message: `Added ${createdPerson.name}`
          })
          setTimeout(() => {
            const empty = {
              className: '',
              message: ''
            }
            setErrorMessage(empty)
          }, 3000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          const errorNotice = {
            className: 'error',
            message: error.response.data.error
          }
          setErrorMessage(errorNotice)
          setTimeout(() => {
            const emptyNotice = {
              className: '',
              message: ''
            }
            setErrorMessage(emptyNotice)
          }, 3000)
        })
      setNewName('')
      setNewNumber('')
    }
  }
 
const handleAddNumber = (event) => {
  setNewNumber(event.target.value)
}

const handleAddPerson = (event) => {
  console.log('event: ', event.target.value)
  setNewName(event.target.value)
}

const handleFilter = (event) => {
  setShowAll(event.target.value)
}

const personsToShow = showAll
  ? persons.filter(person => person.name.toLowerCase().indexOf(showAll) > -1)
  : persons

  return (
    <div>
      <h2>Phonebook</h2>  
      <Notification className={errorMessage.className} message={errorMessage.message} />
      filter shown with:
      <Filter showAll={showAll} handleFilter={handleFilter} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleAddPerson={handleAddPerson} newNumber={newNumber} handleAddNumber={handleAddNumber}/>
      <h2>Numbers</h2>
      <Persons persons={personsToShow} setPersons={setPersons} setErrorMessage={setErrorMessage} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name:
        <input
        value={props.newName}
        onChange={props.handleAddPerson}
        />
      </div>
      <div>
        number:
        <input
        value={props.newNumber}
        onChange={props.handleAddNumber}
        />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

const Persons = (props) => {
  const setPersons = props.setPersons
  const persons = props.persons
  const setErrorMessage = props.setErrorMessage
  return (
    persons.map(person =>      
      <div key={person.id}>
        {person.name} {person.number} <Button id={person.id} name={person.name} persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} />
      </div>  
    )
  )
}

const Button = (props) => {
  const setPersons = props.setPersons
  const setErrorMessage = props.setErrorMessage
  const persons = props.persons
  const id = props.id
  const name = props.name
  const handleClick = () => {
    const result = window.confirm(`Delete ${props.name}?`)
    if(result === true){
      personService
      .deleteObject(id)
      .then(response => {
        console.log('response: ', response)
        setPersons(persons.filter(person => person.id !== id))
        setErrorMessage({
          className: 'notice',
          message: `Deleted ${name}`
        })
        setTimeout(() => {
          const empty = {
            className: '',
            message: ''
          }
          setErrorMessage(empty)
        }, 3000)       
      })
      .catch(error => {
        console.log('error', error.response.data.error)
        setErrorMessage({
          className: 'error',
          message: error.response.data.error
        })
        setTimeout(() => {
          const empty = {
            className: '',
            message: ''
          }
          setErrorMessage(empty)
        }, 3000)
        setPersons(persons.filter(person => person.id !== id))
      }) 
    }
  }
  return (
    <button onClick={handleClick}>delete</button>
  )
}

const Filter = (props) => {
  return (
    <input
      value={props.showAll}
      onChange={props.handleFilter}
    />
  )
}

const Notification = ({ className, message }) => {
 // console.log('message:', message)
  if(message === ''){
    return null
  }
  return (
    <div className={className}>
    {message}
  </div>
  )
}

export default App