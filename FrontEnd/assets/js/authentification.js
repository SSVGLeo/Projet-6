export function setupLogin () {
    const button = document.querySelector("button");

    if (!button) {
        return;
    }

    
    button.addEventListener("click", () => {
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
      
        fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => {
              if (response.ok) {
                  return response.json();
          } else {
              throw new Error("E-mail ou mot de passe incorrect");
          }
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("token", data.token);
            window.location.href = "modal.html";
          })
          .catch((error) => {
              console.log("Erreur", error);
              const errorMessage = document.querySelector("#error__msg");
              errorMessage.classList.remove("none");
              errorMessage.classList.add("error");
          });
      
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "login.html"; // Redirection vers la page de login si le token n'est pas présent
        }
      });
}
