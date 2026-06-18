import { Produto, Pedido, Horario, Feriado, Mensagem } from './types';

// Imagens realistas de alimentos (links Unsplash de alta qualidade)
export const DEFAULT_PRODUCTS: Produto[] = [
  // Carnes
  {
    id: 'carne_1',
    nome: 'Assado de panela de porco',
    preco: 0, // Incluso na marmita
    descricao: 'Carne de porco macia e suculenta, cozida lentamente em fogo baixo no próprio molho temperado.',
    imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    ativa: true,
    categoria: 'carne'
  },
  {
    id: 'carne_2',
    nome: 'Costela de gado cozida com verduras',
    preco: 0,
    descricao: 'Costela bovina de dar água na boca, cozida com batatas, cenouras e tempero verde caseiro.',
    imagem: 'https://images.unsplash.com/photo-1547928500-300457b9f8f2?auto=format&fit=crop&q=80&w=600',
    ativa: true,
    categoria: 'carne'
  },
  {
    id: 'carne_3',
    nome: 'Frango ao molho',
    preco: 0,
    descricao: 'Pedacinhos de frango temperados, cozidos em molho vermelho encorpado e aromático.',
    imagem: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600',
    ativa: true,
    categoria: 'carne'
  },
  {
    id: 'carne_4',
    nome: 'Toscana assada na brasa',
    preco: 0,
    descricao: 'Linguiça toscana Premium grelhada ao calor da brasa, suculenta e saborosa.',
    imagem: 'https://images.unsplash.com/photo-1532242110156-f6737199ec5e?auto=format&fit=crop&q=80&w=600',
    ativa: true,
    categoria: 'carne'
  },
  {
    id: 'carne_5',
    nome: 'Picanha assada na brasa',
    preco: 0,
    descricao: 'Corte nobre de picanha com aquela capa de gordura perfeita, assada na brasa com sal grosso.',
    imagem: 'https://images.unsplash.com/photo-1546964214-db79da3c113a?auto=format&fit=crop&q=80&w=600',
    ativa: true,
    categoria: 'carne'
  },

  // Acompanhamentos
  {
    id: 'acomp_1',
    nome: 'Alface com cenoura ralada',
    preco: 0,
    descricao: 'Alface fresquinha e crocante acompanhada de cenoura ralada bem fininha.',
    imagem: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    ativa: true,
    categoria: 'acompanhamento'
  },
  {
    id: 'acomp_2',
    nome: 'Repolho',
    preco: 0,
    descricao: 'Salada de repolho picado temperado, leve e refrescante.',
    imagem: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400',
    ativa: true,
    categoria: 'acompanhamento'
  },
  {
    id: 'acomp_3',
    nome: 'Purê de batata',
    preco: 0,
    descricao: 'Purê super cremoso batido com manteiga e um toque de leite pastoral.',
    imagem: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=400',
    ativa: true,
    categoria: 'acompanhamento'
  },
  {
    id: 'acomp_4',
    nome: 'Salada de maionese',
    preco: 0,
    descricao: 'Batatas e cenouras cozidas envolvidas em maionese cremosa com milho e temperos.',
    imagem: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&q=80&w=400',
    ativa: true,
    categoria: 'acompanhamento'
  },
  {
    id: 'acomp_5',
    nome: 'Cuxá',
    preco: 0,
    descricao: 'O tradicionalíssimo cuxá maranhense preparado com vinagreira, gergelim e camarão seco.',
    imagem: 'https://images.unsplash.com/photo-1515003848606-ca0597947d65?auto=format&fit=crop&q=80&w=400',
    ativa: true,
    categoria: 'acompanhamento'
  },
];

export const DEFAULT_HOURS: Horario[] = [
  { id: '1', diaSemana: 'Segunda-feira', abertura: '10:00', fechamento: '15:00', fechado: false },
  { id: '2', diaSemana: 'Terça-feira', abertura: '10:00', fechamento: '15:00', fechado: false },
  { id: '3', diaSemana: 'Quarta-feira', abertura: '10:00', fechamento: '15:00', fechado: false },
  { id: '4', diaSemana: 'Quinta-feira', abertura: '10:00', fechamento: '15:00', fechado: false },
  { id: '5', diaSemana: 'Sexta-feira', abertura: '10:00', fechamento: '15:00', fechado: false },
  { id: '6', diaSemana: 'Sábado', abertura: '10:00', fechamento: '16:00', fechado: false },
  { id: '7', diaSemana: 'Domingo', abertura: '10:00', fechamento: '14:00', fechado: true },
];

export const DEFAULT_FERIADOS: Feriado[] = [
  { id: 'fer_1', nome: 'Independência do Brasil', data: '2026-09-07', descricao: 'Funcionamento em horário especial de feriado', funcionamento: 'Especial' },
  { id: 'fer_2', nome: 'Nossa Senhora Aparecida', data: '2026-10-12', descricao: 'Estará fechado neste feriado sagrado', funcionamento: 'Fechado' }
];

export const DEFAULT_MESSAGES: Mensagem[] = [
  { id: 'msg_1', texto: 'Seja bem-vindo ao Sabor de Casa! Fazemos entregas rápidas na região central e bairros vizinhos em Coroatá.', ativa: false, dataCriacao: new Date().toISOString() },
  { id: 'msg_2', texto: 'Amanhã estaremos fechados em virtude do feriado local.', ativa: false, dataCriacao: new Date().toISOString() }
];

// Dados dos Pedidos para dar vida ao Painel de Relatórios
export const MOCK_PEDIDOS: Pedido[] = [
  {
    id: 'SBC-1204',
    clienteNome: 'Maria Silva',
    clienteTelefone: '(99) 98112-2334',
    endereco: 'Rua do Sol',
    numero: '142',
    bairro: 'Centro',
    cidade: 'Coroatá',
    referencia: 'Perto do Banco do Brasil',
    formaPagamento: 'Pix',
    precisaTroco: false,
    valorTroco: '',
    tipoEntrega: 'Entrega',
    status: 'Entregue',
    tipoMarmita: 'PF Completo',
    carne: 'Picanha assada na brasa',
    acompanhamentos: ['Alface com cenoura ralada', 'Salada de maionese', 'Purê de batata'],
    valorMarmita: 25,
    total: 25,
    dataCriacao: new Date(Date.now() - 2 * 3600000).toISOString() // 2 horas atrás
  },
  {
    id: 'SBC-1205',
    clienteNome: 'João Santana',
    clienteTelefone: '(99) 98221-4556',
    endereco: 'Avenida Trizidela',
    numero: '89',
    bairro: 'Trizidela',
    cidade: 'Coroatá',
    referencia: 'Próximo à quadra de esportes',
    formaPagamento: 'Dinheiro',
    precisaTroco: true,
    valorTroco: '50',
    tipoEntrega: 'Entrega',
    status: 'Confirmado',
    tipoMarmita: 'Quentinha / Marmita',
    carne: 'Costela de gado cozida com verduras',
    acompanhamentos: ['Repolho', 'Cuxá', 'Purê de batata'],
    valorMarmita: 20,
    total: 20,
    dataCriacao: new Date(Date.now() - 30 * 60000).toISOString() // 30 mins atrás
  },
  {
    id: 'SBC-1206',
    clienteNome: 'Clara Mendes',
    clienteTelefone: '(99) 99123-5678',
    endereco: 'Avenida da Bandeira',
    numero: '310',
    bairro: 'Centro',
    cidade: 'Coroatá',
    referencia: 'Retirada no balcão',
    formaPagamento: 'Cartão de Crédito',
    precisaTroco: false,
    valorTroco: '',
    tipoEntrega: 'Retirada',
    status: 'Pendente',
    tipoMarmita: 'Quentinha / Marmita',
    carne: 'Frango ao molho',
    acompanhamentos: ['Purê de batata', 'Salada de maionese'],
    valorMarmita: 20,
    total: 20,
    dataCriacao: new Date().toISOString()
  },
  // Pedidos históricos de dias anteriores para os gráficos
  {
    id: 'SBC-1191',
    clienteNome: 'Antonio Rocha',
    clienteTelefone: '(99) 98111-2222',
    endereco: 'Rua da Areia',
    numero: '12',
    bairro: 'Mesa de Pedra',
    cidade: 'Coroatá',
    referencia: 'Ao lado do mercadinho',
    formaPagamento: 'Pix',
    precisaTroco: false,
    valorTroco: '',
    tipoEntrega: 'Entrega',
    status: 'Entregue',
    tipoMarmita: 'PF Completo',
    carne: 'Assado de panela de porco',
    acompanhamentos: ['Cuxá', 'Repolho'],
    valorMarmita: 25,
    total: 25,
    dataCriacao: new Date(Date.now() - 24 * 3600000).toISOString() // Ontem
  },
  {
    id: 'SBC-1192',
    clienteNome: 'Regina Sousa',
    clienteTelefone: '(99) 98222-3333',
    endereco: 'Avenida Homero Castro',
    numero: '411',
    bairro: 'Novo Areal',
    cidade: 'Coroatá',
    referencia: 'Igreja Presbiteriana',
    formaPagamento: 'Dinheiro',
    precisaTroco: false,
    valorTroco: '',
    tipoEntrega: 'Entrega',
    status: 'Entregue',
    tipoMarmita: 'Quentinha / Marmita',
    carne: 'Toscana assada na brasa',
    acompanhamentos: ['Salada de maionese', 'Alface com cenoura ralada'],
    valorMarmita: 20,
    total: 20,
    dataCriacao: new Date(Date.now() - 24 * 3600000 - 1800000).toISOString() // Ontem
  },
  {
    id: 'SBC-1193',
    clienteNome: 'Pedro Chaves',
    clienteTelefone: '(99) 98454-9988',
    endereco: 'Rua São Francisco',
    numero: '77',
    bairro: 'Vila Amorim',
    cidade: 'Coroatá',
    referencia: 'Posto de Saúde',
    formaPagamento: 'Cartão de Débito',
    precisaTroco: false,
    valorTroco: '',
    tipoEntrega: 'Entrega',
    status: 'Entregue',
    tipoMarmita: 'PF Completo',
    carne: 'Picanha assada na brasa',
    acompanhamentos: ['Cuxá', 'Purê de batata', 'Salada de maionese'],
    valorMarmita: 25,
    total: 25,
    dataCriacao: new Date(Date.now() - 48 * 3600000).toISOString() // 2 dias atrás
  },
  {
    id: 'SBC-1194',
    clienteNome: 'Mariana Lima',
    clienteTelefone: '(99) 98455-1122',
    endereco: 'Rua Senador Alexandre Costa',
    numero: '900',
    bairro: 'Centro',
    cidade: 'Coroatá',
    referencia: 'Em frente ao colégio militar',
    formaPagamento: 'Pix',
    precisaTroco: false,
    valorTroco: '',
    tipoEntrega: 'Retirada',
    status: 'Entregue',
    tipoMarmita: 'Quentinha / Marmita',
    carne: 'Frango ao molho',
    acompanhamentos: ['Repolho', 'Alface com cenoura ralada'],
    valorMarmita: 20,
    total: 20,
    dataCriacao: new Date(Date.now() - 72 * 3600000).toISOString() // 3 dias atrás
  }
];

class DBService {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // PRODUTOS
  getProdutos(): Produto[] {
    return this.getStorageItem<Produto[]>('sbc_produtos', DEFAULT_PRODUCTS);
  }

  saveProduto(product: Produto): void {
    const products = this.getProdutos();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.setStorageItem('sbc_produtos', products);
  }

  deleteProduto(id: string): void {
    const products = this.getProdutos();
    const updated = products.filter(p => p.id !== id);
    this.setStorageItem('sbc_produtos', updated);
  }

  // PEDIDOS
  getPedidos(): Pedido[] {
    return this.getStorageItem<Pedido[]>('sbc_pedidos', MOCK_PEDIDOS);
  }

  addPedido(pedido: Pedido): void {
    const pedidos = this.getPedidos();
    pedidos.unshift(pedido); // Novo primeiro
    this.setStorageItem('sbc_pedidos', pedidos);

    // Gravar cliente histórico também
    this.addCliente({
      id: 'cli_' + Date.now(),
      nome: pedido.clienteNome,
      telefone: pedido.clienteTelefone,
      endereco: pedido.endereco,
      numero: pedido.numero,
      bairro: pedido.bairro,
      cidade: pedido.cidade
    });
  }

  updatePedidoStatus(id: string, status: Pedido['status']): void {
    const pedidos = this.getPedidos();
    const index = pedidos.findIndex(p => p.id === id);
    if (index >= 0) {
      pedidos[index].status = status;
      this.setStorageItem('sbc_pedidos', pedidos);
    }
  }

  // CLIENTES
  getClientes() {
    return this.getStorageItem<any[]>('sbc_clientes', [
      { id: '1', nome: 'Maria Silva', telefone: '(99) 98112-2334', endereco: 'Rua do Sol', numero: '142', bairro: 'Centro', cidade: 'Coroatá' },
      { id: '2', nome: 'João Santana', telefone: '(99) 98221-4556', endereco: 'Avenida Trizidela', numero: '89', bairro: 'Trizidela', cidade: 'Coroatá' },
      { id: '3', nome: 'Clara Mendes', telefone: '(99) 99123-5678', endereco: 'Avenida da Bandeira', numero: '310', bairro: 'Centro', cidade: 'Coroatá' }
    ]);
  }

  addCliente(cliente: any): void {
    const clientes = this.getClientes();
    const exists = clientes.some(c => c.telefone === cliente.telefone);
    if (!exists) {
      clientes.push(cliente);
      this.setStorageItem('sbc_clientes', clientes);
    }
  }

  // HORÁRIOS
  getHorarios(): Horario[] {
    return this.getStorageItem<Horario[]>('sbc_horarios', DEFAULT_HOURS);
  }

  updateHorario(id: string, abertura: string, fechamento: string, fechado: boolean): void {
    const horarios = this.getHorarios();
    const index = horarios.findIndex(h => h.id === id);
    if (index >= 0) {
      horarios[index].abertura = abertura;
      horarios[index].fechamento = fechamento;
      horarios[index].fechado = fechado;
      this.setStorageItem('sbc_horarios', horarios);
    }
  }

  // FORÇAR BOTÃO ABERTO / FECHADO MANUAL
  getAbertoManual(): boolean {
    return this.getStorageItem<boolean>('sbc_aberto_manual', true);
  }

  setAbertoManual(aberto: boolean): void {
    this.setStorageItem('sbc_aberto_manual', aberto);
  }

  // FERIADOS
  getFeriados(): Feriado[] {
    return this.getStorageItem<Feriado[]>('sbc_feriados', DEFAULT_FERIADOS);
  }

  addFeriado(feriado: Feriado): void {
    const feriados = this.getFeriados();
    feriados.push(feriado);
    this.setStorageItem('sbc_feriados', feriados);
  }

  deleteFeriado(id: string): void {
    const feriados = this.getFeriados();
    const updated = feriados.filter(f => f.id !== id);
    this.setStorageItem('sbc_feriados', updated);
  }

  // MENSAGENS AUTOMÁTICAS / AVISOS
  getMensagens(): Mensagem[] {
    return this.getStorageItem<Mensagem[]>('sbc_mensagens', DEFAULT_MESSAGES);
  }

  addMensagem(mensagem: Mensagem): void {
    const mensagens = this.getMensagens();
    mensagens.push(mensagem);
    this.setStorageItem('sbc_mensagens', mensagens);
  }

  toggleMensagemAtiva(id: string): void {
    const mensagens = this.getMensagens();
    // Desativa todas e ativa apenas esta, ou ativa/desativa esta individualmente. O prompt sugere que quando ativada, exibe o popup.
    const updated = mensagens.map(m => {
      if (m.id === id) {
        return { ...m, ativa: !m.ativa };
      }
      return { ...m, ativa: false }; // apenas uma ativa por vez para avisos limpos!
    });
    this.setStorageItem('sbc_mensagens', updated);
  }

  deleteMensagem(id: string): void {
    const mensagens = this.getMensagens();
    const updated = mensagens.filter(m => m.id !== id);
    this.setStorageItem('sbc_mensagens', updated);
  }

  // CHECAR SE ESTÁ ABERTO AGORA
  isAbertoAgora(): { aberto: boolean; motivo: string; bannerMessage?: string } {
    const manualStatus = this.getAbertoManual();
    if (!manualStatus) {
      // Checar se há uma mensagem automática ativa para explicar
      const mensagensAtivas = this.getMensagens().filter(m => m.ativa);
      const motivo = mensagensAtivas.length > 0 
        ? mensagensAtivas[0].texto 
        : 'Fechado temporariamente pelo administrador.';
      return { aberto: false, motivo, bannerMessage: motivo };
    }

    // Checar Feriado de hoje (corrigido para f_data batendo com ano-mes-dia de hoje)
    const hojeStr = new Date().toISOString().split('T')[0];
    const feriados = this.getFeriados();
    const feriadoHoje = feriados.find(f => f.data === hojeStr);

    if (feriadoHoje) {
      if (feriadoHoje.funcionamento === 'Fechado') {
        const msg = `Estamos fechados hoje devido ao feriado de ${feriadoHoje.nome}. ${feriadoHoje.descricao}`;
        return { aberto: false, motivo: msg, bannerMessage: msg };
      } else {
        // Funcionamento especial
        return { aberto: true, motivo: `Horário especial no feriado de ${feriadoHoje.nome}: ${feriadoHoje.descricao}` };
      }
    }

    // Checar horas por dia da semana
    const diasSemanaMapa = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ];
    const agora = new Date();
    const diaIndex = agora.getDay();
    const diaNome = diasSemanaMapa[diaIndex];

    const horarios = this.getHorarios();
    const horarioHoje = horarios.find(h => h.diaSemana === diaNome);

    if (!horarioHoje || horarioHoje.fechado) {
      const msg = `Fechado aos domingos ou sem expediente registrado para ${diaNome}.`;
      return { aberto: false, motivo: msg, bannerMessage: msg };
    }

    // Comparar horas
    const horaAgora = agora.getHours();
    const minAgora = agora.getMinutes();
    const totalMinAgora = horaAgora * 60 + minAgora;

    const [hmAbertura, minAbertura] = horarioHoje.abertura.split(':').map(Number);
    const totalMinAbertura = hmAbertura * 60 + minAbertura;

    const [hmFechamento, minFechamento] = horarioHoje.fechamento.split(':').map(Number);
    const totalMinFechamento = hmFechamento * 60 + minFechamento;

    if (totalMinAgora < totalMinAbertura || totalMinAgora > totalMinFechamento) {
      const msg = `Nosso horário de funcionamento hoje (${diaNome}) é das ${horarioHoje.abertura} às ${horarioHoje.fechamento}.`;
      return { aberto: false, motivo: msg, bannerMessage: msg };
    }

    return { aberto: true, motivo: 'Estamos recebendo pedidos!' };
  }
}

export const dbService = new DBService();
