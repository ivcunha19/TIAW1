document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("formAgendamento");
  const selectFreelancer = document.getElementById("freelancer");
  const selectServico = document.getElementById("servico");
  const selectHorario = document.getElementById("horario");

  let freelancers = [];

  function getParamsURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      freelancerId: params.get("freelancer"),
      servicoId: parseInt(params.get("servico"))
    };
  }

  async function carregarFreelancers() {
    try {
      const { freelancerId, servicoId } = getParamsURL();

      const res = await fetch("http://localhost:3000/usuarios");
      if (!res.ok) throw new Error("Erro ao carregar freelancers");
      
      const usuarios = await res.json();
      freelancers = usuarios.filter(u => u.tipo === "freelancer");

      freelancers.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.id;
        opt.textContent = f.perfil.nome;
        selectFreelancer.appendChild(opt);
      });

      if (freelancerId) {
        selectFreelancer.value = freelancerId;
        atualizarServicos();

        setTimeout(() => {
          if (servicoId) {
            selectServico.value = servicoId;
          }
        }, 100);
      } else {
        atualizarServicos();
      }
    } catch (error) {
      console.error("Erro ao carregar freelancers:", error);
      alert("Erro ao carregar dados. Recarregue a página.");
    }
  }

  function atualizarServicos() {
    const freelancerId = selectFreelancer.value;
    const freelancer = freelancers.find(f => f.id === freelancerId);

    selectServico.innerHTML = "";
    selectHorario.innerHTML = "";

    if (freelancer?.perfil?.servicos_oferecidos) {
      freelancer.perfil.servicos_oferecidos.forEach(servico => {
        const opt = document.createElement("option");
        opt.value = servico.id_servico;
        opt.textContent = servico.nome_servico;
        selectServico.appendChild(opt);
      });
    }

    if (freelancer?.perfil?.disponibilidade?.horarios) {
      freelancer.perfil.disponibilidade.horarios.forEach(horario => {
        const opt = document.createElement("option");
        opt.value = horario;
        opt.textContent = horario;
        selectHorario.appendChild(opt);
      });
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  selectFreelancer.addEventListener("change", atualizarServicos);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.tipo !== "cliente") {
      alert("Você precisa estar logado como cliente para agendar.");
      return;
    }

    const freelancerId = selectFreelancer.value;
    const servicoId = selectServico.value;
    const horario = selectHorario.value;
    const data = document.getElementById("data").value;

    if (!freelancerId || !servicoId || !horario || !data) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const freelancer = freelancers.find(f => f.id === freelancerId);
    if (!freelancer) {
      alert("Freelancer não encontrado.");
      return;
    }

    const dataSelecionada = new Date(data + "T00:00");
    const diaSemana = dataSelecionada.toLocaleDateString("pt-BR", { weekday: "long" });
    const diaFormatado = capitalize(diaSemana);

    const diasDisponiveis = freelancer.perfil?.disponibilidade?.dias || [];

    if (!diasDisponiveis.includes(diaFormatado)) {
      alert(`Este freelancer não está disponível na(o) ${diaFormatado}.`);
      return;
    }

    const agendamento = {
      id: Date.now(),
      id_cliente: parseInt(user.id),
      id_freelancer: parseInt(freelancerId),
      id_servico: parseInt(servicoId),
      data: data,
      horario: horario,
      descricao: document.getElementById("descricao").value || "",
      status: "pendente"
    };

    try {
      const response = await fetch("http://localhost:3000/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento)
      });

      if (response.ok) {
        alert("Serviço agendado com sucesso!");
        form.reset();
        window.location.href = `../TelaHistoricosAgendamentos/index.html?clienteId=${user.id}`;
      } else {
        const errorData = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao agendar serviço. Verifique sua conexão e tente novamente.");
    }
  });

  carregarFreelancers();
});
document.addEventListener("DOMContentLoaded", () => {
  const botaoAgendamentos = document.getElementById("btnVerAgendamentos");

  botaoAgendamentos.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    window.location.href = `../TelaHistoricosAgendamentos/index.html?clienteId=${user.id}`;
  });
});

