document.addEventListener("DOMContentLoaded", async () => {
  const medicoId = localStorage.getItem("id");

  if (!medicoId) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("sair").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});



  try {
    const response = await fetch(`https://api-medsched.onrender.com/api/medicos/getById/${medicoId}`);
    const medico = await response.json();
    medicoAtual = medico

    // Preenche os dados
    document.getElementById("fotoUsuario").src = medico.img;
    document.getElementById("fotoPerfil").src = medico.img;
    document.getElementById("nomeUsuario").textContent = `Olá, Dr. ${medico.nome}`;
    document.getElementById("nomeMedico").textContent = `Dr. ${medico.nome}`;
    document.getElementById("especialidade").textContent = medico.especialidade;
    document.getElementById("crmUf").textContent = `${medico.CRM} / ${medico.UF}`;
    document.getElementById("telefone").textContent = medico.telefone;
    document.getElementById("email").textContent = medico.email;
    document.getElementById("descricao").textContent = medico.descricao;

    // Busca nome do hospital se necessário
    const hospitalResp = await fetch(`https://api-medsched.onrender.com/api/hospitais/listarPorId/${medico.hospital}`);
    const hospitalData = await hospitalResp.json();
    document.getElementById("nomeHospital").textContent = hospitalData.nome || "Hospital";

  } catch (err) {
    console.error("Erro ao carregar perfil do médico:", err);
    alert("Não foi possível carregar os dados do perfil.");
  }
});



const btnEditar = document.querySelector(".editar");
const modal = document.getElementById("modal-editar");
const fecharModal = document.getElementById("fecharModal");
const formEditar = document.getElementById("form-editar");

let medicoAtual = {}; // Armazena os dados carregados

btnEditar.addEventListener("click", () => {
  // Preenche os campos com os dados atuais
  document.getElementById("edit-nome").value = medicoAtual.nome || "";
  document.getElementById("edit-especialidade").value = medicoAtual.especialidade || "";
  document.getElementById("edit-crm").value = medicoAtual.CRM || "";
  document.getElementById("edit-uf").value = medicoAtual.UF || "";
  document.getElementById("edit-telefone").value = medicoAtual.telefone || "";
  document.getElementById("edit-email").value = medicoAtual.email || "";
  document.getElementById("edit-descricao").value = medicoAtual.descricao || "";

  modal.style.display = "block";
});

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Atualizar médico
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token"); 

  const dadosAtualizados = {
    nome: document.getElementById("edit-nome").value,
    especialidade: document.getElementById("edit-especialidade").value,
    CRM: document.getElementById("edit-crm").value,
    UF: document.getElementById("edit-uf").value,
    telefone: document.getElementById("edit-telefone").value,
    email: document.getElementById("edit-email").value,
    descricao: document.getElementById("edit-descricao").value,
  };

  try {
    const response = await fetch(`https://api-medsched.onrender.com/api/medicos/atualizarMedico/${id}`, {
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




document.getElementById("inputFoto").addEventListener("change", async function () {
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

    // Atualiza no banco de dados
    const medicoId = localStorage.getItem("id");
    await fetch(`https://api-medsched.onrender.com/api/medicos/atualizarMedico/${medicoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ img: novaUrl })
    });

    alert("Foto atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    alert("Erro ao atualizar foto.");
  }
});
