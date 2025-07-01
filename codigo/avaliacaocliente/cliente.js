document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("avaliacaoForm");
  const limparBtn = document.getElementById("limparBtn");

  // Captura o ID do cliente da URL
  const params = new URLSearchParams(window.location.search);
  const clienteId = params.get("id");

  if (!clienteId) {
    alert("Cliente não especificado na URL.");
    return;
  }

  // Estrelas clicáveis
  document.querySelectorAll(".estrelas span").forEach(star => {
    star.addEventListener("click", () => {
      const value = star.dataset.value;
      const container = star.parentElement;
      const inputId = container.dataset.item;
      document.getElementById(inputId).value = value;

      container.querySelectorAll("span").forEach(s => {
        s.classList.toggle("selecionada", s.dataset.value <= value);
      });
    });
  });

  // Enviar avaliação
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const qualidade = parseInt(document.getElementById("qualidade").value);
    const comentario = document.getElementById("comentario").value.trim();

    if (!qualidade) {
      alert("Selecione uma nota antes de enviar.");
      return;
    }

    const novaAvaliacao = {
      tipo_usuario: "freelancer", // ou o tipo que fizer sentido aqui
      nome_usuario: "Usuário Avaliador", // pode ser substituído por nome dinâmico
      nota: qualidade,
      comentario,
      data: new Date().toISOString()
    };

    try {
      // Busca o cliente no backend
      const resGet = await fetch(`http://localhost:3000/usuarios?id=${clienteId}`);
      const data = await resGet.json();

      if (data.length === 0) {
        alert("Cliente não encontrado.");
        return;
      }

      const cliente = data[0];

      // Garante que existe o array avaliações_realizadas
      if (!cliente.perfil.avaliacoes_realizadas) {
        cliente.perfil.avaliacoes_realizadas = [];
      }

      // Adiciona a nova avaliação
      cliente.perfil.avaliacoes_realizadas.push(novaAvaliacao);

      // Atualiza o cliente no backend
      const resPatch = await fetch(`http://localhost:3000/usuarios/${cliente.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          perfil: {
            ...cliente.perfil,
            avaliacoes_realizadas: cliente.perfil.avaliacoes_realizadas
          }
        })
      });

      if (!resPatch.ok) {
        throw new Error("Erro ao salvar avaliação.");
      }

      alert("Avaliação salva com sucesso!");
      limparFormulario();

    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      alert("Falha ao salvar avaliação. Tente novamente.");
    }
  });

  limparBtn.addEventListener("click", limparFormulario);

  function limparFormulario() {
    form.reset();
    document.getElementById("qualidade").value = "";
    document.querySelectorAll(".estrelas span").forEach(s => {
      s.classList.remove("selecionada");
    });
  }
});