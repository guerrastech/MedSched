document.getElementById("cadastro-paciente-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  if (form.senha.value !== form.confirmarSenha.value) {
    alert("As senhas não coincidem.");
    return;
  }

  const data = {
    cpf: form.cpf.value,
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value,
    nascimento: form.nascimento.value,
    genero: form.genero.value,
    password: form.senha.value,
  };

  try {
    const response = await fetch("http://localhost:3000/api/pacientes/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      form.reset();
    } else {
      const res = await response.json();
      alert(`Erro ao cadastrar paciente: ${res.message || 'Erro desconhecido'}`);
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
    console.error(error);
  }
});
