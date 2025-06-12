document.addEventListener("DOMContentLoaded", async () => {
  const pacienteId = localStorage.getItem("id");
  document.getElementById("nomeUsuario").textContent = `Olá, ${localStorage.getItem("nome") || "Paciente"}`;

  const hospitalSelect = document.getElementById("hospital");
  const medicoSelect = document.getElementById("medico");

    const menuToggle = document.getElementById("menuToggle");
  const menuNav = document.getElementById("menuNav");

  if (menuToggle && menuNav) {
    menuToggle.addEventListener("click", () => {
      menuNav.classList.toggle("show");
    });
  }



  // Carrega hospitais
  const hospitais = await fetch("https://api-medsched.onrender.com/api/hospitais/listarHospitais")
    .then(res => res.json());

  hospitalSelect.innerHTML = `<option value="">Selecione um hospital</option>`;
  hospitais.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h._id;
    opt.textContent = h.nome;
    hospitalSelect.appendChild(opt);
  });

  // quando escolher hospital, carrega médicos
  hospitalSelect.addEventListener("change", async () => {
    const hospitalId = hospitalSelect.value;
    medicoSelect.innerHTML = `<option value="">Carregando...</option>`;
    if (!hospitalId) return;
    
    const medicos = await fetch(`https://api-medsched.onrender.com/api/medicos/buscaPorHospital/${hospitalId}`)
      .then(res => res.json());

    medicoSelect.innerHTML = `<option value="">Selecione um médico</option>`;
    medicos.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m._id;
      opt.textContent = m.nome;
      medicoSelect.appendChild(opt);
    });
  });

  // Enviar agendamento
  document.getElementById("form-agendamento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      paciente: pacienteId,
      medico: medicoSelect.value,
      hospital: hospitalSelect.value,
      date: document.getElementById("data").value,
      horario: document.getElementById("horario").value,
      documento: document.getElementById("documento").value,
      status: 'agendado',
      diagnostico: '1 consulta',
      encamiamento: '1 consulta',
      observacoes: ['1 consulta','1 consulta']
    };

    try {
      console.log("Dados a enviar:", data);
      const response = await fetch("https://api-medsched.onrender.com/api/consultas/marcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
  document.getElementById("modalSucesso").style.display = "flex";
  } else {
        const res = await response.json();
        alert("Erro: " + (res.mensagem || "Não foi possível agendar."));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede.");
    }
  });



});

  function voltarParaHome() {
  window.location.href = "./perfilPaciente.html";
}
