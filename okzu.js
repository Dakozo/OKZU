////////////////////////////////////////////////            v0.1                |
//                                            //  -Creacion del handler.        |
//                    OKZU                    //  -A�adido .env para el token.  |
//                 Creado por                 //  -Funciones basicas agregadas. |
//                   Dakozo                   //  -Todo el codigo explicado.    |
//                                            //  -Lea el log en el Discord.    |
////////////////////////////////////////////////

// Importa los m�dulos necesarios
const { Client, Collection, GatewayIntentBits } = require('discord.js'); // Importar Intents desde discord.js
const fs = require('fs').promises; // API para interactuar con archivos, rutas y directorios y utiliza su m�todo 'promises'.
const path = require('path'); // Para el manejo de rutas de archivos

require('dotenv').config();  // Importa las variables desde del '.env'.


// Crea una instancia del cliente Discord con las intenciones necesarias
const client = new Client({  // Creacion del cliente para interactuar con la API de discord.
    intents: [
        GatewayIntentBits.Guilds,          // Para eventos relacionados con servidores
        GatewayIntentBits.GuildMessages,   // Para eventos relacionados con mensajes

    ]
});

client.commands = new Collection();  // Crea una colecci�n para almacenar los comandos.

const loadModules = async (moduleType, folderPath) => { // Define una funci�n asincr�nica para cargar m�dulos.
    try {
        const moduleFiles = await fs.readdir(`./src/${folderPath}`); // Lee los archivos en la carpeta de m�dulos.
        const modules = moduleFiles.map(file => require(path.join(__dirname, 'src', folderPath, file))); // Importa los m�dulos.

        const handler = moduleType === 'command' ? client.commands : client; // Determina el objeto para manejar los m�dulos.
        const eventHandler = moduleType === 'command' ? 'set' : (modules && modules.once ? 'once' : 'on'); // Decide si usar 'set' para comandos o 'on'/'once' para eventos.

        modules.forEach(module => {
            // A�ade comentarios espec�ficos aqu� para explicar el proceso de carga del m�dulo.
            handler[eventHandler](module.name, (...args) => module.execute(client, ...args)); // Ejecuta la funci�n 'execute' de cada m�dulo y asigna comandos o eventos seg�n sea necesario.
        });
    } catch (error) {
        console.error(`Error al cargar los m�dulos de ${moduleType}:`, error); // Maneja errores durante la carga de m�dulos.
    }
};


const init = async () => {  // Define una funci�n asincr�nica de inicializaci�n.
    try {
        await loadModules('command', 'comandos');  // Carga los m�dulos de comandos.
        await loadModules('event', 'eventos');  // Carga los m�dulos de eventos.

        const token = process.env.TOKEN;  // Obtiene el token desde las variables de entorno.
        if (!token) {
            throw new Error("El token no est� definido en el archivo .env.");  // Lanza un error si el token no est� definido.
        }
        await client.login(token);
    } catch (error) {
        console.error("Error durante la inicializaci�n:", error);  // Maneja errores durante la inicializaci�n.
        process.exit(1);  // Sale del proceso con un c�digo de error.
    }
};

init();  // Llama a la funci�n de inicializaci�n al ejecutar el script.

module.exports = { client }; // Exporta el cliente para que pueda ser utilizado en otros archivos

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
