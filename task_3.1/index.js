'use strict';

function Vehicle(id, name, producted) {
  this.id = id;
  this.name = name;
  this.producted = producted;

  this.setName = (name) => {
    this.name = name;
  };

  this.toString = () => {
    return this.id + '\t' + this.name + '\t' + this.producted;
  };
}

const vehicle = new Vehicle(1, 'Ok-Bubble', new Date());

Object.defineProperty(vehicle, 'name', {
  writable: false,
  configurable: false,
});

// Приклад зі створенням ще одного екземпляру з прототипом старого (Приклад який можливо було використати раніше)
// Спробував різні варіанти використання методів, окрім seal та freeze (Далі в класі)

const vehicleModified = Object.create(vehicle, {
  company: {
    value: 'MyCompany',
    enumerable: true,
    writable: false,
    configurable: false,
  },
  gps: {
    value: true,
    enumerable: true,
    writable: true,
    configurable: true,
  },
});

vehicleModified.company = 'BMW';
vehicleModified.gps = false;
vehicleModified.__proto__.name = 'New Name';

delete vehicleModified.company;
delete vehicleModified.gps;

console.log(vehicleModified);

// Class instanse

// Якщо прагнути використовувати модифікатори доступу потрібно через _ писати проперті
class VehicleClass {
  constructor(id, name, producted) {
    this._id = id;
    this._name = name;
    this._producted = producted;
  }

  set id(newId) {
    this._id = newId;
  }
  get id() {
    return this._id;
  }

  setName(name) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  toString() {
    return this._id + '\t' + this._name + '\t' + this._producted;
  }
}

const vehicleClass = new VehicleClass(1, 'Ok-Bubble', new Date());

// Якщо все заморозити!
// Object.freeze(vehicleClass);

// Окремі випадки для властивостей
Object.defineProperty(vehicleClass, '_name', {
  writable: false,
  configurable: false,
});

// vehicleClass.setName('Charly WS');
vehicleClass.id = 13;

console.log(vehicleClass);
