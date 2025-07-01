document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("avaliacaoForm");
  const limparBtn = document.getElementById("limparBtn");
  const params = new URLSearchParams(window.location.search);
  const profissionalId = params.get("id");

  if (!profissionalId) {
    alert("Profissional não especificado na URL.");
    return;
  }

  // Estrelas clicáveis
  document.querySelectorAll(".estrelas").forEach(estrelas => {
    const item = estrelas.dataset.item;
    estrelas.querySelectorAll("span").forEach(star => {
      star.addEventListener("click", () => {
        const value = star.dataset.value;
        document.getElementById(item).value = value;
        estrelas.querySelectorAll("span").forEach(s => {
          s.classList.toggle("selecionada", s.dataset.value <= value);
        });
      });
    });
  });

  // Enviar avaliação
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const comentario = document.getElementById("comentario").value.trim();
    const pontualidade = document.getElementById("pontualidade").value;
    const qualidade = document.getElementById("qualidade").value;
    const comunicacao = document.getElementById("comunicacao").value;

    if (!comentario || !pontualidade || !qualidade || !comunicacao) {
      alert("Preencha todos os campos.");
      return;
    }

    const novaAvaliacao = {
      tipo_usuario: "freelancer",
      nome_usuario: "Freelancer Anônimo",
      comentario,
      data: new Date().toLocaleString(),
      pontualidade: parseInt(pontualidade),
      qualidade: parseInt(qualidade),
      comunicacao: parseInt(comunicacao)
    };

    try {
      const response = await fetch(`http://localhost:3000/usuarios?id=${profissionalId}`);
      const data = await response.json();

      if (data.length === 0) {
        alert("Profissional não encontrado.");
        return;
      }

      const usuario = data[0];
      if (!usuario.perfil.avaliacoes_recebidas) {
        usuario.perfil.avaliacoes_recebidas = [];
      }

      usuario.perfil.avaliacoes_recebidas.push(novaAvaliacao);

      await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      });

      alert("Avaliação enviada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação.");
    }
  });

  limparBtn.addEventListener("click", () => {
    form.reset();
    document.querySelectorAll(".estrelas span").forEach(s => s.classList.remove("selecionada"));
  });
});