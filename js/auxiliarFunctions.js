
// MUESTRA LA RENTABILIDAD MINIMA SELECCIONADA
  updateRentabilidadMinima=(rentabilidadMnima)=>{
    document.getElementById("display-rentabilidad-minima").innerHTML = rentabilidadMnima + "%";
  }
  showHideMenu=()=>{
    let element = document.getElementById("mobile-menu")
    // console.log(element.style.display);
    if(element.style.display==="none" || element.style.display==="" ){
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
    let details=document.getElementById("details-container")
    // let cardsContaines=document.getElementById("cards-container")

    if(perfil.style.display==="none" || perfil.style.display===""){
      cardsContainer.style.display="none";
      filtrosContainer.style.display="block";
      // filtros.style.display="none";
      perfil.style.display="block";
      // cardsContaines.style.display="none";
    }else{
      cardsContainer.style.display="block";
      filtrosContainer.style.display="none";
      // filtros.style.display="none";
      perfil.style.display="none";
      // cardsContaines.style.display="none";
    }
    details.style.display="none";
    filtros.style.display="none";

    console.log ("Display Cards: "+ cardsContainer.style.display + "   | Display Filters: "+filtrosContainer.style.display);
  }
  showHideFilters =()=>{
    let cardsContainer=document.getElementById("cards-container");
    let filtrosContainer = document.getElementById("filter-container");
    let filtros = document.getElementById("filtros");
    let perfil = document.getElementById("perfil");
    let details=document.getElementById("details-container")

    if(filtros.style.display==="none" || filtros.style.display===""){
      cardsContainer.style.display="none";
      filtrosContainer.style.display="block";
      filtros.style.display="block";
      // perfil.style.display="none";
    }else{
      cardsContainer.style.display="block";
      filtrosContainer.style.display="none";
      filtros.style.display="none";
      // perfil.style.display="none";
      
    }
    details.style.display="none";
    perfil.style.display="none";
      
    console.log ("Display Cards: "+ cardsContainer.style.display + "   | Display Filters: "+filtrosContainer.style.display);
  }
  goBackDetailsMobilMenu=()=>{
    let details=document.getElementById("details-container")
    let cardsContainer=document.getElementById("cards-container");
    details.style.display="none";
    cardsContainer.style.display="block";
  }
  // SELECCIONA UNA PROPIEDAD AL HACER CLICK EN ELLA
  selectProperty=(propertyCard)=>{
    // Get all Cards
    let allCards=document.getElementsByClassName("card panel")
    let cardsContaines=document.getElementById("cards-container")
    // console.log(allCards)
    // console.log(window.screen.width)
    if(window.screen.width <= 650){
      let details=document.getElementById("details-container")
      details.style.display="flex";
      cardsContaines.style.display="none";
    } else{
      if (propertyCard.classList.contains('active-card')){
        //Si el elemento seleccionado tiene la clase, se le quita.
        propertyCard.classList.remove('active-card')
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
    const proper=document.getElementsByClassName("card panel active-card")[0]
    if (proper !==undefined){
      const propId=proper.getElementsByClassName("property-id")[0].textContent;
      // console.log(propId)
      fillDetails(propId)
    } else {
      //Ocultar el panel de detalles si no hay una propiedad seleccionada
      // document.getElementById("details-container").display="none";
    }
    
  }

  switchButtons=(element)=>{
    let buttonGroup=element.parentElement;
    let activeButton
    let disabledButton

    // console.log(buttonGroup.getElementsByTagName("button")[0].classList)
    if(buttonGroup.getElementsByTagName("button")[0].classList.contains('active')){
       activeButton = buttonGroup.getElementsByTagName("button")[0];
       disabledButton =  buttonGroup.getElementsByTagName("button")[1];
       
    } else{
       activeButton = buttonGroup.getElementsByTagName("button")[1];
       disabledButton =  buttonGroup.getElementsByTagName("button")[0];
    }
    console.log("BEFORE CHANGES: Active Button: ",activeButton,"  |  Disabled Button: ",disabledButton)
    activeButton.classList.remove('active');
    activeButton.addEventListener('click',function(){switchButtons(activeButton);});

    disabledButton.removeEventListener('click',switchButtons);
    disabledButton.classList.add('active');
    console.log("AFTER CHANGES: Active Button: ",activeButton,"  |  Disabled Button: ",disabledButton)
  }

