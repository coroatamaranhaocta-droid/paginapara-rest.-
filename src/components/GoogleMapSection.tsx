import React from 'react';
import { MapPin, Navigation, Car, Users, CheckCircle, Clock } from 'lucide-react';

export default function GoogleMapSection() {
  const handleComoChegar = () => {
    // Abrir rota no Google Maps
    const address = "Avenida da Bandeira, Centro, Coroatá - MA, 65415-000";
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="sobre" className="bg-stone-900 text-white py-16 px-4 border-t border-stone-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-sans">Nossa Localização</span>
          <h3 className="font-serif text-3xl md:text-4xl font-bold mt-1 tracking-tight">Onde Encontrar Nosso Tempero 🏠</h3>
          <p className="text-stone-400 text-xs md:text-sm mt-2 max-w-md mx-auto">
            Venha nos fazer uma visita ou retire seu pedido diretamente no nosso balcão de atendimento, situado bem no centro da cidade.
          </p>
        </div>

        {/* Layout Bento Grid Baseada na Imagem de Referência */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card Onde Estamos (Esquerda) */}
          <div className="lg:col-span-4 bg-stone-950 p-6 md:p-8 rounded-2xl border border-stone-800/80 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-800/80 p-2.5 rounded-xl border border-red-700">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-amber-400">ONDE ESTAMOS</h4>
                  <p className="text-xs text-stone-400">Localização centralizada</p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm text-stone-200 font-sans">
                <p className="font-semibold text-white">Restaurante Sabor de Casa</p>
                <div className="space-y-1">
                  <p>Avenida da Bandeira</p>
                  <p>Bairro: Centro</p>
                  <p>Coroatá - MA</p>
                  <p className="text-xs text-stone-400 font-mono">CEP: 65415-000</p>
                </div>
              </div>
            </div>

            {/* Ilustração ou Detalhe do Fachada do Restaurante Simulado */}
            <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                <div className="text-xs text-stone-300 font-sans leading-relaxed">
                  <p className="font-semibold text-white">Retiradas no Balcão:</p>
                  Sem taxas extras. Seu prato é embalado com carinho e isolamento térmico premium.
                </div>
              </div>

              <div className="text-[11px] text-center italic text-stone-500">
                ❤️ Obrigado pela preferência! Sabor de Casa é amor!
              </div>
            </div>
          </div>


          {/* Card Mapa & Instruções (Direita) */}
          <div className="lg:col-span-8 bg-stone-950 rounded-2xl border border-stone-800/80 overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-12">
            
            {/* Google Map real - Iframe centralizado em Coroatá */}
            <div className="md:col-span-7 h-64 md:h-full min-h-[300px] relative bg-stone-900 border-b md:border-b-0 md:border-r border-stone-800/50">
              <iframe
                title="Google Maps Sabor de Casa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.248386345946!2d-44.12642598523755!3d-4.41164999679183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMjQnNDEuOSJTIDQ0wrAwNyczNS4xIlc!5e0!3m2!1spt-BR!2sbr!4v1655000000000!5m2!1spt-BR!2sbr"
                className="absolute inset-0 w-full h-full border-0 grayscale opacity-90 contrast-110"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Como Chegar Guide (Direita do Mapa) */}
            <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between">
              
              <div className="space-y-5">
                <h4 className="font-display font-bold text-lg text-amber-400 tracking-tight">COMO CHEGAR</h4>
                
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  Estamos localizados numa área privilegiada e segura na Avenida da Bandeira, no Centro de Coroatá - MA. Fácil acesso de todas as partes do município!
                </p>

                <div className="space-y-4 pt-1 text-xs text-stone-400 font-sans">
                  <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-200">De carro / moto:</p>
                      <p className="leading-normal">Acesso principal direto pela Avenida da Bandeira no asfalto.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-200">A pé / referências:</p>
                      <p className="leading-normal">Próximo à Praça José Sarney e pertinho do Banco do Brasil.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Como Chegar */}
              <div className="pt-6 mt-6 border-t border-stone-800">
                <button
                  onClick={handleComoChegar}
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-display font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-red-900/30 transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 fill-white shrink-0" />
                  <span>TRAÇAR ROTA (COMO CHEGAR)</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
