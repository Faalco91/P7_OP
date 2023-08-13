const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then((book) => { 
        if (book.userId != req.auth.userId) {
            res.status(403).json({ message: 'unauthorized request' });
        } else {
            res.status(201).json({message: 'Livre enregistré !'})
        }
    })
    .catch( error => res.status(400).json({error}));
};

exports.createBookRating = (req, res, next) => {
    const bookId = req.params.id;
    console.log(bookId);
    const userId = req.auth.userId;
    console.log(userId);
    const grade = req.body.rating; // Convertir la note en nombre
    console.log(grade); 

    // Vérifier si la note est comprise entre 0 et 5
    if (isNaN(grade) || grade < 0 || grade > 5) {
        return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
    }

    // Trouver le livre par son ID
    Book.findById(bookId)
        .populate('ratings.userId') // Peupler les références aux utilisateurs liés aux notes
        .exec()
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé.' });
            }

            // Vérifier si l'utilisateur a déjà noté ce livre
            const hasRated = book.ratings.some(rating => rating.userId === userId);
            if (hasRated) {
                return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
            }

            // Ajouter la nouvelle note à la liste des notes du livre
            book.ratings.push({ userId: userId, grade: grade });

            // Calculer la nouvelle note moyenne
            const totalRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            const averageRating = totalRating / book.ratings.length;

            // Mettre à jour la note moyenne du livre
            book.averageRating = averageRating;

            // Enregistrer les modifications du livre dans la base de données
            return book.save();
        })
        .then(updatedBook => {
            res.status(200).json(upd);
        })
        .catch(error => res.status(500).json({error}));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({message: error}));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }) // Recherche par le champ userId
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.status(200).json(book);
      })
      .catch(error => res.status(400).json({ error }));
  };
  


exports.getBooksBestRating = (req, res, next) => {
    Book.find()
    .sort({ averageRating: -1 }) // Trie par note moyenne décroissante
    .limit(3) // Limite à 3 résultats
    .then(books => {
        //console.log(books);
        if (books.length >= 3) {
        res.status(200).json(books);
      } else {
        res.status(404).json({error});
      }
    })
    .catch(error => res.status(400).json({ error }));
};



exports.modifyOneBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    //console.log(bookObject);
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'});
        } else {
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(400).json({error}));
};

exports.deleteOneBookRating = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'objet supprimé'}))
                    .catch(error => res.status(401).json({error}));
                });
            }

    })
    .catch(error => res.status(500).json({ error }));
};