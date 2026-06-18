/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import HeaderBanner from './components/HeaderBanner';
import OrderForm from './components/OrderForm';
import GoogleMapSection from './components/GoogleMapSection';
import AdminPanel from './components/AdminPanel';
import { dbService } from './dbService';
import { ChefHat, Phone, MapPin, Heart, Clock } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(() => dbService.isAbertoAgora());
  const [refreshCount, setRefreshCount] = useState(0);

  // Recalcular periodicamente ou sob demanda se o restaurante está aberto
  useEffect(() => {
    const status = dbService.isAbertoAgora();
    setIsOpenStatus(status);
  }, [refreshCount]);

  const handleRefreshAppStatus = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleScrollToOrder = () => {
    const element = document.getElementById('cardapio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col justify-between selection:bg-red-800 selection:text-white">
      
      {/* 1. TOPO DA PÁGINA (Header + Banner com Status de Funcionamento) */}
      <HeaderBanner
        onGoToOrder={handleScrollToOrder}
        isOpenNow={isOpenStatus.aberto}
        isOpenStatus={isOpenStatus}
      />

      {/* 2. Destaques de Comida Caseira / Sobre */}
      <section className="py-12 px-4 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          
          <div className="p-6 bg-[#faf8f5] rounded-2xl border border-stone-200/40 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-red-800" />
            </div>
            <div>
              <h4 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wide">Feito com Amor</h4>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">Pratos caseiros arrumados diariamente, com tempero de mãe e carinho tradicional.</p>
            </div>
          </div>

          <div className="p-6 bg-[#faf8f5] rounded-2xl border border-stone-200/40 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wide">Entrega Rápida</h4>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">Embalagem térmica inovadora que preserva o sabor quente até a sua mesa em Coroatá.</p>
            </div>
          </div>

          <div className="p-6 bg-[#faf8f5] rounded-2xl border border-stone-200/40 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-stone-900 text-sm uppercase tracking-wide">Fácil no WhatsApp</h4>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">Pedido estruturado e enviado de forma instantânea para a nossa equipe agilizar o seu almoço.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SEÇÃO FORMULÁRIO DE PEDIDOS & CARDÁPIO DINÂMICO */}
      <main className="flex-1 bg-gradient-to-b from-[#faf8f5] to-white pb-16">
        <OrderForm 
          isOpenNow={isOpenStatus.aberto}
          onOrderCompleted={handleRefreshAppStatus}
        />
      </main>

      {/* 4. MAPS / ENDEREÇO / INFRAESTRUTURA */}
      <GoogleMapSection />

      {/* 5. RODAPÉ INSTITUCIONAL */}
      <footer className="bg-stone-950 text-white font-sans py-8 border-t border-stone-900 text-center text-xs md:text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-500 rounded text-stone-950">
              <ChefHat className="w-5 h-5" />
            </div>
            <p className="font-display font-extrabold text-base text-amber-400">Sabor de Casa</p>
          </div>
          
          <p className="text-stone-400 italic font-medium">
            ♥ Obrigado pela preferência! Qualidade, carinho e sabor que você sente! ♥
          </p>

          <div className="flex flex-col items-center md:items-end gap-2.5">
            <p className="text-stone-500 text-xs">
              © {new Date().getFullYear()} Sabor de Casa. Todos os direitos reservados.
            </p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[11px] text-stone-400 hover:text-amber-400 transition bg-stone-900 hover:bg-stone-800 px-3 py-1 rounded-md border border-stone-800 flex items-center justify-center gap-1 mx-auto md:mr-0 font-medium"
            >
              <span>🔐 Painel do Administrador</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 6. PAINEL ADMINISTRATIVO INTERATIVO (Abastecido por senha) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          onRefreshAppStatus={handleRefreshAppStatus}
        />
      )}

    </div>
  );
}

