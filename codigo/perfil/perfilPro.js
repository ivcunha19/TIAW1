document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const container = document.getElementById('dados');

fetch('http://localhost:3000/usuarios')
  .then(response => response.json())
  .then(data => {
    const profissionalSelecionado = data.find(usuario => usuario.id == id && usuario.tipo === 'freelancer');
      if (profissionalSelecionado) {
        const perfil = profissionalSelecionado.perfil;

        let servicosLista = '';
        if (perfil.servicos_oferecidos && perfil.servicos_oferecidos.length > 0) {
          servicosLista = perfil.servicos_oferecidos.map(servico => {
            let precoTexto = '';
            if (servico.preco_por_hora) {
              precoTexto += `R$ ${servico.preco_por_hora}/hora`;
            }
            if (servico.preco_por_projeto) {
              if (precoTexto) precoTexto += ' ou ';
              precoTexto += `R$ ${servico.preco_por_projeto}/projeto`;
            }
            return `<li>${servico.nome_servico} - ${precoTexto || 'Preço a combinar'}</li>`;
          }).join('');
        } else {
          servicosLista = '<li>Nenhum serviço cadastrado</li>';
        }

function calcularMediaAvaliacoes(profissional) {
  const avaliacoes = profissional.perfil.avaliacoes_recebidas;
  if (!avaliacoes || avaliacoes.length === 0) return 0;

  const soma = avaliacoes.reduce((total, avaliacao) => {
    const mediaIndividual = ((avaliacao.pontualidade || 0) + (avaliacao.qualidade || 0) + (avaliacao.comunicacao || 0)) / 3;
    return total + mediaIndividual;
  }, 0);

  const media = soma / avaliacoes.length;
  return media.toFixed(2);
}

        const mediaA = calcularMediaAvaliacoes(profissionalSelecionado);

        let enderecoFormatado = '';
        if (perfil.endereco) {
          const endereco = perfil.endereco;
          enderecoFormatado = `${endereco.cidade} - ${endereco.estado}, ${endereco.pais || 'Brasil'}`;
        }

        let descricao = 'Freelancer experiente';
        if (perfil.servicos_oferecidos && perfil.servicos_oferecidos.length > 0) {
          const servicos = perfil.servicos_oferecidos.map(s => s.nome_servico).join(', ');
          descricao = `Especialista em: ${servicos}`;
        }

        let certificacoesHTML = '';
        if (perfil.certificacoes && perfil.certificacoes.length > 0) {
          certificacoesHTML = `
            <div class="certificacoes">
              <h3>Certificações:</h3>
              <ul>
                ${perfil.certificacoes.map(cert => 
                  `<li>${cert.nome_certificacao} - ${cert.instituicao} (${new Date(cert.data_obtencao).getFullYear()})</li>`
                ).join('')}
              </ul>
            </div>
          `;
        }

        let portfolioHTML = '';
        if (perfil.portfolio && perfil.portfolio.length > 0) {
          portfolioHTML = `
            <div class="portfolio">
              <h3>Portfólio:</h3>
              ${perfil.portfolio.map(projeto => `
                <div class="projeto-portfolio">
                  <p><strong>Projeto:</strong> ${projeto.descricao_projeto}</p>
                  ${projeto.imagens_projeto && projeto.imagens_projeto.length > 0 ? 
                    `<div class="imagens-projeto">
                      ${projeto.imagens_projeto.map(img => 
                        `<img src="${img}" alt="Imagem do projeto" style="max-width: 200px; margin: 5px;">`
                      ).join('')}
                    </div>` : ''
                  }
                </div>
              `).join('')}
            </div>
          `;
        }

        let avaliacoesDetalhadas = '';
        if (perfil.avaliacoes_recebidas && perfil.avaliacoes_recebidas.length > 0) {
          const ultimasAvaliacoes = [...perfil.avaliacoes_recebidas].slice(-3);
          avaliacoesDetalhadas = `
            <div class="avaliacoes-detalhadas">
              <h4>Últimas Avaliações:</h4>
              ${ultimasAvaliacoes.map(av => `
                <div class="avaliacao-item">
                  <p><strong>${av.nome_usuario}</strong> - ${(((av.pontualidade || 0) + (av.qualidade || 0) + (av.comunicacao || 0)) / 3).toFixed(1)}/5 estrelas</p>
                  ${av.comentario ? `<p>"${av.comentario}"</p>` : ''}
                </div>
              `).join('')}
            </div>
          `;
        }

        container.innerHTML = `
          <article class="tudo">
            <div class="profissional">
            <div class="basico">
            <div class="info-texto">
              <h1>${perfil.nome}</h1>
              <p>${descricao}</p>
            </div>
            <img src="${perfil.foto_perfil_url}" alt="Imagem do Profissional" class="fotoPerfil">
            </div>
              <div class="informacoes">
                <span><strong>Localização:</strong> ${enderecoFormatado}</span><br>
                <span><strong>Contato:</strong> ${perfil.email}</span><br>
                <span><strong>Telefone:</strong> ${perfil.telefone}</span><br>
                <span><strong>Disponibilidade:<a href="sprint2/calendario.html?id=${profissionalSelecionado.id}"> Ver Calendário Detalhado</a></span>
              </div>

              <div class="agendamentos">
                <span><a href="../TelaHistoricosAgendamentos/index.html?id=${profissionalSelecionado.id}">Meus Agendamentos</a></span>
              </div>

              <div class="servicos">
                <h3>Serviços oferecidos:</h3>
                <ul>${servicosLista}</ul>
              </div>

              ${certificacoesHTML}

              ${portfolioHTML}

              <div class="avaliacoes">
                <h3>Avaliações</h3>
                <span><a href="../avaliacaopro/paginaAvaliacoes.html?id=${profissionalSelecionado.id}">Ver todas as avaliações</a></span>
                <span><a href="../avaliacaopro/avaliacao.html?id=${profissionalSelecionado.id}">Avaliar Cliente</a></span>
                <p><strong>Média de avaliações:</strong> ${mediaA} ⭐ (${perfil.avaliacoes_recebidas ? perfil.avaliacoes_recebidas.length : 0} avaliações)</p>
                ${avaliacoesDetalhadas}
              </div>

              ${perfil.url_video_introducao ? `
                <div class="video-introducao">
                  <h3>Vídeo de Apresentação:</h3>
                  <a href="${perfil.url_video_introducao}" target="_blank">Assistir Vídeo</a>
                </div>
              ` : ''}
            </div>
          </article>
        `;
      } else {
        container.innerHTML = `
          <div class="profissional-nao-encontrado">
            <h2>Freelancer não encontrado</h2>
            <p>O freelancer que você está procurando não existe.</p>
          </div>
        `;
      }
    })
    .catch(error => {
      console.error("Erro ao carregar dados do freelancer:", error);
      container.innerHTML = `<p>Erro ao carregar os dados.</p>`;
    });
});