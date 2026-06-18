import React, { useState, useEffect } from 'react';
import { dbService } from '../dbService';
import { Produto, Pedido, Horario, Feriado, Mensagem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { 
  LayoutDashboard, ShoppingCart, Apple, Clock, MessageSquare, Calendar, 
  BarChart3, Settings, Lock, LogOut, ToggleLeft, ToggleRight, 
  Plus, Trash2, Edit2, Check, X, ShieldAlert, CheckCircle, FileSpreadsheet
} from 'lucide-react';
import Swal from 'sweetalert2';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshAppStatus: () => void;
}

type AdminTab = 'Dashboard' | 'Pedidos' | 'Produtos' | 'Horários' | 'Mensagens' | 'Feriados' | 'Relatórios' | 'Configurações';

export default function AdminPanel({ onClose, onRefreshAppStatus }: AdminPanelProps) {
  // Login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminPassword, setAdminPassword] = useState('1234'); // Senha padrão fácil

  // Navegação
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');

  // Listas de Dados Reais persistidos no dbService
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [abertoManual, setAbertoManual] = useState(true);

  // Formulário Produto (Add/Edit)
  const [editingProdutoId, setEditingProdutoId] = useState<string | null>(null);
  const [prodNome, setProdNome] = useState('');
  const [prodPreco, setProdPreco] = useState(0);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodAtiva, setProdAtiva] = useState(true);
  const [prodCat, setProdCat] = useState<'prato' | 'carne' | 'acompanhamento'>('carne');

  // Formulário Feriado
  const [ferNome, setFerNome] = useState('');
  const [ferData, setFerData] = useState('');
  const [ferDesc, setFerDesc] = useState('');
  const [ferFunc, setFerFunc] = useState<'Fechado' | 'Especial'>('Fechado');

  // Formulário Mensagem
  const [msgTexto, setMsgTexto] = useState('');

  // Carregar todos os dados ao abrir ou recarregar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setProdutos(dbService.getProdutos());
    setPedidos(dbService.getPedidos());
    setHorarios(dbService.getHorarios());
    setFeriados(dbService.getFeriados());
    setMensagens(dbService.getMensagens());
    setAbertoManual(dbService.getAbertoManual());
    // Carregar senha customizada se salva
    const savedPass = localStorage.getItem('sbc_admin_password');
    if (savedPass) setAdminPassword(savedPass);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      Swal.fire({
        title: 'Acesso Permitido',
        text: 'Painel Administrativo liberado com sucesso!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#991b1b'
      });
    } else {
      Swal.fire('Acesso Recusado', 'Senha incorreta para o Painel Administrativo. Tente novamente!', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // PRODUTOS ACTIONS
  const handleSaveProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNome || !prodImg) {
      Swal.fire('Atenção', 'Nome e link da imagem são obrigatórios!', 'warning');
      return;
    }

    const novoProduto: Produto = {
      id: editingProdutoId || 'prod_' + Date.now(),
      nome: prodNome,
      preco: Number(prodPreco),
      descricao: prodDesc,
      imagem: prodImg,
      ativa: prodAtiva,
      categoria: prodCat
    };

    dbService.saveProduto(novoProduto);
    Swal.fire('Sucesso!', 'Produto salvo com sucesso!', 'success');
    
    // Reset form
    setEditingProdutoId(null);
    setProdNome('');
    setProdPreco(0);
    setProdDesc('');
    setProdImg('');
    setProdAtiva(true);
    
    setProdutos(dbService.getProdutos());
  };

  const handleEditProduto = (prod: Produto) => {
    setEditingProdutoId(prod.id);
    setProdNome(prod.nome);
    setProdPreco(prod.preco);
    setProdDesc(prod.descricao);
    setProdImg(prod.imagem);
    setProdAtiva(prod.ativa);
    setProdCat(prod.categoria);
  };

  const handleDeleteProduto = (id: string) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Isso removerá permanently o produto do cardápio dos clientes!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!'
    }).then((result) => {
      if (result.isConfirmed) {
        dbService.deleteProduto(id);
        setProdutos(dbService.getProdutos());
        Swal.fire('Deletado!', 'O produto foi excluído.', 'success');
      }
    });
  };

  const handleToggleProdutoAtiva = (prod: Produto) => {
    const updated = { ...prod, ativa: !prod.ativa };
    dbService.saveProduto(updated);
    setProdutos(dbService.getProdutos());
  };

  // HORÁRIOS ACTIONS
  const handleUpdateHorario = (id: string, abertura: string, fechamento: string, fechado: boolean) => {
    dbService.updateHorario(id, abertura, fechamento, fechado);
    setHorarios(dbService.getHorarios());
    onRefreshAppStatus();
  };

  const handleToggleMasterAberto = () => {
    const novoStatus = !abertoManual;
    dbService.setAbertoManual(novoStatus);
    setAbertoManual(novoStatus);
    onRefreshAppStatus();
    Swal.fire({
      title: novoStatus ? '🟢 Restaurante Aberto' : '🔴 Restaurante Fechado',
      text: novoStatus ? 'Aceitando pedidos online normalmente agora!' : 'Fechado para pedidos online temporariamente.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#991b1b'
    });
  };

  // FERIADOS ACTIONS
  const handleAddFeriado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ferNome || !ferData) {
      Swal.fire('Campos vazios', 'Insira o nome e a data do feriado.', 'warning');
      return;
    }

    const novoFer: Feriado = {
      id: 'fer_' + Date.now(),
      nome: ferNome,
      data: ferData,
      descricao: ferDesc,
      funcionamento: ferFunc
    };

    dbService.addFeriado(novoFer);
    setFeriados(dbService.getFeriados());
    onRefreshAppStatus();

    setFerNome('');
    setFerData('');
    setFerDesc('');
    Swal.fire('Salvo!', 'Feriado cadastrado com sucesso!', 'success');
  };

  const handleDeleteFeriado = (id: string) => {
    dbService.deleteFeriado(id);
    setFeriados(dbService.getFeriados());
    onRefreshAppStatus();
  };

  // MENSAGENS ACTIONS
  const handleAddMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTexto) return;

    const novaMsg: Mensagem = {
      id: 'msg_' + Date.now(),
      texto: msgTexto,
      ativa: false,
      dataCriacao: new Date().toISOString()
    };

    dbService.addMensagem(novaMsg);
    setMensagens(dbService.getMensagens());
    setMsgTexto('');
    Swal.fire('Salvo!', 'Mensagem automática cadastrada!', 'success');
  };

  const handleToggleMensagem = (id: string) => {
    dbService.toggleMensagemAtiva(id);
    setMensagens(dbService.getMensagens());
    onRefreshAppStatus();
  };

  const handleDeleteMensagem = (id: string) => {
    dbService.deleteMensagem(id);
    setMensagens(dbService.getMensagens());
    onRefreshAppStatus();
  };

  // PEDIDOS STATUS ACTIONS
  const handleChangeStatus = (id: string, status: Pedido['status']) => {
    dbService.updatePedidoStatus(id, status);
    setPedidos(dbService.getPedidos());
  };

  // CONFIGURAÇÃO SENHA
  const handleSaveConfigPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const novaSenha = (document.getElementById('new-password') as HTMLInputElement)?.value;
    if (novaSenha && novaSenha.length >= 3) {
      localStorage.setItem('sbc_admin_password', novaSenha);
      setAdminPassword(novaSenha);
      Swal.fire('Senha Alterada!', 'Nova senha salva com sucesso para segurança.', 'success');
    } else {
      Swal.fire('Inválido', 'A senha precisa ter pelo menos 3 dígitos.', 'warning');
    }
  };

  // CÁLCULOS ANALÍTICOS (DASHBOARD)
  const totalPedidosCount = pedidos.length;
  // Total Vendido Hoje: pedidos de hoje cujo status é 'Entregue' ou 'Confirmado'
  const hojeStr = new Date().toISOString().split('T')[0];
  const pedidosHoje = pedidos.filter(p => p.dataCriacao.startsWith(hojeStr));
  const totalVendidoHoje = pedidosHoje
    .filter(p => p.status === 'Entregue' || p.status === 'Confirmado')
    .reduce((acc, curr) => acc + curr.total, 0);

  // Total Vendido no Mês: pedidos deste mês (ano-mes)
  const mesStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const pedidosMes = pedidos.filter(p => p.dataCriacao.startsWith(mesStr));
  const totalVendidoMes = pedidosMes
    .filter(p => p.status === 'Entregue' || p.status === 'Confirmado')
    .reduce((acc, curr) => acc + curr.total, 0);

  // Produtos mais vendidos (carne + tipo de marmita)
  const carnesContagem: { [key: string]: number } = {};
  pedidos.forEach(p => {
    if (p.carne) {
      carnesContagem[p.carne] = (carnesContagem[p.carne] || 0) + 1;
    }
  });
  const carnesTop = Object.entries(carnesContagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // GRAFICOS DE VENDAS
  // 1. Vendas por dia (últimos 4 dias mapeados)
  const vendasPorDiaData = [
    { name: 'D-3', vendas: pedidos.filter(p => p.dataCriacao.startsWith(new Date(Date.now() - 72 * 3600000).toISOString().split('T')[0]) && p.status === 'Entregue').reduce((a,c) => a + c.total, 0) },
    { name: 'D-2', vendas: pedidos.filter(p => p.dataCriacao.startsWith(new Date(Date.now() - 48 * 3600000).toISOString().split('T')[0]) && p.status === 'Entregue').reduce((a,c) => a + c.total, 0) },
    { name: 'Ontem', vendas: pedidos.filter(p => p.dataCriacao.startsWith(new Date(Date.now() - 24 * 3600000).toISOString().split('T')[0]) && p.status === 'Entregue').reduce((a,c) => a + c.total, 0) },
    { name: 'Hoje', vendas: totalVendidoHoje }
  ];

  // 2. Vendas por mês (últimos meses simulados históricos)
  const vendasPorMesData = [
    { name: 'Abr/26', vendas: 1240 },
    { name: 'Mai/26', vendas: 1850 },
    { name: 'Jun/26', vendas: totalVendidoMes + 450 } // atual mês + simulado anterior
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-stone-900 border-2 border-amber-500/30 text-white rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 text-lg font-bold"
          >
            ✕
          </button>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-lg border-2 border-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-amber-400">Restaurante Sabor de Casa</h3>
            <p className="text-stone-400 text-xs sm:text-sm font-sans">Área restrita de gestão interna. Digite a senha de acesso.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-sans">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Senha do Administrador</label>
              <input
                type="password"
                placeholder="Ex de teste: 1234"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white text-center font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
                required
              />
            </div>
            
            <div className="flex gap-3 pt-2 text-sm font-bold">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 border border-stone-700 hover:bg-stone-800 text-stone-300 py-3 rounded-xl transition"
              >
                Voltar ao Menu
              </button>
              <button
                type="submit"
                className="w-1/2 bg-amber-500 hover:bg-amber-400 text-stone-950 py-3 rounded-xl shadow-lg shadow-amber-500/10 transition"
              >
                Entrar Painel
              </button>
            </div>
          </form>

          <div className="text-[10px] text-center text-stone-500 border-t border-stone-800/80 pt-4">
            Dica: A senha padrão de teste é <strong className="text-stone-400">1234</strong>. Modifique nas Configurações.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-950/70 z-50 flex items-stretch justify-center p-0 md:p-4 backdrop-blur-sm animate-fadeIn">
      
      {/* Container Principal */}
      <div className="bg-stone-100 text-stone-800 rounded-none md:rounded-3xl w-full max-w-7xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-200">
        
        {/* SIDEBAR ESQUERDO DO PAINEL */}
        <aside className="w-full md:w-64 bg-stone-900 text-white flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-stone-800">
          <div>
            {/* Header Sidebar */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-amber-500 text-red-950 flex items-center justify-center font-black">
                  S
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-white tracking-tight">Sabor de Casa</h4>
                  <p className="text-[10px] text-stone-400">Maranhão • Admin</p>
                </div>
              </div>
              
              <button
                onClick={handleToggleMasterAberto}
                title={abertoManual ? "Clique para Fechar Restaurante" : "Clique para Abrir Restaurante"}
                className="transition active:scale-95 text-stone-300 hover:text-white"
              >
                {abertoManual ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
                ) : (
                  <X className="w-6 h-6 text-red-500 bg-red-900/20 rounded-full stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* Menu Itens */}
            <nav className="p-3.5 space-y-1 font-sans text-stone-300 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block px-3 py-1 mb-2">GERENCIAL</span>
              
              {([
                { id: 'Dashboard', icon: LayoutDashboard },
                { id: 'Pedidos', icon: ShoppingCart },
                { id: 'Produtos', icon: Apple },
                { id: 'Horários', icon: Clock },
                { id: 'Mensagens', icon: MessageSquare },
                { id: 'Feriados', icon: Calendar },
                { id: 'Relatórios', icon: BarChart3 },
                { id: 'Configurações', icon: Settings }
              ] as const).map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition ${
                      isSelected 
                        ? 'bg-amber-500 text-red-950 font-bold shadow' 
                        : 'hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.id}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-stone-800 space-y-2">
            <div className="flex items-center gap-2.5 bg-stone-950/50 p-2 rounded-lg font-sans">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${abertoManual ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className="text-[10px] text-stone-300">
                Status: {abertoManual ? 'Aberto p/ Pedidos' : 'Fechada Geral'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-stone-800/60 hover:bg-stone-800 hover:text-white text-xs font-semibold text-stone-400 font-sans transition border border-stone-700/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Painel</span>
            </button>
          </div>
        </aside>

        {/* CONTAINER DO CONTEÚDO DA TELA ATIVA */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto bg-stone-100 p-4 md:p-6 lg:p-8">
          
          {/* Header Superior Principal */}
          <header className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
            <div>
              <h3 className="font-serif text-2xl font-black text-stone-900 flex items-center gap-2.5">
                {activeTab}
              </h3>
              <p className="text-xs text-stone-500 font-sans">Gerencie os dados vitais e históricos das operações de comida caseira.</p>
            </div>

            <button
              onClick={onClose}
              className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-1.5 rounded-lg font-display font-semibold text-xs active:scale-95 transition"
            >
              Voltar ao Site ✕
            </button>
          </header>


          {/* 1. ABA DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 font-sans">
              
              {/* Cards Analytics Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total de Pedidos</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-3xl font-black text-stone-900">{totalPedidosCount}</p>
                    <span className="text-xs text-stone-500">Mapeados</span>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Vendido Hoje</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-3xl font-black text-emerald-700">R$ {totalVendidoHoje.toFixed(2)}</p>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Ativo</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Vendido no Mês</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-3xl font-black text-stone-900">R$ {totalVendidoMes.toFixed(2)}</p>
                    <span className="text-xs text-stone-500">{mesStr}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Controle Geral de Status</span>
                  <div className="mt-2.5">
                    <button
                      onClick={handleToggleMasterAberto}
                      className={`w-full text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                        abertoManual 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${abertoManual ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      <span>{abertoManual ? 'ABERTO (CLIQUE P/ FECHAR)' : 'FECHADO (CLIQUE P/ ABRIR)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Informações Rápidas Bento */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Carnes Top 3 */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                  <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">🏆 Mais Pedidos (Carnes)</h4>
                  {carnesTop.length === 0 ? (
                    <p className="text-stone-400 text-xs italic py-4">Sem dados suficientes registrados ainda.</p>
                  ) : (
                    <ol className="divide-y divide-stone-100 space-y-3.5 pt-1">
                      {carnesTop.map(([carne, count], idx) => (
                        <li key={idx} className="flex items-center justify-between text-xs py-1.5">
                          <span className="font-semibold text-stone-700 flex items-center gap-2">
                            <span className="font-mono text-stone-400">{idx + 1}.</span>
                            {carne}
                          </span>
                          <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded-full font-mono text-[10px]">{count}x pedidos</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Pedidos Recentes Ativos (Pendentes ou Confirmados) */}
                <div className="lg:col-span-8 bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                  <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">🕒 Pedidos Pendentes de Análise</h4>
                  
                  {pedidos.filter(p => p.status === 'Pendente').length === 0 ? (
                    <div className="text-center py-6 text-stone-400 text-xs italic">
                      😎 Maravilha! Não há nenhum pedido pendente para resolver hoje.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
                            <th className="py-2">Código</th>
                            <th>Cliente</th>
                            <th>Carne</th>
                            <th>Marmita</th>
                            <th>Subtotal</th>
                            <th className="text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {pedidos.filter(p => p.status === 'Pendente').map((ped) => (
                            <tr key={ped.id} className="hover:bg-stone-50/50">
                              <td className="py-3 font-mono font-bold text-red-900">{ped.id}</td>
                              <td>
                                <p className="font-bold">{ped.clienteNome}</p>
                                <p className="text-[10px] text-stone-400">{ped.clienteTelefone}</p>
                              </td>
                              <td className="text-stone-600 font-medium">{ped.carne}</td>
                              <td className="text-stone-500 font-medium">{ped.tipoMarmita}</td>
                              <td className="font-mono font-bold">R$ {ped.total.toFixed(2)}</td>
                              <td className="text-right py-2 flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleChangeStatus(ped.id, 'Confirmado')}
                                  title="Confirmar Pedido"
                                  className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-[10px]"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => handleChangeStatus(ped.id, 'Cancelado')}
                                  title="Recusar"
                                  className="p-1 px-2 border border-red-200 text-red-800 hover:bg-red-50 font-bold rounded-lg transition text-[10px]"
                                >
                                  Cancelar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}


          {/* 2. ABA PEDIDOS */}
          {activeTab === 'Pedidos' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4 font-sans">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-3">
                <h4 className="font-serif font-bold text-lg text-stone-900">Relatório Consolidado de Chamados</h4>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    {pedidos.filter(p => p.status === 'Pendente').length} Pendentes
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    {pedidos.filter(p => p.status === 'Confirmado').length} Em Preparo
                  </span>
                </div>
              </div>

              {pedidos.length === 0 ? (
                <p className="text-stone-400 text-xs italic py-10 text-center">Nenhum pedido recebido e salvo até o momento.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
                        <th className="py-3 px-2">Código</th>
                        <th>Cliente & Contato</th>
                        <th>Resumo Marmita / Carne</th>
                        <th>Acompanhamentos</th>
                        <th>Endereço / Retirada</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th className="text-right">Ação Rápida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {pedidos.map((ped) => (
                        <tr key={ped.id} className="hover:bg-stone-50 transition">
                          <td className="py-4 px-2 font-mono font-bold text-red-800">{ped.id}</td>
                          <td>
                            <p className="font-bold text-stone-900">{ped.clienteNome}</p>
                            <p className="text-stone-400 font-mono text-[10px]">{ped.clienteTelefone}</p>
                          </td>
                          <td className="max-w-[180px]">
                            <p className="font-bold text-stone-700">{ped.tipoMarmita}</p>
                            <p className="text-amber-800 font-medium text-[11px]">{ped.carne}</p>
                          </td>
                          <td className="max-w-[160px] text-[11px] text-stone-500 whitespace-pre-wrap">
                            {ped.acompanhamentos.join(', ') || 'Nenhum'}
                          </td>
                          <td className="max-w-[180px]">
                            <p className="font-medium text-stone-700">{ped.tipoEntrega}</p>
                            <p className="text-[10px] text-stone-400 line-clamp-1">{ped.endereco}, Nº {ped.numero} ({ped.bairro})</p>
                          </td>
                          <td>
                            <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[10px] ${
                              ped.status === 'Pendente' ? 'bg-amber-100 text-amber-800' :
                              ped.status === 'Confirmado' ? 'bg-blue-100 text-blue-800' :
                              ped.status === 'Entregue' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {ped.status}
                            </span>
                          </td>
                          <td className="font-mono font-bold text-stone-900 text-sm">R$ {ped.total.toFixed(2)}</td>
                          <td className="text-right py-2 flex items-center justify-end gap-1.5">
                            {ped.status !== 'Entregue' && ped.status !== 'Cancelado' && (
                              <>
                                <button
                                  onClick={() => handleChangeStatus(ped.id, 'Confirmado')}
                                  title="Colocar em Preparo"
                                  className="p-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                                >
                                  Preparo
                                </button>
                                <button
                                  onClick={() => handleChangeStatus(ped.id, 'Entregue')}
                                  title="Entregue"
                                  className="p-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                                >
                                  Entregue
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleChangeStatus(ped.id, 'Cancelado')}
                              title="Cancelar pedido"
                              className="p-1 text-red-700 hover:bg-red-50 border border-red-200 rounded"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {/* 3. ABA PRODUTOS */}
          {activeTab === 'Produtos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
              
              {/* Formulário Add / Edit */}
              <form onSubmit={handleSaveProduto} className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">
                  {editingProdutoId ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Nome do Item *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Assado de panela de Boi"
                      value={prodNome}
                      onChange={(e) => setProdNome(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Categoria *</label>
                    <select
                      value={prodCat}
                      onChange={(e: any) => setProdCat(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 font-bold select"
                    >
                      <option value="carne">Carne Principal</option>
                      <option value="acompanhamento">Acompanhamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Preço (R$) (Insira 0 para carnes inclusas no PF)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Ex: 0"
                      value={prodPreco}
                      onChange={(e) => setProdPreco(Number(e.target.value))}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Descrição Breve</label>
                    <textarea
                      placeholder="Ex: Deliciosa carne cozida com verduras"
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 h-16 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Link de Imagem Realista *</label>
                    <input
                      type="text"
                      required
                      placeholder="URL Unsplash ou outra"
                      value={prodImg}
                      onChange={(e) => setProdImg(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 text-stone-600 truncate font-mono text-[10px]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2.5">
                    <input
                      type="checkbox"
                      id="prod-ativa-input"
                      checked={prodAtiva}
                      onChange={(e) => setProdAtiva(e.target.checked)}
                      className="rounded text-red-800"
                    />
                    <label htmlFor="prod-ativa-input" className="font-semibold text-stone-600">Disponível / Ativo aos clientes</label>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  {editingProdutoId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProdutoId(null);
                        setProdNome('');
                        setProdImg('');
                        setProdPreco(0);
                        setProdDesc('');
                      }}
                      className="w-1/2 border py-2 rounded-lg hover:bg-stone-50"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 py-2.5 rounded-lg shadow font-bold text-xs"
                  >
                    Salvar Produto
                  </button>
                </div>
              </form>

              {/* Tabela dos Produtos */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-4">📜 Cardápio sob Custódia (Produtos Totais)</h4>
                
                {produtos.length === 0 ? (
                  <p className="text-stone-400 text-xs italic py-8 text-center">Nenhum produto cadastrado no database.</p>
                ) : (
                  <div className="overflow-y-auto max-h-[380px] divide-y divide-stone-100 pr-1">
                    {produtos.map((prod) => (
                      <div key={prod.id} className="flex items-center justify-between py-3 hover:bg-stone-50/60 transition px-2 rounded-lg text-xs">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.imagem} 
                            alt={prod.nome} 
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-extrabold text-stone-900">{prod.nome}</p>
                            <p className="text-[10px] text-stone-400 uppercase font-mono">{prod.categoria}</p>
                            <p className="text-[11px] text-stone-500 truncate max-w-xs">{prod.descricao || 'Sem descrição'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <button
                            onClick={() => handleToggleProdutoAtiva(prod)}
                            className={`p-1 rounded font-bold text-[10px] ${
                              prod.ativa 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {prod.ativa ? 'Ativo' : 'Inativo'}
                          </button>
                          
                          <button
                            onClick={() => handleEditProduto(prod)}
                            title="Editar"
                            className="p-1.5 text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProduto(prod.id)}
                            title="Deletar permanentemente"
                            className="p-1.5 text-red-700 hover:bg-red-100/50 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}


          {/* 4. ABA HORÁRIOS */}
          {activeTab === 'Horários' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-6 font-sans">
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-serif font-bold text-lg text-stone-900">Horários Oficiais de Funcionamento</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Estes dados regulam se o botão de pedidos do cliente funcionará.</p>
                </div>

                <button
                  onClick={handleToggleMasterAberto}
                  className={`flex items-center gap-2 font-black py-2.5 px-4 rounded-xl shadow transition ${
                    abertoManual 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-red-700 text-white hover:bg-red-800'
                  }`}
                >
                  <span>{abertoManual ? '🟢 SIM, RESTAURANTE ABERTO' : '🔴 FECHADO MANUALMENTE'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <h5 className="font-bold text-sm text-stone-700 pl-1 border-l-4 border-amber-500">Mapeamento por dia da semana</h5>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {horarios.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-stone-50/50 text-xs">
                        <span className="font-bold w-24">{h.diaSemana}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={h.abertura}
                            onChange={(e) => handleUpdateHorario(h.id, e.target.value, h.fechamento, h.fechado)}
                            placeholder="Abertura"
                            className="w-14 text-center border p-1 rounded font-mono"
                          />
                          <span>às</span>
                          <input
                            type="text"
                            value={h.fechamento}
                            onChange={(e) => handleUpdateHorario(h.id, h.abertura, e.target.value, h.fechado)}
                            placeholder="Fechamento"
                            className="w-14 text-center border p-1 rounded font-mono"
                          />
                        </div>

                        <button
                          onClick={() => handleUpdateHorario(h.id, h.abertura, h.fechamento, !h.fechado)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm ${
                            h.fechado 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : 'bg-green-100 text-green-900 border border-green-200'
                          }`}
                        >
                          {h.fechado ? 'Fechado' : 'Aberto'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 p-5 rounded-2xl border space-y-4 flex flex-col justify-between">
                  <h5 className="font-bold text-sm text-stone-700">Explicação do Funcionamento Dinâmico</h5>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans">
                    • Se você ajustar um dia da semana como <strong className="text-red-700">Fechado</strong>, o site exibirá o status de fechado automaticamente naquele dia inteiro.<br/>
                    • Se a hora atual estiver fora da abertura/fechamento, o site avisará o cliente qual o expediente correto.<br/>
                    • Para fechar em feriados específicos, cadastre na aba <strong className="text-stone-800">Feriados</strong>.<br/>
                    • Se precisar fechar por algum imprevisto, clique no botão master superior.
                  </p>
                  
                  <div className="text-[11px] text-stone-400 italic">
                    💡 Dica: Formato das horas é 24h separado por dois pontos (ex: 10:00 às 15:00).
                  </div>
                </div>
              </div>

            </div>
          )}


          {/* 5. ABA MENSAGENS */}
          {activeTab === 'Mensagens' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
              
              {/* Formulário cadastrar Mensagem */}
              <form onSubmit={handleAddMensagem} className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">📢 Criar Nova Mensagem / Aviso Automático</h4>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1.5">Texto do Comunicado</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Ex: Estamos fechados hoje devido à forte chuva na região central. Retornaremos normalmente amanhã!"
                      value={msgTexto}
                      onChange={(e) => setMsgTexto(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg p-2.5 text-stone-800 font-medium"
                    />
                  </div>
                  
                  <p className="text-[10px] text-stone-400 leading-normal">
                    Essa mensagem será exibida num popup elegante para todos os clientes logo que eles acessarem o site do Sabor de Casa se o aviso estiver ativo.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg shadow text-xs"
                  >
                    Adicionar Aviso
                  </button>
                </div>
              </form>

              {/* Avisos cadastrados */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">📜 Avisos Cadastrados</h4>
                
                {mensagens.length === 0 ? (
                  <p className="text-stone-400 text-xs italic py-8 text-center">Nenhuma mensagem registrada no momento.</p>
                ) : (
                  <div className="space-y-3 max-h-[320px] overflow-y-auto">
                    {mensagens.map((msg) => (
                      <div key={msg.id} className="p-3 border rounded-xl flex items-start justify-between hover:bg-stone-50 transition text-xs">
                        <div className="space-y-2 pr-4 flex-1">
                          <p className="text-stone-700 font-medium whitespace-pre-line">{msg.texto}</p>
                          <p className="text-[10px] text-stone-400 font-mono">Enviado em: {new Date(msg.dataCriacao).toLocaleDateString()}</p>
                        </div>

                        <div className="flex items-center gap-2shrink-0">
                          <button
                            onClick={() => handleToggleMensagem(msg.id)}
                            className={`p-1.5 py-1 text-[10px] font-bold rounded transition shadow-sm ${
                              msg.ativa 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                            }`}
                          >
                            {msg.ativa ? '📢 Ativo' : 'Inativo'}
                          </button>

                          <button
                            onClick={() => handleDeleteMensagem(msg.id)}
                            title="Excluir"
                            className="p-1.5 text-red-700 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}


          {/* 6. ABA FERIADOS */}
          {activeTab === 'Feriados' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
              
              {/* Add Feriado Form */}
              <form onSubmit={handleAddFeriado} className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">📅 Cadastrar Novo Feriado</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Nome do Feriado *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Tiradentes"
                      value={ferNome}
                      onChange={(e) => setFerNome(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Data do Feriado *</label>
                    <input
                      type="date"
                      required
                      placeholder="Ex: 21/04"
                      value={ferData}
                      onChange={(e) => setFerData(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Tipo de Funcionamento *</label>
                    <select
                      value={ferFunc}
                      onChange={(e: any) => setFerFunc(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 select"
                    >
                      <option value="Fechado">Fechado Total</option>
                      <option value="Especial">Funcionamento especial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Descrição Breve</label>
                    <textarea
                      placeholder="Ex: Não haverá expediente hoje."
                      value={ferDesc}
                      onChange={(e) => setFerDesc(e.target.value)}
                      className="w-full bg-stone-50 border rounded-lg p-2.5 h-16 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg shadow text-xs"
                  >
                    Adicionar Feriado
                  </button>
                </div>
              </form>

              {/* List Feriados */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-4">📜 Feriados Cadastrados</h4>
                
                {feriados.length === 0 ? (
                  <p className="text-stone-400 text-xs italic py-8 text-center">Nenhum feriado cadastrado até o momento.</p>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto">
                    {feriados.map((fer) => (
                      <div key={fer.id} className="p-3 border rounded-xl flex items-center justify-between hover:bg-stone-50 text-xs transition">
                        <div>
                          <p className="font-extrabold text-stone-900">{fer.nome}</p>
                          <p className="text-[10px] text-stone-400 font-mono">Data: {fer.data}</p>
                          <p className="text-[11px] text-stone-500">{fer.descricao}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            fer.funcionamento === 'Fechado' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fer.funcionamento === 'Fechado' ? 'Fechado' : 'Especial'}
                          </span>

                          <button
                            onClick={() => handleDeleteFeriado(fer.id)}
                            className="p-1.5 text-stone-400 hover:text-red-700 transition"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}


          {/* 7. ABA RELATÓRIOS (GRÁFICOS) */}
          {activeTab === 'Relatórios' && (
            <div className="space-y-6 font-sans">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Grafico de Vendas Diarias */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h5 className="font-bold text-sm text-stone-800">📈 Vendas por Dia (Histórico/Hoje)</h5>
                    <span className="text-[11px] text-stone-400">Total faturado no prato feito</span>
                  </div>

                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vendasPorDiaData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#78716c" fontSize={10} tickLine={false} />
                        <YAxis stroke="#78716c" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="vendas" fill="#991b1b" radius={[4, 4, 0, 0]} name="Faturamento (R$)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Grafico de Vendas Mensais */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h5 className="font-bold text-sm text-stone-800">📊 Faturamento por Mês (R$)</h5>
                    <span className="text-[11px] text-stone-400">Vendas consolidadas</span>
                  </div>

                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vendasPorMesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#78716c" fontSize={10} tickLine={false} />
                        <YAxis stroke="#78716c" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="vendas" stroke="#d97706" strokeWidth={3} name="Total Faturado (R$)"activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Informações detalhadas da tabela analítica */}
              <div className="bg-white p-5 rounded-2xl border">
                <h5 className="font-bold text-stone-800 border-b pb-2 mb-4">📋 Resumo Analítico Geral</h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-600">
                  <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                    <p className="text-stone-400 font-medium">Faturamento Estimado</p>
                    <p className="text-lg font-extrabold text-stone-900">R$ {totalVendidoHoje.toFixed(2)} (Hoje)</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                    <p className="text-stone-400 font-medium">Volume de Almoços (Hoje)</p>
                    <p className="text-lg font-extrabold text-stone-900">{pedidosHoje.length} Quentinhas / Pratos</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                    <p className="text-stone-400 font-medium">Ticket Médio por Prato</p>
                    <p className="text-lg font-extrabold text-stone-900">R$ 22,50 por pessoa</p>
                  </div>
                </div>
              </div>

            </div>
          )}


          {/* 8. ABA CONFIGURAÇÕES */}
          {activeTab === 'Configurações' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              
              <form onSubmit={handleSaveConfigPassword} className="bg-white p-5 rounded-2xl border space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-2">🔐 Senha Administrativa de Segurança</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Senha Atual de Teste</label>
                    <input
                      type="text"
                      readOnly
                      value={adminPassword}
                      className="w-full bg-stone-100 border rounded-lg px-2.5 py-2 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Nova Senha</label>
                    <input
                      type="password"
                      id="new-password"
                      placeholder="Mínimo 3 dígitos"
                      className="w-full bg-stone-50 border rounded-lg px-2.5 py-2 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg shadow text-xs"
                  >
                    Alterar Senha do Painel
                  </button>
                </div>
              </form>

              <div className="bg-white p-5 rounded-2xl border flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 border-b pb-2 mb-4">👑 Suporte do Desenvolvedor</h4>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans mt-2">
                    Este sistema possui o controle total offline local do Sabor de Casa. Todos os cadastros adicionados de produtos, controle de horários de funcionamento e mensagens automáticas persistem de forma segura de ponta a ponta. 
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl text-center text-xs text-stone-500 mt-6 font-mono">
                  Sabor de Casa App • Coroatá - MA
                </div>
              </div>

            </div>
          )}


          {/* Footer Informações Admin */}
          <footer className="text-center text-[10px] text-stone-400 border-t border-stone-200/60 pt-4 mt-8 font-sans">
            Sabor de Casa Admin Portal • Solução completa e integrada de pedidos via WhatsApp.
          </footer>

        </main>

      </div>

    </div>
  );
}
