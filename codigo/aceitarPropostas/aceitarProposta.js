const urlParams = new URLSearchParams(window.location.search);
const propostaId = Number(urlParams.get('proposta_id'));

let propostaSelecionada = null;
let clienteId = null;

async function carregarProposta() {
  try {
    const res = await fetch("http://localhost:3000/usuarios");
    const usuarios = await res.json();

    for (const cliente of usuarios.filter(u => u.tipo === "cliente")) {
      const proposta = (cliente.perfil.propostas_servico || []).find(p => p.id === propostaId);
      if (proposta) {
        propostaSelecionada = proposta;
        clienteId = cliente.id;
        break;
      }
    }

    if (!propostaSelecionada) {
      document.getElementById('detalhes').textContent = "Proposta não encontrada.";
      document.getElementById('btnAceitar').style.display = 'none';
      return;
    }

    document.getElementById('detalhes').innerHTML = `
      <p><strong>Serviço:</strong> ${propostaSelecionada.servico}</p>
      <p><strong>Local:</strong> ${propostaSelecionada.local}</p>
      <p><strong>Pagamento:</strong> R$ ${propostaSelecionada.pagamento}</p>
      <p><strong>Data:</strong> ${new Date(propostaSelecionada.data).toLocaleDateString('pt-BR')}</p>
      <p><strong>Descrição:</strong> ${propostaSelecionada.descricao}</p>
      <p><strong>Categoria:</strong> ${propostaSelecionada.categoria}</p>
    `;
  } catch (error) {
    console.error("Erro ao carregar proposta:", error);
    document.getElementById('detalhes').textContent = "Erro ao carregar proposta.";
  }
}

async function aceitarProposta() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.tipo !== "freelancer") {
    alert("Você precisa estar logado como freelancer para aceitar uma proposta.");
    return;
  }

  const agendamento = {
    id: Date.now(),
    id_cliente: clienteId,
    id_freelancer: user.id,
    id_servico: 0,
    data: propostaSelecionada.data,
    horario: "Não definido",
    descricao: propostaSelecionada.descricao,
    status: "pendente"
  };

  try {
    const res = await fetch("http://localhost:3000/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agendamento)
    });

    if (!res.ok) throw new Error("Erro ao criar agendamento");

    alert("Proposta aceita com sucesso! Agendamento criado.");

    await removerPropostaDoCliente(clienteId, propostaId);

    window.location.href = "../TelaHistoricosAgendamentos/index.html?freelancerId=" + user.id;

  } catch (err) {
    console.error(err);
    alert("Erro ao aceitar a proposta. Tente novamente.");
  }
}

async function removerPropostaDoCliente(clienteId, propostaId) {
  try {
    const res = await fetch(`http://localhost:3000/usuarios/${clienteId}`);
    const cliente = await res.json();

    const novasPropostas = (cliente.perfil.propostas_servico || []).filter(p => p.id !== propostaId);

    cliente.perfil.propostas_servico = novasPropostas;

    await fetch(`http://localhost:3000/usuarios/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    });

  } catch (error) {
    console.error("Erro ao remover proposta do cliente:", error);
  }
}

document.getElementById('btnAceitar').addEventListener('click', aceitarProposta);

carregarProposta();
