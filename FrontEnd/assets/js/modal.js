export function setupModal() {
  const openModal = document.querySelector(".edit__portfolio");
  const modal = document.querySelector("#modal");
  const changeModal = document.querySelector("#change__modal");
  const changeModal2 = document.querySelector("#arrow__modal");
  const modal__content = document.querySelector(".modal__content");
  const modal__content2 = document.querySelector(".modal__content2");
  const closeModalElements = document.querySelectorAll(
    ".modal__border, .modal__content i, .modal__content2 .fa-xmark"
  );

  openModal.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "flex";
  });

  closeModalElements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "none";
    });

    changeModal.addEventListener("click", (event) => {
      event.preventDefault();
      modal__content.classList.add("none");
      modal__content2.classList.remove("none");
    });
    changeModal2.addEventListener("click", (event) => {
      event.preventDefault();
      modal__content.classList.remove("none");
      modal__content2.classList.add("none");
    });
  });
  document.querySelector(".modal__new").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#fileInput").click();
  });

  document.querySelector("#fileInput").addEventListener("change", (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.createElement("img");
        preview.src = e.target.result;
        preview.style.maxWidth = "100%";
        preview.style.maxHeight = "160px";

        const modalNew = document.querySelector(".modal__new");
        modalNew.innerHTML = "";
        modalNew.appendChild(preview);
      };
      reader.readAsDataURL(file);
    }
  });
}

export function fetchWorksModal() {
  fetch("http://localhost:5678/api/works")
    // On va chercher les valeurs de l'api et on les lit en json
    .then((response) => response.json())
    .then((projets) => {
      const gallery2 = document.querySelector(".gallery2");
      gallery2.innerHTML = "";

      projets.forEach((projet) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src ="${projet.imageUrl}" alt = "${projet.title}">
            <i class="fa-solid fa-trash" data-id="${projet.id}"></i>
            `;
        gallery2.appendChild(figure);

        gallery2.querySelectorAll(".fa-trash").forEach((trashIcon) => {
          trashIcon.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const id = event.target.dataset.id;
            deleteWork(id);
          });
        });
      });
    })
    .catch((error) => console.log(error));
}

export function deleteWork(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      return response.text(); // Certains DELETE renvoient une réponse vide
    })
    .then(() => {
      // Supprimer dynamiquement l'élément dans la modal
      const trashIcon = document.querySelector(`.fa-trash[data-id="${id}"]`);
      if (trashIcon) {
        trashIcon.parentElement.remove(); // Supprime la <figure> qui contient l'image et l'icône poubelle
      }

      // Supprimer dynamiquement l'élément dans la galerie principale
      const galleryItem = document.querySelector(
        `.gallery figure[data-id="${id}"]`
      );
      if (galleryItem) {
        galleryItem.remove();
      }
    })
    .catch((error) => console.error(error));
}

export function fetchCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      return response.json();
    })
    .then((categories) => {
      const categorySelect = document.querySelector("#category");

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Erreur :", error));
}



function injectImageToGalery(data) {
  // Ajouter dynamiquement l'image à la galerie secondaire
  const gallery2 = document.querySelector(".gallery2");
  const figureModal = document.createElement("figure");
  figureModal.innerHTML = `
  <img src="${data.imageUrl}" alt="${data.title}">
  <i class="fa-solid fa-trash" data-id="${data.id}"></i>
`;
  gallery2.appendChild(figureModal);
  // Ajouter dynamiquement l'image à la galerie principale
  const gallery = document.querySelector(".gallery");
  const figureMain = document.createElement("figure");
  figureMain.setAttribute("data-id", data.id);
  figureMain.innerHTML = `
<img src ="${data.imageUrl}" alt = "${data.title}">
<figcaption>${data.title}</figcaption>
`;
  gallery.appendChild(figureMain);
  // Réinitialiser le formulaire après ajout
  document.querySelector("#fileInput").value = "";
  document.querySelector("#title").value = "";
  document.querySelector("#category").selectedIndex = 0;
  const modalNew = document.querySelector(".modal__new");
  modalNew.innerHTML = `
  <i class="fa-solid fa-image"></i>
  <button>+ Ajouter photo</button>
  <p>jpg, png : 4mo max</p>
`;
}


export function addWork() {
  const addImage = document.querySelector("#add__image");
  const fileInput = document.querySelector("#fileInput");
  const titleInput = document.querySelector("#title");
  const categoryInput = document.querySelector("#category");

  function checkFields() {
    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const category = categoryInput.value;
  
    if (!file || !title || category === "0") {
      addImage.disabled = true;
      addImage.classList.add("disabled");
      console.log("erreur champs pas tous remplis");
      return;
    } else {
      console.log("champs remplis");
      addImage.disabled = false;
      addImage.classList.remove("disabled");
      addImage.classList.add("enabled");
    }
  }

  fileInput.addEventListener("change", checkFields);
  titleInput.addEventListener("input", checkFields);
  categoryInput.addEventListener("change", checkFields);

  addImage.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("click");

    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const category = categoryInput.value;

    if (!file || !title || category === "0") {
      alert("Veuillez remplir tous les champs !");
      console.log("erreur champs pas tous remplis");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    console.log(formData);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        console.log("fetch fait");
        if (!response.ok) {
          console.log("error");
          throw new Error("Erreur lors de l'envoi de l'image");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        injectImageToGalery(data);
        addImage.classList.remove("enabled");
        addImage.classList.add("disabled");

        alert("Image ajoutée !");
      })
      .catch((error) => console.error("Erreur :", error));
  });

  checkFields();
}