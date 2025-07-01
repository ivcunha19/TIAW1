document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const container = document.getElementById('dados');

 fetch('http://localhost:3000/usuarios')
   .then(response => response.json())
    .then(data => {
      const clienteSelecionado = data.find(usuario => usuario.id == id && usuario.tipo === 'cliente');

      if (!clienteSelecionado) {
        container.innerHTML = `<p>Cliente não encontrado.</p>`;
        return;
      }

      const perfil = clienteSelecionado.perfil;

    
      let historicoHTML = '';      
      if (perfil.historico_contratos && perfil.historico_contratos.length > 0) {
        historicoHTML = '<div class="historico-lista">';
        
        perfil.historico_contratos.forEach(contrato => {
           const dataFormatada = new Date(contrato.data).toLocaleDateString('pt-BR');
          
          
          let avaliacaoTexto = '';
          if (contrato.avaliacao) {
            avaliacaoTexto = ` | <strong>Avaliação:</strong> ${contrato.avaliacao.nota}/5`;
            if (contrato.avaliacao.comentario) {
              avaliacaoTexto += ` - "${contrato.avaliacao.comentario}"`;
            }
          }
          
          historicoHTML += `
            <div class="historico-item">
              <p>
                <strong>Serviço:</strong> ${contrato.servico} | 
                <strong>Freelancer:</strong> ${contrato.nome_freelancer} | 
                <strong>Data:</strong> ${dataFormatada}${avaliacaoTexto}
              </p>
            </div>
          `;
        });
        
        historicoHTML += '</div>';
      } else {
        historicoHTML = '<p>Este cliente ainda não possui histórico de serviços.</p>';
      }
     
      let avaliacoesHTML = '';
      if (perfil.avaliacoes_realizadas && perfil.avaliacoes_realizadas.length > 0) {
        avaliacoesHTML = '<div class="avaliacoes-lista">';
        const ultimasAvaliacoes = [...perfil.avaliacoes_realizadas].slice(-2);
        
        ultimasAvaliacoes.forEach(avaliacao => {
          avaliacoesHTML += `
            <div class="avaliacao-item">
              <p><strong>Nota dada:</strong> ${avaliacao.nota}/5</p>
              <p><strong>Freelancer avaliado:</strong> ${avaliacao.nome_usuario}</p>
              ${avaliacao.comentario ? `<p>"${avaliacao.comentario}"</p>` : ''}
            </div>
          `;
        });
        
        avaliacoesHTML += '</div>';
      } else {
        avaliacoesHTML = '<p>Este cliente ainda não realizou nenhuma avaliação.</p>';
      }

      let enderecoFormatado = '';
      if (perfil.endereco) {
        const endereco = perfil.endereco;
        if (endereco.rua) {
          enderecoFormatado = `${endereco.rua}, ${endereco.cidade} - ${endereco.estado}`;
          if (endereco.cep) {
            enderecoFormatado += ` (${endereco.cep})`;
          }
        } else {
          enderecoFormatado = `${endereco.cidade} - ${endereco.estado}, ${endereco.pais || 'Brasil'}`;
        }
      }

      let preferenciasHTML = '';
      if (perfil.preferencias_servico && perfil.preferencias_servico.length > 0) {
        preferenciasHTML = `
          <div class="preferencias">
            <h3>Serviços de Interesse</h3>
            <p>${perfil.preferencias_servico.join(', ')}</p>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="basico">
          <div class="info-texto">
            <h1><a${perfil.nome}</h1>
            <p>Cliente HouseService</p>
          </div>
        </div>
        
        <div class="informacoes">
          <h3>Informações de Contato</h3>
          <span><strong>Localização:</strong> ${enderecoFormatado}</span>
          <span><strong>Contato:</strong> ${perfil.email}</span>
          <span><strong>Telefone:</strong> ${perfil.telefone}</span>
        </div>

        <div class="agendamentos">
          <span><a href="../TelaHistoricosAgendamentos/index.html?id=${clienteSelecionado.id}">Meus Agendamentos</a></span>
        </div>

        ${preferenciasHTML}

        <div class="historico">
          <h3>Histórico de Serviços</h3>
          ${historicoHTML}
        </div>

        <div class="avaliacoes">
         <h3>Avaliações</h3> 
         <span><a href="../avaliacaocliente/mostrarcli.html?id=${clienteSelecionado.id}">Ver todas as avaliações</a></span>
          <span><a href="../avaliacaocliente/avalicaocli.html?id=${clienteSelecionado.id}">Avaliar Cliente</a></span>
          <h4>Últimas Avaliações Recebidas</h4>
          ${avaliacoesHTML}
        </div>
      `;
    })
    .catch(error => {
      console.error("Erro ao carregar dados do cliente:", error);
      container.innerHTML = `<p>Erro ao carregar os dados.</p>`;
    });
});