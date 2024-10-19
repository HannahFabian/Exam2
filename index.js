const express = require('express');
const https = require("https");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static('public'));

// Ruta para obtener información de un personaje por su ID
app.get('/infoGOT/:id', (req, res) => {
  const characterId = req.params.id; // Obtiene el ID del personaje de la URL
  const url = `https://ThronesApi.com/api/v2/Characters/${characterId}`; // API de Game of Thrones

  https.get(url, (response) => {
      let resContent = "";

      response.on("data", (data) => {
          resContent += data;
      }).on("end", () => {
          try {
              const jsonObj = JSON.parse(resContent);
              console.log(jsonObj); // Log para verificar los datos

              // Renderiza directamente la vista "buscar.ejs" con los datos del personaje
              res.render('buscar', { personaje: jsonObj });
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.redirect("/"); // Redirige a la página principal en caso de error
          }
      }).on("error", (e) => {
          console.error(`Error: ${e.message}`);
          res.redirect("/"); // Redirige a la página principal en caso de error
      });
  });
});

// Ruta para la búsqueda (redirigida desde /infoGOT/:id)
app.get('/search', (req, res) => {
    const id = req.query.id; // Obtiene el ID del personaje desde la consulta
    console.log("Consulta de búsqueda por ID:", id); // Log para verificar el valor del ID
  
    const url = `https://thronesapi.com/api/v2/Characters/${id}`; // URL de la API para buscar por ID
    https.get(url, (response) => {
        let resContent = "";
  
        response.on("data", (data) => {
            resContent += data;
        }).on("end", () => {
            try {
                const personaje = JSON.parse(resContent);
                console.log("Resultado de la API:", personaje); // Log para verificar el resultado
  
                // Renderiza la vista con el personaje
                res.render('buscar', { personaje: personaje });
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.redirect("/"); // Redirige en caso de error
            }
        }).on("error", (e) => {
            console.error(`Error: ${e.message}`);
            res.redirect("/"); // Redirige en caso de error
        });
    });
  });
  

// Ruta raíz para la página principal
app.get('/', (req, res) => {
  // Renderiza la vista de búsqueda sin un personaje inicialmente
  res.render('buscar', { personaje: {} });
});

// Inicia el servidor en el puerto 4000
app.listen(4000, () => {
  console.log("Listening on port 4000");
});
