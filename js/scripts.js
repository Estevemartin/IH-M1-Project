/*jshint -W033 */
  // function  startPage () { 
  //   console.log("pageloaded");
  //   initialLoad();
  //   // plotCurrentPageProperties(1);
  // }
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
  const initialLoad = async () => {
    console.log("pageloaded");
    const dataSet = JSON.parse(localStorage.getItem("dataSet"));
    await saveAllDataToLS()
    await saveCurrentFilteredData()
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
    await saveCurrentFilteredData()
  }
  document.addEventListener('load',initialLoad())

  const plotCurrentPageProperties =(firstPropertyToPrint)=>{
    //USE THIS FUNCTION WITH THE PAGES NUMBERS
    // console.log(document.getElementById('pagination').getElementsByClassName("active-page")[0].textContent)
    if (firstPropertyToPrint===999){
      var currentPage=1
      firstPropertyToPrint=undefined
    } else {
      var currentPage=document.getElementById('pagination').getElementsByClassName("active-page")[0].textContent;
    }
    // const currentPage=document.getElementById('pagination').getElementsByClassName("active-page")[0].textContent;
    
    // console.log("Current Page: ",currentPage)
    const dataSet = JSON.parse(localStorage.getItem("currentDataSet"));
    // console.log("Data Set About to be Shown: ",dataSet)
    let stringToPrint="";
    // let firstPropertyToPrint = getFirstPropertyToPrint(currentPage);
    // console.log("First Property To Print: ",firstPropertyToPrint)
    // console.log(dataSet)
    /////////////////////////////////////PROBLEMA CON EL SLICE 
    // console.log(dataSet.slice(8,10))
    // console.log(firstPropertyToPrint)
    if (firstPropertyToPrint===null||firstPropertyToPrint===undefined){
      firstPropertyToPrint=0;
      
    }
    dataSet.slice(firstPropertyToPrint,firstPropertyToPrint+10).map(element=>{
      // console.log("Inside the map")
      stringToPrint+=getCardStr(element)
    });

    let paginationStr = createPagination(countPagesNeeded(dataSet),currentPage);
    document.getElementsByClassName("cards-container")[0].innerHTML=paginationStr+stringToPrint;
  }
  plotCurrentPageProperties(1)

  async function saveCurrentFilteredData (){
    //USE THIS FUNCTION WITH "BUSCAR" BUTTON UNDER THE FILTERS
    const dataSet = JSON.parse(localStorage.getItem("dataSet"));
    // console.log(dataSet)
    //GET FILTERS VARIABLES
    let maxDownPayment=Number(document.getElementById("max-price").value);
    let minimumProfit=Number(document.getElementById("minimum-profit").value);
    let selectedCity=document.getElementById("city-selector").value;
    // console.log("Main Data Set: ",dataSet)

    if (window.screen.width <= 650){showHideFilters()}
    
    const currentData=dataSet.filter(element=>{
      // console.log("I'm filtering")
      //DISPLAY PROPERTIES THAT MATCH THE FILTERS
      if (filterMaxDownPayment(element.downpayment,maxDownPayment) && filterMinimumProfit(element.profit,minimumProfit) && filterCity(element.city,selectedCity)){
        return true;
      } else {
        return false;
      }

    }).sort(function(a,b){
      //SORT PROPERTIES ACCORDING TO SORTING CRITERIA
      let sortMethod=document.getElementById("sort-method-selector").value;
      // console.log(b.downpayment)
      switch (sortMethod){
        // Number(a..replace(/\D/g,''))-Number(b..replace(/\D/g,''))
        // Number(b..replace(/\D/g,''))-Number(a..replace(/\D/g,''))
        case "Mayor Rentabilidad":return Number(b.profit.replace(/\D/g,''))-Number(a.profit.replace(/\D/g,''))
        case "Menor Capital Inicial": return  Number(a.downpayment.replace(/\D/g,''))-Number(b.downpayment.replace(/\D/g,''))
        case "Menor Precio del Inmueble":return  Number(a.price.replace(/\D/g,''))-Number(b.price.replace(/\D/g,''))
        case "Mayores Ingresos":return Number(b.income.replace(/\D/g,''))-Number(a.income.replace(/\D/g,''))
        case "Menores Gastos": return  Number(a.expenses.replace(/\D/g,''))-Number(b.expenses.replace(/\D/g,''))
        case "Mayor Balance": return Number(b.balance.replace(/\D/g,''))-Number(a.balance.replace(/\D/g,''))
      }
    })
    // console.log("Main Data Set Filtered and About to be Saved: ",currentData)
    localStorage.setItem("currentDataSet",JSON.stringify(currentData));
    
    plotCurrentPageProperties(999);
  }
  
  function rndBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min).toFixed(0);
  }
  function filterMinimumProfit(curProfit,minProfit){
    // console.log(Number(curProfit),minProfit)
    if (Number(curProfit)>=minProfit){return true;}else{return false;}
  }
  function filterMaxDownPayment(curDP,maxDP){
    // console.log(Number(curDP.replace(/\D/g,'')), maxDP)
    if (maxDP===0){return true;}else{if(Number(curDP.replace(/\D/g,''))>maxDP){return false;} else {return true}}
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
  function actualizarCalculos(element){
    console.log("Update function was trigered")
    let id = element.id
    // console.log(id)
    if (id==="details-rebaja-negociacion" ){
      //HIPOTECA
        calcularPrecioDeCompra()
      calcularProcentajeFinanciadoDetails()
      calcularCapitalFinanciado()
      calcularCuotaMensual()
      calcularTotalHipoteca()
      calcularInteresesHipoteca()
      //GASTOS DE COMPRAVENTA
      calculateITP()
      calcuarGastosDeApertura()
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //INGRESOS MENSUALES
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()

    } else if (id==="details-porcentaje-financiado"){
      //HIPOTECA
      calcularCapitalFinanciado()
      calcularCuotaMensual()
      calcularTotalHipoteca()
      calcularInteresesHipoteca()
      //GASTOS DE COMPRAVENTA
      calculateITP()
      calcuarGastosDeApertura()
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //INGRESOS MENSUALES
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    } else if("details-tae"){
      calcularCuotaMensual()
      calcularTotalHipoteca()
      calcularInteresesHipoteca()
      //GASTOS DE COMPRAVENTA
      calculateITP()
      calcuarGastosDeApertura()
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-plazo-hipoteca"){
      calcularCuotaMensual()
      calcularTotalHipoteca()
      calcularInteresesHipoteca()
      //GASTOS DE COMPRAVENTA
      calculateITP()
      calcuarGastosDeApertura()
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-tasacion"){
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-nota-simple"){
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-registro"){
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-comision-apertura"){
      calcuarGastosDeApertura()
      calcularGastosDeCompraVenta()
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-ibi"){
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-impuesto-basuras"){
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-gastos-comunidad"){
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-seguro"){
      //GASTOS MENSUALES
      calcularTotalGastosMensuales()
      //RENTABILIDAD (PARTE SUPERIOR)
      calcularInversionInicial()
      calcularGastosAnuales()
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
    }else if("details-ocupacion"){
      calcularIngresosAnuales()
      calcularBalanceAnual()
      //RENTABILIDAD (PARTE INFERIOR)
      calcularRentabilidadNeta()
      calcularRoi()
      calcularPayback()
      calcularPer()
      
    }

    checkFaltanDatos()

   
  }

  function checkFaltanDatos(){
    let mostrar=false;
    let importeRebaja= document.getElementById("details-rebaja-negociacion").value
    // console.log(importeRebaja)
    let porcentajeFinanciado = document.getElementById("details-porcentaje-financiado").value
    // console.log(porcentajeFinanciado)
    let tae = document.getElementById("details-tae").value
    // console.log(tae)
    let años = (document.getElementById("details-plazo-hipoteca").value)
    // console.log(años)
    let tasacion = (document.getElementById("details-tasacion").value)
    // console.log(tasacion)
    let nota = (document.getElementById("details-nota-simple").value)
    // console.log(nota)
    let registro = (document.getElementById("details-registro").value)
    // console.log(registro)
    let gastosDeApertura = document.getElementById("details-comision-apertura").value 
    // console.log(gastosDeApertura)
    let ibi=(document.getElementById("details-ibi").value)
    // console.log(ibi)
    let basuras=(document.getElementById("details-impuesto-basuras").value)
    // console.log(basuras)
    let comunidad=(document.getElementById("details-gastos-comunidad").value)
    // console.log(comunidad)
    let seguro=(document.getElementById("details-seguro").value)
    // console.log(seguro)
    let ocupacion = document.getElementById("details-ocupacion").value
    // console.log(ocupacion)
    if(importeRebaja===""){mostrar=true;}
    if(porcentajeFinanciado===""){mostrar=true;}
    if(tae===""){mostrar=true;}
    if(años===""){mostrar=true;}
    if(tasacion===""){mostrar=true;}
    if(nota===""){mostrar=true;}
    if(registro===""){mostrar=true;}
    if(gastosDeApertura===""){mostrar=true;}
    if(ibi===""){mostrar=true;}
    if(basuras===""){mostrar=true;}
    if(comunidad===""){mostrar=true;}
    if(seguro===""){mostrar=true;}
    if(ocupacion===""){mostrar=true;}
    errContainer=document.getElementById("error-faltan-datos")
    // console.log(errContainer)
    if (mostrar===true){
      errContainer.style.display="block"
    }else{
      errContainer.style.display="none"
    }

  }
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
    calcuarGastosDeApertura()
    calcularGastosDeCompraVenta()
    //GASTOS MENSUALES
    calcularTotalGastosMensuales()
    //INGRESOS MENSUALES
    calcularSuperficiePiso(prop)
    calcularIngresosMensuales(prop)
    //RENTABILIDAD (PARTE SUPERIOR)
    calcularInversionInicial()
    calcularGastosAnuales()
    calcularIngresosAnuales()
    calcularBalanceAnual()
    //RENTABILIDAD (PARTE INFERIOR)
    calcularRentabilidadNeta()
    calcularRoi()
    calcularPayback()
    calcularPer()
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
    document.getElementById("details-cuota-hipoteca").textContent = numberToCurrency(cuotaMensual)
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
    let birthDate = document.getElementById("birth-date").value
    // console.log(birthDate)
    let age = calcAge(birthDate)
    // console.log(age)
    if (age<32){var porcentajeITP = 0.05} else{var porcentajeITP = 0.1}
    // console.log(porcentajeITP)
    let precioDeCompra = document.getElementById("details-precio-compra").textContent;
    // console.log(precioDeCompra)
    let numeroPrecioDeCompra = Number(precioDeCompra.replace(/\D/g,''))
    // console.log(numeroPrecioDeCompra)
    let itp = numeroPrecioDeCompra * porcentajeITP
    // console.log(itp)
    document.getElementById("details-itp").textContent= numberToCurrency(itp)
  }
  function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }
  function calcuarGastosDeApertura(){
    let capitalFinanciado = document.getElementById("details-capital-financiado").textContent
    // console.log(capitalFinanciado)
    let numeroCapitalFinanciado = Number(capitalFinanciado.replace(/\D/g,''))
    // console.log(numeroCapitalFinanciado)
    let comisionApertura = document.getElementById("details-comision-apertura").value
    // console.log(comisionApertura)
    let numerocomisionApertura = Number(comisionApertura.replace(/\D/g,''))/100
    // console.log(numerocomisionApertura)
    let gastosDeApertura = numerocomisionApertura*numeroCapitalFinanciado
    // console.log(gastosDeApertura)
    document.getElementById("details-gastos-apertura").textContent = numberToCurrency(gastosDeApertura)
  }
  function calcularGastosDeCompraVenta(){
    let itp = document.getElementById("details-itp").textContent;
    // console.log(itp)
    let numeroItp = Number(itp.replace(/\D/g,''))
    // console.log(numeroItp)
    let tasacion = Number(document.getElementById("details-tasacion").value)
    // console.log(tasacion)
    let nota = Number(document.getElementById("details-nota-simple").value)
    // console.log(nota)
    let registro = Number(document.getElementById("details-registro").value)
    // console.log(registro)
    let gastosDeApertura = document.getElementById("details-gastos-apertura").textContent 
    // console.log(gastosDeApertura)
    let numeroGastosDeApertura = Number(gastosDeApertura.replace(/\D/g,''))
    // console.log(numeroGastosDeApertura)
    let gastosDeCompraventa = numeroItp + tasacion + nota +registro+numeroGastosDeApertura
    // console.log(gastosDeCompraventa)
    document.getElementById("details-gastos-compraventa").textContent =numberToCurrency(gastosDeCompraventa)
  }
  function calcularTotalGastosMensuales(){
    let ibi=Number(document.getElementById("details-ibi").value)
    // console.log(ibi)
    let basuras=Number(document.getElementById("details-impuesto-basuras").value)
    // console.log(basuras)
    let comunidad=Number(document.getElementById("details-gastos-comunidad").value)
    // console.log(comunidad)
    let seguro=Number(document.getElementById("details-seguro").value)
    // console.log(seguro)
    let cuotaHipoteca = document.getElementById("details-cuota-hipoteca").textContent
    // console.log(cuotaHipoteca)
    let numeroCuotaHipoteca = Number(cuotaHipoteca.replace(/\D/g,''))
    // console.log(numeroCuotaHipoteca)
    let totalGastosMensuales = ibi+basuras+comunidad+seguro+numeroCuotaHipoteca
    // console.log(totalGastosMensuales)
    document.getElementById("details-total-gastos-mensuales").textContent = numberToCurrency(totalGastosMensuales)
  }
  function calcularSuperficiePiso(prop){
    let superifice = prop[0].surface;
    // console.log(superifice)
    document.getElementById("details-superficie-piso").innerHTML=superifice+"m<sup>2</sup>"
  }
  function calcularIngresosMensuales(prop){
    let superifice = Number(prop[0].surface);
    // console.log(superifice)
    let alquilerm2 = document.getElementById("details-alquilerm2").textContent
    // console.log(alquilerm2)
    let numeroAlquilerm2 =  Number(alquilerm2.replace(/\D/g,''))
    // console.log(numeroAlquilerm2)
    let ingresosMensuales = numeroAlquilerm2 * superifice
    // console.log(ingresosMensuales)
    document.getElementById("details-ingresos-mensuales").textContent = numberToCurrency(ingresosMensuales)

  }
  function calcularInversionInicial(){
    let precioDeCompra = document.getElementById("details-precio-compra").textContent;
    // console.log(precioDeCompra)
    let numeroPrecioDeCompra = Number(precioDeCompra.replace(/\D/g,''))
    // console.log(numeroPrecioDeCompra)
    let capitalFinanciado = document.getElementById("details-capital-financiado").textContent
    // console.log(capitalFinanciado)
    let numeroCapitalFinanciado = Number(capitalFinanciado.replace(/\D/g,''))
    // console.log(numeroCapitalFinanciado)
    let gastosDeCompraVenta = document.getElementById("details-gastos-compraventa").textContent
    // console.log(gastosDeCompraVenta)
    let numerogastosDeCompraVenta = Number(gastosDeCompraVenta.replace(/\D/g,''))
    // console.log(numerogastosDeCompraVenta)
    let inversionInicial = (numeroPrecioDeCompra-numeroCapitalFinanciado)+numerogastosDeCompraVenta
    // console.log(inversionInicial)
    document.getElementById("details-inversion-inicial").textContent = numberToCurrency(inversionInicial)
  }
  function calcularGastosAnuales(){
    let gastosMensuales = document.getElementById("details-total-gastos-mensuales").textContent
    // console.log(gastosMensuales)
    let numeroGastosMensuales = Number(gastosMensuales.replace(/\D/g,''))
    // console.log(numeroGastosMensuales)
    let gastosAnuales = 12*numeroGastosMensuales
    // console.log(gastosAnuales)
    document.getElementById("details-gastos-anuales").textContent = numberToCurrency(gastosAnuales)
  }
  function calcularIngresosAnuales(){
    let ingresosMensuales = document.getElementById("details-ingresos-mensuales").textContent
    // console.log(ingresosMensuales)
    let numeroIngresosMensuales = Number(ingresosMensuales.replace(/\D/g,''))
    // console.log(numeroIngresosMensuales)
    let ocupacion = document.getElementById("details-ocupacion").value
    // console.log(ocupacion)
    let numeroOcupacion = Number(ocupacion.replace(/\D/g,''))/100
    // console.log(numeroOcupacion)
    let ingresosAnuales = numeroIngresosMensuales * numeroOcupacion*12
    document.getElementById("details-ingresos-anuales").textContent = numberToCurrency(ingresosAnuales)
  }
  function calcularBalanceAnual(){
    let ingreosAnuales = document.getElementById("details-ingresos-anuales").textContent
    // console.log(ingreosAnuales)
    let numeroingreosAnuales = Number(ingreosAnuales.replace(/\D/g,''))
    // console.log(numeroingreosAnuales)
    let gastosAnuales = document.getElementById("details-gastos-anuales").textContent
    // console.log(gastosAnuales)
    let numerogastosAnuales = Number(gastosAnuales.replace(/\D/g,''))
    // console.log(numerogastosAnuales)
    let balanceAnual = numeroingreosAnuales-numerogastosAnuales
    // console.log(balanceAnual)
    document.getElementById("details-balance-anual").textContent = numberToCurrency(balanceAnual)
  }
  function calcularRentabilidadNeta(){
    let gastosMensuales = document.getElementById("details-total-gastos-mensuales").textContent
    // console.log(gastosMensuales)
    let numeroGastosMensuales = Number(gastosMensuales.replace(/\D/g,''))
    // console.log(numeroGastosMensuales)
    let ingreosAnuales = document.getElementById("details-ingresos-anuales").textContent
    // console.log(ingreosAnuales)
    let numeroingreosAnuales = Number(ingreosAnuales.replace(/\D/g,''))
    // console.log(numeroingreosAnuales)
    let precioDeCompra = document.getElementById("details-precio-compra").textContent;
    // console.log(precioDeCompra)
    let numeroPrecioDeCompra = Number(precioDeCompra.replace(/\D/g,''))
    // console.log(numeroPrecioDeCompra)
    let rentabilidadNeta=(((numeroingreosAnuales-(numeroGastosMensuales*12))/numeroPrecioDeCompra)*100).toFixed(0)
    // console.log(rentabilidadNeta)
    document.getElementById("details-rentabilidad-neta").textContent = (rentabilidadNeta+"%")
  }
  function calcularRoi(){
    let rentabilidadNeta =  document.getElementById("details-rentabilidad-neta").textContent
    // console.log(rentabilidadNeta)
    let numerorentabilidadNeta = Number(rentabilidadNeta.replace(/\D/g,''))
    // console.log(numerorentabilidadNeta)
    let roi = ((1/numerorentabilidadNeta)*100).toFixed(0)
    // console.log(roi)
    document.getElementById("details-roi").textContent = (roi+"%")
  }
  function calcularPayback(){
    let inversionInicial=document.getElementById("details-inversion-inicial").textContent
    // console.log(inversionInicial)
    let numeroinversionInicial = Number(inversionInicial.replace(/\D/g,''))
    // console.log(numeroinversionInicial)
    let balanceAnual = document.getElementById("details-balance-anual").textContent
    // console.log(balanceAnual)
    let numerobalanceAnual = Number(balanceAnual.replace(/\D/g,''))
    // console.log(numerobalanceAnual)
    let payback = (numeroinversionInicial / numerobalanceAnual).toFixed(1)
    document.getElementById("details-payback").textContent = payback+" Años"
  }
  function calcularPer() {
    let ingreosAnuales = document.getElementById("details-ingresos-anuales").textContent
    // console.log(ingreosAnuales)
    let numeroingreosAnuales = Number(ingreosAnuales.replace(/\D/g,''))
    // console.log(numeroingreosAnuales)
    let precioDeCompra = document.getElementById("details-precio-compra").textContent;
    // console.log(precioDeCompra)
    let numeroPrecioDeCompra = Number(precioDeCompra.replace(/\D/g,''))
    // console.log(numeroPrecioDeCompra)
    let per = (numeroPrecioDeCompra/numeroingreosAnuales).toFixed(1)
    document.getElementById("details-per").textContent = per+" Años"
  }