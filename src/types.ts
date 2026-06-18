export interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  ativa: boolean;
  categoria: 'prato' | 'carne' | 'acompanhamento';
}

export interface Pedido {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  referencia: string;
  formaPagamento: 'Pix' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito';
  precisaTroco: boolean;
  valorTroco: string;
  tipoEntrega: 'Entrega' | 'Retirada';
  status: 'Pendente' | 'Confirmado' | 'Entregue' | 'Cancelado';
  tipoMarmita: 'PF Completo' | 'Quentinha / Marmita';
  valorMarmita: number;
  carne: string;
  acompanhamentos: string[];
  total: number;
  dataCriacao: string; // ISO string
}

export interface Horario {
  id: string;
  diaSemana: string;
  abertura: string;
  fechamento: string;
  fechado: boolean;
}

export interface Feriado {
  id: string;
  nome: string;
  data: string;
  descricao: string;
  funcionamento: 'Fechado' | 'Especial';
}

export interface Mensagem {
  id: string;
  texto: string;
  ativa: boolean;
  dataCriacao: string;
}

export interface ConfiguracaoGeral {
  abertoManual: boolean; // override de aberto/fechado geral por botão do admin
}
