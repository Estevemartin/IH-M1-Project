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
    // document.getElementById('cards-test').innerHTML=dataSet[1].property_id;
    console.log(dataSet[3])

    let result = dataSet.slice(0,30).map((element,index)=>{
      let title=element.address.line;
      let nBaths=rndBetween(1,4);
      let nHabs=rndBetween(1,4);
      let surface=rndBetween(40,300);
      let profit=rndBetween(3,18);
      let price=rndBetween(80000,28000);
      let downpayment=0.2*price;
      let income=rndBetween(500,3000);
      let expenses=0.35*income;
      let balance=income-expenses;
      let mainPicture=element.photos[0].href
      returnElement ={
        title:title,
        nBaths:nBaths,
        nHabs:nHabs,
        surface:surface,
        profit:profit,
        downpayment:downpayment.toFixed(0),
        price:price,
        income:income,
        expenses:expenses.toFixed(0),
        balance:balance.toFixed(0),
        mainPicture:mainPicture
      };
      return returnElement;
    })

    let stringToPrint="";

    result.map(element=>{
      stringToPrint+=`<!-- TARJETA A RELLENAR CON JS -->
      <div class = "card panel" onclick='selectProperty(this)'><div class="img-card-container">
              <img src="`+element.mainPicture+`">
      </div><!-- CARD(CENTRAL) --><div class="card-central"><div class="cc-main"><div class="cc-main-sub"><div class="top-tag-label-rentabilidad">Rentabilidad</div>
                      <div class="tag font-green top-card-tag tag-short">
                          `+element.profit+`%
                      </div>
                  </div>
                  <div class="cc-main-sub">
                      <div class="top-tag-label-capital-inicial">Capital Inicial</div>
                      <div class="tag font-green top-card-tag tag-long">
                      `+element.downpayment+` €
                      </div>
                  </div>
                  <div class="cc-main-sub">
                      <div class="top-tag-label-precio-inmueble">Precio Inmueble</div>
                      <div class="tag font-green tag-long">
                      `+element.price+` €
                      </div>
                  </div>
              </div>
              <div class="cc-details">
                  <div class="cc-details-icons">
                      <i class="fas fa-bed"></i>
                      `+element.nHabs+`
                      <i class="fas fa-bath"></i>
                      `+element.nBaths+`
                      <i class="fas fa-ruler-combined"></i>
                      `+element.surface+`m<sup>2</sup>
                  </div>
              </div>
              <div class="cc-title">
              `+element.title+`
              </div>
              <div class="cc-info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique diam pretium est hendrerit, nec varius velit bibendum. Etiam gravida nibh sit amet metus ultricies lacinia.
              </div>
          </div>
          <!-- CARD(RIGHT) -->
          <div class="card-right">
              <b>Analisis Mensual</b>
              <div class="cr-container">
                  <div class="cr-tags">
                      <div class="white-card-tag">Ingresos</div>
                      <div class="white-card-tag">Gastos</div>
                      <div class="white-card-tag">Balance</div>
                  </div>
                  <div class="cr-amounts">
                      <div class="tag font-blue">+`+element.income+`€</div>
                      <div class="tag font-red">-`+element.expenses+`€</div>
                      <div class="tag font-green">+`+element.balance+`€</div>
                  </div>
              </div>
          </div>
      </div>
      <!-- FIN TARJETA A RELLENAR CON JS -->`;
    })
    document.getElementsByClassName("cards-container")[0].innerHTML=stringToPrint;
  }

  function rndBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min).toFixed(0);
}
const properties = collectProperties();
// console.log(dataSet)
// console.log(properties)




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

// MUESTRA LA RENTABILIDAD MINIMA SELECCIONADA
updateRentabilidadMinima=(rentabilidadMnima)=>{
  document.getElementById("display-rentabilidad-minima").innerHTML = rentabilidadMnima + "%";
}

// SELECCIONA UNA PROPIEDAD AL HACER CLICK EN ELLA
selectProperty=(propertyCard)=>{
  // Get all Cards
  let allCards=document.getElementsByClassName("card panel")
  console.log(allCards)

  
  if (propertyCard.classList.contains('active-card')){
    //Si el elemento seleccionado tiene la clase, se le quita.
    propertyCard.classList.remove('active-class')
  } else{
    // Remove 'active-card' class from every element
    for (cardId=0;cardId<allCards.length;cardId++){
      console.log(allCards[cardId].classList.contains('active-card'))
      if (allCards[cardId].classList.contains('active-card')){
        allCards[cardId].classList.remove('active-card');
      }
    }
    //Si el elemento seleccionado no tiene la clase, se le transifere la calse.
    propertyCard.classList.add('active-card');
  }

  

  //
  
  
  // console.log(allCards)
  // console.log(propertyCard.style.backgroundColor="#a8a7a7");
}

