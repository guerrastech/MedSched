document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  if (!token || !id) {
    alert("Você precisa estar logado");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/medicos/getById/${id}`, {
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

    // Inicializar data com o dia de hoje
    const dataInput = document.getElementById("data-consulta");
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.value = hoje;

    // Buscar consultas ao carregar a página
    buscarConsultas(id, hoje, token);

    // Buscar consultas ao alterar a data
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

// Função para buscar e exibir as consultas
async function buscarConsultas(medicoId, data, token) {
  try {
    const response = await fetch(`http://localhost:3000/api/consultas/medico-consultas?medicoId=${medicoId}&data=${data}`, {
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

    // Preencher a tabela com os dados reais
    consultas.forEach((consulta, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${consulta.horario || "Sem horário"}</td>
        <td>${consulta.paciente?.nome || "Desconhecido"}</td>
        <td>${consulta.documento || "Sem descrição"}</td>
        <td>
          <button data-id="${consulta._id}" class="btn-cancelar">Cancelar</button>
        </td>
      `;
      tabela.appendChild(tr);
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

  if (!temConsultaTarde) {
    alerta.style.display = "block";
  } else {
    alerta.style.display = "none";
  }
}