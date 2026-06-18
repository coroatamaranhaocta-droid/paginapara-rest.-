import React, { useEffect, useState } from 'react';
import { dbService } from '../dbService';
import { ChefHat, ShoppingBag, Phone, Clock, MapPin, Menu as MenuIcon, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';

interface HeaderBannerProps {
  onGoToOrder: () => void;
  onGoToAdmin: () => void;
  isOpenNow: boolean;
  isOpenStatus: { aberto: boolean; motivo: string; bannerMessage?: string };
}

export default function HeaderBanner({ onGoToOrder, onGoToAdmin, isOpenNow, isOpenStatus }: HeaderBannerProps) {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    // Busca se existe mensagem ativa cadastrada pelo admin
    const msgs = dbService.getMensagens();
    const active = msgs.find(m => m.ativa);
    if (active) {
      setActiveMessage(active.texto);

      // Exibe um modal elegante de aviso se houver mensagem ativa
      Swal.fire({
        title: '🔔 Comunicado Importante',
        text: active.texto,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#991b1b', // Burgundy Red
        backdrop: 'rgba(153, 27, 27, 0.2)'
      });
    }
  }, []);

  return (
    <header className="relative w-full">
      {/* Banner de Funcionamento */}
      {isOpenNow ? (
        <div className="w-full bg-emerald-600 text-white py-2 text-center text-xs md:text-sm font-medium tracking-wide shadow-inner flex items-center justify-center gap-2 animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          <span>🟢 ESTAMOS RECEBENDO PEDIDOS — Faça já sua escolha!</span>
        </div>
      ) : (
        <div className="w-full bg-red-700 text-white py-2.5 px-4 text-center text-xs md:text-sm font-medium tracking-wide shadow-md flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span className="font-semibold">🔴 ESTAMOS FECHADOS NO MOMENTO:</span>
          <span className="opacity-95 italic">{isOpenStatus.bannerMessage || 'Voltaremos amanhã a partir das 10h!'}</span>
        </div>
      )}

      {/* Nav de Atendimento */}
      <nav className="bg-stone-900 text-stone-100 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-amber-500 text-red-950 p-1.5 md:p-2 rounded-xl shadow-lg border border-amber-400">
              <ChefHat className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg md:text-2xl text-amber-400 tracking-tight flex items-center gap-1.5">
                Sabor de Casa
                <span className="text-[10px] md:text-xs bg-red-800 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                  Caseiro
                </span>
              </h1>
              <p className="text-[10px] md:text-xs text-stone-400 font-sans">Comida feita com amor, como na casa da mãe!</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <button
              onClick={onGoToAdmin}
              className="text-stone-300 hover:text-amber-400 bg-stone-800/80 hover:bg-stone-800 font-sans px-3 py-1.5 rounded-lg transition border border-stone-700/60 font-medium"
            >
              🔐 Admin Painel
            </button>
            <button
              onClick={onGoToOrder}
              className="bg-amber-500 hover:bg-amber-400 text-red-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Pedir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Premium Banner Section */}
      <div className="relative overflow-hidden bg-stone-950 text-white min-h-[460px] md:min-h-[520px] flex items-center py-12 md:py-16">
        {/* Background Image / Blur Accent */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200')` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-900/40"></div>

        <div className="relative max-w-6xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-red-900/80 border border-red-700 text-red-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-sans">
              <ChefHat className="w-3.5 h-3.5" />
              Tempero autêntico maranhense
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6.5xl font-bold text-white tracking-tight leading-none">
              O Verdadeiro <span className="text-amber-400">Sabor Caseiro</span> na sua Mesa
            </h2>

            <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-xl font-sans font-light leading-relaxed">
              Marmitas e pratos feitos preparados diariamente com ingredientes selecionados, verduras frescas e aquele carinho especial de fogão de lenha.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-stone-300 font-sans pt-2">
              <div className="flex items-center gap-2 bg-stone-900/60 backdrop-blur-sm p-2.5 rounded-lg border border-stone-800/80">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Entregas rápidas em toda <strong>Coroatá - MA</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/60 backdrop-blur-sm p-2.5 rounded-lg border border-stone-800/80">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Atendimento: <strong>Seg a Sáb (10h às 15h)</strong></span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={onGoToOrder}
                className="w-full sm:w-auto bg-red-700 hover:bg-red-600 text-white font-display font-bold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-red-900/20 transition flex items-center justify-center gap-2.5 group active:scale-98"
              >
                <Phone className="w-5 h-5 animate-bounce group-hover:scale-110 transition" />
                <span>Fazer Pedido Agora</span>
              </button>
              <a
                href="#sobre"
                className="w-full sm:w-auto text-center bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:text-white font-medium text-sm sm:text-base px-6 py-4 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                Checar Cardápio 👇
              </a>
            </div>
            
            {/* WhatsApp Display */}
            <div className="text-stone-400 text-xs sm:text-sm font-sans flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
              Atendimento WhatsApp direto: <span className="text-white hover:text-amber-400 font-semibold">(99) 98454-5370</span>
            </div>
          </div>

          {/* Right Bento Box - Lunchbox Realistic Image Preview Frame */}
          <div className="lg:col-span-12 xl:col-span-5 hidden lg:block relative">
            <div className="relative mx-auto max-w-[360px] md:max-w-md bg-stone-900 p-3 rounded-3xl border-2 border-amber-500/20 shadow-2xl relative group overflow-hidden">
              <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-stone-950 relative">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
                  alt="Marmita Caseira Ideal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-red-800/90 text-white text-[10px] font-bold py-1 px-2.5 rounded-full shadow tracking-wider uppercase font-sans">
                  Sabor Popular
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-semibold text-lg text-amber-500">Marmita Arrumada de Hoje</h4>
                  <span className="text-white font-mono font-bold">R$ 20,00</span>
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  Arroz cozido no ponto, farofa crocante amanteigada e o grelhado de sua escolha com temperos cultivados localmente.
                </p>
                <div className="flex gap-2 text-[10px] font-mono text-stone-400 bg-stone-950/60 p-2 rounded-lg">
                  <span>🍚 Arroz Soltinho</span>
                  <span>•</span>
                  <span>🥕 Salada de Maionese</span>
                  <span>•</span>
                  <span>🥓 Farofa de Tradição</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
