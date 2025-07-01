document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

const email = document.getElementById("email").value;
const senha = document.getElementById("senha").value;

  try {
    const response = await fetch(`http://localhost:3000/usuarios`);
    const usuarios = await response.json();

    const user = usuarios.find(u =>
      ((u.email === email || u.perfil?.email === email) && u.senha === senha)
    );

    if (user) {
      const nome = user.perfil?.nome || "Usuário";
      alert(`Bem-vindo, ${nome}!`);
      localStorage.setItem('user', JSON.stringify(user));

      window.location.href = "../pagina-inicial/index-paginaInicial.html";
    } else {
      alert("E-mail ou senha inválidos!");
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
    console.error(error);
  }
});
