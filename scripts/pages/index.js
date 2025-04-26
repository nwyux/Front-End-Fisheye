// Encapsuler toute la recuperation des donnees dans un repository "photographer"
// 2 fonctions, getPhotographers et getPhotographer qui vont recup les donnees correspondantes
// Class photographer

async function getPhotographers() {
  // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
  // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
  const urlGetPhotographers = "data/photographers.json";

  let photographers = await fetch(urlGetPhotographers)
    .then((response) => response.json())
    .then((data) => data.photographers)
    .catch((error) =>
      console.error("Erreur lors de la récupération des données :", error)
    );

  // et bien retourner le tableau photographers seulement une fois récupéré
  return { photographers: photographers };
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
