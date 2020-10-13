
// MUESTRA LA RENTABILIDAD MINIMA SELECCIONADA
updateRentabilidadMinima=(rentabilidadMnima)=>{
    document.getElementById("display-rentabilidad-minima").innerHTML = rentabilidadMnima + "%";
  }
  
  showHideMenu=()=>{
    let element = document.getElementById("mobile-menu")
    // console.log(element.style.display);
    if(element.style.display==="none" || element.style.display===""){
      element.style.display="inline";
    } else{
      element.style.display="none";
    }
  }
  

  showHideProfile=()=>{
    let cardsContainer=document.getElementById("cards-container");
    let filtrosContainer = document.getElementById("filter-container");
    let filtros = document.getElementById("filtros");
    let perfil = document.getElementById("perfil");

    if(perfil.style.display==="none" || perfil.style.display===""){
      cardsContainer.style.display="none";
      filtrosContainer.style.display="block";
      filtros.style.display="none";
      perfil.style.display="block";
    }else{
      cardsContainer.style.display="block";
      filtrosContainer.style.display="none";
      filtros.style.display="none";
      perfil.style.display="none";
    }
    console.log ("Display Cards: "+ cardsContainer.style.display + "   | Display Filters: "+filtrosContainer.style.display);
  }

  showHideFilters =()=>{
    let cardsContainer=document.getElementById("cards-container");
    let filtrosContainer = document.getElementById("filter-container");
    let filtros = document.getElementById("filtros");
    let perfil = document.getElementById("perfil");

    if(filtrosContainer.style.display==="none" || filtrosContainer.style.display===""){
      cardsContainer.style.display="none";
      filtrosContainer.style.display="block";
      filtros.style.display="block";
      perfil.style.display="none";
    }else{
      cardsContainer.style.display="block";
      filtrosContainer.style.display="none";
      perfil.style.display="none";
      filtros.style.display="none";
    }
    console.log ("Display Cards: "+ cardsContainer.style.display + "   | Display Filters: "+filtrosContainer.style.display);
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