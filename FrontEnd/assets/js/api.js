export function fetchWorks(projets) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    projets.forEach((projet) => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", projet.id);
        figure.innerHTML = `
        <img src ="${projet.imageUrl}" data-id="${projet.id}" alt = "${projet.title}">
        <figcaption>${projet.title}</figcaption>
        `
        gallery.appendChild(figure);
    });
}

export function displayFilters(projets) {
    const filters = document.querySelector(".filters");

    const categoriesMap = new Map();

    projets.forEach((projet) => {
        categoriesMap.set(projet.category.name, projet.category.id);
    });

    categoriesMap.forEach((id,name) => {
        const button = document.createElement("button");
        button.textContent = `${name}`;
        button.dataset.id = `${id}`;
        filters.appendChild(button);
    })
}


export function setupFilters(projets) {
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const categoryId = button.dataset.id;

            buttons.forEach((button) => button.classList.remove("selected"));
            button.classList.add("selected");

            let filteredProjets;
            if (categoryId === undefined) {
                filteredProjets = projets;
            } else {
                filteredProjets = projets.filter(projet => projet.category.id === parseInt(categoryId));
            }

            fetchWorks(filteredProjets);
    })
    })
}

fetch("http://localhost:5678/api/works")
  // On va chercher les valeurs de l'api et on les lit en json
  .then((response) => response.json())
  .then((projets) => {
    fetchWorks(projets);
    displayFilters(projets);
    setupFilters(projets)
  })
  .catch((error) => console.log(error));