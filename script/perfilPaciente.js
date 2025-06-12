document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const pacienteId = localStorage.getItem("id");

  if (!token || !pacienteId) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }


      const menuToggle = document.getElementById("menuToggle");
  const menuNav = document.getElementById("menuNav");

  if (menuToggle && menuNav) {
    menuToggle.addEventListener("click", () => {
      menuNav.classList.toggle("show");
    });
  }

  document.getElementById("sair").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  document.querySelector(".imagem-container").addEventListener("click", () => {
  document.getElementById("inputImagem").click();
});



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
    localStorage.setItem("nome", paciente.nome);
    document.getElementById("nomeUsuario").textContent = `Olá, ${paciente.nome}`;
    document.getElementById("nomePaciente").textContent = paciente.nome;
    document.getElementById("nomeCompleto").textContent = paciente.nome;
    document.getElementById("email").textContent = paciente.email;
    document.getElementById("telefone").textContent = paciente.telefone;
    document.getElementById("cpf").textContent = formatarCPF(paciente.cpf);
    document.getElementById("dataNascimento").textContent = formatarData(paciente.nascimento);
    document.getElementById("idadePaciente").textContent = calcularIdade(paciente.nascimento) + " anos";

    document.getElementById("fotoUsuario").src = paciente.img;
    document.getElementById("fotoPerfil").src = paciente.img;

  } catch (error) {
    console.error("Erro ao carregar dados do paciente:", error);
    alert("Erro ao carregar perfil.");
    window.location.href = "login.html";
  }

const btnEditar = document.getElementById("editar");
const modal = document.getElementById("modal-editar");
const fecharModal = document.getElementById("fecharModal");
const formEditar = document.getElementById("form-editar");

let pacienteAtual = {};

btnEditar.addEventListener("click", () => {
  // Preenche os campos com os dados atuais
  document.getElementById("edit-nome").value = pacienteAtual.nome || "";
  document.getElementById("edit-telefone").value = pacienteAtual.telefone || "";
  document.getElementById("edit-email").value = pacienteAtual.email || "";

  modal.style.display = "block";
});

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Atualizar paciente
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token"); 

  const dadosAtualizados = {
    nome: document.getElementById("edit-nome").value,
    telefone: document.getElementById("edit-telefone").value,
    email: document.getElementById("edit-email").value,
  };

  try {
    const response = await fetch(`https://api-medsched.onrender.com/api/pacientes/atualizar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(dadosAtualizados)
    });

    if (!response.ok) throw new Error("Erro ao atualizar perfil.");

    alert("Perfil atualizado com sucesso!");
    modal.style.display = "none";
    window.location.reload(); 

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao salvar alterações.");
  }
});




  // Listener para upload de imagem
  document.getElementById("inputImagem").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "medschead");

      const cloudName = "dfrngbz8u";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const cloudRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData
      });

      const cloudData = await cloudRes.json();
      const novaUrl = cloudData.secure_url;

      // Atualiza a imagem na tela imediatamente
      document.getElementById("fotoPerfil").src = novaUrl;
      document.getElementById("fotoUsuario").src = novaUrl;

      // Atualiza no banco de dados com token
      await fetch(`https://api-medsched.onrender.com/api/pacientes/atualizar/${pacienteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ img: novaUrl })
      });

      alert("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      alert("Erro ao atualizar foto.");
    }
  });
});

// Função para formatar data de nascimento
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Função para calcular idade
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

// Função para formatar CPF
function formatarCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
