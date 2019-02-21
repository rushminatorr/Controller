'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'production';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

const dbPath = getDbPath();
try {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { mode: 0o744 });
  }
} catch (e) {
  console.log("Cannot initialize DB folder");
  process.exit(1);
}

config.storage = path.resolve(dbPath, config.storage);
console.log(dbPath);
console.log(config.storage);

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const createUmzug = (path) => {
  return new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    logging: false,
    migrations: {
      params: [
        sequelize.getQueryInterface(),
        Sequelize,
      ],
      path,
      pattern: /\.js$/
    },
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.migrate = () => createUmzug(path.resolve(__dirname, '../migrations')).up();
db.seed = () => createUmzug(path.resolve(__dirname, '../seeders')).up();

function getDbPath() {
  let dbPath;

  if (os.type() === 'Linux') {
    dbPath = '/var/lib/iofog-controller/';
  } else if (os.type() === 'Darwin') {
    dbPath = '/var/lib/iofog-controller/';
  } else if (os.type() === 'Windows_NT') {
    dbPath = `${process.env.APPDATA}` + '\\iofog-controller\\';
  } else {
    throw new Error("Unsupported OS found: " + os.type());
  }

  return dbPath;
}

module.exports = db;
