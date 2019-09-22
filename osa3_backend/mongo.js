

const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstackDB:${password}@cluster0-qq9is.mongodb.net/person-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (name && number){
  person.save().then(response => {
    console.log(`added ${name} number ${number} to phonebook`)
    console.log(response)

    mongoose.connection.close()
  })
}


if (process.argv.length<4) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(people => {
      console.log(`${people.name} ${people.number}`)
    })
    mongoose.connection.close()
  })
}
