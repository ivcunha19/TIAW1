let currentTab = 'proximos'; 
let searchQuery = ''; 
let appointments = [];

document.addEventListener('DOMContentLoaded', () => {
  carregarAgendamentos();
  configurarEventos();
});

function configurarEventos() {
  document.getElementById('searchInput').addEventListener('input', () => {
    searchQuery = document.getElementById('searchInput').value.toLowerCase();
    render();
  });

  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
  render();
}

async function carregarAgendamentos() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Você precisa estar logado.");
    return;
  }

  let urlAgendamentos = "http://localhost:3000/agendamentos?";
  if (user.tipo === "cliente") {
    urlAgendamentos += `id_cliente=${user.id}`;
  } else if (user.tipo === "freelancer") {
    urlAgendamentos += `id_freelancer=${user.id}`;
  } else {
    alert("Tipo de usuário desconhecido.");
    return;
  }

  try {
    const resAgend = await fetch(urlAgendamentos);
    const agendamentos = await resAgend.json();

    const resUsuarios = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resUsuarios.json();

    appointments = agendamentos.map(ag => {
      const freelancer = usuarios.find(u => u.id === ag.id_freelancer);
      const cliente = usuarios.find(u => u.id === ag.id_cliente);
      const servico = freelancer?.perfil?.servicos_oferecidos.find(s => s.id_servico == ag.id_servico);

      return {
        id: ag.id,
        nome: cliente?.perfil?.nome || "Cliente",
        servico: servico?.nome_servico || "Serviço desconhecido",
        endereco: freelancer?.perfil?.endereco?.cidade + ", " + freelancer?.perfil?.endereco?.estado || "Localização não informada",
        data: ag.data,
        status: ag.status,
        horario: ag.horario,
        descricao: ag.descricao
      };
    });

    render();
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
    alert("Erro ao carregar agendamentos. Veja o console.");
  }
}

function render() {
  const container = document.getElementById('appointmentsContainer');
  container.innerHTML = ''; 

  const filteredAppointments = appointments.filter(app => {
    const isHistorico = app.status === 'concluido' || app.status === 'cancelado';
    const matchesTab = (currentTab === 'historico' && isHistorico) || (currentTab === 'proximos' && !isHistorico);
    const matchesSearch = searchQuery === '' || 
      app.nome.toLowerCase().includes(searchQuery) ||
      app.servico.toLowerCase().includes(searchQuery) ||
      app.endereco.toLowerCase().includes(searchQuery) || 
      app.data.toLowerCase().includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  if (filteredAppointments.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: #555;">Nenhum agendamento encontrado.</p>';
    return;
  }

  filteredAppointments.forEach(app => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <p><strong>${app.data} - ${app.horario}</strong> - ${app.servico}</p>
      <p><strong>Cliente:</strong> ${app.nome}</p>
      <p><strong>Endereço:</strong> ${app.endereco}</p>
      <p>${app.descricao ? `<strong>Descrição:</strong> ${app.descricao}` : ''}</p>
      <span class="status ${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
      <div class="buttons">
        <button onclick="viewDetails('${app.servico}', '${app.nome}', '${app.data}', '${app.horario}', '${app.descricao || ''}')">Ver Detalhes</button>
        ${currentTab === 'proximos' && (app.status === 'confirmado' || app.status === 'pendente') ?
          `<button class="cancel-button" onclick="cancelAppointment(${app.id})">Cancelar Agendamento</button>` : ''}
        ${currentTab === 'proximos' && (app.status === 'pendente' || app.status === 'confirmado') ? `
        <button onclick="markAsConcluded(${app.id})">Concluir Agendamento</button>` : ''}   
      </div>
    `;
    container.appendChild(card);
  });
}

function viewDetails(servico, nome, data, horario, descricao) {
  alert(`Detalhes do Agendamento:\n\nServiço: ${servico}\nCliente: ${nome}\nData: ${data}\nHorário: ${horario}\nDescrição: ${descricao}`);
}

async function cancelAppointment(id) {
  if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
    try {
      await fetch(`http://localhost:3000/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelado" })
      });
      alert("Agendamento cancelado com sucesso!");
      carregarAgendamentos(); 
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("Erro ao cancelar agendamento. Veja o console.");
    }
  }
}

async function markAsConcluded(id) {
  if (confirm("Deseja marcar este agendamento como concluído?")) {
    try {
      const response = await fetch(`http://localhost:3000/agendamentos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "concluido" })
      });

      if (response.ok) {
        alert("Agendamento marcado como concluído!");
        carregarAgendamentos();
      } else {
        throw new Error(`Erro HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao marcar como concluído:", error);
      alert("Erro ao atualizar o agendamento.");
    }
  }
}

