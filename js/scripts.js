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

    let result = dataSet.slice(1,30).map((element,index)=>{
        let propertyId=element.listing_id;
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
        let mainPicture=element.photos[0].href;
        let city=element.address.city;

        returnElement ={
            propertyId:propertyId,
            title:title,
            nBaths:nBaths,
            nHabs:nHabs,
            surface:surface,
            profit:profit,
            downpayment:downpayment.toFixed(0),
            price:price,
            income:income,
            city:city,
            expenses:expenses.toFixed(0),
            balance:balance.toFixed(0),
            mainPicture:mainPicture
        };

        return returnElement;
    })

    //GET FILTERS VARIABLES
    let maxDownPayment=Number(document.getElementById("max-price").value);
    let minimumProfit=Number(document.getElementById("minimum-profit").value);
    let selectedCity=document.getElementById("city-selector").value;

    //GET AUXILIAR VARIABLES
    let stringToPrint="";
    let regions=[];

    //INSERT "All Regions" OPTION INTO SELECT
    document.getElementById("city-selector").innerHTML="";
    let selectorCiudades = document.getElementById("city-selector");
    let allCitiesOption = document.createElement("Option");
    allCitiesOption.value = "All Regions";
    allCitiesOption.innerHTML="All Regions";
    selectorCiudades.appendChild(allCitiesOption)

    //INSTER CITY NAMES INTO SELECT  
    result.slice(1,30).map(function(element){
      if (regions.includes(element.city)===false){
        regions.push(element.city);
        let newCity = document.createElement("Option");
        newCity.value = element.city;
        newCity.innerHTML=element.city;
        selectorCiudades.appendChild(newCity)
      }
    });
    document.getElementById("city-selector").value = selectedCity;
   


    result.filter(element=>{
      //DISPLAY PROPERTIES THAT MATCH THE FILTERS
      if (filterMaxDownPayment(element.downpayment,maxDownPayment) && filterMinimumProfit(element.profit,minimumProfit) && filterCity(element.city,selectedCity)){
        return true;
      } else {
        return false;
      }

    }).sort(function(a,b){
      //SORT PROPERTIES ACCORDING TO SORTING CRITERIA
      let sortMethod=document.getElementById("sort-method-selector").value;
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
      //PLOT PROPERTIES INTO THE HTML FILE
      stringToPrint+=`<!-- TARJETA A RELLENAR CON JS --><div class = "card panel" onclick='selectProperty(this)'><div class="img-card-container"><img src="`+element.mainPicture+`">
      </div><!-- CARD(CENTRAL) --><div class="card-central"><div class="cc-main"><div class="cc-main-sub"><div class="top-tag-label-rentabilidad">Rentabilidad</div>
      <div class="tag font-green top-card-tag tag-short">`+element.profit+`%</div></div><div class="cc-main-sub "><div class="top-tag-label-capital-inicial">Capital Inicial</div>
      <div class="tag font-green top-card-tag tag-long">`+element.downpayment+` €</div></div><div class="cc-main-sub cc-main-sub-capital-inicial"><div class="top-tag-label-precio-inmueble ">
      Precio Inmueble</div><div class="tag font-green tag-long">`+element.price+` €</div></div></div><div class="cc-details"><div class="cc-details-icons"><i class="fas fa-bed"></i>
      `+element.nHabs+`<i class="fas fa-bath"></i>`+element.nBaths+`<i class="fas fa-ruler-combined"></i>`+element.surface+`m<sup>2</sup></div></div><div class="cc-title">
      `+element.title+` | `+element.city+`</div><div class="cc-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique diam pretium est hendrerit, nec varius velit bibendum. Etiam gravida nibh sit amet metus ultricies lacinia.
      </div></div><!-- CARD(RIGHT) --><div class="card-right"><b>Analisis Mensual</b><div class="cr-container"><div class="cr-tags"><div class="white-card-tag">Ingresos</div>
      <div class="white-card-tag">Gastos</div><div class="white-card-tag">Balance</div></div><div class="cr-amounts"><div class="tag font-blue">+`+element.income+`€</div>
      <div class="tag font-red">-`+element.expenses+`€</div><div class="tag font-green">+`+element.balance+`€</div></div></div></div></div><!-- FIN TARJETA A RELLENAR CON JS -->`;
    })
    let paginationStr = `<div class="pagination"><a><p>1</p></a><a><p>2</p></a><a><p>3</p></a><a><p>4</p></a><a><p>5</p></a></div>`;
    document.getElementsByClassName("cards-container")[0].innerHTML=paginationStr+stringToPrint;
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

  function filterCity(currCity,selectedCity){
    if (currCity===selectedCity || selectedCity==="All Regions"){return true;}else{return false;}
  }

  const properties = collectProperties();


