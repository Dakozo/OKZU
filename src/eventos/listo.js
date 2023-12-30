// Importa el cliente de Discord
const { client } = require('../../okzu');

// Define el evento 'ready'
client.on('ready', () => {
    console.log(`OKZU ha sido activado como: ${client.user.tag}!`);
    // Puedes agregar más código aquí según sea necesario.
});

// Exporta el archivo para que pueda ser utilizado en otros archivos
module.exports = {};
