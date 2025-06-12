function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function carregarPerfil() {
  const id = getIdFromURL();
  if (!id) {
    document.getElementById("perfil-box").innerHTML = "<p>ID do médico não encontrado.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/medicos/getById/${id}`);
    const medico = await res.json();

    // Busca nome do hospital
    let nomeHospital = "Não informado";
    if (medico.hospital) {
      try {
        const hospitalRes = await fetch(`http://localhost:3000/api/hospitais/listarPorId/${medico.hospital}`);
        const hospital = await hospitalRes.json();
        nomeHospital = hospital.nome || nomeHospital;
      } catch (err) {
        console.warn("Erro ao buscar hospital:", err);
      }
    }

    const perfilHTML = `
      <img src="${medico.img}" alt="Foto de ${medico.nome}" />
      <div class="perfil-info">
        <h2>Dr. ${medico.nome}</h2>
        <p><strong>${medico.especialidade}</strong></p>
        <p>CRM ${medico.CRM} - ${medico.UF}</p>
        <hr />
        <h3>Sobre</h3>
        <p>${medico.descricao}</p>
        <h3>Hospital Onde Atende</h3>
        <p>${nomeHospital}</p>
      </div>
    `;

    document.getElementById("perfil-box").innerHTML = perfilHTML;
  } catch (error) {
    console.error("Erro ao carregar médico:", error);
    document.getElementById("perfil-box").innerHTML = "<p>Erro ao carregar informações.</p>";
  }
}

window.onload = carregarPerfil;
