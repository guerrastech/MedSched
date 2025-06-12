document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const dataInput = document.getElementById("datepicker");
    const screenWidth = window.innerWidth;


  if (!token || !id) {
    alert("Você precisa estar logado");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`https://api-medsched.onrender.com/api/medicos/getById/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Token inválido ou expirado");
    }

    const medico = await response.json();
    document.getElementById("nomeMedico").textContent = medico.nome;
    document.getElementById("fotoMedico").src = medico.img;
 if (screenWidth > 768) {
    flatpickr("#datepicker", {
      defaultDate: new Date(),
      inline: true,
      dateFormat: "Y-m-d",
      onChange: function (selectedDates, dateStr) {
        buscarConsultas(id, dateStr, token);
      }
    });
  } else {
    // Campo nativo para mobile
    const mobileInput = document.getElementById('mobile-date');
    const today = new Date().toISOString().split('T')[0];
    mobileInput.value = today;

    mobileInput.addEventListener('change', function () {
      buscarConsultas(id, this.value,token);
    });

    // Dispara a busca ao carregar a tela também
    buscarConsultas(id, mobileInput.value,token);
  }

    const hoje = new Date().toISOString().split("T")[0];
    buscarConsultas(id, hoje, token);

    dataInput.addEventListener("change", () => {
      const dataSelecionada = dataInput.value;
      buscarConsultas(id, dataSelecionada, token);
    });

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
  }
});

async function buscarConsultas(medicoId, data, token) {
  try {
    const response = await fetch(`https://api-medsched.onrender.com/api/consultas/medico-consultas?medicoId=${medicoId}&data=${data}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar consultas");
    }

    const consultas = await response.json();
    const tabela = document.getElementById("tabela-consultas");
    tabela.innerHTML = "";

    if (consultas.length === 0) {
      tabela.innerHTML = `<tr><td colspan="5">Nenhuma consulta encontrada para esta data.</td></tr>`;
      return;
    }

    consultas.forEach((consulta, index) => {
      console.log("Status da consulta:", consulta.status);
      const tr = document.createElement("tr");
      const statusClass = consulta.status.toLowerCase();
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${consulta.horario || "Sem horário"}</td>
        <td>${consulta.paciente?.nome || "Desconhecido"}</td>
        <td>${consulta.documento || "Sem descrição"}</td>
        <td><span class="status ${statusClass}">${consulta.status}</span></td>
      `;
      tr.addEventListener("click", () => abrirModalConsulta(consulta));
      tabela.appendChild(tr);
    });

    document.querySelectorAll(".btn-cancelar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const consultaId = e.target.getAttribute("data-id");
        const confirmar = confirm("Tem certeza que deseja cancelar esta consulta?");
        if (!confirmar) return;

        try {
          const response = await fetch(`https://api-medsched.onrender.com/api/consultas/cancelarConsulta/${consultaId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error("Falha ao cancelar consulta.");
          }

          alert("Consulta cancelada com sucesso.");
          buscarConsultas(medicoId, data, token);

        } catch (error) {
          console.error("Erro ao cancelar consulta:", error);
          alert("Erro ao cancelar consulta.");
        }
      });
    });

    verificarConsultasTarde(consultas);

  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    alert("Erro ao carregar consultas.");
  }
}

function verificarConsultasTarde(consultas) {
  const alerta = document.getElementById("alerta-tarde");

  const temConsultaTarde = consultas.some(c => {
    const [hora, minuto] = c.horario.split(":").map(Number);
    return hora >= 13;
  });

  alerta.style.display = temConsultaTarde ? "none" : "block";
}

function abrirModalConsulta(consulta) {
  document.getElementById("btn-concluir").setAttribute("data-id", consulta.id);

  document.getElementById("modal-nome").textContent = consulta.paciente?.nome || "Desconhecido";
  document.getElementById("modal-dataHora").textContent = `${consulta.horario || "horário indefinido"}`;
  document.getElementById("modal-status").textContent = consulta.status || "Indefinido";
  document.getElementById("modal-motivo").textContent = consulta.documento || "Não informado";
  document.getElementById("modal-historico").textContent = consulta.diagnostico || "Sem histórico.";
  document.getElementById("modal-historico1").textContent = consulta.encamiamento || "Sem histórico.";
  document.getElementById("modal-observacoes").textContent = consulta.observacoes || "Sem observações.";


  document.getElementById("btn-concluir").setAttribute("data-id", consulta._id);

  document.getElementById("modal-detalhes").classList.remove("hidden");
}

document.querySelector(".fechar-modal").addEventListener("click", () => {
  document.getElementById("modal-detalhes").classList.add("hidden");
});

document.getElementById("btn-concluir").addEventListener("click", async () => {
  const consultaId = document.getElementById("btn-concluir").getAttribute("data-id");
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const dataSelecionada = document.getElementById("datepicker").value;

  if (!consultaId) return;

  try {
    console.log("Concluindo consulta ID:", consultaId);
    const response = await fetch(`https://api-medsched.onrender.com/api/consultas/atualizarConsulta/${consultaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: "concluido" })
    });

    if (!response.ok) {
      throw new Error("Erro ao concluir a consulta.");
    }

    alert("Consulta marcada como concluída com sucesso.");
    document.getElementById("modal-detalhes").classList.add("hidden");
    buscarConsultas(id, dataSelecionada, token);

  } catch (error) {
    console.error("Erro ao concluir consulta:", error);
    alert("Erro ao concluir a consulta.");
  }
});

document.getElementById("btn-inserir-info").addEventListener("click", () => {
  alert("Função de inserção de informações ainda não implementada.");
});
