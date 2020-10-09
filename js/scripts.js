// CONNECT TO API

let getProperties = async ()=> {
    try {
      let response= await fetch("https://find-your-asset.herokuapp.com/properties");
      let properties = await response.json();
        return properties;
    }catch{
      err=>console.log(err);
    }
  }
  
const collectProperties = async () =>{
    const dataSet = await getProperties();
    document.getElementById('cards-test').innerHTML=dataSet[1].property_id;
}


const properties = collectProperties();
console.log(dataSet)
console.log(properties)




// class property {
//     constructor(id,beds,city,country,state,neighborhood,rent,baths,name,pics){
//         this.id = id;
//         this.name=name;
//         this.beds=beds;
//         this.baths = baths;
//         this.city = city;
//         this.rent = rent;
//         this.pics=pics;

//     }
// }