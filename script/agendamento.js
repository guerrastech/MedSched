document.addEventListener("DOMContentLoaded", async () => {
  const pacienteId = localStorage.getItem("id");
  document.getElementById("nomePaciente").textContent = `Olá, ${localStorage.getItem("nome") || "Paciente"}`;

  const hospitalSelect = document.getElementById("hospital");
  const medicoSelect = document.getElementById("medico");

  // Carrega hospitais
  const hospitais = await fetch("http://localhost:3000/api/hospitais/listarHospitais")
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

    const medicos = await fetch(`http://localhost:3000/api/medicos/buscaPorHospital/${hospitalId}`)
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
      documento: document.getElementById("documento").value
    };

    try {
      const response = await fetch("http://localhost:3000/api/consultas/marcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Consulta agendada com sucesso!");
        window.location.href = "homePaciente.html";
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
