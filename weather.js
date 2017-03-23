const http = require('http')
const https = require('https')
const api = require('./api.json')


//print out temp details
function printWeather(weather) {
  const message = `Current temperature in ${weather.location.city} is ${weather.current_observation.temp_f}F`
  console.log(message)
  //alert(message)
  console.log("How does this make you feel?")
}

//print out error message
function printError(error) {
  console.error(error.message)
}

//print out error message
function get(query) {
  //take underscores out for readability
  const readableQuery = query.replace('_', ' ')
  try{
  const request = https.get(`https://api.wunderground.com/api/${api.key}/geolookup/conditions/q/${query}.json`, response =>{
    if (response.statusCode === 200) {
    let body = ""
    //read the data
    response.on('data', chunk => {
      body += chunk
    })
    response.on('end', () => {
      try{
        //parse the data
        const weather = JSON.parse(body)
        //check if the location was found before printing
        if(weather.location){
          //print the data
          printWeather(weather)
      }else {
      const queryError = new Error(`The location ${readableQuery} was not found`)
      printError(queryError)
      }
    }catch (error) {
      //parse error
      printError(error)
    }
  })
}else {
  //Status Code error
  const statusCodeError = new Error(`There was an error gettig the message for ${readableQuery}. (${http.STATUS_CODES[response.statusCode]})`)
  printError(statusCodeError)
}

})

request.on("error", printError)
}catch (error) {
  //malformed url
  printError(error)
}
}

module.exports.get = get
