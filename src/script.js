//import Amplify from '@aws-amplify/api'
import Amplify, { API, graphqlOperation } from '@aws-amplify/api'
import awsConfig from './aws-exports'
//import { createGif }  from './graphql/mutations'
//import { createGif, updateGif } from './graphql/mutations'
import { createGif, deleteGif, updateGif } from './graphql/mutations'
import { listGifs } from './graphql/queries'

Amplify.configure(awsConfig)

let currentGifId = ''

const getGifs = async () => {
    // select the container element
    const container = document.querySelector('.container')
    // reset its current contents
    container.innerHTML = ''
    // make a request to get all our gifs
    const gifs = await API.graphql(graphqlOperation(listGifs))
    // loop through our gifs and 
    gifs.data.listGifs.items.map(gif => {
      // create a new image element
      const img = document.createElement('img')
      // add the src attribute to the img
      img.setAttribute('src', gif.url)
      // add the alt attribute to the img
      img.setAttribute('alt', gif.altText)
      img.addEventListener('click', () => {
             currentGifId = gif.id
             document.getElementById('edit-altText').value = gif.altText
             document.getElementById('edit-url').value = gif.url
             document.getElementById('edit-title').innerText = `Update ${gif.altText}`
           }) 
      // add the image to the container
      document.querySelector('.container').appendChild(img)
    })
  }
  
  // run this function on page load
  getGifs()

// create an async function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
const createNewGif = async e => {
    e.preventDefault() // don't refresh the page after form submit
  
    const gif = {
      // grab the value of the `altText` field
      altText: document.getElementById('altText').value,
      // grab the value of the `url` field
      url: document.getElementById('url').value
    }
  
    try {
      // Make the API request: provide the createGif operation, provide the user's gif data
      const newGif = await API.graphql(graphqlOperation(createGif, { input: gif }))
      getGifs()  
      // Print the data to the console once it comes back
      console.log(newGif)
      // Reset the form (make the fields blank again)
      document.getElementById('create-form').reset()
    } catch (err) {
      // If the request fails, print the error message to the console
      console.error(err)
    }
  }
  
  // run our createNewGif function when the form is submitted
  document.getElementById('create-form').addEventListener('submit', createNewGif)

  const editGif = async e => {
    e.preventDefault()
  
    try {
      return await API.graphql(graphqlOperation(updateGif, {
        input: {
          id: currentGifId,
          altText: document.getElementById('edit-altText').value,
          url: document.getElementById('edit-url').value
        }
      }))
    } catch (err) {
      console.error(err)
    }
    getGifs()
  }
  
  document.getElementById('edit-form').addEventListener('submit', editGif)

  const removeGif = async () => {
    await API.graphql(graphqlOperation(deleteGif, {
      input: { id: currentGifId }
    }))
    getGifs()
  }
  
  document.getElementById('delete-button').addEventListener('click', removeGif)