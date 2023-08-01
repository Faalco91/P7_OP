//On importe le module 'http' de node ce qui permet de créer un serveur HTTP.
const http = require('http');

//On importe l'application express que l'on a créer (app.js). Ce qui signifie que toute les routes et configurations dans app.js seront utilisées dans le serveur.
const app = require('./app');

// Cette fonction normalise le port sur lequel le serveur va écouter. Si un numéro de port est spécifié dans les variables d'environnement (process.env.PORT), il sera utilisé. 
//Sinon, le port 4000 sera utilisé par défaut.
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

  //On determine le port sur lequel le serveur écoutera en utilisant la fonction normalizePort.
  const port = normalizePort(process.env.PORT || '4000');

  //On indique à l'application Express sur quel port elle doit écouter en utilisant la méthode "set".
  app.set('port', port);

  //Cette fonction est un gestionnaire d'erreurs qui sera appelé si une erreur se produit lors du démarrage du serveur. 
  //Elle affiche des messages d'erreur spécifiques en fonction du type d'erreur.
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  //On créer le serveur HTTP en passant l'application Express (app) en tant que gestionnaire de requêtes.
  const server = http.createServer(app);
  
  //On attache un gestionnaire d'erreurs pour le serveur pour gérer les erreurs de démarrage.
  server.on('error', errorHandler);

  //On attache un événement pour afficher un message lorsque le serveur commence à écouter sur le port spécifié.
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  });
  
  //On démarre le serveur en l'écoutant sur le port spécifié.
  server.listen(port);



/*//On dit à l'application express sur quel port elle doit tourner
app.set('port, process.env.PORT || 3000')
//On passe l'application app dans notre serveur
const server = http.createServer(app);

//Permet que si l'environement sur lequel tourne notre serveur nous envoie écouter un port specifique cela se fait, si non l'écoute se fera sur le port 3000.
server.listen(process.env.PORT || 3000);*/
