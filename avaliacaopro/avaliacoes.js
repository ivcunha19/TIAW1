document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const profissionalId = params.get("id");

  if (!profissionalId) {
    alert("ID do profissional não especificado na URL.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/usuarios?id=${profissionalId}`);
    const data = await response.json();

    if (data.length === 0) {
      document.getElementById("avaliacoes-lista").innerHTML = "<p>Profissional não encontrado.</p>";
      return;
    }

    const usuario = data[0];
    const avaliacoes = usuario.perfil.avaliacoes_recebidas || [];

    if (avaliacoes.length === 0) {
      document.getElementById("avaliacoes-lista").innerHTML = "<p>Nenhuma avaliação encontrada para este profissional.</p>";
      return;
    }

    // Calcular médias
    const mediaEstrelas = calcularMedia(avaliacoes);
    const mediaPontualidade = calcularMediaCriterio(avaliacoes, 'pontualidade');
    const mediaQualidade = calcularMediaCriterio(avaliacoes, 'qualidade');
    const mediaComunicacao = calcularMediaCriterio(avaliacoes, 'comunicacao');

    // Exibir médias
    document.getElementById("media-estrelas").textContent = mediaEstrelas;
    document.getElementById("fill-media").style.width = (mediaEstrelas * 20) + "%";
    document.getElementById("fill-pontualidade").style.width = (mediaPontualidade * 20) + "%";
    document.getElementById("fill-qualidade").style.width = (mediaQualidade * 20) + "%";
    document.getElementById("fill-comunicacao").style.width = (mediaComunicacao * 20) + "%";

    // Exibir avaliações
    const avaliacoesLista = document.getElementById("avaliacoes-lista");
    avaliacoes.forEach(avaliacao => {
      const div = document.createElement("div");
      div.classList.add("avaliacao");
      div.innerHTML = `
        <p><strong>Comentário:</strong> ${avaliacao.comentario}</p>
        <p><strong>Data:</strong> ${avaliacao.data}</p>
        <p><strong>Pontualidade:</strong> ${"★".repeat(avaliacao.pontualidade)}${"☆".repeat(5 - avaliacao.pontualidade)}</p>
        <p><strong>Qualidade:</strong> ${"★".repeat(avaliacao.qualidade)}${"☆".repeat(5 - avaliacao.qualidade)}</p>
        <p><strong>Comunicação:</strong> ${"★".repeat(avaliacao.comunicacao)}${"☆".repeat(5 - avaliacao.comunicacao)}</p>
      `;
      avaliacoesLista.appendChild(div);
    });

  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    document.getElementById("avaliacoes-lista").innerHTML = "<p>Erro ao carregar avaliações.</p>";
  }

  function calcularMedia(avaliacoes) {
    const total = avaliacoes.reduce((sum, a) =>
      sum + ((+a.pontualidade + +a.qualidade + +a.comunicacao) / 3), 0);
    return (total / avaliacoes.length).toFixed(1);
  }

  function calcularMediaCriterio(avaliacoes, criterio) {
    const total = avaliacoes.reduce((sum, a) => sum + parseInt(a[criterio]), 0);
    return (total / avaliacoes.length).toFixed(1);
  }
});
