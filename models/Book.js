const mongoose = require('mongoose');

//On créer notre schema de données auquels on passe un objet, les differents champs, dont notre schema aura besoin.
//Le schema de Mongoose permet de créer un schéma de données pour notre base de données MongoDB.
const bookSchema = mongoose.Schema({

    userId : {type: String}, //identifiant MongoDB unique de l'utilisateur qui a créé le livre
    title : {type: String}, //titre du livre
    author : {type: String}, //auteur du livre
    imageUrl : {type: String}, //- illustration/couverture du livre
    year: {type: Number}, //année de publication du livre 
    genre: {type: String}, //genre du livre
    ratings : [{ //notes données à un livre
        userId : {type: String}, //dentifiant MongoDB unique de l'utilisateur qui a noté le livre
        grade : {type: Number}, //note donnée à un livre
    }],
    averageRating : {type: Number} //note moyenne du livre

});

//Pour exploiter ce schema, (le lire, l'enregistrer dans la base de données), on utilise la méthode suivante.
//Le premier argument est le nom du type de model, le deuxieme est le nom du schema de données.
module.exports = mongoose.model('Book', bookSchema);