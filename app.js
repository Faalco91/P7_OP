const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('requete reçue !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({message: 'Votre requête a bien été reçue lol.'});
    next();
});

app.use((req, res) => {
    console.log('La réponse a été envoyé avec succès !');
});

//On exporte cette constante app afin de pouvoir l'utiliser depuis nos autres fichiers notamment dans notre serveur node (server.js)
module.exports = app;