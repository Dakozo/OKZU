// Importa el cliente de Discord
const { client } = require('../../okzu');

// Define el evento 'ready'
client.on('ready', () => {
    console.log(`OKZU ha sido activado como: ${client.user.tag}!`);
    // Puedes agregar m�s c�digo aqu� seg�n sea necesario.
});

// Exporta el archivo para que pueda ser utilizado en otros archivos
module.exports = {};
