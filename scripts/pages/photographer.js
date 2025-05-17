import { photographerTemplate } from "../templates/photographer.js";
import { initContactForm } from "../utils/contactForm.js";

function getPhotographerId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// Factory pour les médias (images et vidéos)
function mediaFactory(data, photographerName) {
  const { title, image, video, likes } = data;

  let mediaPath;
  let type;

  if (image) {
    mediaPath = `assets/images/${photographerName}/${image}`;
    type = "image";
  } else if (video) {
    mediaPath = `assets/images/${photographerName}/${video}`;
    type = "video";
  }

  function getMediaCardDOM() {
    const article = document.createElement("article");
    article.classList.add("media-card");
    article.setAttribute("aria-label", title);

    // Conteneur du média
    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("media-container");

    // Création du média (image ou vidéo)
    if (type === "image") {
      const img = document.createElement("img");
      img.setAttribute("src", mediaPath);
      img.setAttribute("alt", title);
      img.setAttribute("class", "media-content");
      img.setAttribute("tabindex", "0"); // Média sélectionnable en premier
      mediaContainer.appendChild(img);
    } else if (type === "video") {
      const video = document.createElement("video");
      video.setAttribute("src", mediaPath);
      video.setAttribute("alt", title);
      video.setAttribute("class", "media-content");
      video.setAttribute("controls", true);
      video.setAttribute("tabindex", "0"); // Média sélectionnable en premier
      mediaContainer.appendChild(video);
    }

    // Informations sur le média
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("media-info");

    const titleElem = document.createElement("h3");
    titleElem.textContent = title;
    titleElem.classList.add("media-title");
    titleElem.setAttribute("tabindex", "0"); // Le titre est le deuxième élément à sélectionner

    const likesContainer = document.createElement("div");
    likesContainer.classList.add("likes-container");

    const likesCount = document.createElement("span");
    likesCount.textContent = likes;
    likesCount.classList.add("likes-count");
    likesCount.setAttribute("tabindex", "0"); // Le nombre de likes est le troisième élément

    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fas", "fa-heart");
    heartIcon.setAttribute("aria-label", "Bouton J'aime");
    heartIcon.setAttribute("tabindex", "0");
    heartIcon.setAttribute("role", "button");

    // Ajout de l'événement de like sur le coeur
    heartIcon.addEventListener("click", function() {
      incrementLike(likesCount);
    });

    // Gestion de l'accessibilité clavier pour les likes
    heartIcon.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        incrementLike(likesCount);
      }
    });

    likesContainer.appendChild(likesCount);
    likesContainer.appendChild(heartIcon);

    infoContainer.appendChild(titleElem);
    infoContainer.appendChild(likesContainer);

    article.appendChild(mediaContainer);
    article.appendChild(infoContainer);

    return article;
  }

  return { getMediaCardDOM };
}

function incrementLike(likesElement) {
  // Vérifier si l'élément a déjà été liké (attribut data-liked)
  const isLiked = likesElement.getAttribute("data-liked") === "true";
  
  if (!isLiked) {
    // Incrémenter le nombre de likes
    let currentLikes = parseInt(likesElement.textContent);
    currentLikes++;
    likesElement.textContent = currentLikes;
    
    // Marquer comme liké pour éviter les likes multiples
    likesElement.setAttribute("data-liked", "true");
    
    // Mettre à jour le compteur global de likes
    updateTotalLikes(1);
  } else {
    // Si déjà liké, on retire le like
    let currentLikes = parseInt(likesElement.textContent);
    currentLikes--;
    likesElement.textContent = currentLikes;
    
    // Marquer comme non liké
    likesElement.setAttribute("data-liked", "false");
    
    // Mettre à jour le compteur global de likes
    updateTotalLikes(-1);
  }
}

function updateTotalLikes(increment) {
  const totalLikesElement = document.querySelector(".total-likes");
  
  if (totalLikesElement) {
    // Extraire le nombre actuel (en ignorant l'icône coeur)
    const currentText = totalLikesElement.textContent;
    const currentTotal = parseInt(currentText);
    
    // Mettre à jour le total
    const newTotal = currentTotal + increment;
    
    // Mettre à jour l'affichage
    totalLikesElement.innerHTML = `${newTotal} <i class="fas fa-heart"></i>`;
  }
}

async function fetchData() {
  try {
    const response = await fetch("./data/photographers.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
}

async function init() {
    const { photographers, media } = await fetchData();
    const photographerId = getPhotographerId();
  
    // Récupération des informations du photographe
    const photographer = photographers.find((p) => p.id === photographerId);
  
    if (!photographer) {
      console.error("Photographe non trouvé");
      return;
    }
  
    // Récupération des médias du photographe
    const photographerMedia = media.filter(
      (m) => m.photographerId === photographerId
    );
  
    displayPhotographerInfo(photographer);
  
    displayPhotographerMedia(photographerMedia, photographer.name);
  
    displayPhotographerPrice(photographer.price);
    
    initContactForm(photographer);
  }

function displayPhotographerInfo(photographer) {
  const headerSection = document.querySelector(".photograph-header");

  const photographerModel = photographerTemplate(photographer);

  // Création du profil du photographe
  const profileSection = document.createElement("div");
  profileSection.classList.add("photographer-profile");

  const nameElem = document.createElement("h1");
  nameElem.textContent = photographer.name;
  nameElem.setAttribute("tabindex", "1");

  // Création d'un conteneur pour regrouper h2 et p
  const infoGroup = document.createElement("div");
  infoGroup.classList.add("photographer-info-group");
  infoGroup.setAttribute("tabindex", "2");
  infoGroup.setAttribute(
    "aria-label",
    `Localisation: ${photographer.city}, ${photographer.country}. Description: ${photographer.tagline}`
  );

  const locationElem = document.createElement("h2");
  locationElem.textContent = `${photographer.city}, ${photographer.country}`;
  locationElem.classList.add("photographer-location");

  const taglineElem = document.createElement("p");
  taglineElem.textContent = photographer.tagline;
  taglineElem.classList.add("photographer-tagline");

  // Ajout des éléments de texte au groupe d'info
  infoGroup.appendChild(locationElem);
  infoGroup.appendChild(taglineElem);

  // Structure du profil: nom puis groupe d'informations
  profileSection.appendChild(nameElem);
  profileSection.appendChild(infoGroup);

  // Création du conteneur pour le bouton de contact
  const contactButtonContainer = document.createElement("div");
  contactButtonContainer.classList.add("contact-button-container");

  // On récupère le bouton existant et on le déplace dans son conteneur
  const contactButton = headerSection.querySelector(".contact_button");
  contactButtonContainer.appendChild(contactButton);

  // Ajout de la photo du photographe
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("photographer-portrait");

  const img = document.createElement("img");
  img.setAttribute("src", photographerModel.picture);
  img.setAttribute("alt", photographer.name);
  img.setAttribute("tabindex", "4");

  imgContainer.appendChild(img);

  // On vide d'abord la section header
  while (headerSection.firstChild) {
    headerSection.removeChild(headerSection.firstChild);
  }

  // Insertion des éléments dans la section header
  headerSection.appendChild(profileSection);
  headerSection.appendChild(contactButtonContainer);
  headerSection.appendChild(imgContainer);
}

function displayPhotographerMedia(photographerMedia, photographerName) {
  const main = document.getElementById("main");

  // Création du sélecteur de tri
  const sortContainer = document.createElement("div");
  sortContainer.classList.add("sort-container");
  sortContainer.setAttribute("aria-label", "Options de tri");

  const sortLabel = document.createElement("label");
  sortLabel.textContent = "Trier par";
  sortLabel.setAttribute("for", "media-sort");
  sortLabel.classList.add("sort-label");
  sortLabel.setAttribute("tabindex", "6");

  const sortSelect = document.createElement("select");
  sortSelect.id = "media-sort";
  sortSelect.classList.add("sort-select");
  sortSelect.setAttribute("aria-label", "Trier les médias par");
  sortSelect.setAttribute("tabindex", "7");

  const options = [
    { value: "popularity", text: "Popularité" },
    { value: "date", text: "Date" },
    { value: "title", text: "Titre" },
  ];

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    sortSelect.appendChild(optionElement);
  });

  sortContainer.appendChild(sortLabel);
  sortContainer.appendChild(sortSelect);
  main.appendChild(sortContainer);

  // Création de la section des médias
  const mediaSection = document.createElement("section");
  mediaSection.classList.add("photographer-media");

  // Création de la galerie de médias
  const mediaGallery = document.createElement("div");
  mediaGallery.classList.add("media-gallery");

  function sortMedia(media, sortType) {
    const mediaCopy = [...media];

    switch (sortType) {
      case "popularity":
        return mediaCopy.sort((a, b) => b.likes - a.likes);
      case "date":
        return mediaCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "title":
        return mediaCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return mediaCopy;
    }
  }

  function updateMediaDisplay(sortType) {
    // Vider la galerie actuelle
    mediaGallery.innerHTML = "";

    // Trier les médias selon le critère sélectionné
    const sortedMedia = sortMedia(photographerMedia, sortType);

    // Ajouter les médias triés à la galerie
    sortedMedia.forEach((media, index) => {
      const mediaModel = mediaFactory(media, photographerName);
      const mediaCard = mediaModel.getMediaCardDOM();

      // Ajouter un événement click pour ouvrir la modal
      const mediaContent = mediaCard.querySelector(".media-content");
      mediaContent.addEventListener("click", () => {
        openModal(sortedMedia, index);
      });

      // Ajouter un événement keydown pour l'accessibilité
      mediaContent.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          openModal(sortedMedia, index);
        }
      });

      mediaGallery.appendChild(mediaCard);
    });

    // Créer la modal si elle n'existe pas encore
    createLightboxModal();
  }

  function createLightboxModal() {
    // Vérifier si la modal existe déjà
    if (document.getElementById("lightbox-modal")) {
      return;
    }
  
    const modal = document.createElement("div");
    modal.id = "lightbox-modal";
    modal.classList.add("lightbox-modal");
    modal.setAttribute("aria-label", "Image en plein écran");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-hidden", "true");
  
    const modalContent = document.createElement("div");
    modalContent.classList.add("lightbox-content");
    modalContent.setAttribute("tabindex", "1");
  
    // Créer un conteneur pour l'image et le titre
    const mediaAndTitleContainer = document.createElement("div");
    mediaAndTitleContainer.classList.add("lightbox-media-title-container");
  
    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("lightbox-media-container");
    mediaContainer.setAttribute("tabindex", "2");
  
    const title = document.createElement("h3");
    title.classList.add("lightbox-title");
    title.setAttribute("tabindex", "3");
  
    // Boutons de navigation
    const prevBtn = document.createElement("button");
    prevBtn.classList.add("lightbox-prev");
    prevBtn.innerHTML = "&#10094;";
    prevBtn.setAttribute("aria-label", "Image précédente");
    prevBtn.setAttribute("tabindex", "4");
    prevBtn.addEventListener("click", showPreviousImage);
    prevBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        showPreviousImage();
      }
    });
  
    const nextBtn = document.createElement("button");
    nextBtn.classList.add("lightbox-next");
    nextBtn.innerHTML = "&#10095;";
    nextBtn.setAttribute("aria-label", "Image suivante");
    nextBtn.setAttribute("tabindex", "5");
    nextBtn.addEventListener("click", showNextImage);
    nextBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        showNextImage();
      }
    });
  
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("lightbox-close");
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Fermer la fenêtre");
    closeBtn.setAttribute("tabindex", "6");
    closeBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        closeModal();
      }
    });
  
    // Organisation des éléments
    mediaAndTitleContainer.appendChild(mediaContainer);
    mediaAndTitleContainer.appendChild(title);
  
    modalContent.appendChild(mediaAndTitleContainer);
    modalContent.appendChild(prevBtn);
    modalContent.appendChild(nextBtn);
    modalContent.appendChild(closeBtn);
  
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  
    // Ajouter un gestionnaire d'événements pour les touches du clavier
    document.addEventListener("keydown", handleKeyDown);
  }

  // Variables globales pour la lightbox
  let currentMedias = [];
  let currentIndex = 0;

  function openModal(medias, index) {
    currentMedias = medias;
    currentIndex = index;
  
    const modal = document.getElementById("lightbox-modal");
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "flex";
  
    updateModalContent();
  
    // Mettre le focus sur le conteneur de la modal
    setTimeout(() => {
      const modalContent = modal.querySelector(".lightbox-content");
      modalContent.focus();
    }, 100);
  
    // Désactiver les tabindex des éléments en dehors de la modal
    document.querySelectorAll('button, a, input, select, [tabindex]').forEach(el => {
      if (!modal.contains(el)) {
        el.setAttribute('data-old-tabindex', el.getAttribute('tabindex') || '0');
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  function closeModal() {
    const modal = document.getElementById("lightbox-modal");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
  
    // Réactiver les tabindex des éléments en dehors de la modal
    document.querySelectorAll('[data-old-tabindex]').forEach(el => {
      const oldTabIndex = el.getAttribute('data-old-tabindex');
      if (oldTabIndex === 'null') {
        el.removeAttribute('tabindex');
      } else {
        el.setAttribute('tabindex', oldTabIndex);
      }
      el.removeAttribute('data-old-tabindex');
    });
  
    // Remettre le focus sur l'image qui a été cliquée
    const mediaElements = document.querySelectorAll(".media-content");
    if (mediaElements[currentIndex]) {
      mediaElements[currentIndex].focus();
    }
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % currentMedias.length;
    updateModalContent();
  }

  function showPreviousImage() {
    currentIndex =
      (currentIndex - 1 + currentMedias.length) % currentMedias.length;
    updateModalContent();
  }

  function updateModalContent() {
    const media = currentMedias[currentIndex];
    const mediaContainer = document.querySelector(".lightbox-media-container");
    const title = document.querySelector(".lightbox-title");
  
    // Nettoyer le conteneur
    mediaContainer.innerHTML = "";
  
    // Ajouter le média (image ou vidéo) avec taille réduite
    if (media.image) {
      const img = document.createElement("img");
      img.src = `assets/images/${photographerName}/${media.image}`;
      img.alt = media.title;
      img.classList.add("lightbox-media");
      // Réduire la taille de 30%
      img.style.maxWidth = "70%"; 
      img.style.maxHeight = "70%";
      mediaContainer.appendChild(img);
    } else if (media.video) {
      const video = document.createElement("video");
      video.src = `assets/images/${photographerName}/${media.video}`;
      video.controls = true;
      video.autoplay = true;
      video.classList.add("lightbox-media");
      // Réduire la taille de 30%
      video.style.maxWidth = "70%";
      video.style.maxHeight = "70%";
      mediaContainer.appendChild(video);
    }
  
    // Mettre à jour le titre
    title.textContent = media.title;
  }

  function handleKeyDown(e) {
    const modal = document.getElementById("lightbox-modal");
    if (
      modal.style.display === "none" ||
      modal.getAttribute("aria-hidden") === "true"
    ) {
      return;
    }

    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        showPreviousImage();
        break;
      case "ArrowRight":
        showNextImage();
        break;
    }
  }

  // Écouter les changements du sélecteur
  sortSelect.addEventListener("change", (e) => {
    updateMediaDisplay(e.target.value);
  });

  // Affichage initial (par défaut: popularité)
  updateMediaDisplay("popularity");

  mediaSection.appendChild(mediaGallery);
  main.appendChild(mediaSection);
}

function displayPhotographerPrice(price) {
  const main = document.getElementById("main");

  const priceContainer = document.createElement("div");
  priceContainer.classList.add("photographer-price-banner");
  priceContainer.setAttribute("tabindex", "5");

  // Ajouter le nombre total de likes
  const totalLikes = calculateTotalLikes();
  const likesElem = document.createElement("span");
  likesElem.classList.add("total-likes");
  likesElem.innerHTML = `${totalLikes} <i class="fas fa-heart"></i>`;

  // Ajouter un séparateur avec plus d'espace
  const separator = document.createElement("span");
  separator.classList.add("price-separator");
  separator.textContent = "     "; // Plusieurs espaces pour un écart plus grand
  // Ou utiliser une marge CSS
  separator.style.margin = "0 20px";

  // Ajouter le prix
  const priceElem = document.createElement("span");
  priceElem.textContent = `${price}€ / jour`;

  // Assembler les éléments
  priceContainer.appendChild(likesElem);
  priceContainer.appendChild(separator);
  priceContainer.appendChild(priceElem);
  main.appendChild(priceContainer);
}

function calculateTotalLikes() {
  const likesElements = document.querySelectorAll(".likes-count");
  let totalLikes = 0;

  likesElements.forEach((element) => {
    totalLikes += parseInt(element.textContent);
  });

  return totalLikes;
}

// Initialisation de la page
init();
