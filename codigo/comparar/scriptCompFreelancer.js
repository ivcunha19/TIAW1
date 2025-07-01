const freelancers = [
  {
    id: 1,
    nome: "Danilo Amaral",
    profissao: "Carpinteiro",
    descricao: "Especialista em móveis sob medida e reparos em madeira.",
    preco_hora: 50,
    avaliacao: 4.7,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 2,
    nome: "Eva Martins",
    profissao: "Lavadora",
    descricao: "Serviços de lavagem de roupas e tecidos delicados.",
    preco_hora: 80,
    avaliacao: 4.9,
    localizacao: "Rio de Janeiro, RJ",
    favorito: false,
  },
  {
    id: 3,
    nome: "Carla Nogueira",
    profissao: "Diarista",
    descricao: "Limpeza completa e organização residencial.",
    preco_hora: 60,
    avaliacao: 4.8,
    localizacao: "São Paulo, SP",
    favorito: false,
  }, {
    id: 4,
    nome: "Roberto Lima",
    profissao: "Eletricista",
    descricao: "Instalações e manutenções elétricas residenciais.",
    preco_hora: 75,
    avaliacao: 4.6,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 5,
    nome: "Juliana Rocha",
    profissao: "Cozinheira",
    descricao: "Cozinha caseira e pratos personalizados para eventos.",
    preco_hora: 90,
    avaliacao: 4.9,
    localizacao: "Belo Horizonte, MG",
    favorito: false,
  },
  {
    id: 6,
    nome: "Paulo Souza",
    profissao: "Pintor",
    descricao: "Pintura residencial e comercial com acabamento fino.",
    preco_hora: 70,
    avaliacao: 4.5,
    localizacao: "Belo Horizonte, MG",
    favorito: false,
  },
  {
    id: 7,
    nome: "Fernanda Alves",
    profissao: "Babá",
    descricao: "Cuidados infantis com experiência em primeiros socorros.",
    preco_hora: 85,
    avaliacao: 5.0,
    localizacao: "Belo Horizonte, MG",
    favorito: false,
  },
  {
    id: 8,
    nome: "João Pedro",
    profissao: "Jardineiro",
    descricao: "Manutenção de jardins e paisagismo.",
    preco_hora: 55,
    avaliacao: 4.4,
    localizacao: "Belo Horizonte, MG",
    favorito: false,
  },
  {
    id: 9,
    nome: "Tatiane Silva",
    profissao: "Costureira",
    descricao: "Ajustes e confecção de roupas sob medida.",
    preco_hora: 60,
    avaliacao: 4.8,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 10,
    nome: "Miguel Torres",
    profissao: "Marceneiro",
    descricao: "Fabricação de móveis planejados e restauração.",
    preco_hora: 100,
    avaliacao: 4.9,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 11,
    nome: "Letícia Ferreira",
    profissao: "Cabeleireira",
    descricao: "Cortes, coloração e penteados para todas as ocasiões.",
    preco_hora: 95,
    avaliacao: 4.7,
    localizacao: "Brasília, DF",
    favorito: false,
  },
  {
    id: 12,
    nome: "Renato Gomes",
    profissao: "Encanador",
    descricao: "Reparos e instalações hidráulicas emergenciais.",
    preco_hora: 65,
    avaliacao: 4.6,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 13,
    nome: "Aline Duarte",
    profissao: "Maquiadora",
    descricao: "Maquiagens para festas, casamentos e editoriais.",
    preco_hora: 120,
    avaliacao: 5.0,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 14,
    nome: "Thiago Mendes",
    profissao: "Chaveiro",
    descricao: "Abertura de portas e confecção de chaves.",
    preco_hora: 70,
    avaliacao: 4.3,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 15,
    nome: "Priscila Monteiro",
    profissao: "Manicure",
    descricao: "Manicure e pedicure com técnicas modernas.",
    preco_hora: 50,
    avaliacao: 4.9,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 16,
    nome: "Carlos Eduardo",
    profissao: "Pedreiro",
    descricao: "Obras e reformas com acabamento profissional.",
    preco_hora: 90,
    avaliacao: 4.5,
    localizacao: "São Paulo, SP",
    favorito: false,
  },
  {
    id: 17,
    nome: "Amanda Ribeiro",
    profissao: "Passadeira",
    descricao: "Passadoria de roupas residenciais e profissionais.",
    preco_hora: 45,
    avaliacao: 4.7,
    localizacao: "Rio de Janeiro, RJ",
    favorito: false,
  },
  {
    id: 18,
    nome: "Diego Freitas",
    profissao: "Montador de Móveis",
    descricao: "Montagem e desmontagem rápida e segura.",
    preco_hora: 60,
    avaliacao: 4.6,
    localizacao: "Rio de Janeiro, RJ",
    favorito: false,
  },
  {
    id: 19,
    nome: "Isabela Costa",
    profissao: "Personal Organizer",
    descricao: "Organização de ambientes com foco em funcionalidade.",
    preco_hora: 110,
    avaliacao: 5.0,
    localizacao: "Rio de Janeiro, RJ",
    favorito: false,
  },
  {
    id: 20,
    nome: "Ricardo Barbosa",
    profissao: "Zelador",
    descricao: "Manutenção predial e suporte em condomínios.",
    preco_hora: 70,
    avaliacao: 4.4,
    localizacao: "Rio de Janeiro, RJ",
    favorito: false,
  }
];

const nome1Input = document.getElementById("nome1");
const nome2Input = document.getElementById("nome2");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");

const checkPreco = document.getElementById("checkPreco");
const checkAvaliacao = document.getElementById("checkAvaliacao");
const ctx = document.getElementById("grafico").getContext("2d");

const resultadoBox = document.getElementById("resultadoBox");
const resultadoTexto = document.getElementById("resultadoComparacao");

let f1 = null;
let f2 = null;

let grafico = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: []
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function exibirDados(f, div) {
  div.innerHTML = `
    <h3>${f.nome}</h3>
    <p><strong>Profissão:</strong> ${f.profissao}</p>
    <p><strong>Descrição:</strong> ${f.descricao}</p>
    <p><strong>Preço por hora:</strong> R$${f.preco_hora}</p>
    <p><strong>Avaliação:</strong> ${f.avaliacao}</p>
    <p><strong>Localização:</strong> ${f.localizacao}</p>
  `;
}

function atualizarGrafico() {
  if (!f1 || !f2) return;

  let datasets = [];

  if (checkPreco.checked) {
    datasets.push({
      label: "Preço por Hora (R$)",
      backgroundColor: ['#4e73df', '#4e73df'],
      data: [f1.preco_hora, f2.preco_hora]
    });
  }

  if (checkAvaliacao.checked) {
    datasets.push({
      label: "Avaliação",
      backgroundColor: ['#1cc88a', '#1cc88a'],
      data: [f1.avaliacao, f2.avaliacao]
    });
  }

  grafico.data.labels = [f1.nome, f2.nome];
  grafico.data.datasets = datasets;
  grafico.update();
}

function gerarVeredito() {
  if (!f1 || !f2) {
    resultadoBox.style.display = "none";
    resultadoTexto.textContent = "";
    return;
  }

  const mesmoPreco = f1.preco_hora === f2.preco_hora;
  const mesmaAvaliacao = f1.avaliacao === f2.avaliacao;

  resultadoBox.style.display = "block";

  // Caso ideal: um vence nos dois critérios
  if (f1.avaliacao > f2.avaliacao && f1.preco_hora < f2.preco_hora) {
    resultadoTexto.textContent = `Melhor custo-benefício: ${f1.nome}`;
    return;
  }

  if (f2.avaliacao > f1.avaliacao && f2.preco_hora < f1.preco_hora) {
    resultadoTexto.textContent = `Melhor custo-benefício: ${f2.nome}`;
    return;
  }

  // Empates totais
  if (mesmoPreco && mesmaAvaliacao) {
    resultadoTexto.textContent = `Empate: ambos têm a mesma avaliação e cobram o mesmo valor.`;
    return;
  }

  // Empate de preço, mas avaliação diferente
  if (mesmoPreco) {
    const melhor = f1.avaliacao > f2.avaliacao ? f1 : f2;
    resultadoTexto.textContent = `${melhor.nome} tem melhor avaliação, e ambos cobram o mesmo valor. Dito isso, o melhor custo-benefício é: ${melhor.nome}`;
    return;
  }

  // Empate de avaliação, mas preço diferente
  if (mesmaAvaliacao) {
    const maisBarato = f1.preco_hora < f2.preco_hora ? f1 : f2;
    resultadoTexto.textContent = `${maisBarato.nome} cobra menos, e ambos têm a mesma avaliação. Dito isso, o melhor custo-benefício é: ${maisBarato.nome}`;
    return;
  }

  // Caso comum: cada um é melhor em um critério
  const melhorAvaliacao = f1.avaliacao > f2.avaliacao ? f1 : f2;
  const maisBarato = f1.preco_hora < f2.preco_hora ? f1 : f2;
  resultadoTexto.textContent = `${melhorAvaliacao.nome} tem melhor avaliação, mas ${maisBarato.nome} é mais barato.`;
}

function compararFreelancers() {
  const nome1 = nome1Input.value.trim().toLowerCase();
  const nome2 = nome2Input.value.trim().toLowerCase();

  f1 = freelancers.find(f => f.nome.toLowerCase() === nome1);
  f2 = freelancers.find(f => f.nome.toLowerCase() === nome2);

  if (!f1 || !f2) {
    alert("Verifique os nomes. Um ou ambos os freelancers não foram encontrados.");
    return;
  }

  if (f1.id === f2.id) {
    alert("Selecione dois freelancers diferentes.");
    return;
  }

  exibirDados(f1, info1);
  exibirDados(f2, info2);
  atualizarGrafico();
  gerarVeredito();
}

checkPreco.addEventListener("change", () => {
  atualizarGrafico();
  gerarVeredito();
});

checkAvaliacao.addEventListener("change", () => {
  atualizarGrafico();
  gerarVeredito();
});
