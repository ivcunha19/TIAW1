let freelancers = []; 

async function carregarFreelancers() {
  try {
    const response = await fetch('http://localhost:3000/usuarios');
    const usuarios = await response.json();

    freelancers = usuarios
      .filter(user => user.tipo === "freelancer")
      .map(freelancerData => {
        const perfil = freelancerData.perfil;
        const servicosOferecidos = perfil.servicos_oferecidos && perfil.servicos_oferecidos.length > 0
          ? perfil.servicos_oferecidos[0]
          : {};

    const avaliacoes = perfil.avaliacoes_recebidas || [];
    const avaliacao = avaliacoes.length > 0
      ? (
          avaliacoes.reduce((soma, a) => {
            const media = ((a.pontualidade || 0) + (a.qualidade || 0) + (a.comunicacao || 0)) / 3;
            return soma + media;
          }, 0) / avaliacoes.length
        ).toFixed(1)
      : 0;

      return {
        id: freelancerData.id,
        nome: perfil.nome,
        profissao: servicosOferecidos.nome_servico || "Serviço não especificado",
        descricao: servicosOferecidos.descricao || servicosOferecidos.descricao_servico || "Sem descrição.",
        preco_hora: servicosOferecidos.preco_por_hora || 0,
        avaliacao: avaliacao,
        localizacao: `${perfil.endereco.cidade}, ${perfil.endereco.estado}`,
        favorito: false,
        id_servico: servicosOferecidos.id_servico || 1 
      };

      });

    aplicarFiltros();
    preencherLocalizacoes();
  } catch (error) {
    console.error("Erro ao carregar freelancers:", error);
  }
}

function agendarServico(idFreelancer, idServico) {
  const url = `../servicos/aceitarServicos.html?freelancer=${idFreelancer}&servico=${idServico}`;
  window.location.href = url;
}

function renderFreelancers(lista) {
  const grid = document.getElementById("freelancerGrid");
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = "<p>Nenhum serviço encontrado com os filtros aplicados.</p>";
    return;
  }

  lista.forEach(f => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="https://picsum.photos/80/80?random=${f.id}" alt="${f.nome}" />
        <h3><a href="../perfil/perfilpro.html?id=${f.id}">${f.nome}</a></h3>
        <p><strong>${f.profissao}</strong></p>
        <p>${f.localizacao}</p>
        <p>R$ ${f.preco_hora}/hora</p>
        <p>Avaliação: ${f.avaliacao}</p>
        <div class="actions">
          <button onclick="favoritar('${f.id}')">${f.favorito ? "Desfavoritar" : "Favoritar"}</button>
          <button onclick="agendarServico('${f.id}', ${f.id_servico})">Agendar</button>
        </div>
      `;
    grid.appendChild(card);
  });
}

function aplicarFiltros() {
  const termoBusca = document.getElementById("campoBusca").value.trim().toLowerCase();
  const localizacao = document.getElementById("localizacaoFiltro").value;
  const precoMax = parseFloat(document.getElementById("precoMaxFiltro").value);
  const avaliacaoMin = parseFloat(document.getElementById("avaliacaoFiltro").value);
  const apenasFavoritos = document.getElementById("favoritosFiltro").checked;

  const filtrados = freelancers.filter(f => {
    const porBusca =
      !termoBusca ||
      f.nome.toLowerCase().includes(termoBusca) ||
      f.profissao.toLowerCase().includes(termoBusca) ||
      f.descricao.toLowerCase().includes(termoBusca);

    const porLocal = !localizacao || f.localizacao === localizacao;
    const porPreco = isNaN(precoMax) || f.preco_hora <= precoMax;
    const porAvaliacao = isNaN(avaliacaoMin) || f.avaliacao >= avaliacaoMin || f.avaliacao === 0;
    const porFavorito = !apenasFavoritos || f.favorito;

    return porBusca && porLocal && porPreco && porAvaliacao && porFavorito;
  });

  renderFreelancers(filtrados);
}

function favoritar(id) {
  const freelancer = freelancers.find(f => f.id === id);
  if (freelancer) {
    freelancer.favorito = !freelancer.favorito;
    aplicarFiltros();
  }
}

/*function comparar(id) {
  window.location.href = `../comparar/compararFreelancer.html?freelancer1_id=${id}`;
}*/

function agendar(id) {
  window.location.href = `../agendamento/agendamento.html?freelancer1_id=${id}`;
}

function preencherLocalizacoes() {
  const select = document.getElementById("localizacaoFiltro");
  const todasLocalizacoes = [...new Set(freelancers.map(f => f.localizacao))].sort();
  select.innerHTML = `<option value="">Todas Localizações</option>`;
  todasLocalizacoes.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    select.appendChild(option);
  });
}

document.getElementById("campoBusca").addEventListener("input", aplicarFiltros);
document.getElementById("localizacaoFiltro").addEventListener("change", aplicarFiltros);
document.getElementById("precoMaxFiltro").addEventListener("input", aplicarFiltros);
document.getElementById("avaliacaoFiltro").addEventListener("change", aplicarFiltros);
document.getElementById("favoritosFiltro").addEventListener("change", aplicarFiltros);


carregarFreelancers();

