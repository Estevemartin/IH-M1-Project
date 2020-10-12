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
    console.log(dataSet)

    let result = dataSet.slice(1,30).map((element,index)=>{
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
    let maxDownPayment=Number(document.getElementById("max-price").value);
    let minimumProfit=Number(document.getElementById("minimum-profit").value);
    // let sortMethod=Number(document.getElementById("sort-method-selector").value);
    // console.log(maxDownPayment);
    // console.log(maxDownPayment);
    


    result.filter(element=>{
      if (filterMaxDownPayment(element.downpayment,maxDownPayment) && filterMinimumProfit(element.profit,minimumProfit)){return true;} else {return false;}
    }).sort(function(a,b){
      let sortMethod=document.getElementById("sort-method-selector").value;
      console.log(sortMethod)
        switch (sortMethod){

          // case "Mayor Rentabilidad":if(a.profit>b.profit){return 1;} else {return -1;}break;
          // case "Menor Capital Inicial":if(a.downpayment<b.downpayment){return 1;} else {return -1;}break;
          // case "Menor Precio del Inmueble":if(a.price<b.price){return 1;} else {return -1;}break;
          // case "Mayores Ingresos":if(a.income>b.income){return 1;} else {return -1;}break;
          // case "Menores Gastos":if(a.expenses<b.expenses){return 1;} else {return -1;}break;
          // case "Mayor Balance":if(a.balance<b.balance){return 1;} ;if(a.balance>b.balance) {return -1;}break;

          case "Mayor Rentabilidad":return b.profit-a.profit;
          case "Menor Capital Inicial":return a.downpayment-b.downpayment;
          case "Menor Precio del Inmueble":return a.price-b.price;
          case "Mayores Ingresos":return b.income-a.income;
          case "Menores Gastos":return a.expenses-b.expenses;
          case "Mayor Balance":return b.balance-a.balance;
        }
    }).map(element=>{
      stringToPrint+=`<!-- TARJETA A RELLENAR CON JS -->
      <div class = "card panel" onclick='selectProperty(this)'><div class="img-card-container">
              <img src="`+element.mainPicture+`">
      </div><!-- CARD(CENTRAL) --><div class="card-central"><div class="cc-main"><div class="cc-main-sub"><div class="top-tag-label-rentabilidad">Rentabilidad</div>
                      <div class="tag font-green top-card-tag tag-short">
                          `+element.profit+`%
                      </div>
                  </div>
                  <div class="cc-main-sub ">
                      <div class="top-tag-label-capital-inicial">Capital Inicial</div>
                      <div class="tag font-green top-card-tag tag-long">
                      `+element.downpayment+` €
                      </div>
                  </div>
                  <div class="cc-main-sub cc-main-sub-capital-inicial">
                      <div class="top-tag-label-precio-inmueble ">Precio Inmueble</div>
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

  function filterMinimumProfit(curProfit,minProfit){
    if (curProfit>minProfit){return true;}else{return false;}
  }

  function filterMaxDownPayment(curDP,maxDP){
    if (maxDP===0){return true;}else{if(curDP>maxDP){return false;} else {return true}}
    
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

showHideMenu=()=>{
  let element = document.getElementById("mobile-menu")
  console.log(element.style.display);
  if(element.style.display==="none" || element.style.display===""){
    element.style.display="inline";
  } else{
    element.style.display="none";
  }
}

showHideFilters =()=>{
  console.log('clicked');
  let cardsContainer=document.getElementById("cards-container");
  let filtrosContainer = document.getElementById("filtros");
  // let filtersContainer= document.getElementById("perfil");
  // console.log(cardsContainer.style.display);
  // console.log(filtrosContainer.style.display);
  // console.log(filtrosContainer.style.display);
  console.log ("Display Cards: "+ cardsContainer.style.display + "   | Display Filters: "+filtrosContainer.style.display)
  if(filtrosContainer.style.display==="none" || filtrosContainer.style.display===""){
    console.log("Gonna Display Only Filters")
    cardsContainer.style.display="none";
    filtrosContainer.style.display="flex";
    // filtersContainer.style.display="inline-block";
  } else{
    console.log("Gonna Display Only Cards")
    cardsContainer.style.display="block";
    filtrosContainer.style.display="none";
    // filtersContainer.style.display="none";
  }

}

// SELECCIONA UNA PROPIEDAD AL HACER CLICK EN ELLA
selectProperty=(propertyCard)=>{
  // Get all Cards
  let allCards=document.getElementsByClassName("card panel")
  // console.log(allCards)

  
  if (propertyCard.classList.contains('active-card')){
    //Si el elemento seleccionado tiene la clase, se le quita.
    propertyCard.classList.remove('active-class')
  } else{
    // Remove 'active-card' class from every element
    for (cardId=0;cardId<allCards.length;cardId++){
      // console.log(allCards[cardId].classList.contains('active-card'))
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

