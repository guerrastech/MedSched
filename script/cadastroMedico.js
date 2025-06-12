document.getElementById("cadastro-medico-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  
  const data = {
    nome: form.nome.value,
    cpf: form.cpf.value,
    genero: form.genero.value,
    especialidade: form.especialidade.value,
    CRM: form.crm.value,
    hospital: "6837a0d733c37b63139d81f7",
    UF: form.uf.value,
    telefone: form.telefone.value,
    password: form.senha.value,
    email: form.email.value,
    descricao: "imagem nao cadatrada",
    img: "imagem nao cadastrada"
  };

  try {
    const response = await fetch("https://api-medsched.onrender.com/api/medicos/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      form.reset();
    } else {
      alert("Erro ao cadastrar médico.");
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
    console.error(error);
  }
});

