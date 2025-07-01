document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem("user"));
  if (!usuario) {
    alert("Usuário não está logado.");
    return;
  }

  const CLIENTE_ID = usuario.id;
  const API_URL = `http://localhost:3000/usuarios/${CLIENTE_ID}`;

  const jobForm = document.getElementById('jobForm');
  const jobList = document.getElementById('jobList');

  jobForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaProposta = {
      id: Date.now(),
      servico: document.getElementById('servico').value,
      local: document.getElementById('local').value,
      pagamento: document.getElementById('pagamento').value,
      data: document.getElementById('data').value,
      descricao: document.getElementById('descricao').value,
      categoria: document.getElementById('categoria')?.value || "Não especificada"
    };

    salvarProposta(novaProposta);
    jobForm.reset();
  });

  function salvarProposta(proposta) {
    fetch(API_URL)
      .then(res => res.json())
      .then(usuario => {
        const propostas = usuario.perfil.propostas_servico || [];
        propostas.push(proposta);

        return fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...usuario,
            perfil: {
              ...usuario.perfil,
              propostas_servico: propostas
            }
          })
        });
      })
      .then(() => loadPropostas())
      .catch(err => console.error("Erro ao salvar proposta:", err));
  }

  function loadPropostas() {
    fetch(API_URL)
      .then(res => res.json())
      .then(usuario => {
        const propostas = usuario.perfil.propostas_servico || [];
        jobList.innerHTML = '';

        propostas.forEach(job => {
          const jobCard = document.createElement('div');
          jobCard.className = 'job-card';

          jobCard.innerHTML = `
            <h3>${job.servico}</h3>
            <p><strong>Local:</strong> ${job.local}</p>
            <p><strong>Pagamento:</strong> R$ ${job.pagamento}</p>
            <p><strong>Data:</strong> ${job.data}</p>
            <p><strong>Descrição:</strong> ${job.descricao}</p>
            <p><strong>Categoria:</strong> ${job.categoria}</p>
            <div class="card-buttons">
              <button class="edit-btn" onclick="editarProposta(${job.id})">Editar</button>
              <button class="delete-btn" onclick="excluirProposta(${job.id})">Excluir</button>
            </div>
          `;

          jobList.appendChild(jobCard);
        });
      });
  }

  function excluirProposta(id) {
    fetch(API_URL)
      .then(res => res.json())
      .then(usuario => {
        const propostas = (usuario.perfil.propostas_servico || []).filter(p => p.id !== id);

        return fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...usuario,
            perfil: {
              ...usuario.perfil,
              propostas_servico: propostas
            }
          })
        });
      })
      .then(() => loadPropostas());
  }

  function editarProposta(id) {
    fetch(API_URL)
      .then(res => res.json())
      .then(usuario => {
        const proposta = (usuario.perfil.propostas_servico || []).find(p => p.id === id);
        if (!proposta) return;

        document.getElementById('servico').value = proposta.servico;
        document.getElementById('local').value = proposta.local;
        document.getElementById('pagamento').value = proposta.pagamento;
        document.getElementById('data').value = proposta.data;
        document.getElementById('descricao').value = proposta.descricao;
        
        const categoriaInput = document.getElementById('categoria');
        if (categoriaInput) categoriaInput.value = proposta.categoria;

        excluirProposta(id);
      });
  }

  loadPropostas();

  window.editarProposta = editarProposta;
  window.excluirProposta = excluirProposta;
});
