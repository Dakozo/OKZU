////////////////////////////////////////////////            v0.1                |
//                                            //  -Creacion del handler.        |
//                    OKZU                    //  -Añadido .env para el token.  |
//                 Creado por                 //  -Funciones basicas agregadas. |
//                   Dakozo                   //  -Todo el codigo explicado.    |
//                                            //  -Lea el log en el Discord.    |
////////////////////////////////////////////////

// Importa los módulos necesarios
const { Client, Collection, GatewayIntentBits } = require('discord.js'); // Importar Intents desde discord.js
const fs = require('fs').promises; // API para interactuar con archivos, rutas y directorios y utiliza su método 'promises'.
const path = require('path'); // Para el manejo de rutas de archivos

require('dotenv').config();  // Importa las variables desde del '.env'.


// Crea una instancia del cliente Discord con las intenciones necesarias
const client = new Client({  // Creacion del cliente para interactuar con la API de discord.
    intents: [
        GatewayIntentBits.Guilds,          // Para eventos relacionados con servidores
        GatewayIntentBits.GuildMessages,   // Para eventos relacionados con mensajes

    ]
});

client.commands = new Collection();  // Crea una colección para almacenar los comandos.

const loadModules = async (moduleType, folderPath) => { // Define una función asincrónica para cargar módulos.
    try {
        const moduleFiles = await fs.readdir(`./src/${folderPath}`); // Lee los archivos en la carpeta de módulos.
        const modules = moduleFiles.map(file => require(path.join(__dirname, 'src', folderPath, file))); // Importa los módulos.

        const handler = moduleType === 'command' ? client.commands : client; // Determina el objeto para manejar los módulos.
        const eventHandler = moduleType === 'command' ? 'set' : (modules && modules.once ? 'once' : 'on'); // Decide si usar 'set' para comandos o 'on'/'once' para eventos.

        modules.forEach(module => {
            // Añade comentarios específicos aquí para explicar el proceso de carga del módulo.
            handler[eventHandler](module.name, (...args) => module.execute(client, ...args)); // Ejecuta la función 'execute' de cada módulo y asigna comandos o eventos según sea necesario.
        });
    } catch (error) {
        console.error(`Error al cargar los módulos de ${moduleType}:`, error); // Maneja errores durante la carga de módulos.
    }
};


const init = async () => {  // Define una función asincrónica de inicialización.
    try {
        await loadModules('command', 'comandos');  // Carga los módulos de comandos.
        await loadModules('event', 'eventos');  // Carga los módulos de eventos.

        const token = process.env.TOKEN;  // Obtiene el token desde las variables de entorno.
        if (!token) {
            throw new Error("El token no está definido en el archivo .env.");  // Lanza un error si el token no está definido.
        }
        await client.login(token);
    } catch (error) {
        console.error("Error durante la inicialización:", error);  // Maneja errores durante la inicialización.
        process.exit(1);  // Sale del proceso con un código de error.
    }
};

init();  // Llama a la función de inicialización al ejecutar el script.

module.exports = { client }; // Exporta el cliente para que pueda ser utilizado en otros archivos

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
