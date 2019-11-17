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

Linux :  commando `mongorestore -d padeldb `carpeta donde se situa el proyecto `/padeldb`

Windows : Copiamos la carpeta padeldb del proyecto en donde tenemos instalado mongo (mongodb/bin) una vez en bin pulsamos el ejecutable `mongorestore`



### Ejecución


Linux: abrir una terminal y escribir el comando mongod.

Windows: Hay que lanzar el daemon de mongoDB. Este se encuentra en mongoDB/Server/4.2/bin/mongod.

Después habría que ejecutar el siguiente comando :

`cd PadelGest`

`npm start`

No es necesario volver a ejecutar el proyecto cada vez que se realiza un cambio porque ya se hace automáticamente utilizando Nodemon.

Abrimos un navegador con `localhost:3000`




