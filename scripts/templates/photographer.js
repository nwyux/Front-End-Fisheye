export function photographerTemplate(data) {
    const { id, name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    // Au lieu de tout mettre dans une fonction, tout separe pour que ce soit clean

    function getUserCardDOM() {
        const article = document.createElement('article');
        article.classList.add('photographer-card');
        article.setAttribute("aria-label", "Photographe " + name);
        article.setAttribute("role", "article");
        
        const link = document.createElement('a');
        link.setAttribute("href", `photographer.html?id=${id}`);
        link.setAttribute("aria-label", `Voir le profil de ${name}`);
        
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('photographer-img-container');
        
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        img.setAttribute("aria-label", "Photographe " + name);
        img.setAttribute("role", "img");
        
        const h2 = document.createElement('h2');
        h2.textContent = name;
        h2.classList.add('photographer-name');
        h2.setAttribute("alt", `${name}`);

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('photographer-info-container');
        infoContainer.setAttribute("tabindex", "0");
        infoContainer.setAttribute("aria-label", `Informations sur ${name}: ${city}, ${country}. ${tagline}. Tarif: ${price}€ par jour`);
        
        const h3 = document.createElement('h3');
        h3.textContent = `${city}, ${country}`;
        h3.classList.add('photographer-location');
        
        const p = document.createElement('p');
        p.textContent = tagline;
        p.classList.add('photographer-tagline');
        
        const span = document.createElement('span');
        span.textContent = `${price}€/jour`;
        span.classList.add('photographer-price');
        
        // Ajout des éléments d'information au conteneur
        infoContainer.appendChild(h3);
        infoContainer.appendChild(p);
        infoContainer.appendChild(span);
        
        imgContainer.appendChild(img);
        
        article.appendChild(link);
        link.appendChild(imgContainer);
        link.appendChild(h2);
        article.appendChild(infoContainer); // Ajout du conteneur unique au lieu des éléments individuels
        
        return (article);
    }
    
    return { 
        id, 
        name, 
        picture, 
        city,
        country,
        tagline,
        price,
        getUserCardDOM 
    }
}