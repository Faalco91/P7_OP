const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//La fonction signup qui permet à un nouvel utilisateur de s'enregistrer
//prend un mot de passe qu'il va crypter puis va créer un nouvel user avec ce mot-de-passe crypter et l'adresse mail de celui-ci,
//pour enfin l'enregistrer dans la base de données.
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user =  new User ({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then((savedUser) => {
        res.status(201).json({message: 'utilisateur créé !'});
        })
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};



exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            res.status(401).json({message: 'Email ou identifiant incorrect !'});
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then( valid => { 
                if (!valid) {
                    return res.status(401).json({message : 'Email ou identifiant incorrect !'});
                }  
                res.status(200).json({
                    message : 'identification réussi !',
                    userId: user.email,
                    token: jwt.sign(
                        { userId: user.email },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                 });
                
            })
            .catch( error => res.status(500).json({error}));
        }
    })
    .catch( error => res.status(500).json({error}));
};