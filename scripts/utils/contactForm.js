let currentPhotographer = null;

export function displayModal() {
    const modal = document.getElementById("contact_modal");
    const contactTitle = document.getElementById("contact-title");
    
    if (currentPhotographer) {
        contactTitle.textContent = `Contactez-moi ${currentPhotographer.name}`;
    } else {
        contactTitle.textContent = 'Contactez-moi';
    }
    
    modal.style.display = "flex";
    
    // Accessibilité - focus sur le premier champ
    setTimeout(() => {
        document.getElementById('firstname').focus();
    }, 100);
    
    // Désactiver les tabindex des éléments en dehors de la modal
    document.querySelectorAll('button, a, input, select, [tabindex]').forEach(el => {
        if (!modal.contains(el) && !el.classList.contains('contact_button')) {
            el.setAttribute('data-old-tabindex', el.getAttribute('tabindex') || '0');
            el.setAttribute('tabindex', '-1');
        }
    });
}

export function closeModal() {
    const modal = document.getElementById("contact_modal");
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
    
    // Remettre le focus sur le bouton de contact
    document.querySelector('.contact_button').focus();
}

export function initContactForm(photographer) {
    currentPhotographer = photographer;
    
    const contactTitle = document.getElementById("contact-title");
    if (contactTitle) {
        contactTitle.textContent = `Contactez-moi ${photographer.name}`;
    }
    
    const contactButton = document.querySelector('.contact_button');
    if (contactButton) {
        contactButton.addEventListener('click', displayModal);
    }
    
    const closeButton = document.querySelector('.modal header img');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
        closeButton.removeAttribute('onclick');
    }
    
    // Ajout d'un gestionnaire d'événement pour la soumission du formulaire
    const contactForm = document.getElementById("contact-form");
    
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Récupération des données du formulaire
        const formData = {
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };
        
        console.log("Données du formulaire:", formData);
        console.log(`Message envoyé à ${currentPhotographer.name}`);
        
        contactForm.reset();
        closeModal();
    });
    
    // Gestion de la touche Escape pour fermer la modal
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            const modal = document.getElementById("contact_modal");
            if (modal.style.display === "flex") {
                closeModal();
            }
        }
    });
}