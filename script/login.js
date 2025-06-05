document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  document.getElementById("btn-medico").addEventListener("click", async (e) => {
    e.preventDefault();
    await fazerLogin("medico");
  });

  document.getElementById("btn-paciente").addEventListener("click", async (e) => {
    e.preventDefault();
    await fazerLogin("paciente");
  });

  async function fazerLogin(tipo) {
    const cpf = document.getElementById("cpf").value;
    const password = document.getElementById("senha").value;

    try {
      const response = await fetch(`http://localhost:3000/api/auth/login/${tipo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);

        if (tipo === "medico") {
          window.location.href = "homeMedico.html";
        } else {
          window.location.href = "perfilPaciente.html";
        }
      } else {
        alert(data.mensagem || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de rede ao tentar fazer login");
    }
  }
});
