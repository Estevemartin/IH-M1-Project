
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
    console.log(cardsContainer.style);
    // let filtersContainer= document.getElementById("perfil");
    // console.log(cardsContainer.style.display);
    // console.log(filtrosContainer.style.display);
    // console.log(filtrosContainer.style.display);
    console.log ("Display Cards: "+ cardsContainer.style.display + "   | Display Filters: "+filtrosContainer.style.display);
    
  
    if(filtrosContainer.style.display==="none" || filtrosContainer.style.display===""){
      console.log("Gonna Display Only Filters");
      cardsContainer.style.display="none";
      filtrosContainer.style.display="block";
      // filtersContainer.style.display="inline-block";
    }else{
      console.log("Gonna Display Only Cards");
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
  
  }