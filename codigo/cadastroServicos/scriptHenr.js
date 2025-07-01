function getUsuarioLogado() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.tipo !== "freelancer") {
    alert("Você precisa estar logado como freelancer.");
    throw new Error("Usuário não autenticado ou não é freelancer");
  }
  return user;
}

function getApiUrl() {
  const user = getUsuarioLogado();
  return `http://localhost:3000/usuarios/${user.id}`;
}


function carregarServicos() {
  fetch(getApiUrl())
    .then(res => res.json())
    .then(usuario => {
      const servicos = usuario.perfil.servicos_oferecidos || [];
      renderLista(servicos);
    })
    .catch(err => console.error("Erro ao carregar serviços:", err));
}

function adicionarServico(novoServico) {
  fetch(getApiUrl())
    .then(res => res.json())
    .then(usuario => {
      const servicos = usuario.perfil.servicos_oferecidos || [];
      const id_servico = Date.now();
      novoServico.id_servico = id_servico;
      servicos.push(novoServico);

      return fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...usuario,
          perfil: {
            ...usuario.perfil,
            servicos_oferecidos: servicos
          }
        })
      });
    })
    .then(() => carregarServicos());
}

function editarServico(id, novosDados) {
  fetch(getApiUrl())
    .then(res => res.json())
    .then(usuario => {
      const servicos = usuario.perfil.servicos_oferecidos || [];
      const novosServicos = servicos.map(s =>
        s.id_servico === id ? { ...novosDados, id_servico: id } : s
      );

      return fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...usuario,
          perfil: {
            ...usuario.perfil,
            servicos_oferecidos: novosServicos
          }
        })
      });
    })
    .then(() => carregarServicos());
}

function excluirServico(id) {
  fetch(getApiUrl())
    .then(res => res.json())
    .then(usuario => {
      const novosServicos = (usuario.perfil.servicos_oferecidos || []).filter(
        s => s.id_servico !== id
      );

      return fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...usuario,
          perfil: {
            ...usuario.perfil,
            servicos_oferecidos: novosServicos
          }
        })
      });
    })
    .then(() => carregarServicos());
}

function renderLista(servicos) {
  const tbody = document.querySelector("#tabelaServicos tbody");
  tbody.innerHTML = "";

  servicos.forEach(servico => {
    const valorFormatado = parseFloat(servico.valor || servico.preco_por_projeto || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${servico.nomeServico || servico.nome_servico}</td>
      <td>${servico.categoria || "-"}</td>
      <td>${valorFormatado}</td>
      <td>${servico.contato || "-"}</td>
      <td>${servico.localizacao || "-"}</td>
      <td>
        <button onclick="preencherFormulario(${servico.id_servico})">Editar</button>
        <button onclick="excluirServico(${servico.id_servico})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function preencherFormulario(id) {
  fetch(getApiUrl())
    .then(res => res.json())
    .then(usuario => {
      const servico = usuario.perfil.servicos_oferecidos.find(s => s.id_servico === id);
      if (!servico) return;

      document.getElementById("nomeServico").value = servico.nomeServico || servico.nome_servico;
      document.getElementById("descricao").value = servico.descricao || "";
      document.getElementById("categoria").value = servico.categoria || "";
      document.getElementById("valor").value = servico.valor || servico.preco_por_projeto || "";
      document.getElementById("contato").value = servico.contato || "";
      document.getElementById("localizacao").value = servico.localizacao || "";
      document.getElementById("formServico").setAttribute("data-id", id);
      document.getElementById("btnSubmit").textContent = "Confirmar Edição";
      document.getElementById("modoEdicao").textContent = ` Editando serviço: ${servico.nomeServico || servico.nome_servico}`;
      document.getElementById("modoEdicao").removeAttribute("hidden");
    });
}

document.getElementById("formServico").addEventListener("submit", function (e) {
  e.preventDefault();

  const servico = {
    nome_servico: document.getElementById("nomeServico").value,
    descricao: document.getElementById("descricao").value,
    categoria: document.getElementById("categoria").value,
    preco_por_projeto: document.getElementById("valor").value,
    contato: document.getElementById("contato").value,
    localizacao: document.getElementById("localizacao").value
  };

  const id = this.getAttribute("data-id");

  if (id) {
    editarServico(Number(id), servico);
    this.removeAttribute("data-id");
    document.getElementById("btnSubmit").textContent = "Cadastrar";
    document.getElementById("modoEdicao").textContent = "";
    document.getElementById("modoEdicao").setAttribute("hidden", true);
  } else {
    adicionarServico(servico);
  }

  this.reset();
});

carregarServicos();
