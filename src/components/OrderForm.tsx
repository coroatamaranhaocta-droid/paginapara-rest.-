import React, { useState, useEffect } from 'react';
import { dbService } from '../dbService';
import { Produto, Pedido } from '../types';
import { ShoppingCart, Check, Fuel, MapPin, Truck, Store, ArrowRight, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface OrderFormProps {
  isOpenNow: boolean;
  onOrderCompleted: () => void;
}

export default function OrderForm({ isOpenNow, onOrderCompleted }: OrderFormProps) {
  // Estado dinâmico de produtos cadastrados pelo ADM
  const [carnes, setCarnes] = useState<Produto[]>([]);
  const [acompanhamentos, setAcompanhamentos] = useState<Produto[]>([]);

  // Dados do pedido
  const [tipoMarmita, setTipoMarmita] = useState<'PF Completo' | 'Quentinha / Marmita'>('Quentinha / Marmita');
  const [carneSelected, setCarneSelected] = useState<string>('');
  const [acompsSelected, setAcompsSelected] = useState<string[]>([]);
  const [showAcompModal, setShowAcompModal] = useState(false);

  // Formulário do cliente
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Coroatá');
  const [referencia, setReferencia] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'Pix' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito'>('Pix');
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [valorTroco, setValorTroco] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<'Entrega' | 'Retirada'>('Entrega');

  const WHATSAPP_NUMERO = "5599984545370"; // 99 98454-5370 formatado internacional

  useEffect(() => {
    carregarMenu();
  }, []);

  const carregarMenu = () => {
    const todosProds = dbService.getProdutos();
    // Exibe apenas os produtos ativos
    setCarnes(todosProds.filter(p => p.categoria === 'carne' && p.ativa));
    setAcompanhamentos(todosProds.filter(p => p.categoria === 'acompanhamento' && p.ativa));
  };

  // Preço base
  const precoMarmita = tipoMarmita === 'PF Completo' ? 25.00 : 20.00;
  const total = precoMarmita;

  const handleToggleAcomp = (nome: string) => {
    if (acompsSelected.includes(nome)) {
      setAcompsSelected(acompsSelected.filter(item => item !== nome));
    } else {
      setAcompsSelected([...acompsSelected, nome]);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Máscara (99) 98454-5370
    const numbers = value.replace(/\D/g, '');
    let char = { 0: '(', 2: ') ', 7: '-' };
    let r = '';
    for (let i = 0; i < numbers.length; i++) {
      r += (char[i as keyof typeof char] || '') + numbers[i];
    }
    return r.substring(0, 15);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClienteTelefone(formatPhoneNumber(e.target.value));
  };

  const handleFinalizarPedido = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOpenNow) {
      Swal.fire({
        title: '⚠️ Restaurante Fechado',
        text: 'Não estamos recebendo pedidos online no momento devido ao horário de funcionamento. Por favor, verifique nossos horários ou volte amanhã.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#991b1b',
      });
      return;
    }

    // Validar dados do cliente antes para não interromper a escolha fácil
    if (!clienteNome || !clienteTelefone || (tipoEntrega === 'Entrega' && (!endereco || !bairro))) {
      Swal.fire('Preencha os dados de entrega', 'Nome, telefone e dados de endereço são fundamentais para realizarmos sua entrega corretamente!', 'warning');
      return;
    }

    if (!carneSelected) {
      Swal.fire({
        title: 'Escolha a sua carne',
        text: 'Por favor, selecione uma das opções de carnes preparadas para o seu prato.',
        icon: 'info',
        confirmButtonText: 'Escolher',
        confirmButtonColor: '#c2410c'
      });
      return;
    }

    if (acompsSelected.length === 0) {
      // Abre o modal de escolha fácil
      setShowAcompModal(true);
      return;
    }

    prosseguirComPedido();
  };

  const prosseguirComPedido = () => {
    if (!clienteNome || !clienteTelefone || (tipoEntrega === 'Entrega' && (!endereco || !bairro))) {
      Swal.fire('Preencha os dados', 'Nome, telefone e dados de endereço são fundamentais para realizarmos sua entrega corretamente!', 'warning');
      return;
    }

    // Gerar ID do pedido
    const pedidoId = `SBC-${Math.floor(1000 + Math.random() * 9000)}`;

    const novoPedido: Pedido = {
      id: pedidoId,
      clienteNome,
      clienteTelefone,
      endereco: tipoEntrega === 'Entrega' ? endereco : 'Retirada no balcão',
      numero: tipoEntrega === 'Entrega' ? numero : '',
      bairro: tipoEntrega === 'Entrega' ? bairro : '',
      cidade: tipoEntrega === 'Entrega' ? cidade : 'Coroatá',
      referencia: tipoEntrega === 'Entrega' ? referencia : '',
      formaPagamento,
      precisaTroco,
      valorTroco: precisaTroco ? valorTroco : '',
      tipoEntrega,
      status: 'Pendente',
      tipoMarmita,
      valorMarmita: precoMarmita,
      carne: carneSelected,
      acompanhamentos: acompsSelected,
      total,
      dataCriacao: new Date().toISOString()
    };

    // Gravar o pedido no dbService / LocalStorage
    dbService.addPedido(novoPedido);

    // Formatar texto para o Whatsapp
    let msgWhatsapp = `Olá *Sabor de Casa*! Gostaria de fazer o seguinte pedido:\n\n`;
    msgWhatsapp += `👉 *Código do Pedido:* ${pedidoId}\n`;
    msgWhatsapp += `🍱 *Prato:* ${tipoMarmita} (R$ ${precoMarmita.toFixed(2).replace('.', ',')})\n`;
    msgWhatsapp += `🥩 *Carne Escolhida:* ${carneSelected}\n`;
    
    if (acompsSelected.length > 0) {
      msgWhatsapp += `🥗 *Acompanhamentos:* \n - ` + acompsSelected.join('\n - ') + `\n`;
    } else {
      msgWhatsapp += `🥗 *Acompanhamentos:* Nenhum\n`;
    }

    msgWhatsapp += `\n💵 *Total:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    msgWhatsapp += `📍 *Forma de Retirada:* ${tipoEntrega}\n`;
    
    if (tipoEntrega === 'Entrega') {
      msgWhatsapp += `🏠 *Endereço:* ${endereco}, Nº ${numero || 'S/N'}\n`;
      msgWhatsapp += `🏡 *Bairro:* ${bairro}\n`;
      msgWhatsapp += `🏙️ *Cidade:* ${cidade} - MA\n`;
      if (referencia) msgWhatsapp += `🔍 *Referência:* ${referencia}\n`;
    }

    msgWhatsapp += `💳 *Falta pagar via:* ${formaPagamento}\n`;
    if (formaPagamento === 'Dinheiro' && precisaTroco) {
      msgWhatsapp += `🪙 *Precisa de troco para:* R$ ${valorTroco}\n`;
    }

    msgWhatsapp += `\n👤 *Cliente:* ${clienteNome}\n`;
    msgWhatsapp += `📞 *Telefone de Contato:* ${clienteTelefone}\n\n`;
    msgWhatsapp += `_Enviado via aplicativo oficial do Sabor de Casa_`;

    // Abrir Whatsapp
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(msgWhatsapp)}`;
    window.open(urlWhatsapp, '_blank');

    Swal.fire({
      title: '🎉 Pedido Enviado!',
      text: `Seu pedido ${pedidoId} foi registrado e você será redirecionado para o WhatsApp para confirmar com o restaurante.`,
      icon: 'success',
      confirmButtonText: 'Ótimo!',
      confirmButtonColor: '#991b1b',
    });

    // Resetar campos opcionais
    setCarneSelected('');
    setAcompsSelected([]);
    onOrderCompleted();
  };

  return (
    <section id="cardapio" className="py-12 px-4 max-w-6xl mx-auto font-sans scroll-mt-6">
      
      {/* 1. SEÇÃO DE PREÇOS (CARDS PRINCIPAIS) */}
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Nossas Opções de Marmitas 🍱
        </h3>
        <p className="text-stone-500 text-sm md:text-base mt-2 max-w-lg mx-auto">
          Escolha o tamanho ideal da sua fome. Todas as nossas opções incluem Arroz cozido, Farofa fofinha e a sua escolha de carnes e acompanhamentos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-14">
        {/* Card 1: PF COMPLETO */}
        <div 
          onClick={() => setTipoMarmita('PF Completo')}
          className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden backdrop-blur-sm shadow-md ${
            tipoMarmita === 'PF Completo' 
              ? 'border-amber-500 bg-amber-50/50 scale-102 ring-4 ring-amber-500/10' 
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          {tipoMarmita === 'PF Completo' && (
            <div className="absolute top-0 right-0 bg-amber-500 text-red-950 text-[10px] uppercase font-bold py-1 px-4 rounded-bl-xl shadow">
              Selecionado
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2 py-0.5 rounded-md">Prato feito</span>
              <h4 className="font-display font-extrabold text-xl md:text-2xl mt-1.5 text-stone-900">PF Completo</h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">Por apenas</p>
              <h5 className="font-display font-black text-2xl md:text-3xl text-red-800">R$ 25,00</h5>
            </div>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            Generosa porção servida com arroz soltinho, farofa dourada temperada, sua carne de preferência e até múltiplos acompanhamentos frescos à sua escolha. Ideal para um almoço robusto de respeito.
          </p>
          <div className="text-xs text-stone-400 border-t border-dotted border-stone-200 pt-3 flex flex-wrap gap-x-3 gap-y-1 font-medium">
            <span>🥗 Acompanhamentos livres</span>
            <span>•</span>
            <span>🥩 Grelhados premium</span>
          </div>
        </div>

        {/* Card 2: QUENTINHA / MARMITA */}
        <div 
          onClick={() => setTipoMarmita('Quentinha / Marmita')}
          className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden backdrop-blur-sm shadow-md ${
            tipoMarmita === 'Quentinha / Marmita' 
              ? 'border-amber-500 bg-amber-50/50 scale-102 ring-4 ring-amber-500/10' 
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          {tipoMarmita === 'Quentinha / Marmita' && (
            <div className="absolute top-0 right-0 bg-amber-500 text-red-950 text-[10px] uppercase font-bold py-1 px-4 rounded-bl-xl shadow">
              Selecionado
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Tradicional</span>
              <h4 className="font-display font-extrabold text-xl md:text-2xl mt-1.5 text-stone-900">Quentinha "Marmita"</h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">Por apenas</p>
              <h5 className="font-display font-black text-2xl md:text-3xl text-red-800">R$ 20,00</h5>
            </div>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed mb-4">
            A verdadeira e amada marmita brasileira. Embalagem que conserva o calor perfeitamente. Vem com Arroz da casa, Farofa artesanal e a carne deliciosa que você optar. Almoço campeão e econômico!
          </p>
          <div className="text-xs text-stone-400 border-t border-dotted border-stone-200 pt-3 flex flex-wrap gap-x-3 gap-y-1 font-medium">
            <span>🍚 Prático e quentinho</span>
            <span>•</span>
            <span>💰 Excelente custo-benefício</span>
          </div>
        </div>
      </div>


      {/* 2. SEÇÃO ESCOLHA SUA CARNE */}
      <div className="border-t border-stone-200/80 pt-12 mb-16">
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            1. Escolha a sua Carne Principal 🥩
          </h3>
          <p className="text-stone-500 text-xs md:text-sm mt-1">
            Grelhadas na brasa ou cozidas ao molho lento. Selecione um tipo de carne (Incluso no prato).
          </p>
        </div>

        {carnes.length === 0 ? (
          <div className="text-center py-6 text-stone-400 border border-stone-100 rounded-xl bg-stone-50">
            Nenhuma carne ativa registrada no cardápio de hoje. Por favor, volte mais tarde.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {carnes.map((carne) => {
              const isSelected = carneSelected === carne.nome;
              return (
                <div
                  key={carne.id}
                  onClick={() => setCarneSelected(carne.nome)}
                  className={`cursor-pointer rounded-xl bg-white border overflow-hidden shadow-sm transition hover:shadow-md ${
                    isSelected 
                      ? 'border-red-600 ring-2 ring-red-600/30' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="h-36 overflow-hidden relative bg-stone-100">
                    <img 
                      src={carne.imagem} 
                      alt={carne.nome} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-900/10 flex items-center justify-center">
                        <div className="bg-red-700 text-white rounded-full p-2 shadow-lg scale-110">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h5 className="font-display font-semibold text-stone-900 text-sm leading-tight line-clamp-1 mb-1">{carne.nome}</h5>
                    <p className="text-[11px] text-stone-500 leading-normal line-clamp-2">{carne.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* 3. SEÇÃO ACOMPANHAMENTOS */}
      <div className="border-t border-stone-200/80 pt-12 mb-16">
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            2. Selecione seus Acompanhamentos 🥗
          </h3>
          <p className="text-stone-500 text-xs md:text-sm mt-1">
            Selecione múltiplos acompanhamentos para tornar o seu prato ainda mais completo!
          </p>
        </div>

        {acompanhamentos.length === 0 ? (
          <div className="text-center py-6 text-stone-400 border border-stone-100 rounded-xl bg-stone-50">
            Nenhum acompanhamento ativo registrado no cardápio de hoje.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {acompanhamentos.map((acomp) => {
              const isSelected = acompsSelected.includes(acomp.nome);
              return (
                <div
                  key={acomp.id}
                  onClick={() => handleToggleAcomp(acomp.nome)}
                  className={`cursor-pointer rounded-xl bg-white border overflow-hidden shadow-sm transition hover:shadow-md ${
                    isSelected 
                      ? 'border-amber-600 ring-2 ring-amber-600/30' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="h-36 overflow-hidden relative bg-stone-100">
                    <img 
                      src={acomp.imagem} 
                      alt={acomp.nome} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-900/10 flex items-center justify-center">
                        <div className="bg-amber-500 text-red-950 rounded-full p-2 shadow-lg scale-110">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h5 className="font-display font-semibold text-stone-900 text-sm leading-tight mb-1">{acomp.nome}</h5>
                    <p className="text-[11px] text-stone-500 leading-normal line-clamp-2">{acomp.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* 4. FORMULÁRIO DE PEDIDO & ADM INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-stone-200/80 pt-12">
        
        {/* Lado Esquerdo - Campos do Cliente */}
        <form onSubmit={handleFinalizarPedido} className="lg:col-span-7 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/60 shadow-inner space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h4 className="font-serif text-xl md:text-2xl font-bold text-stone-900">Dados do Cliente & Entrega</h4>
            <p className="text-xs text-stone-500 mt-1">Preencha com carinho para enviarmos sem complicações.</p>
          </div>

          {/* Entrega ou Retirada selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTipoEntrega('Entrega')}
              className={`py-3.5 px-4 rounded-xl font-display font-bold text-sm transition flex items-center justify-center gap-2.5 shadow ${
                tipoEntrega === 'Entrega'
                  ? 'bg-red-800 text-white hover:bg-red-700'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Receber (Entrega)</span>
            </button>
            <button
              type="button"
              onClick={() => setTipoEntrega('Retirada')}
              className={`py-3.5 px-4 rounded-xl font-display font-bold text-sm transition flex items-center justify-center gap-2.5 shadow ${
                tipoEntrega === 'Retirada'
                  ? 'bg-amber-500 text-red-950 hover:bg-amber-400'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Retirar no Local</span>
            </button>
          </div>

          {/* Nome e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Nome do Cliente *</label>
              <input
                type="text"
                required
                placeholder="Ex: Maria Silva"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">WhatsApp para contato *</label>
              <input
                type="text"
                required
                placeholder="Ex: (99) 98454-5370"
                value={clienteTelefone}
                onChange={handleTelefoneChange}
                className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition shadow-sm"
              />
            </div>
          </div>

          {/* Endereço - Oculto se escolher Retirada */}
          {tipoEntrega === 'Entrega' && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-9">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Endereço / Rua *</label>
                  <input
                    type="text"
                    required={tipoEntrega === 'Entrega'}
                    placeholder="Ex: Avenida da Bandeira"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition shadow-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Número *</label>
                  <input
                    type="text"
                    required={tipoEntrega === 'Entrega'}
                    placeholder="Ex: 140"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Bairro *</label>
                  <input
                    type="text"
                    required={tipoEntrega === 'Entrega'}
                    placeholder="Ex: Centro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Cidade *</label>
                  <input
                    type="text"
                    required={tipoEntrega === 'Entrega'}
                    readOnly
                    placeholder="Ex: Coroatá"
                    value={cidade}
                    className="w-full bg-stone-100 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-500 font-semibold cursor-not-allowed text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Referência</label>
                  <input
                    type="text"
                    placeholder="Ex: Próximo à praça central"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Forma de Pagamento</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'] as const).map((pag) => (
                <button
                  type="button"
                  key={pag}
                  onClick={() => setFormaPagamento(pag)}
                  className={`py-2 px-3 border rounded-lg text-xs font-bold transition text-center shadow-sm ${
                    formaPagamento === pag
                      ? 'border-red-800 bg-red-50 text-red-900 ring-2 ring-red-800/10'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {pag}
                </button>
              ))}
            </div>
          </div>

          {/* Precisa de Troco (Se pagar com Dinheiro) */}
          {formaPagamento === 'Dinheiro' && (
            <div className="p-3.5 bg-stone-100 rounded-xl space-y-3 border border-stone-200 animate-fadeIn">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 text-sm">
                <input
                  type="checkbox"
                  checked={precisaTroco}
                  onChange={(e) => setPrecisaTroco(e.target.checked)}
                  className="rounded text-red-800 focus:ring-red-800 w-4.5 h-4.5"
                />
                <span>Precisa de troco para o dinheiro?</span>
              </label>

              {precisaTroco && (
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-semibold text-stone-500 mb-1">Troco para quanto?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 text-xs font-bold font-mono">R$</span>
                    <input
                      type="text"
                      placeholder="Ex: 50,00"
                      value={valorTroco}
                      onChange={(e) => setValorTroco(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3.5 py-1.5 text-stone-800 font-bold font-mono text-sm focus:outline-none focus:ring-1 focus:ring-red-800 shadow-inner"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="hidden">
            <button id="real-submit" type="submit">Enviar</button>
          </div>
        </form>

        {/* Lado Direito - Resumo do Pedido Estilizado */}
        <div className="lg:col-span-5 bg-stone-900 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between border-2 border-stone-800 shadow-2xl relative min-h-[460px]">
          
          <div>
            <div className="border-b border-stone-800 pb-4 mb-5">
              <h4 className="font-serif text-xl font-bold text-amber-400 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400 animate-pulse" />
                Resumo do Pedido
              </h4>
              <p className="text-[11px] text-stone-400 mt-1">Confirme as escolhas antes de finalizar no WhatsApp.</p>
            </div>

            <div className="space-y-4.5 text-sm">
              <div className="flex justify-between items-center bg-stone-950/40 p-3 rounded-lg border border-stone-800/50">
                <span className="text-stone-300">Tipo de Prato:</span>
                <span className="font-display font-extrabold text-white text-base">{tipoMarmita}</span>
              </div>

              <div className="p-3 bg-stone-950/40 rounded-lg border border-stone-800/50 space-y-1">
                <span className="text-[11px] text-stone-400 uppercase tracking-widest block">Carne Escolhida</span>
                <p className="font-display font-semibold text-amber-300">
                  {carneSelected || '⚠️ Nenhuma carne selecionada'}
                </p>
              </div>

              <div className="p-3 bg-stone-950/40 rounded-lg border border-stone-800/50 space-y-1">
                <span className="text-[11px] text-stone-400 uppercase tracking-widest block">Acompanhamentos</span>
                {acompsSelected.length > 0 ? (
                  <ul className="text-xs text-stone-200 list-disc list-inside space-y-0.5 max-h-24 overflow-y-auto">
                    {acompsSelected.map((ac, idx) => (
                      <li key={idx} className="font-medium">{ac}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs italic text-stone-500">Nenhum acompanhamento selecionado</p>
                )}
              </div>

              {/* Informações de Retirada / Troco */}
              <div className="text-xs text-stone-400 bg-stone-950/20 p-3 rounded-lg space-y-1 border border-stone-800/40">
                <p>📍 Retirada: <strong className="text-white">{tipoEntrega}</strong></p>
                <p>💳 Pagamento: <strong className="text-white">{formaPagamento}</strong></p>
                {formaPagamento === 'Dinheiro' && precisaTroco && (
                  <p>🪙 Troco para: <strong className="text-amber-400">R$ {valorTroco}</strong></p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 mt-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-stone-400 font-sans text-sm">Preço Total:</span>
              <span className="font-display font-black text-3xl md:text-4xl text-amber-400 tracking-tight">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={() => document.getElementById('real-submit')?.click()}
              className="w-full bg-amber-500 hover:bg-amber-400 text-red-950 font-display font-extrabold text-base py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-98"
            >
              <span>FINALIZAR PEDIDO NO WHATS_</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <p className="text-[10px] text-stone-400 text-center font-sans">
              Ao finalizar, um texto formatado abrirá no seu WhatsApp para o envio direto ao estabelecimento. Muito rápido e prático!
            </p>
          </div>

        </div>

      </div>

      {/* MODAL DE COMPLEMENTOS FALTANTES / SELEÇÃO FÁCIL */}
      {showAcompModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#faf8f5] text-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900 to-amber-700 p-6 text-white text-center sm:text-left relative flex justify-between items-start shrink-0">
              <div>
                <span className="inline-block bg-amber-400 text-red-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  🤩 Todo prato merece um acompanhamento!
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                  Adicione Acompanhamentos Grátis 🥗
                </h3>
                <p className="text-stone-200 text-xs mt-1">
                  Eles já estão inclusos no preço da sua {tipoMarmita.toLowerCase()}! Escolha abaixo de forma super fácil:
                </p>
              </div>
              <button 
                onClick={() => setShowAcompModal(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alternativas / Lista Compacta de Acompanhamentos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {acompanhamentos.length === 0 ? (
                <p className="text-stone-500 text-center py-8 text-sm">
                  Nenhum acompanhamento adicional ativo no cardápio de hoje.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {acompanhamentos.map((acomp) => {
                    const isSelected = acompsSelected.includes(acomp.nome);
                    return (
                      <div
                        key={acomp.id}
                        onClick={() => handleToggleAcomp(acomp.nome)}
                        className={`cursor-pointer p-4 rounded-2xl border transition duration-200 flex items-center gap-4 ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-600 ring-2 ring-amber-500/20 shadow-md' 
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {/* Imagem em mini miniatura */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200/50 bg-stone-100">
                          <img 
                            src={acomp.imagem} 
                            alt={acomp.nome} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        {/* Nome / Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-stone-900 text-sm leading-snug truncate">
                            {acomp.nome}
                          </h4>
                          <p className="text-[10px] text-stone-500 leading-normal line-clamp-2 mt-0.5">
                            {acomp.descricao}
                          </p>
                        </div>

                        {/* Caixa de seleção bonitona */}
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition ${
                          isSelected 
                            ? 'bg-amber-500 border-amber-600 text-red-950' 
                            : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs font-semibold text-stone-600">
                {acompsSelected.length === 0 
                  ? 'Nenhum item selecionado 🤔' 
                  : `🎉 ${acompsSelected.length} ${acompsSelected.length === 1 ? 'acompanhamento selecionado' : 'acompanhamentos selecionados'}`
                }
              </span>
              
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowAcompModal(false);
                    prosseguirComPedido();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 border border-stone-300 text-stone-700 bg-white rounded-xl text-xs font-bold hover:bg-stone-100 transition whitespace-nowrap"
                >
                  Continuar sem Acompanhamento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAcompModal(false);
                    prosseguirComPedido();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Confirmar e Finalizar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
