document.addEventListener("DOMContentLoaded", async () => {
  const pacienteId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

    const menuToggle = document.getElementById("menuToggle");
  const menuNav = document.getElementById("menuNav");

  if (menuToggle && menuNav) {
    menuToggle.addEventListener("click", () => {
      menuNav.classList.toggle("show");
    });
  }


  if (!pacienteId || !token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nomeUsuario").textContent = `Olá, ${localStorage.getItem("nome") || "Paciente"}`;

    try {
    const response = await fetch(`https://api-medsched.onrender.com/api/pacientes/getById/${pacienteId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar paciente");
    }

    const paciente = await response.json();
    

    // Atualizar elementos da página
    document.getElementById("fotoUsuario").src = paciente.img;
  } catch (error) {
    console.error("Erro ao carregar dados do paciente:", error);
    alert("Erro ao carregar perfil.");
    window.location.href = "login.html";
  }





  try {
    const res = await fetch(`https://api-medsched.onrender.com/api/consultas/paciente-consultas/${pacienteId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar consultas.");

    const consultas = await res.json();
    const lista = document.getElementById("listaConsultas");

    if (consultas.length === 0) {
      lista.innerHTML = "<p>Você ainda não possui consultas agendadas.</p>";
      return;
    }

    consultas.forEach(consulta => {
      const data = new Date(consulta.date).toLocaleDateString("pt-BR");
      const card = document.createElement("div");
      card.className = "consulta-card";
      card.innerHTML = `
        <div class="consulta-info">
          <span class="status">Aberto</span>
          <p><strong>${data}</strong> às <strong>${consulta.horario}</strong></p>
          <p>Dr. ${consulta.medico.nome} — ${consulta.medico.especialidade}</p>
          <p>${consulta.hospital.nome}</p>
        </div>
        <button class="btn-detalhes" onclick="verDetalhes('${consulta._id}')">Ver detalhes</button>
      `;
      lista.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar consultas:", error);
    alert("Erro ao carregar suas consultas.");
  }
});

async function verDetalhes(id) {
  console.log("ID recebido para detalhes:", id);
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`https://api-medsched.onrender.com/api/consultas/consultas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao buscar detalhes da consulta");

    const consulta = await res.json();

    document.getElementById("modalEspecialidade").textContent = consulta.medico.especialidade;
    document.getElementById("modalLocal").textContent = consulta.hospital.nome;
    document.getElementById("modalMedico").textContent = `Dr. ${consulta.medico.nome}`;
    document.getElementById("modalData").textContent = new Date(consulta.date).toLocaleDateString("pt-BR");
    document.getElementById("modalHorario").textContent = consulta.horario;

    const cancelarLink = document.getElementById("cancelarLink");
cancelarLink.onclick = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`https://api-medsched.onrender.com/api/consultas/cancelarConsulta/${consulta._id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Erro ao cancelar consulta");

    fecharModal(); // Fecha o modal de detalhes
    document.getElementById("modalCancelado").classList.remove("hidden"); // Abre o modal de sucesso
  } catch (err) {
    console.error("Erro ao cancelar consulta:", err);
    alert("Não foi possível cancelar a consulta.");
  }
};

    document.getElementById("modalDetalhes").classList.remove("hidden");
  } catch (error) {
    console.error("Erro ao buscar consulta:", error);
    alert("Erro ao exibir detalhes da consulta.");
  }
}


function fecharModal() {
  document.getElementById("modalDetalhes").classList.add("hidden");
}

function fecharModalCancelado() {
  document.getElementById("modalCancelado").classList.add("hidden");
  window.location.reload();
}

