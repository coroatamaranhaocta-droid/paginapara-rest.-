import React, { useState, useEffect } from 'react';
import { dbService } from '../dbService';
import { Produto, Pedido } from '../types';
import { ShoppingCart, Check, Fuel, MapPin, Truck, Store, ArrowRight, X, ArrowLeft, Clipboard, Image, Landmark, FileCheck } from 'lucide-react';
import Swal from 'sweetalert2';

interface OrderFormProps {
  isOpenNow: boolean;
  onOrderCompleted: () => void;
}

const BAIRROS_COROATA = [
  'Centro',
  'Tresidela',
  'Novo Coroatá',
  'Maçaranduba',
  'Areal',
  'Cohab',
  'Mariol',
  'Jordão',
  'Flor do Dia',
  'Americano',
  'Nova Jerusalém',
  'Vila Kanaan',
  'Mutirão',
  'Casas Populares',
  'Campo de Aviação',
  'Piauí',
  'Caracol',
  'Marajá',
  'Palmeira',
  'Mangueira',
  'Vila Cilene',
  'Cajueiro',
  'Vila Maranhão',
  'Pau de Estopa',
  'Creoli do Sinhá',
  'Rodoviária',
  'Trecho Seco',
  'Bacabalzinho',
  'Estação',
  'Ipem',
  'Macaúba'
].sort();

export default function OrderForm({ isOpenNow, onOrderCompleted }: OrderFormProps) {
  // Estado dinâmico de produtos cadastrados pelo ADM
  const [carnes, setCarnes] = useState<Produto[]>([]);
  const [acompanhamentos, setAcompanhamentos] = useState<Produto[]>([]);

  // Wizard Passo atual (passo 1, 2, 3, 4)
  const [passo, setPasso] = useState<number>(1);

  // Dados do pedido
  const [tipoMarmita, setTipoMarmita] = useState<'PF Completo' | 'Quentinha / Marmita'>('Quentinha / Marmita');
  const [carnesSelected, setCarnesSelected] = useState<string[]>([]);
  const [acompsSelected, setAcompsSelected] = useState<string[]>([]);

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

  // Comprovante Pix
  const [comprovante, setComprovante] = useState<string | null>(null);

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

  const handleToggleCarne = (nome: string) => {
    let novasCarnes = [...carnesSelected];
    if (novasCarnes.includes(nome)) {
      novasCarnes = novasCarnes.filter(item => item !== nome);
    } else {
      if (novasCarnes.length >= 2) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Máximo de 2 opções de carnes!',
          showConfirmButton: false,
          timer: 2000
        });
        return;
      }
      novasCarnes.push(nome);
    }
    setCarnesSelected(novasCarnes);

    // Se selecionar exatamente duas carnes, avança automaticamente
    if (novasCarnes.length === 2) {
      setTimeout(() => {
        setPasso(3);
        const cardapioEl = document.getElementById('cardapio');
        if (cardapioEl) cardapioEl.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  const handleToggleAcomp = (nome: string) => {
    let novosAcomps = [...acompsSelected];
    if (novosAcomps.includes(nome)) {
      novosAcomps = novosAcomps.filter(item => item !== nome);
    } else {
      novosAcomps.push(nome);
    }
    setAcompsSelected(novosAcomps);

    // Se selecionar exatamente 2 acompanhamentos, avança automaticamente para entrega/local
    if (novosAcomps.length === 2) {
      setTimeout(() => {
        setPasso(4);
        const cardapioEl = document.getElementById('cardapio');
        if (cardapioEl) cardapioEl.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  const formatPhoneNumber = (value: string) => {
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

  const handleCopyPix = () => {
    navigator.clipboard.writeText('01986157369');
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Chave CPF Copiada! 👏',
      showConfirmButton: false,
      timer: 2500
    });
  };

  const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Arquivo muito grande', 'O comprovante deve ter no máximo 5MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprovante(reader.result as string);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Comprovante anexado! 🧾',
          showConfirmButton: false,
          timer: 2500
        });
      };
      reader.readAsDataURL(file);
    }
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

    if (carnesSelected.length === 0) {
      Swal.fire('Escolha a sua carne', 'Por favor, selecione até 2 opções de carnes preparadas para o seu prato.', 'info');
      setPasso(2);
      return;
    }

    if (!clienteNome || !clienteTelefone || (tipoEntrega === 'Entrega' && (!endereco || !bairro))) {
      Swal.fire('Preencha os dados', 'Nome, telefone e dados de endereço são fundamentais para realizarmos sua entrega corretamente!', 'warning');
      setPasso(4);
      return;
    }

    // Gerar ID do pedido
    const pedidoId = `SBC-${Math.floor(1000 + Math.random() * 9000)}`;

    const carneTexto = carnesSelected.join(' + ');

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
      carne: carneTexto,
      acompanhamentos: acompsSelected,
      total,
      dataCriacao: new Date().toISOString()
    };

    // Gravar o pedido
    dbService.addPedido(novoPedido);

    // Formatar WhatsApp
    let msgWhatsapp = `Olá *Sabor de Casa*! Gostaria de fazer o seguinte pedido:\n\n`;
    msgWhatsapp += `👉 *Código do Pedido:* ${pedidoId}\n`;
    msgWhatsapp += `🍱 *Prato:* ${tipoMarmita} (R$ ${precoMarmita.toFixed(2).replace('.', ',')})\n`;
    msgWhatsapp += `🥩 *Carne(s) Escolhida(s):* ${carneTexto}\n`;

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
    if (formaPagamento === 'Pix') {
      msgWhatsapp += `🔑 *Chave Pix CPF:* 01986157369\n`;
      if (comprovante) {
        msgWhatsapp += `📎 *Status Comprovante:* Anexado no App (Enviando na conversa abaixo)\n`;
      } else {
        msgWhatsapp += `📎 *Status Comprovante:* Aguardando envio na conversa\n`;
      }
    } else if (formaPagamento === 'Dinheiro' && precisaTroco) {
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
      text: `Seu pedido ${pedidoId} foi registrado. Agora envie a mensagem e o comprovante no WhatsApp!`,
      icon: 'success',
      confirmButtonText: 'Ótimo!',
      confirmButtonColor: '#991b1b',
    });

    // Reset total e retornar ao Passo 1
    setCarnesSelected([]);
    setAcompsSelected([]);
    setClienteNome('');
    setClienteTelefone('');
    setEndereco('');
    setNumero('');
    setBairro('');
    setReferencia('');
    setFormaPagamento('Pix');
    setPrecisaTroco(false);
    setValorTroco('');
    setComprovante(null);
    setPasso(1);
    onOrderCompleted();
  };

  return (
    <section id="cardapio" className="py-10 px-4 max-w-6xl mx-auto font-sans scroll-mt-6 select-none">
      
      {/* INDICADORES DE PASSOS (ABAS SUPERIORES COMPACTAS E RESPONSIVAS) */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-stone-200">
          {[
            { n: 1, label: 'Marmita', desc: 'Tamanho' },
            { n: 2, label: 'Carnes', desc: 'Até 2 opções' },
            { n: 3, label: 'Acompanhamentos', desc: 'Inclusos' },
            { n: 4, label: 'Entrega & Pix', desc: 'Finalizar' }
          ].map((s) => {
            const isActive = passo === s.n;
            const isCompleted = passo > s.n;
            return (
              <button
                type="button"
                key={s.n}
                onClick={() => setPasso(s.n)}
                className={`flex items-center gap-2.5 pb-2.5 px-3 border-b-2 transition duration-200 shrink-0 text-left ${
                  isActive 
                    ? 'border-red-800 text-red-900 font-bold' 
                    : isCompleted 
                      ? 'border-emerald-600 text-emerald-700 font-medium' 
                      : 'border-transparent text-stone-400'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold leading-none ${
                  isActive 
                    ? 'bg-red-800 text-white' 
                    : isCompleted 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}>
                  {isCompleted ? '✓' : s.n}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-display leading-tight">{s.label}</p>
                  <p className="text-[10px] text-stone-400 block font-normal">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDERIZADOR DOS INTERPASSOS DO WIZARD */}

      {/* ====== PASSO 1: OPÇÃO DE MARMITA ====== */}
      {passo === 1 && (
        <div className="animate-fadeIn">
          <div className="text-center mb-10">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Opção de Prato ou Marmita 🍱
            </h3>
            <p className="text-stone-500 text-sm md:text-base mt-2 max-w-lg mx-auto">
              Selecione o estilo e tamanho ideal da sua fome hoje. Todas incluem Arroz e Farofa artesanal!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-10">
            {/* Card 1: PF COMPLETO */}
            <div 
              onClick={() => {
                setTipoMarmita('PF Completo');
                // Avanço automático instantâneo
                setTimeout(() => setPasso(2), 250);
              }}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden backdrop-blur-sm shadow-md hover:scale-[1.01] duration-200 ${
                tipoMarmita === 'PF Completo' 
                  ? 'border-amber-500 bg-amber-50/40 ring-4 ring-amber-500/10' 
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
                Generosa porção servida com arroz soltinho, farofa dourada temperada, sua carne de preferência e múltiplos acompanhamentos frescos da casa. Um almoço robusto e completo!
              </p>
              <div className="text-xs text-stone-400 border-t border-dotted border-stone-200 pt-3 flex flex-wrap gap-x-3 gap-y-1 font-medium">
                <span>🥗 Acompanhamentos livres</span>
                <span>•</span>
                <span>🥩 Grelhados premium</span>
              </div>
            </div>

            {/* Card 2: QUENTINHA / MARMITA */}
            <div 
              onClick={() => {
                setTipoMarmita('Quentinha / Marmita');
                // Avanço automático instantâneo
                setTimeout(() => setPasso(2), 250);
              }}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden backdrop-blur-sm shadow-md hover:scale-[1.01] duration-200 ${
                tipoMarmita === 'Quentinha / Marmita' 
                  ? 'border-amber-500 bg-amber-50/40 ring-4 ring-amber-500/10' 
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
                A verdadeira e amada marmita brasileira em embalagem térmica que conserva o sabor perfeitamente. Rice bem solto, farofinha temperada e a carne selecionada!
              </p>
              <div className="text-xs text-stone-400 border-t border-dotted border-stone-200 pt-3 flex flex-wrap gap-x-3 gap-y-1 font-medium">
                <span>🍚 Prático e quentinho</span>
                <span>•</span>
                <span>💰 Excelente custo-benefício</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setPasso(2)}
              className="px-8 py-3.5 bg-red-800 hover:bg-red-700 active:scale-95 text-white rounded-xl font-display font-bold text-sm flex items-center gap-2 shadow-lg transition duration-200"
            >
              <span>Avançar para Escolha de Carnes ➡️</span>
            </button>
          </div>
        </div>
      )}


      {/* ====== PASSO 2: ESCOLHER ATÉ 2 CARNES ====== */}
      {passo === 2 && (
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              🥩 Selecione até 2 opções de Carne
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              1. Escolha a sua Carne Principal
            </h3>
            <p className="text-stone-500 text-xs md:text-sm mt-1 max-w-md mx-auto">
              Ao selecionar 2 opções, o sistema avançará automaticamente para os acompanhamentos.
            </p>
          </div>

          {carnes.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 max-w-xl mx-auto">
              <p className="text-stone-500 text-sm">Nenhuma carne cadastrada ou ativa no cardápio de hoje.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              {carnes.map((carne) => {
                const isSelected = carnesSelected.includes(carne.nome);
                return (
                  <div
                    key={carne.id}
                    onClick={() => handleToggleCarne(carne.nome)}
                    className={`cursor-pointer rounded-xl bg-white border overflow-hidden shadow-sm transition hover:shadow-md ${
                      isSelected 
                        ? 'border-red-600 ring-4 ring-red-600/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="h-32 sm:h-38 overflow-hidden relative bg-stone-100">
                      <img 
                        src={carne.imagem} 
                        alt={carne.nome} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-900/10 flex items-center justify-center">
                          <div className="bg-red-700 text-white rounded-full p-2.5 shadow-lg scale-110">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-display font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate">{carne.nome}</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{carne.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between items-center max-w-4xl mx-auto border-t border-stone-100 pt-6">
            <button
              type="button"
              onClick={() => setPasso(1)}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>

            <span className="text-xs font-semibold text-stone-600">
              Selecionado: <strong className="text-red-800">{carnesSelected.length}/2</strong> carnes
            </span>

            <button
              type="button"
              onClick={() => {
                if (carnesSelected.length === 0) {
                  Swal.fire('Escolha uma carne', 'Por favor, selecione pelo menos 1 opção de carne para prosseguir.', 'info');
                  return;
                }
                setPasso(3);
              }}
              disabled={carnesSelected.length === 0}
              className={`px-6 py-3 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition ${
                carnesSelected.length > 0 
                  ? 'bg-red-800 hover:bg-red-700 text-white' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Ir para acompanhamentos 🥗</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}


      {/* ====== PASSO 3: CHOOSE ACCOMPANIMENTS ====== */}
      {passo === 3 && (
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              🥗 Selecione até 2 opções inclusas
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              2. Escolha seus Acompanhamentos
            </h3>
            <p className="text-stone-500 text-xs md:text-sm mt-1 max-w-sm mx-auto">
              Selecione 2 acompanhamentos para avançar automaticamente, ou escolha quantos quiser.
            </p>
          </div>

          {acompanhamentos.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 max-w-xl mx-auto">
              <p className="text-stone-500 text-sm">Nenhum acompanhamento cadastrado no menu de hoje.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              {acompanhamentos.map((acomp) => {
                const isSelected = acompsSelected.includes(acomp.nome);
                return (
                  <div
                    key={acomp.id}
                    onClick={() => handleToggleAcomp(acomp.nome)}
                    className={`cursor-pointer rounded-xl bg-white border overflow-hidden shadow-sm transition hover:shadow-md ${
                      isSelected 
                        ? 'border-amber-600 ring-4 ring-amber-600/20' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="h-32 sm:h-38 overflow-hidden relative bg-stone-100">
                      <img 
                        src={acomp.imagem} 
                        alt={acomp.nome} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-900/10 flex items-center justify-center">
                          <div className="bg-amber-500 text-red-950 rounded-full p-2.5 shadow-lg scale-110">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-display font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate">{acomp.nome}</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{acomp.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between items-center max-w-4xl mx-auto border-t border-stone-100 pt-6">
            <button
              type="button"
              onClick={() => setPasso(2)}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-xs flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>

            <span className="text-xs font-semibold text-stone-600">
              Selecionados: <strong className="text-amber-600">{acompsSelected.length}/2</strong> acompanhamentos
            </span>

            <button
              type="button"
              onClick={() => setPasso(4)}
              className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Avançar para Entrega & Pix 🚗</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}


      {/* ====== PASSO 4: IDENTIFICAÇÃO, ENTREGA E PAGAMENTO ====== */}
      {passo === 4 && (
        <div className="animate-fadeIn max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              Identificação & Entrega
            </h3>
            <p className="text-stone-500 text-xs md:text-sm mt-1 max-w-md mx-auto">
              Preencha os dados e escolha como deseja pagar. Chave Pix CPF e anexação de comprovantes ativa!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LADO ESQUERDO: INFOS DO CLIENTE */}
            <form onSubmit={handleFinalizarPedido} className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
              
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-stone-800 text-base">Seus Dados</h4>
                  <p className="text-[11px] text-stone-500">Rápido e sem burocracias para agilizar seu envio.</p>
                </div>
                <div className="flex gap-1">
                  <span className="bg-red-800/10 text-red-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">MAIORES CUIDADOS</span>
                </div>
              </div>

              {/* Entrega ou Retirada selector */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setTipoEntrega('Entrega')}
                  className={`py-3 px-4 rounded-xl font-display font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                    tipoEntrega === 'Entrega'
                      ? 'bg-red-800 text-white shadow-red-900/15'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Entregar em Casa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoEntrega('Retirada')}
                  className={`py-3 px-4 rounded-xl font-display font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                    tipoEntrega === 'Retirada'
                      ? 'bg-amber-500 text-stone-950 shadow-amber-900/15'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Retirar no Local</span>
                </button>
              </div>

              {/* Nome e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 flex text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp para contato *</label>
                  <input
                    type="text"
                    required
                    placeholder="(99) 90000-0000"
                    value={clienteTelefone}
                    onChange={handleTelefoneChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 flex text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Endereço - Oculto se escolher Retirada */}
              {tipoEntrega === 'Entrega' && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-9">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Endereço / Rua *</label>
                      <input
                        type="text"
                        required={tipoEntrega === 'Entrega'}
                        placeholder="Nome da rua / avenida"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Número</label>
                      <input
                        type="text"
                        placeholder="Nº"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1 font-sans">Bairro *</label>
                      <input
                        type="text"
                        required={tipoEntrega === 'Entrega'}
                        list="bairros-coroata"
                        placeholder="Pesquisar bairro..."
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition"
                      />
                      <datalist id="bairros-coroata">
                        {BAIRROS_COROATA.map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        required={tipoEntrega === 'Entrega'}
                        readOnly
                        placeholder="Coroatá"
                        value={cidade}
                        className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-500 font-semibold cursor-not-allowed text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Referência</label>
                      <input
                        type="text"
                        placeholder="Ex: Próximo à igreja"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Forma de Pagamento */}
              <div className="border-t border-stone-100 pt-4">
                <label className="block text-xs font-semibold text-stone-700 mb-2.5">Forma de Pagamento</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'] as const).map((pag) => (
                    <button
                      type="button"
                      key={pag}
                      onClick={() => setFormaPagamento(pag)}
                      className={`py-2 px-3 border border-stone-200 rounded-lg text-xs font-bold transition text-center shadow-sm ${
                        formaPagamento === pag
                          ? 'border-red-800 bg-red-50 text-red-900 ring-2 ring-red-800/10'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {pag}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEÇÃO PIX AVANÇADA COM CHAVE CPF, QR CODE E UPLOADER DE COMPROVANTE */}
              {formaPagamento === 'Pix' && (
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/60 animate-fadeIn space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-teal-600 text-white rounded-lg p-2 shrink-0">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-extrabold text-teal-900 text-sm">Pagamento via Pix Fácil</h4>
                      <p className="text-[11px] text-teal-800 leading-normal">
                        Copie a chave CPF ou escaneie o QR Code abaixo para efetuar a transferência rápida.
                      </p>
                    </div>
                  </div>

                  {/* Chave Pix Copiar */}
                  <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-teal-200 shadow-inner">
                    <div className="min-w-0">
                      <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Chave CPF Sabor de Casa</span>
                      <strong className="font-mono text-sm text-stone-800 block select-all">01986157369</strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Copiar Chave</span>
                    </button>
                  </div>

                  {/* QR Code de Pix */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2 bg-white/50 rounded-2xl border border-dashed border-teal-200">
                    <div className="bg-white p-2 rounded-xl shadow-lg border border-stone-200">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=0d9488&data=01986157369" 
                        alt="Pix QR Code Sabor de Casa" 
                        className="w-36 h-36 sm:w-40 sm:h-40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-2 max-w-xs">
                      <h5 className="font-display font-black text-stone-800 text-sm flex items-center justify-center sm:justify-start gap-1">
                        <span>QR Code Escaneável 📱</span>
                      </h5>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Abra o aplicativo do seu banco, escolha <strong>Pagar por QR Code</strong> e aponte para a imagem acima.
                      </p>
                      <span className="inline-block bg-teal-100 text-teal-900 border border-teal-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        Titular: Sabor de Casa MA
                      </span>
                    </div>
                  </div>

                  {/* UPLOADER DE COMPROVANTE */}
                  <div className="bg-white p-4 rounded-xl border border-teal-200 space-y-3 shadow-inner">
                    <label className="block text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-teal-600" />
                      <span>Anexar Comprovante do Pix (Muito indicado!)</span>
                    </label>
                    <div className="border-2 border-dashed border-teal-200/70 hover:border-teal-400 bg-stone-50/50 hover:bg-stone-50/80 rounded-xl p-3.5 text-center transition cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleComprovanteChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      {comprovante ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <img 
                            src={comprovante} 
                            alt="Comprovante Pix do Sabor de Casa" 
                            className="max-h-24 object-contain rounded border border-stone-200 shadow-sm"
                          />
                          <p className="text-[10px] text-emerald-700 font-bold">✓ Comprovante selecionado com sucesso!</p>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setComprovante(null);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold underline block"
                          >
                            Substituir ou remover arquivo
                          </button>
                        </div>
                      ) : (
                        <div className="py-2">
                          <Image className="w-6 h-6 mx-auto text-teal-600/50 mb-1" />
                          <p className="text-xs text-stone-500 font-medium">Toque para selecionar imagem ou tire uma foto</p>
                          <p className="text-[9px] text-stone-400 mt-0.5">Formatos suportados: PNG, JPG ou JPEG (máx 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Precisa de Troco (Se pagar com Dinheiro) */}
              {formaPagamento === 'Dinheiro' && (
                <div className="p-3.5 bg-stone-50 rounded-xl space-y-3 border border-stone-200 animate-fadeIn">
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
                      <label className="block text-xs font-semibold text-stone-500 mb-1 font-mono">Troco para quanto?</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-stone-400 text-xs font-bold font-mono">R$</span>
                        <input
                          type="text"
                          placeholder="0,00"
                          value={valorTroco}
                          onChange={(e) => setValorTroco(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3.5 py-1.5 text-stone-800 font-bold font-mono text-sm focus:outline-none focus:ring-1 focus:ring-red-800 shadow-inner"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botão de envio real invisível */}
              <button id="real-submit-trigger" type="submit" className="hidden">Enviar</button>
            </form>

            {/* LADO DIREITO: RESUMO EM GRID BENTO DE ALTÍSSIMA QUALIDADE */}
            <div className="lg:col-span-5 bg-stone-900 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between border-2 border-stone-800 shadow-2xl min-h-[460px]">
              <div>
                <div className="border-b border-stone-800 pb-4 mb-5">
                  <h4 className="font-serif text-xl font-bold text-amber-400 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-amber-400 animate-pulse" />
                    Resumo das Escolhas
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1">Veja com atenção antes de fechar no WhatsApp.</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center bg-stone-950/40 p-3 rounded-lg border border-stone-800/50">
                    <span className="text-stone-300">Prato:</span>
                    <strong className="font-display font-extrabold text-white text-base">{tipoMarmita}</strong>
                  </div>

                  <div className="p-3 bg-stone-950/40 rounded-lg border border-stone-800/50 space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">Carnes Escolhidas</span>
                    <p className="font-display font-semibold text-amber-300 leading-normal">
                      {carnesSelected.length > 0 ? carnesSelected.join(' + ') : '⚠️ Nenhuma carne selecionada'}
                    </p>
                  </div>

                  <div className="p-3 bg-stone-950/40 rounded-lg border border-stone-800/50 space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">Acompanhamentos</span>
                    {acompsSelected.length > 0 ? (
                      <ul className="text-xs text-stone-200 list-disc list-inside space-y-0.5 truncate">
                        {acompsSelected.map((ac, idx) => (
                          <li key={idx} className="font-medium inline-block bg-stone-800 text-stone-200 rounded px-2 py-0.5 mr-1 mb-1">{ac}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-stone-500">Nenhum adicional selecionado</p>
                    )}
                  </div>

                  <div className="text-xs text-stone-400 bg-stone-950/20 p-3 rounded-lg space-y-1.5 border border-stone-800/40">
                    <p>📍 Forma de Retirada: <strong className="text-white bg-red-900/30 px-1.5 py-0.5 rounded ml-1">{tipoEntrega}</strong></p>
                    <p>💳 Forma de Pagamento: <strong className="text-white bg-stone-800 px-1.5 py-0.5 rounded ml-1">{formaPagamento}</strong></p>
                    {formaPagamento === 'Pix' && comprovante && (
                      <p className="text-emerald-400 flex items-center gap-1 font-bold mt-1">✓ Comprovante Anexado com Sucesso!</p>
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

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const trigger = document.getElementById('real-submit-trigger');
                      if (trigger) trigger.click();
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-extrabold text-sm py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-98"
                  >
                    <span>ENVIAR PEDIDO NO WHATSAPP</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPasso(3)}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-display text-xs font-semibold py-2.5 rounded-lg border border-stone-700 transition"
                  >
                    ← Alterar Acompanhamentos
                  </button>
                </div>

                <p className="text-[10px] text-stone-400 text-center leading-normal">
                  Seja rápido! O WhatsApp inicializará automaticamente com seu comprovante pronto.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
