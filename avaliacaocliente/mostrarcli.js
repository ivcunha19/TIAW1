document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const clienteId = params.get("id");

  if (!clienteId) {
    alert("ID do cliente não especificado na URL.");
    return;
  }

  // URL do JSON Server (ajuste se necessário)
  const apiUrl = `http://localhost:3000/usuarios?id=${clienteId}`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados do cliente.");
      return res.json();
    })
    .then(data => {
      if (!data.length) {
        document.getElementById("avaliacoes-lista").innerHTML = "<p>Cliente não encontrado.</p>";
        return;
      }

      const cliente = data[0];
      const avaliacoes = cliente.perfil.avaliacoes_realizadas || [];

      if (avaliacoes.length === 0) {
        document.getElementById("avaliacoes-lista").innerHTML = "<p>Nenhuma avaliação encontrada para este cliente.</p>";
        return;
      }

      // Calcular média da nota das avaliações (supondo que nota está em 'nota')
      const mediaNota = (avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length).toFixed(1);

      // Exibir média no elemento com id "media-estrelas" (crie no HTML)
      if (document.getElementById("media-estrelas")) {
        document.getElementById("media-estrelas").textContent = mediaNota;
      }

      const avaliacoesLista = document.getElementById("avaliacoes-lista");
      avaliacoesLista.innerHTML = "";

      avaliacoes.forEach(avaliacao => {
        const div = document.createElement("div");
        div.classList.add("avaliacao");
        div.innerHTML = `
          <p><strong>Usuário:</strong> ${avaliacao.nome_usuario || "Anônimo"}</p>
          <p><strong>Nota:</strong> ${"★".repeat(avaliacao.nota)}${"☆".repeat(5 - avaliacao.nota)}</p>
          ${avaliacao.comentario ? `<p><strong>Comentário:</strong> ${avaliacao.comentario}</p>` : ""}
        `;
        avaliacoesLista.appendChild(div);
      });
    })
    .catch(error => {
      console.error(error);
      document.getElementById("avaliacoes-lista").innerHTML = "<p>Erro ao carregar avaliações.</p>";
    });
});