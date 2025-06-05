document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const pacienteId = localStorage.getItem("id"); 

  if (!token || !pacienteId) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("sair").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

  try {
    const response = await fetch(`http://localhost:3000/api/pacientes/getById/${pacienteId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar paciente");
    }

    const paciente = await response.json();

    // Atualizar elementos da página
    document.getElementById("nomeUsuario").textContent = `Olá, ${paciente.nome}`;
    document.getElementById("nomePaciente").textContent = paciente.nome;
    document.getElementById("nomeCompleto").textContent = paciente.nome;
    document.getElementById("email").textContent = paciente.email;
    document.getElementById("telefone").textContent = paciente.telefone;
    document.getElementById("cpf").textContent = formatarCPF(paciente.cpf);
    document.getElementById("dataNascimento").textContent = formatarData(paciente.nascimento);
    document.getElementById("idadePaciente").textContent = calcularIdade(paciente.nascimento) + " anos";

    
    document.getElementById("fotoUsuario").src = "../logo/usuario.png";
    document.getElementById("fotoPerfil").src = "../logo/usuario.png";

  } catch (error) {
    console.error("Erro ao carregar dados do paciente:", error);
    alert("Erro ao carregar perfil.");
    window.location.href = "login.html";
  }
});

// formatação da data de nascimento
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Função para calcular idade a partir da data
function calcularIdade(dataISO) {
  const nascimento = new Date(dataISO);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}


function formatarCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
