'use strict'

class Database {
  // recuperar los usuarios - el array
  getAllUsers = () => {
    const usersStr = localStorage.getItem("users");// recuperar el string
    const usersArr = JSON.parse( usersStr );// convertir el string a un array

    // si todavia no hay usuarios, devuelve un array vacio
    if (usersArr === null) {return [];} else {return usersArr;}
  }

  saveNewUser = (newUser) => {
    const usersArr = this.getAllUsers();// recuperar el array de los usuarios del localStorage
    usersArr.push(newUser);// actualizar el array de usuario
    const usersStr = JSON.stringify(usersArr);// convertir el array a un string
    localStorage.setItem("users", usersStr);// almacenar lo de nuevo
  }
}
const db = new Database();

class propertyDataBase{
    getData=()=>{
      const dataStr = localStorage.getItem("properties");
      const dataArr = JSON.parse(dataStr);
      if (dataArr === null){return [];}else{return dataArr;}
    }
    savePropertyData = (dataFetch)=>{
      const dataStr = JSON.stringify(dataFetch);
      localStorage.setItem("properties",[]);
      localStorage.setItem("properties",dataStr);

    }
}
constr dbProp = new propertyDataBase();

// console.log('db', db)
