# PADELGEST

### Instalación

* #### NodeJS

Descarga de NodeJs a partir del siguiente enlace: 

<https://nodejs.org/en/download/>



* #### ExpressJS

Instalación de ExpressJS como dependencia utilizando el gestor de paquetes 

` cd PadelGest `

`npm install express -save`



+ #### MongoDB

Descarga de MongoDB a partir del siguiente enlace:

<https://docs.mongodb.com/manual/administration/install-community/>



+ #### Dependencias

Para la instalación de las demás dependencias del proyecto hay que ejecutar el comando:

`cd PadelGest`

`npm install`

Es importante hacerlo después de cada cambio de otra persona para que descargue las dependencias añadidas y no de error en la ejecución.



### Importar base de datos

Linux :  

`cd PadelGest`

`mongorestore -d padeldb padeldb`

con eso dos comandos ya estaría importados los datos en la base de datos.

Windows : 

`C:\Program Files\MongoDB\Server\4.0\bin` o dónde sea que esté instalado mongo.

`mongorestore -d padeldb padeldb`



### Ejecución


Linux: abrir una terminal y escribir el comando mongod.

Windows: Hay que lanzar el daemon de mongoDB. Este se encuentra en mongoDB/Server/4.2/bin/mongod.

Después habría que ejecutar el siguiente comando :

`cd PadelGest`

`npm start`

No es necesario volver a ejecutar el proyecto cada vez que se realiza un cambio porque ya se hace automáticamente utilizando Nodemon.

Abrimos un navegador con `localhost:3000`

##### Usuarios de prueba

Para ver las funciones de administrador:

​	usuario: **admin**  

​	contraseña: **admin**

Para acceder como un deportista:

​	usuario: **adenore0**

​	contraseña: **iz4iCG**


lgerardi14

gtTxFY9J











