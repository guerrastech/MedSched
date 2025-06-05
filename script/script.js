document.addEventListener('DOMContentLoaded', function () {
  const clinicaSelect = document.getElementById('clinica');
  const medicoSelect = document.getElementById('medico');
  const horarioCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
  const form = document.querySelector('form');

  const medicosPorClinica = {
    'Hospital Central': ['Dr. Ana Souza', 'Dr. Pedro Lima'],
    'Clínica Vida': ['Dra. Julia Rocha', 'Dr. Carlos Silva'],
    'Centro Médico Alfa': ['Dr. Rafael Torres', 'Dra. Beatriz Nunes']
  };

  clinicaSelect.addEventListener('change', function () {
    const clinicaSelecionada = clinicaSelect.value;
    const medicos = medicosPorClinica[clinicaSelecionada] || [];

    medicoSelect.innerHTML = '<option disabled selected>Selecione um médico</option>';
    medicos.forEach(medico => {
      const option = document.createElement('option');
      option.value = medico;
      option.textContent = medico;
      medicoSelect.appendChild(option);
    });
  });

  horarioCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        horarioCheckboxes.forEach(cb => {
          if (cb !== checkbox) cb.checked = false;
        });
      }
    });
  });

  form.addEventListener('submit', function (e) {
    const especialidade = document.querySelector('select:nth-of-type(1)').value;
    const clinica = clinicaSelect.value;
    const medico = medicoSelect.value;
    const data = document.querySelector('input[type="date"]').value;
    const horarioSelecionado = Array.from(horarioCheckboxes).some(cb => cb.checked);

    if (!especialidade || !clinica || !medico || !data || !horarioSelecionado) {
      e.preventDefault();
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  });
});
