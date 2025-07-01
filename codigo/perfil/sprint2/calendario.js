const mesTitulo = document.getElementById("mes");
const calendario = document.getElementById("calendario");
const btnAnterior = document.getElementById("prev");
const btnProximo = document.getElementById("next");

let dataAtual = new Date();
let freelancer = null;

const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function atualizarHeader() {
  const headerTitle = document.querySelector("header h1");
  if (freelancer && headerTitle) {
    headerTitle.textContent = `HouseService - ${freelancer.perfil.nome}`;
  }
}

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();

  mesTitulo.textContent = `${nomesMeses[mes]} ${ano}`;
  calendario.innerHTML = "";

  for (let i = 0; i < primeiroDiaSemana; i++) {
    calendario.innerHTML += `<div></div>`;
  }

  for (let dia = 1; dia <= ultimoDiaMes; dia++) {
    const data = new Date(ano, mes, dia);
    const diaSemana = diasSemana[data.getDay()];

    const estaDisponivel = freelancer?.perfil?.disponibilidade?.dias?.includes(diaSemana);
    
    let conteudoDia = `<div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${dia}</div>`;

    if (estaDisponivel && freelancer?.perfil?.disponibilidade?.horarios) {
      freelancer.perfil.disponibilidade.horarios.forEach(horario => {
        conteudoDia += `<div style="background: #29a329; color: white; padding: 2px 4px; margin: 1px; border-radius: 3px; font-size: 10px;">${horario}</div>`;
      });
    }
    
    calendario.innerHTML += `<div class="${estaDisponivel ? 'disponivel' : ''}">${conteudoDia}</div>`;
  }
}

btnAnterior.onclick = () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  renderizarCalendario();
};

btnProximo.onclick = () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  renderizarCalendario();
};

const id = getIdFromUrl();
fetch(`http://localhost:3000/usuarios?id=${id}&tipo=freelancer`)
  .then(res => res.json())
  .then(data => {
    freelancer = data[0];
    if (!freelancer) {
      alert("Freelancer não encontrado!");
      return;
    }
    atualizarHeader(); 
    renderizarCalendario();
  })
  .catch(err => {
    console.error("Erro ao carregar dados do freelancer:", err);
    alert("Erro ao carregar dados.");
  });