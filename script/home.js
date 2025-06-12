// script/home.js
const carrossel = document.getElementById("carrossel-medicos");
const anterior = document.getElementById("anterior");
const proximo = document.getElementById("proximo");

let scrollPosition = 0;

fetch("https://api-medsched.onrender.com/api/medicos/listarMedicos")
  .then(res => res.json())
  .then(medicos => {
    medicos.forEach(medico => {
      const card = document.createElement("div");
      card.classList.add("medico-card");

      card.innerHTML = `
        <img src="${medico.img}" alt="Foto de ${medico.nome}">
        <h3>${medico.nome}</h3>
        <p>${medico.especialidade}</p>
        <button onclick="location.href='./perfilEspecialista.html?id=${medico._id}'" class="agendar-btn">Ver Perfil</button>
      `;

      carrossel.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Erro ao buscar médicos:", err);
    carrossel.innerHTML = "<p>Erro ao carregar médicos.</p>";
  });

// Controle do carrossel
anterior.addEventListener("click", () => {
  carrossel.scrollBy({ left: -300, behavior: "smooth" });
});

proximo.addEventListener("click", () => {
  carrossel.scrollBy({ left: 300, behavior: "smooth" });
});