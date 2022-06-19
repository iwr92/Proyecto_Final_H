const express = require("express");
const cors = require("cors");
const sequelize = require("../database/config");
const fileUpload = require('express-fileupload');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      // https://barbarapp.herokuapp.com
      auth: "/api/auth",
      usuarios: "/api/users",
      rol: "/api/rol",
      products: "/api/products",
      services: "/api/services",
      categories: "/api/categories",
      date: "/api/date",
      employee: "/api/employee",
      purchaseOrder: "/api/purchaseOrder",
      pago: "/api/pago",
      favorite: "/api/favorite",
      resetPassword: "/api/resetPassword",
      upload: '/api/upload'
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    try {
      await sequelize.authenticate();

      // await sequelize.sync({ force: true }); //para pruebas descoment!!!

    } catch (error) {
      console.log(error);
    }
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));

    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.rol, require("../routes/roles"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.services, require("../routes/services"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.date, require("../routes/date"));
    this.app.use(this.paths.employee, require("../routes/employee"));
    this.app.use(this.paths.purchaseOrder, require("../routes/purchaseOrder"));
    this.app.use(this.paths.pago, require("../routes/pago"));
    this.app.use(this.paths.favorite, require("../routes/favorite"));
    this.app.use(this.paths.resetPassword, require("../routes/resetPassword"));
    this.app.use(this.paths.upload, require("../routes/upload"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`listen in port ${this.port}`);
    });
  }
}

module.exports = Server;
