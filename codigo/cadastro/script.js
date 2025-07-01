document.addEventListener("DOMContentLoaded", function () {
  const tipoUsuarioSelect = document.getElementById("tipoUsuario");
  const form = document.getElementById("cadastroForm");

  const camposFreelancer = `
    <div id="campos-freelancer">
      <label for="dataNascimento">Data de Nascimento</label>
      <input type="date" id="dataNascimento" required />
      
      <label for="cpf">CPF</label>
      <input type="text" id="cpf" placeholder="123.456.789-00" required />
      
      <label for="email">Email</label>
      <input type="email" id="email" required />
      
      <label for="telefone">Telefone</label>
      <input type="text" id="telefone" placeholder="+55 11 91234-5678" required />
      
      <label for="endereco">Endereço</label>
      <div class="row">
        <div><input type="text" id="cidade" required placeholder="Cidade" /></div>
        <div><input type="text" id="estado" required placeholder="Estado" /></div>
      </div>
      
      <label for="fotoPerfil">URL da Foto de Perfil</label>
      <input type="text" id="fotoPerfil" />
      
      <h3>Serviços Oferecidos</h3>
      <div id="servicos-container">
        <div class="servico-item">
          <input type="text" class="nome-servico" placeholder="Nome do Serviço" required />
          <div class="row">
            <div><input type="number" class="preco-hora" placeholder="Preço/Hora (R$)" /></div>
            <div><input type="number" class="preco-projeto" placeholder="Preço/Projeto (R$)" /></div>
          </div>
        </div>
      </div>
      <button type="button" id="addServico" class="adicionar">+ Adicionar Serviço</button>
      
      <h3>Portfólio</h3>
      <div id="portfolio-container">
        <div class="portfolio-item">
          <input type="text" class="descricao-projeto" placeholder="Descrição do Projeto" />
          <input type="text" class="imagens-projeto" placeholder="URLs das imagens (separadas por vírgula)" />
        </div>
      </div>
      <button type="button" id="addPortfolio" class="adicionar">+ Adicionar Projeto</button>
      
      <h3>Certificações</h3>
      <div id="certificacoes-container">
        <div class="certificacao-item">
          <input type="text" class="nome-certificacao" placeholder="Nome da Certificação" />
          <div class="row">
            <div><input type="text" class="instituicao" placeholder="Instituição" /></div>
            <div><input type="date" class="data-obtencao" /></div>
          </div>
        </div>
      </div>
      <button type="button" id="addCertificacao" class="adicionar">+ Adicionar Certificação</button>
      
      <label for="urlVideo">URL do Vídeo de Introdução</label>
      <input type="text" id="urlVideo" />
      
      <h3>Disponibilidade</h3>
      <div class="disponibilidade">
        <div class="dias-semana">
          <label><input type="checkbox" value="Segunda-feira"> Segunda-feira</label>
          <label><input type="checkbox" value="Terça-feira"> Terça-feira</label>
          <label><input type="checkbox" value="Quarta-feira"> Quarta-feira</label>
          <label><input type="checkbox" value="Quinta-feira"> Quinta-feira</label>
          <label><input type="checkbox" value="Sexta-feira"> Sexta-feira</label>
          <label><input type="checkbox" value="Sábado"> Sábado</label>
          <label><input type="checkbox" value="Domingo"> Domingo</label>
        </div>
        <label for="horarios">Horários disponíveis (ex: 9h-17h, 19h-21h)</label>
        <input type="text" id="horarios" placeholder="Separe com vírgula" />
      </div>
      
      <h3>Dados Bancários</h3>
      <div class="dados-bancarios">
        <div class="row">
          <div><input type="text" id="banco" placeholder="Banco" /></div>
          <div><input type="text" id="agencia" placeholder="Agência" /></div>
        </div>
        <div class="row">
          <div><input type="text" id="conta" placeholder="Conta" /></div>
          <div>
            <select id="tipoConta">
              <option value="">Tipo de Conta</option>
              <option value="Pessoa Física">Pessoa Física</option>
              <option value="Pessoa Jurídica">Pessoa Jurídica</option>
            </select>
          </div>
        </div>
        <label for="pix">Chave PIX</label>
        <input type="text" id="pix" />
      </div>
      
      <label>
        <input type="checkbox" id="documentosVerificados"> Confirmo que todos os documentos são verdadeiros
      </label>
    </div>
  `;

  const camposCliente = `
    <div id="campos-cliente">
      <label for="dataNascimento">Data de Nascimento</label>
      <input type="date" id="dataNascimento" required />
      
      <label for="cpf">CPF</label>
      <input type="text" id="cpf" placeholder="123.456.789-00" required />
      
      <label for="email">Email</label>
      <input type="email" id="email" required />
      
      <label for="telefone">Telefone</label>
      <input type="text" id="telefone" placeholder="+55 11 91234-5678" required />
      
      <label for="endereco">Endereço</label>
      <div class="row">
        <div><input type="text" id="rua" placeholder="Rua, número" /></div>
      </div>
      <div class="row">
        <div><input type="text" id="cidade" required placeholder="Cidade" /></div>
        <div><input type="text" id="estado" required placeholder="Estado" /></div>
      </div>
      <input type="text" id="cep" placeholder="CEP" />
      
      <h3>Preferências de Serviço</h3>
      <div id="preferencias-container">
        <div class="preferencia-item">
          <input type="text" class="preferencia-servico" placeholder="Tipo de Serviço" />
        </div>
      </div>
      <button type="button" id="addPreferencia" class="adicionar">+ Adicionar Preferência</button>
      
      <h3>Método de Pagamento</h3>
      <label for="numeroCartao">Número do Cartão</label>
      <input type="text" id="numeroCartao" placeholder="1234 5678 9012 3456" />
      
      <label for="validade">Validade (MM/AA) e CVV</label>
      <div class="row">
        <div><input type="text" id="validade" placeholder="MM/AA" /></div>
        <div><input type="text" id="cvv" placeholder="CVV" /></div>
      </div>
    </div>
  `;

  const camposDinamicos = document.createElement("div");
  camposDinamicos.id = "campos-dinamicos";

  const tipoUsuarioLabel = tipoUsuarioSelect.parentElement;
  tipoUsuarioLabel.parentNode.insertBefore(camposDinamicos, tipoUsuarioLabel.nextSibling);

  tipoUsuarioSelect.addEventListener("change", function () {
    const tipo = this.value;

    if (tipo === "freelancer") {
      camposDinamicos.innerHTML = camposFreelancer;
      setupFreelancerEvents();
    } else if (tipo === "cliente") {
      camposDinamicos.innerHTML = camposCliente;
      setupClienteEvents();
    } else {
      camposDinamicos.innerHTML = "";
    }
  });

  function setupFreelancerEvents() {
    document.getElementById("addServico").addEventListener("click", function () {
      const container = document.getElementById("servicos-container");
      const novoItem = document.createElement("div");
      novoItem.className = "servico-item";
      novoItem.innerHTML = `
        <input type="text" class="nome-servico" placeholder="Nome do Serviço" required />
        <div class="row">
          <div><input type="number" class="preco-hora" placeholder="Preço/Hora (R$)" /></div>
          <div><input type="number" class="preco-projeto" placeholder="Preço/Projeto (R$)" /></div>
        </div>
      `;
      container.appendChild(novoItem);
    });

    document.getElementById("addPortfolio").addEventListener("click", function () {
      const container = document.getElementById("portfolio-container");
      const novoItem = document.createElement("div");
      novoItem.className = "portfolio-item";
      novoItem.innerHTML = `
        <input type="text" class="descricao-projeto" placeholder="Descrição do Projeto" />
        <input type="text" class="imagens-projeto" placeholder="URLs das imagens (separadas por vírgula)" />
      `;
      container.appendChild(novoItem);
    });

    document.getElementById("addCertificacao").addEventListener("click", function () {
      const container = document.getElementById("certificacoes-container");
      const novoItem = document.createElement("div");
      novoItem.className = "certificacao-item";
      novoItem.innerHTML = `
        <input type="text" class="nome-certificacao" placeholder="Nome da Certificação" />
        <div class="row">
          <div><input type="text" class="instituicao" placeholder="Instituição" /></div>
          <div><input type="date" class="data-obtencao" /></div>
        </div>
      `;
      container.appendChild(novoItem);
    });
  }

  function setupClienteEvents() {
    document.getElementById("addPreferencia").addEventListener("click", function () {
      const container = document.getElementById("preferencias-container");
      const novoItem = document.createElement("div");
      novoItem.className = "preferencia-item";
      novoItem.innerHTML = `
        <input type="text" class="preferencia-servico" placeholder="Tipo de Serviço" />
      `;
      container.appendChild(novoItem);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const tipoUsuario = document.getElementById("tipoUsuario").value;
let jsonOutput = {
  tipo: tipoUsuario,
  id: tipoUsuario + "_" + Date.now().toString().slice(-3),
  email: document.getElementById("email").value,
  senha: document.getElementById("senha").value,
  perfil: {
    nome: document.getElementById("nome").value,
    data_nascimento: document.getElementById("dataNascimento")?.value || "",
    cpf: document.getElementById("cpf")?.value || "",
    telefone: document.getElementById("telefone")?.value || "",
    termos_aceitos: true,
    data_cadastro: new Date().toISOString()
  }
};


    if (tipoUsuario === "freelancer") {

      jsonOutput.perfil.endereco = {
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        pais: "Brasil"
      };


      jsonOutput.perfil.foto_perfil_url = document.getElementById("fotoPerfil").value;


      jsonOutput.perfil.servicos_oferecidos = [];
      document.querySelectorAll(".servico-item").forEach((item, index) => {
        jsonOutput.perfil.servicos_oferecidos.push({
          id_servico: index + 1,
          nome_servico: item.querySelector(".nome-servico").value,
          preco_por_hora: Number(item.querySelector(".preco-hora").value) || 0,
          preco_por_projeto: Number(item.querySelector(".preco-projeto").value) || 0
        });
      });

      jsonOutput.perfil.portfolio = [];
      document.querySelectorAll(".portfolio-item").forEach((item, index) => {
        const descricao = item.querySelector(".descricao-projeto").value;
        if (descricao) {
          const imagens = item.querySelector(".imagens-projeto").value.split(',').map(url => url.trim());
          jsonOutput.perfil.portfolio.push({
            id_projeto: index + 1,
            descricao_projeto: descricao,
            imagens_projeto: imagens
          });
        }
      });

      jsonOutput.perfil.certificacoes = [];
      document.querySelectorAll(".certificacao-item").forEach((item, index) => {
        const nomeCertificacao = item.querySelector(".nome-certificacao").value;
        if (nomeCertificacao) {
          jsonOutput.perfil.certificacoes.push({
            id_certificacao: index + 1,
            nome_certificacao: nomeCertificacao,
            instituicao: item.querySelector(".instituicao").value,
            data_obtencao: item.querySelector(".data-obtencao").value
          });
        }
      });

      jsonOutput.perfil.url_video_introducao = document.getElementById("urlVideo").value;


      const diasSelecionados = [];
      document.querySelectorAll('.dias-semana input:checked').forEach(input => {
        diasSelecionados.push(input.value);
      });
      const horarios = document.getElementById("horarios").value.split(',').map(h => h.trim());

      jsonOutput.perfil.disponibilidade = {
        dias: diasSelecionados,
        horarios: horarios
      };


      jsonOutput.perfil.conta_bancaria = {
        banco: document.getElementById("banco").value,
        agencia: document.getElementById("agencia").value,
        conta: document.getElementById("conta").value,
        tipo: document.getElementById("tipoConta").value,
        pix: document.getElementById("pix").value
      };

      s
      jsonOutput.perfil.documentos_verificados = document.getElementById("documentosVerificados").checked;

      jsonOutput.perfil.avaliacoes_recebidas = [];
      jsonOutput.perfil.uploads_portfolio = [];

    } else if (tipoUsuario === "cliente") {
      jsonOutput.perfil.endereco = {
        rua: document.getElementById("rua").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        cep: document.getElementById("cep").value
      };


      jsonOutput.perfil.preferencias_servico = [];
      document.querySelectorAll(".preferencia-item").forEach(item => {
        const preferencia = item.querySelector(".preferencia-servico").value;
        if (preferencia) {
          jsonOutput.perfil.preferencias_servico.push(preferencia);
        }
      });

      jsonOutput.perfil.metodo_pagamento = {
        numero_cartao: document.getElementById("numeroCartao").value,
        validade: document.getElementById("validade").value,
        cvv: document.getElementById("cvv").value
      };


      jsonOutput.perfil.historico_contratos = [];
      jsonOutput.perfil.avaliacoes_realizadas = [];
    }

    console.log("JSON Enviado:", JSON.stringify(jsonOutput, null, 2));
    
    fetch('http://localhost:3000/usuarios', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonOutput)
    })
    .then(res => {
      if (res.ok) {
        alert(jsonOutput.id ? 'Atualizado com sucesso!' : 'Cadastrado com sucesso!');
      } else {
        alert('Erro ao salvar no servidor.');
      }
    });
    


  });
});
