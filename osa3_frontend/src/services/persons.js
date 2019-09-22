
import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    console.log('getAll')
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl ,newObject)
    return request.then(response => response.data)
}

const deleteObject = id => {
    console.log(`poistetaan person id:llä ${id}`)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    console.log('päivitetään numero')
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default {
    getAll,
    create,
    deleteObject,
    update
}