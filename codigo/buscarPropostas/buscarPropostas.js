let propostas = [];


async function carregarPropostas() {
  try {
     const response = await fetch('http://localhost:3000/usuarios');
     const usuarios = await response.json();
    
     propostas = usuarios
       .filter(user => user.tipo === "cliente")
       .flatMap(cliente => 
         cliente.perfil.propostas_servico?.map(proposta => ({
           id: proposta.id,
           servico: proposta.servico,
           local: proposta.local,
           pagamento: parseInt(proposta.pagamento),
           data: proposta.data,
           descricao: proposta.descricao,
           categoria: proposta.categoria,
           cliente: cliente.perfil.nome,
           favorito: false
         })) || []
       );

    aplicarFiltros();
    preencherLocalizacoes();
    preencherCategorias();
  } catch (error) {
    console.error("Erro ao carregar propostas:", error);
  }
}

function renderPropostas(lista) {
  const grid = document.getElementById("propostasGrid");
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = "<p>Nenhuma proposta encontrada com os filtros aplicados.</p>";
    return;
  }

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3><a href="../proposta/detalhes.html?id=${p.id}">${p.servico}</a></h3>
      <p><strong>${p.categoria}</strong></p>
      <p>${p.local}</p>
      <p>R$ ${p.pagamento}</p>
      <p>Data: ${new Date(p.data).toLocaleDateString('pt-BR')}</p>
      <p>${p.descricao.substring(0, 80)}...</p>
      <div class="actions">
        <button onclick="favoritar(${p.id})">${p.favorito ? "Desfavoritar" : "Favoritar"}</button>
        <button onclick="candidatar(${p.id})">Candidatar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function aplicarFiltros() {
  const termoBusca = document.getElementById("campoBusca").value.trim().toLowerCase();
  const localizacao = document.getElementById("localizacaoFiltro").value;
  const categoria = document.getElementById("categoriaFiltro").value;
  const pagamentoMax = parseFloat(document.getElementById("pagamentoMaxFiltro").value);
  const apenasFavoritos = document.getElementById("favoritosFiltro").checked;

  const filtrados = propostas.filter(p => {
    const porBusca =
      !termoBusca ||
      p.servico.toLowerCase().includes(termoBusca) ||
      p.categoria.toLowerCase().includes(termoBusca) ||
      p.descricao.toLowerCase().includes(termoBusca);

    const porLocal = !localizacao || p.local === localizacao;
    const porCategoria = !categoria || p.categoria === categoria;
    const porPagamento = isNaN(pagamentoMax) || p.pagamento <= pagamentoMax;
    const porFavorito = !apenasFavoritos || p.favorito;

    return porBusca && porLocal && porCategoria && porPagamento && porFavorito;
  });

  renderPropostas(filtrados);
}

function favoritar(id) {
  const proposta = propostas.find(p => p.id === id);
  if (proposta) {
    proposta.favorito = !proposta.favorito;
    aplicarFiltros();
  }
}

function candidatar(id) {
  window.location.href = `../aceitarPropostas/aceitarProposta.html?proposta_id=${id}`;
}


function preencherLocalizacoes() {
  const select = document.getElementById("localizacaoFiltro");
  const todasLocalizacoes = [...new Set(propostas.map(p => p.local))].sort();
  select.innerHTML = `<option value="">Todas Localizações</option>`;
  todasLocalizacoes.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    select.appendChild(option);
  });
}

function preencherCategorias() {
  const select = document.getElementById("categoriaFiltro");
  const todasCategorias = [...new Set(propostas.map(p => p.categoria))].sort();
  select.innerHTML = `<option value="">Todas Categorias</option>`;
  todasCategorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

document.getElementById("campoBusca").addEventListener("input", aplicarFiltros);
document.getElementById("localizacaoFiltro").addEventListener("change", aplicarFiltros);
document.getElementById("categoriaFiltro").addEventListener("change", aplicarFiltros);
document.getElementById("favoritosFiltro").addEventListener("change", aplicarFiltros);
document.getElementById("pagamentoMaxFiltro").addEventListener("input", aplicarFiltros);

carregarPropostas();