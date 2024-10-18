//Conectar con la API

const express = require('express');
const https = require("https");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

var info = "";
var personaje = "";

//Esto fue solo para ver que funcionara, use la API de las bromas.
app.get('/info', (req, res) => {
  const url = "https://v2.jokeapi.dev/joke/Any";
  https.get(url, (response) => {
      console.log("Got a response");
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const jsonObj = JSON.parse(resContent);
              console.log(jsonObj); 
              info = jsonObj;
              res.redirect("/"); 
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/"); 
          }
      }).on("error", (e) => {
          console.error(`Got an error: ${e.message}`);
          res.redirect("/"); 
      });
  });
});

// Esto si es para la API de Game of thrones.
// http://localhost:4000/infoGOT/10 para verlo en google, /10, el número es para llamar al personaje con ese número. No se cuantos son.
app.get('/infoGOT/:id', (req, res) => {
  const characterId = req.params.id; // Obtiene el ID del personaje de la URL
  const url = `https://ThronesApi.com/api/v2/Characters/${characterId}`; // Actualiza la URL con el ID

  https.get(url, (response) => {
      console.log("Got a response");
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const jsonObj = JSON.parse(resContent);
              console.log(jsonObj); // Log para verificar la estructura de datos

              // Almacena el personaje en la variable
              personaje = jsonObj;

              res.redirect("/"); // Redirige a la página de inicio
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/");
          }
      }).on("error", (e) => {
          console.error(`Got an error: ${e.message}`);
          res.redirect("/");
      });
  });
});

// Solo para ver que funcionara en Google.
app.get('/test', (req, res) => {
  res.send('¡El servidor está funcionando correctamente!');
});

app.get('/', (req, res) => {
  res.render('home', { joke: info, personaje : personaje}); // Render
});


app.listen(4000, () => {
    console.log("Listening on port 4000");
});

//http://localhost:4000/infoGOT/10


