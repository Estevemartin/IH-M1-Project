
/*jshint -W033 */
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
  
const saveAllDataToLS = async()=>{
  const dataSet = await getProperties();
  const numberOfProperties = 49;
  let result = dataSet.slice(1,numberOfProperties).map((element,index)=>{
      let propertyId=element.listing_id;
      let title=element.address.line;
      let nBaths=rndBetween(1,4);
      let nHabs=rndBetween(1,4);
      let surface=rndBetween(40,300);
      let profit=rndBetween(3,18);
      let price=rndBetween(80,28)*1000;
      let downpayment=0.2*price;
      let income=rndBetween(50,300)*10;
      let expenses=0.35*income;
      income = income
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
          downpayment:numberToCurrency(downpayment.toFixed(0)),
          price:numberToCurrency(price),
          income:numberToCurrency(income),
          city:city,
          expenses:numberToCurrency(expenses.toFixed(0)),
          balance:numberToCurrency(balance.toFixed(0)),
          mainPicture:mainPicture
      };

      return returnElement;
  })

  localStorage.setItem("dataSet",JSON.stringify(result));

  //GET FILTERS VARIABLES
  let selectedCity=document.getElementById("city-selector").value;

  //GET AUXILIAR VARIABLES
  let regions=[];

  //INSERT "All Regions" OPTION INTO SELECT
  document.getElementById("city-selector").innerHTML="";
  let selectorCiudades = document.getElementById("city-selector");
  let allCitiesOption = document.createElement("Option");
  allCitiesOption.value = "All Regions";
  allCitiesOption.innerHTML="All Regions";
  selectorCiudades.appendChild(allCitiesOption)

  //INSTER CITY NAMES INTO SELECT  
  result.map(function(element){
    if (regions.includes(element.city)===false){
      regions.push(element.city);
    }
  });
  
  //LIST REGIONS AND OCCURRENCIES FOR EACH REGION
  const regionsCounted = regions.map(region=>{
    return region +" ("+result.filter(element=>{return (element.city===region)}).length+")";
  }).sort();

  //CREATE THE OPTION SELECT ELEMENT FOR EACH REGION AND EXTRACT THE NUMBER OF OCCURRENCES FROM VALUE
  regionsCounted.forEach(region=>{
    let newCity = document.createElement("Option");
      newCity.value = region.slice(0,region.indexOf("(")-1);
      newCity.innerHTML=region;
      selectorCiudades.appendChild(newCity)
  });

  // console.log(regionsCounted)
  document.getElementById("city-selector").value = selectedCity;
 
}
const tr=saveAllDataToLS();

const initialLoad = () => {
  const dataSet = JSON.parse(localStorage.getItem("dataSet"));

  let stringToPrint="";
  const numPages =countPagesNeeded(dataSet)
  dataSet.sort(function(a,b){return b.profit-a.profit;}).slice(1,11).map(
    element=>{
    //PLOT PROPERTIES INTO THE HTML FILE
    stringToPrint+=getCardStr(element)
  });
  
  let detailsSection = document.getElementById("details-container")
  // detailsSection.style.display="flex";


  const paginationStr = createPagination(numPages,1)
  document.getElementsByClassName("cards-container")[0].innerHTML=paginationStr+stringToPrint;
}
document.addEventListener('load',initialLoad())

const plotCurrentPageProperties =(firstPropertyToPrint)=>{
  //USE THIS FUNCTION WITH THE PAGES NUMBERS
  // console.log(document.getElementById('pagination').getElementsByClassName("active-page")[0].textContent)
  const currentPage=document.getElementById('pagination').getElementsByClassName("active-page")[0].textContent;
  
  // console.log("Current Page: ",currentPage)
  const dataSet = JSON.parse(localStorage.getItem("currentDataSet"));
  // console.log("Data Set About to be Shown: ",dataSet)
  let stringToPrint="";
  // let firstPropertyToPrint = getFirstPropertyToPrint(currentPage);
  // console.log("First Property To Print: ",firstPropertyToPrint)
  // console.log(dataSet)
  /////////////////////////////////////PROBLEMA CON EL SLICE 
  // console.log(dataSet.slice(8,10))
  if (firstPropertyToPrint===null||firstPropertyToPrint===undefined){firstPropertyToPrint=0;}
  dataSet.slice(firstPropertyToPrint,firstPropertyToPrint+10).map(element=>{
    // console.log("Inside the map")
    stringToPrint+=getCardStr(element)
  });

  let paginationStr = createPagination(countPagesNeeded(dataSet),currentPage);
  document.getElementsByClassName("cards-container")[0].innerHTML=paginationStr+stringToPrint;
}
plotCurrentPageProperties(1)

function saveCurrentFilteredData (){
  //USE THIS FUNCTION WITH "BUSCAR" BUTTON UNDER THE FILTERS
  const dataSet = JSON.parse(localStorage.getItem("dataSet"));
  //GET FILTERS VARIABLES
  let maxDownPayment=Number(document.getElementById("max-price").value);
  let minimumProfit=Number(document.getElementById("minimum-profit").value);
  let selectedCity=document.getElementById("city-selector").value;
  // console.log("Main Data Set: ",dataSet)

  if (window.screen.width <= 650){showHideFilters()}
  
  const currentData=dataSet.filter(element=>{
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
      case "Mayor Rentabilidad":return b.profit-a.profit;
      case "Menor Capital Inicial":return a.downpayment-b.downpayment;
      case "Menor Precio del Inmueble":return a.price-b.price;
      case "Mayores Ingresos":return b.income-a.income;
      case "Menores Gastos":return a.expenses-b.expenses;
      case "Mayor Balance":return b.balance-a.balance;
    }
  })
  // console.log("Main Data Set Filtered and About to be Saved: ",currentData)
  localStorage.setItem("currentDataSet",JSON.stringify(currentData));
  
  plotCurrentPageProperties();
}

// const collectProperties = async () =>{
//     const dataSet = await getProperties();

//     let result = dataSet.slice(1,30).map((element,index)=>{
//         let propertyId=element.listing_id;
//         let title=element.address.line;
//         let nBaths=rndBetween(1,4);
//         let nHabs=rndBetween(1,4);
//         let surface=rndBetween(40,300);
//         let profit=rndBetween(3,18);
//         let price=rndBetween(80000,28000);
//         let downpayment=0.2*price;
//         let income=rndBetween(500,3000);
//         let expenses=0.35*income;
//         let balance=income-expenses;
//         let mainPicture=element.photos[0].href;
//         let city=element.address.city;

//         returnElement ={
//             propertyId:propertyId,
//             title:title,
//             nBaths:nBaths,
//             nHabs:nHabs,
//             surface:surface,
//             profit:profit,
//             downpayment:downpayment.toFixed(0),
//             price:price,
//             income:income,
//             city:city,
//             expenses:expenses.toFixed(0),
//             balance:balance.toFixed(0),
//             mainPicture:mainPicture
//         };

//         return returnElement;
//     })

//     //GET FILTERS VARIABLES
//     let maxDownPayment=Number(document.getElementById("max-price").value);
//     let minimumProfit=Number(document.getElementById("minimum-profit").value);
//     let selectedCity=document.getElementById("city-selector").value;

//     //GET AUXILIAR VARIABLES
//     let stringToPrint="";
//     let regions=[];

//     //INSERT "All Regions" OPTION INTO SELECT
//     document.getElementById("city-selector").innerHTML="";
//     let selectorCiudades = document.getElementById("city-selector");
//     let allCitiesOption = document.createElement("Option");
//     allCitiesOption.value = "All Regions";
//     allCitiesOption.innerHTML="All Regions";
//     selectorCiudades.appendChild(allCitiesOption)

//     //INSTER CITY NAMES INTO SELECT  
//     result.slice(1,30).map(function(element){
//       if (regions.includes(element.city)===false){
//         regions.push(element.city);
//         let newCity = document.createElement("Option");
//         newCity.value = element.city;
//         newCity.innerHTML=element.city;
//         selectorCiudades.appendChild(newCity)
//       }
//     });
//     document.getElementById("city-selector").value = selectedCity;
   


//     result.filter(element=>{
//       //DISPLAY PROPERTIES THAT MATCH THE FILTERS
//       if (filterMaxDownPayment(element.downpayment,maxDownPayment) && filterMinimumProfit(element.profit,minimumProfit) && filterCity(element.city,selectedCity)){
//         return true;
//       } else {
//         return false;
//       }

//     }).sort(function(a,b){
//       //SORT PROPERTIES ACCORDING TO SORTING CRITERIA
//       let sortMethod=document.getElementById("sort-method-selector").value;
//       switch (sortMethod){

//         // case "Mayor Rentabilidad":if(a.profit>b.profit){return 1;} else {return -1;}break;
//         // case "Menor Capital Inicial":if(a.downpayment<b.downpayment){return 1;} else {return -1;}break;
//         // case "Menor Precio del Inmueble":if(a.price<b.price){return 1;} else {return -1;}break;
//         // case "Mayores Ingresos":if(a.income>b.income){return 1;} else {return -1;}break;
//         // case "Menores Gastos":if(a.expenses<b.expenses){return 1;} else {return -1;}break;
//         // case "Mayor Balance":if(a.balance<b.balance){return 1;} ;if(a.balance>b.balance) {return -1;}break;

//         case "Mayor Rentabilidad":return b.profit-a.profit;
//         case "Menor Capital Inicial":return a.downpayment-b.downpayment;
//         case "Menor Precio del Inmueble":return a.price-b.price;
//         case "Mayores Ingresos":return b.income-a.income;
//         case "Menores Gastos":return a.expenses-b.expenses;
//         case "Mayor Balance":return b.balance-a.balance;
//       }

//     }).map(element=>{
//       //PLOT PROPERTIES INTO THE HTML FILE
//       stringToPrint+=`<!-- TARJETA A RELLENAR CON JS --><div class = "card panel" onclick='selectProperty(this)'><div class="img-card-container"><img src="`+element.mainPicture+`">
//       </div><!-- CARD(CENTRAL) --><div class="card-central"><div class="cc-main"><div class="cc-main-sub"><div class="top-tag-label-rentabilidad">Rentabilidad</div>
//       <div class="tag font-green top-card-tag tag-short">`+element.profit+`%</div></div><div class="cc-main-sub "><div class="top-tag-label-capital-inicial">Capital Inicial</div>
//       <div class="tag font-green top-card-tag tag-long">`+element.downpayment+` €</div></div><div class="cc-main-sub cc-main-sub-capital-inicial"><div class="top-tag-label-precio-inmueble ">
//       Precio Inmueble</div><div class="tag font-green tag-long">`+element.price+` €</div></div></div><div class="cc-details"><div class="cc-details-icons"><i class="fas fa-bed"></i>
//       `+element.nHabs+`<i class="fas fa-bath"></i>`+element.nBaths+`<i class="fas fa-ruler-combined"></i>`+element.surface+`m<sup>2</sup></div></div><div class="cc-title">
//       `+element.title+` | `+element.city+`</div><div class="cc-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique diam pretium est hendrerit, nec varius velit bibendum. Etiam gravida nibh sit amet metus ultricies lacinia.
//       </div></div><!-- CARD(RIGHT) --><div class="card-right"><b>Analisis Mensual</b><div class="cr-container"><div class="cr-tags"><div class="white-card-tag">Ingresos</div>
//       <div class="white-card-tag">Gastos</div><div class="white-card-tag">Balance</div></div><div class="cr-amounts"><div class="tag font-blue">+`+element.income+`€</div>
//       <div class="tag font-red">-`+element.expenses+`€</div><div class="tag font-green">+`+element.balance+`€</div></div></div></div></div><!-- FIN TARJETA A RELLENAR CON JS -->`;
//     })
//     let paginationStr = `<div class="pagination"><a><p>1</p></a><a><p>2</p></a><a><p>3</p></a><a><p>4</p></a><a><p>5</p></a></div>`;
//     document.getElementsByClassName("cards-container")[0].innerHTML=paginationStr+stringToPrint;
//   }
  function rndBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min).toFixed(0);
  }
  function filterMinimumProfit(curProfit,minProfit){
    if (curProfit>=minProfit){return true;}else{return false;}
  }
  function filterMaxDownPayment(curDP,maxDP){
    if (maxDP===0){return true;}else{if(curDP>maxDP){return false;} else {return true}}
  }
  function filterCity(currCity,selectedCity){
    if (currCity===selectedCity || selectedCity==="All Regions"){return true;}else{return false;}
  }
  function countPagesNeeded(dataSet){
    // console.log(dataSet.length)
    if (dataSet===null){return 1;}
    if (dataSet.length<10){
      return 1;
    } else{
      const numPages = Number((dataSet.length).toString(10).slice(0,1))
    return numPages +1;
    }
  }
  function createPagination(numPages,activePage){
    let paginationStr = `<div class="pagination" id="pagination">`;
    // console.log("Page to be Active: ",activePage)
    for (i=1;i<=numPages;i++){
      if (i===Number(activePage)){
        paginationStr+=`<a class="active-page" onclick=getSelectedPage(this)><p>`+i+`</p></a>`;
      } else {
        paginationStr+=`<a  onclick=getSelectedPage(this)><p>`+i+`</p></a>`;
      }
    }
    paginationStr+=`</div>`;
    // console.log(paginationStr)
    return paginationStr;
  }
  function getFirstPropertyToPrint(currentPage){
    // if (Number(currentPage)===1){
    //   return 1;
    // } else {
      let firstProp = (currentPage-1)*10;
      return firstProp
    // }
  }
  function getCardStr(element){
    return `<!-- TARJETA A RELLENAR CON JS --><div class = "card panel" onclick='selectProperty(this)'><div class="property-id">`+element.propertyId+`</div><div class="img-card-container"><img src="`+element.mainPicture+`">
    </div><!-- CARD(CENTRAL) --><div class="card-central"><div class="cc-main"><div class="cc-main-sub"><div class="top-tag-label-rentabilidad">Rentabilidad</div>
    <div class="tag font-green top-card-tag tag-short">`+element.profit+`%</div></div><div class="cc-main-sub "><div class="top-tag-label-capital-inicial">Capital Inicial</div>
    <div class="tag font-green top-card-tag tag-long">`+element.downpayment+`</div></div><div class="cc-main-sub cc-main-sub-capital-inicial"><div class="top-tag-label-precio-inmueble ">
    Precio Inmueble</div><div class="tag font-green tag-long">`+element.price+`</div></div></div><div class="cc-details"><div class="cc-details-icons"><i class="fas fa-bed"></i>
    `+element.nHabs+`<i class="fas fa-bath"></i>`+element.nBaths+`<i class="fas fa-ruler-combined"></i>`+element.surface+`m<sup>2</sup></div></div><div class="cc-title">
    `+element.title+` | `+element.city+`</div><div class="cc-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique diam pretium est hendrerit, nec varius velit bibendum. Etiam gravida nibh sit amet metus ultricies lacinia.
    </div></div><!-- CARD(RIGHT) --><div class="card-right"><b>Analisis Mensual</b><div class="cr-container"><div class="cr-tags"><div class="white-card-tag">Ingresos</div>
    <div class="white-card-tag">Gastos</div><div class="white-card-tag">Balance</div></div><div class="cr-amounts"><div class="tag font-blue">+`+element.income+`</div>
    <div class="tag font-red">-`+element.expenses+`</div><div class="tag font-green">+`+element.balance+`</div></div></div></div></div><!-- FIN TARJETA A RELLENAR CON JS -->`;
  }
  function getSelectedPage(element){
    let selectedPage=element.textContent;
    let pagination=element.parentElement
    // console.log(pagination.getElementsByTagName('a').length)
    for (i=0;i<pagination.getElementsByTagName('a').length;i++){
      let page = pagination.getElementsByTagName('a')[i]
      if (page.classList.contains('active-page')){
        page.classList.remove('active-page');
      }
      if (page.textContent===selectedPage){
        page.classList.add('active-page')
      }
    }

    let firstPropertyToPrint = (Number(selectedPage)-1)*10;
    // console.log(firstPropertyToPrint)

    plotCurrentPageProperties(firstPropertyToPrint);
  }
  function numberToCurrency(number){
    // console.log(number)
    result = new Intl.NumberFormat("de-DE" ,{style: "currency", currency: "EUR"}).format(number)
    // console.log(result)
    result=result.slice(0,result.indexOf(","))+result.slice(result.indexOf(",")+3,100)
    return result
  }
  function currencyToNumber(number){
    // console.log("Inside currencyToNumber: ",number)

    if (typeof number === "number" || number.indexOf(" ")===-1){
      result = Number(number);
    } else {
      console.log(number.indexOf(" "))
      result= Number(number.slice(0,number.indexOf(" ")-1).replace(".",""));
    }
   return result;
  }

  function fillDetails(propertyId){
    const dataSet = JSON.parse(localStorage.getItem("currentDataSet"));
    const prop=dataSet.filter(data=>{return data.propertyId===propertyId})
    

    rellenarDetails(prop)


  }
  

  // function getNumber(element,valor,esPorcentaje){
   
  //   // // console.log("Inicio de getNumber => localeName: "+element.localName+" | Es porcentaje: " + esPorcentaje + " | Element: "+element)
  //   // if(element.localName==="input"){
  //   //   // console.log(element.value)
  //   //   if (esPorcentaje===true){
  //   //     var number = Number(valor.value.replace(/\D/g,''))/100
  //   //   } else if(esPorcentaje===false) {
  //   //     var number = Number(valor.value.replace(/\D/g,''));
  //   //   }
  //   // } else if (element.localName!=="input"){
  //   //   // console.log(element.textContent)
  //   //   if (esPorcentaje===true){
  //   //     var number = Number(valor.textContent.replace(/\D/g,''))/100
  //   //   } else if(esPorcentaje===false) {
  //   //     //Caso 60m^2
  //   //     var number = Number(valor.textContent.replace(/\D/g,''));
  //   //   }
  //   // }

  //   try{
  //     if (esPorcentaje===true){
  //       var number = Number(valor.value.replace(/\D/g,''))/100
  //     } else if(esPorcentaje===false) {
  //       var number = Number(valor.value.replace(/\D/g,''));
  //     }
  //   } catch{
  //     if (esPorcentaje===true){
  //       var number = Number(valor.textContent.replace(/\D/g,''))/100
  //     } else if(esPorcentaje===false) {
  //       //Caso 60m^2
  //       var number = Number(valor.textContent.replace(/\D/g,''));
  //     }
  //   }


  //   // console.log("Fin de getNumber => localeName: "+element.localName+" | Es porcentaje: " + esPorcentaje + " | Number: "+number + " | Element: ",element)
  //   return number;
  // }

  

  function actualizarCalculos(){

  }


  function addEventListener(){
    // document.getElementById("details-rebaja-negociacion").addEventListener('onblur',actualizarCalculos())

  }

  // class parameter{
  //     constructor(name,elementId,value,esPorcentaje){
  //       // console.log("------START-----")
  //       // console.log(getNumber(value))
  //       // console.log(inputType)
  //       this.name=name;
        
  //       // console.log("Constrcutor Input Value: ", value)
  //       // console.log(inputType)
  //       // this.formType=formType;
  //       // console.log(value)
  //       this.element=document.getElementById(elementId);
  //       // console.log(getNumber(this.element,false))
  //       // console.log(element)
  //       // if (inputType === "%"){
  //       //   this.numericValue = value/100;
  //       //   this.unitsValue=value+"%";
  //       // }else if(inputType === "€"){
  //         // console.log("Value inside Constructor: ",value)
  //         // console.log(currencyToNumber(value))
  //       this.value = value;
  //         // this.numericValue = currencyToNumber(value);
  //         this.numericValue=getNumber(this.element,value,esPorcentaje)
  //         // this.unitsValue=numberToCurrency(this.numericValue);
  //         // console.log(this.numericValue ,this.unitsValue)
  //       // }
  //       // console.log(this.numericValue ,this.unitsValue)
  //       console.log(this)
  //     }

  //     // printInput(){
  //     //   this.element.value=this.numericValue
  //     // }

  //     // printText(){
  //     //   this.element.textContent=this.unitsValue
  //     // }

  //     print(){

  //       // // console.log(this)
  //       // if (this.element.localName==="b"){
  //       //   // ES UNA ETIQUETA Y SOLO HAY QUE MOSTRAR EL NUMERO Y UNIDADES
  //       //   this.element.textContent=this.unitsValue
  //       // } else if(this.element.localName==="input"){
  //       //   //ES UN INPUT
  //       //   // if (this.inputType==="%"){
  //       //   //   this.element.value=this.numericValue*100
  //       //   // } else {
  //       //     this.element.value=this.numericValue
  //       //   // }
          
  //       // }
  //     }


  //     getVariableFromElementId(elementId){
  //       //Get the value of the input or label contained in the ID.
  //       let element=document.getElementById(elementId)
  //       let result
  //       if (element.localName==="input"){
  //         result = element.value
  //       } else{
  //         result = element.textContent
  //       }
  //       if (element.classList.contains("percent")){
  //         result=result/100;
  //       }
  //       console.log(result)
  //       return result;
  //     }

  //     convertToNumber(variable){
  //       let result = variable.replace(/\D/g,'');
  //       this.numericValue=result;
  //       console.log(result)
  //       return result;
  //     }




  // }



  function rellenarDetails(prop){
    //HIPOTECA
    calcularPrecioOfertado(prop)
    calcularRebajaEnNegociacion()
    calcularPrecioDeCompra()
    calcularProcentajeFinanciadoDetails()
    calcularCapitalFinanciado()
    calcularCuotaMensual()
    calcularTotalHipoteca()
    calcularInteresesHipoteca()
    //GASTOS DE COMPRAVENTA
    calculateITP()
    // // console.log(getNumber("20%"))
    // // console.log(prop[0].price)
    // let precioOfertado = new parameter("precioOfertado","details-precio-ofertado",prop[0].price,false)
    // // precioOfertado.print()
    // // console.log(precioOfertado)
    // let porcentajeNegociacion = new parameter("porcentajeNegociacion","profile-rebaja-negociacion",document.getElementById("profile-rebaja-negociacion").value,true)
    // // console.log(porcentajeNegociacion)
    // // console.log(precioOfertado.numericValue)
    // // console.log(porcentajeNegociacion.numericValue)
    // // console.log(precioOfertado.numericValue*porcentajeNegociacion.numericValue)
    // let rebajaNegociacion = new parameter("rebajaNegociacion","details-rebaja-negociacion",precioOfertado.numericValue*porcentajeNegociacion.numericValue,false)
    // // rebajaNegociacion.print()
    // // console.log("precio Ofertado",precioOfertado.numericValue)
    // // console.log("rebaja negociacion",rebajaNegociacion.numericValue)
    // // console.log(precioOfertado.numericValue-rebajaNegociacion.numericValue)
    // let precioDeCompra = new parameter("precioDeCompra","details-precio-compra",precioOfertado.numericValue-rebajaNegociacion.numericValue,false)
    // // precioDeCompra.print()
    
    // let porcentajeFinanciado = new parameter("porcentajeFinanciado","details-porcentaje-financiado",document.getElementById("profile-porcentaje-financiado").value,true)
    // // porcentajeFinanciado.print()

    // let capitalAportado = new parameter("capitalAportado","details-capital-aportado",document.getElementById("profile-capital-aportado").value,false)
    // // console.log(capitalAportado)
    // // capitalAportado.print()

  }


  function calcularPrecioOfertado(prop){
    let price = prop[0].price;
    // console.log(price)
    document.getElementById("details-precio-ofertado").textContent = price;
  }
  
  function calcularRebajaEnNegociacion(){
    let porcentajeRebaja = Number(document.getElementById("profile-rebaja-negociacion").value)
    // console.log(porcentajeRebaja)
    let precioOfertado=document.getElementById("details-precio-ofertado").textContent
    // console.log(precioOfertado)
    let numeroPrecioOfertado = Number(precioOfertado.replace(/\D/g,''))
    // console.log(numeroPrecioOfertado)
    let importeRebaja = numeroPrecioOfertado * (porcentajeRebaja/100)
    // console.log(importeRebaja)
    document.getElementById("details-rebaja-negociacion").value = importeRebaja;
  }

  function calcularPrecioDeCompra(){
    let precioOfertado= document.getElementById("details-precio-ofertado").textContent
    // console.log(precioOfertado)
    let numeroPrecioOfertado = Number(precioOfertado.replace(/\D/g,''))
    // console.log(numeroPrecioOfertado)
    let importeRebaja= document.getElementById("details-rebaja-negociacion").value
    // console.log(precioOfertado)
    let numeroImporteRebaja = Number(importeRebaja.replace(/\D/g,''))
    // console.log(numeroImporteRebaja)
    let precioDeCompra = numeroPrecioOfertado-numeroImporteRebaja;
    // console.log(precioDeCompra)
    document.getElementById("details-precio-compra").textContent = numberToCurrency(precioDeCompra)
  }

  function calcularProcentajeFinanciadoDetails(){
    let porcentajeFinanciado = Number(document.getElementById("profile-porcentaje-financiado").value)
    // console.log(porcentajeFinanciado)
    document.getElementById("details-porcentaje-financiado").value = porcentajeFinanciado
  }

  function calcularCapitalFinanciado(){
    let precioDeCompra = document.getElementById("details-precio-compra").textContent;
    // console.log(precioDeCompra)
    let numeroPrecioDeCompra = Number(precioDeCompra.replace(/\D/g,''))
    // console.log(numeroPrecioDeCompra)
    let porcentajeFinanciado = Number(document.getElementById("details-porcentaje-financiado").value)/100
    // console.log(porcentajeFinanciado)
    let capitalFinanciado = numeroPrecioDeCompra*(1-porcentajeFinanciado)
    // console.log(capitalFinanciado)
    let printCapitalFinanciado = numberToCurrency(capitalFinanciado)
    // console.log(printCapitalFinanciado)
    document.getElementById("details-capital-financiado").textContent = printCapitalFinanciado
  }

  function calcularCuotaMensual(){
    let capitalFinanciado = document.getElementById("details-capital-financiado").textContent
    // console.log(capitalFinanciado)
    let numeroCapitalFinanciado = Number(capitalFinanciado.replace(/\D/g,''))
    // console.log(numeroCapitalFinanciado)
    let años = Number(document.getElementById("details-plazo-hipoteca").value)
    // console.log(años)
    let tae = Number(document.getElementById("details-tae").value/100)
    // console.log(tae)
    let cuotaMensual = (((numeroCapitalFinanciado*tae)/(1-(1+tae)**(-años)))/12).toFixed(2);
    // console.log(cuotaMensual)
    document.getElementById("details-cuota-mensual").textContent = numberToCurrency(cuotaMensual)
  }

  function calcularTotalHipoteca(){
    let capitalFinanciado = document.getElementById("details-capital-financiado").textContent
    // console.log(capitalFinanciado)
    let numeroCapitalFinanciado = Number(capitalFinanciado.replace(/\D/g,''))
    // console.log(numeroCapitalFinanciado)
    let años = Number(document.getElementById("details-plazo-hipoteca").value)
    // console.log(años)
    let tae = Number(document.getElementById("details-tae").value/100)
    // console.log(tae)
    let cuotaMensual = Number((((numeroCapitalFinanciado*tae)/(1-(1+tae)**(-años)))/12).toFixed(2));
    // console.log(cuotaMensual)
    let totalHipoteca = cuotaMensual*años*12;
    // console.log(TotalHipoteca);
    document.getElementById("details-total-hipoteca").textContent = numberToCurrency(totalHipoteca)
  }

  function calcularInteresesHipoteca(){
    let totalHipoteca = document.getElementById("details-total-hipoteca").textContent
    // console.log(totalHipoteca)
    let numberTotalHipoteca = Number(totalHipoteca.replace(/\D/g,''))
    // console.log(numberTotalHipoteca)
    let capitalFinanciado = document.getElementById("details-capital-financiado").textContent
    // console.log(capitalFinanciado)
    let numeroCapitalFinanciado = Number(capitalFinanciado.replace(/\D/g,''))
    // console.log(numeroCapitalFinanciado)
    let interesesHipoteca = numberTotalHipoteca-numeroCapitalFinanciado
    // console.log(interesesHipoteca)
    document.getElementById("details-intereses-hipoteca").textContent = numberToCurrency(interesesHipoteca)
  }

  function calculateITP(){
    
  }