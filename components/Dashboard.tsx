
import React, { useState, useMemo } from 'react';
import {
  Menu,
  LogOut,
  Home,
  User as UserIcon,
  Activity,
  Target,
  TrendingUp,
  Settings,
  Plus,
  CheckSquare,
  Trophy,
  Trash2,
  Link as LinkIcon,
  Info
} from 'lucide-react';
import { INITIAL_GOALS, INITIAL_HABITS, DEFAULT_USER_PROFILE } from '../constants';
import { SectionType, Habit, Goal, RankOption } from '../types';
import GoalModal from './GoalModal';
import ConfirmModal from './ConfirmModal';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<SectionType>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Delete Confirmation State
  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    type: 'habit' | 'goal' | null;
    id: string | null;
    name: string;
  }>({ isOpen: false, type: null, id: null, name: '' });

  // Form states
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', frequency: '', motivation: '', notes: '', goalId: '' });

  // --- LOGIC: Statistics ---
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.progress === 100).length;
    const avgProgress = totalHabits > 0 
      ? Math.round(habits.reduce((acc, curr) => acc + curr.progress, 0) / totalHabits) 
      : 0;
    
    const bestHabit = totalHabits > 0 
      ? habits.reduce((prev, current) => (prev.progress > current.progress) ? prev : current) 
      : null;

    return {
      totalHabits,
      completedHabits,
      avgProgress,
      bestHabitName: bestHabit ? bestHabit.name : 'Ninguno aún',
    };
  }, [habits]);

  // --- LOGIC: Goal Summary Stats ---
  const goalStats = useMemo(() => {
    const completed = goals.filter(g => g.isCompleted);
    const byRank: Record<string, number> = {};
    
    completed.forEach(g => {
      byRank[g.rankName] = (byRank[g.rankName] || 0) + 1;
    });

    const summaryText = Object.entries(byRank)
      .map(([rank, count]) => `${count} meta${count > 1 ? 's' : ''} ${rank}`)
      .join(' - ');

    return {
      totalCompleted: completed.length,
      totalGoals: goals.length,
      summaryText: summaryText || "Aún no has completado ninguna meta.",
      byRank
    };
  }, [goals]);

  // --- HANDLERS ---

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      frequency: newHabit.frequency,
      motivation: newHabit.motivation,
      notes: newHabit.notes,
      progress: 0
    };
    setHabits([...habits, habit]);
    setIsHabitFormOpen(false);
    setNewHabit({ name: '', frequency: '', motivation: '', notes: '', goalId: '' });
  };

  const promptDelete = (type: 'habit' | 'goal', id: string, name: string) => {
    setDeleteConfig({
      isOpen: true,
      type,
      id,
      name
    });
  };

  const confirmDelete = () => {
    if (deleteConfig.type === 'habit' && deleteConfig.id) {
      setHabits(habits.filter(h => h.id !== deleteConfig.id));
      // Also remove goals associated with this habit
      setGoals(goals.filter(g => g.habitId !== deleteConfig.id));
    } else if (deleteConfig.type === 'goal' && deleteConfig.id) {
      setGoals(goals.filter(g => g.id !== deleteConfig.id));
    }
    setDeleteConfig({ isOpen: false, type: null, id: null, name: '' });
  };

  const handleRankConfirm = (habitId: string, rank: RankOption) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      habitId: habitId,
      habitName: habit.name,
      rankId: rank.id,
      rankName: rank.name,
      rankEmoji: rank.imageEmoji,
      targetDays: rank.days,
      daysCompleted: 0,
      progress: 0,
      isCompleted: false,
      reward: 'Recompensa pendiente' // Could be an input in a future iteration
    };

    setGoals([...goals, newGoal]);
    setShowGoalModal(false);
    setActiveSection('metas');
  };

  // Navigation Items
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'usuario', label: 'Perfil', icon: UserIcon },
    { id: 'habitos', label: 'Hábitos', icon: Activity },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'progresos', label: 'Progresos', icon: TrendingUp },
    { id: 'ajustes', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Confirm Modal */}
      <ConfirmModal 
        isOpen={deleteConfig.isOpen}
        title={`Eliminar ${deleteConfig.type === 'habit' ? 'Hábito' : 'Meta'}`}
        message={`¿Estás seguro de que deseas eliminar "${deleteConfig.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">HabitTracker</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as SectionType);
                setIsSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeSection === 'usuario' ? 'Perfil de Usuario' : activeSection}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-gray-600 sm:block">Hola, {DEFAULT_USER_PROFILE.username}</span>
            <img
              src={DEFAULT_USER_PROFILE.avatarUrl}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-gray-200"
            />
            <button
              onClick={onLogout}
              className="ml-2 rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* --- SECCIÓN INICIO --- */}
          {activeSection === 'inicio' && (
            <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">¡Bienvenido de nuevo!</h2>
                <p className="text-blue-50">¿Qué quieres lograr hoy? Define nuevos hábitos o alcanza metas legendarias.</p>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => { setIsHabitFormOpen(true); }}
                    className="flex items-center gap-2 rounded-lg bg-white/20 px-6 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/30"
                  >
                    <Plus className="h-5 w-5" /> Nuevo Hábito
                  </button>
                  <button
                     onClick={() => setShowGoalModal(true)}
                     className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 shadow-lg"
                  >
                    <Target className="h-5 w-5" /> Alcanza una Meta
                  </button>
                </div>
              </div>

              {/* Formulario Nuevo Hábito */}
              {isHabitFormOpen && (
                <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                   <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Nuevo Hábito</h3>
                    <button onClick={() => setIsHabitFormOpen(false)} className="text-gray-400 hover:text-gray-600"><Activity className="w-5 h-5"/></button>
                   </div>
                   <form onSubmit={handleAddHabit} className="grid gap-4 md:grid-cols-2">
                      <input 
                        type="text" placeholder="Nombre (ej. Leer)" 
                        className="rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} required 
                      />
                      <input 
                        type="text" placeholder="Frecuencia (ej. Diario)" 
                        className="rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newHabit.frequency} onChange={e => setNewHabit({...newHabit, frequency: e.target.value})} required 
                      />
                      <input 
                        type="text" placeholder="Motivación personal" 
                        className="rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
                        value={newHabit.motivation} onChange={e => setNewHabit({...newHabit, motivation: e.target.value})} 
                      />
                      <textarea 
                        placeholder="Notas adicionales" 
                        className="rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
                        value={newHabit.notes} onChange={e => setNewHabit({...newHabit, notes: e.target.value})} 
                      />
                      <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">Guardar Hábito</button>
                   </form>
                </div>
              )}
            </div>
          )}

          {/* --- SECCIÓN HÁBITOS --- */}
          {activeSection === 'habitos' && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="p-4 font-medium">Hábito</th>
                      <th className="p-4 font-medium hidden sm:table-cell">Meta Activa</th>
                      <th className="p-4 font-medium">Frecuencia</th>
                      <th className="p-4 font-medium">Progreso</th>
                      <th className="p-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {habits.map((habit) => {
                      const activeGoal = goals.find(g => g.habitId === habit.id && !g.isCompleted);
                      return (
                        <tr key={habit.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="p-4">
                            <p className="font-semibold text-gray-800">{habit.name}</p>
                            {habit.motivation && <p className="text-xs text-gray-400">{habit.motivation}</p>}
                          </td>
                          <td className="p-4 hidden sm:table-cell">
                            {activeGoal ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 border border-purple-100">
                                {activeGoal.rankEmoji} {activeGoal.rankName}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Sin desafío activo</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-600">{habit.frequency}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-gray-100">
                                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${habit.progress}%` }}></div>
                              </div>
                              <span className="text-xs text-gray-400">{habit.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => promptDelete('habit', habit.id, habit.name)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="Eliminar Hábito"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {habits.length === 0 && <div className="p-8 text-center text-gray-400">No hay hábitos registrados aún.</div>}
              </div>
            </div>
          )}

          {/* --- SECCIÓN METAS (REDESIGNED) --- */}
          {activeSection === 'metas' && (
            <div className="animate-[fadeIn_0.4s_ease-out] space-y-8">
              
              {/* 1. General Summary Card */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Resumen de Logros</h2>
                    <p className="text-indigo-100 mt-1 text-sm">
                      "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                     <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Historial</div>
                     <div className="font-medium text-sm">
                       Tienes: {goalStats.summaryText} completas.
                     </div>
                  </div>
                </div>

                {/* Visual Progress Bar for Summary */}
                <div className="mt-6">
                   <div className="flex justify-between text-xs text-indigo-200 mb-2">
                      <span>Metas Totales: {goalStats.totalGoals}</span>
                      <span>Completadas: {goalStats.totalCompleted}</span>
                   </div>
                   <div className="h-3 w-full rounded-full bg-black/20 overflow-hidden flex">
                      {/* Render a segment for completed vs remaining */}
                      <div 
                        className="bg-green-400 h-full transition-all duration-1000" 
                        style={{ width: `${goalStats.totalGoals > 0 ? (goalStats.totalCompleted / goalStats.totalGoals) * 100 : 0}%` }}
                      />
                   </div>
                </div>
              </div>

              {/* 2. Active Goals Grid */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <Target className="text-indigo-600" /> Tus Desafíos Activos
                </h3>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {goals.filter(g => !g.isCompleted).length === 0 && (
                    <div className="col-span-full rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-400">
                       No tienes desafíos activos. ¡Ve al inicio y "Alcanza una Meta"!
                    </div>
                  )}

                  {goals.filter(g => !g.isCompleted).map((goal) => (
                    <div key={goal.id} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100">
                      <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <button 
                          onClick={(e) => { e.stopPropagation(); promptDelete('goal', goal.id, goal.habitName); }}
                          className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="rounded-xl bg-indigo-50 p-3 text-4xl">
                           {goal.rankEmoji}
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                          {goal.targetDays} Días
                        </span>
                      </div>
                      
                      <h4 className="text-sm text-gray-500 uppercase font-bold tracking-wider">Desafío {goal.rankName}</h4>
                      <h3 className="text-xl font-bold text-gray-800 mt-1">{goal.habitName}</h3>
                      
                      <div className="mt-6">
                        <div className="flex justify-between mb-1 text-sm font-medium">
                            <span className="text-gray-600">Día {goal.daysCompleted} de {goal.targetDays}</span>
                            <span className="text-indigo-600">{Math.round((goal.daysCompleted / goal.targetDays) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 transition-all duration-500" 
                            style={{ width: `${(goal.daysCompleted / goal.targetDays) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 3. Completed Goals History (Optional/Small) */}
              {goalStats.totalCompleted > 0 && (
                 <div className="opacity-75">
                    <h3 className="text-lg font-bold text-gray-600 mb-4">Historial de Victorias</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {goals.filter(g => g.isCompleted).map(goal => (
                         <div key={goal.id} className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 border border-gray-200">
                            <span className="text-2xl grayscale hover:grayscale-0 transition">{goal.rankEmoji}</span>
                            <div>
                               <p className="text-xs font-bold text-gray-500">{goal.rankName}</p>
                               <p className="text-sm font-medium text-gray-700">{goal.habitName}</p>
                            </div>
                         </div>
                      ))}
                    </div>
                 </div>
              )}

            </div>
          )}

           {/* --- SECCIÓN USUARIO / PERFIL --- */}
           {activeSection === 'usuario' && (
             <div className="flex justify-center animate-[fadeIn_0.4s_ease-out]">
               <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg text-center border border-gray-100">
                 <div className="relative mx-auto mb-6 h-32 w-32">
                    <img src={DEFAULT_USER_PROFILE.avatarUrl} className="h-full w-full rounded-full object-cover shadow-md" alt="Profile" />
                    <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                      <Settings className="h-4 w-4" />
                    </button>
                 </div>
                 <h2 className="text-2xl font-bold text-gray-800">{DEFAULT_USER_PROFILE.username}</h2>
                 <p className="text-gray-500 mb-6">{DEFAULT_USER_PROFILE.email}</p>
                 
                 <div className="grid grid-cols-2 gap-4 border-t pt-6">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-blue-600">{habits.length}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Hábitos</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-purple-600">{goals.length}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Desafíos</span>
                    </div>
                 </div>
                 <p className="mt-8 text-sm text-gray-400">Miembro desde: {DEFAULT_USER_PROFILE.memberSince}</p>
               </div>
             </div>
           )}

           {/* --- SECCIÓN PROGRESOS (DINÁMICA) --- */}
           {activeSection === 'progresos' && (
             <div className="grid gap-6 md:grid-cols-2 animate-[fadeIn_0.4s_ease-out]">
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckSquare className="text-green-500"/> Resumen General</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Hábito más constante</span>
                      <span className="font-semibold text-gray-800">{stats.bestHabitName}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Progreso Promedio</span>
                      <span className={`font-semibold ${stats.avgProgress >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {stats.avgProgress}%
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm border border-gray-100 min-h-[200px]">
                   <h4 className="mb-4 font-semibold text-gray-700">Estadísticas en tiempo real</h4>
                   <div className="w-full grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                         <p className="text-2xl font-bold text-blue-600">{stats.totalHabits}</p>
                         <p className="text-xs text-gray-500">Hábitos Totales</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                         <p className="text-2xl font-bold text-green-600">{stats.completedHabits}</p>
                         <p className="text-xs text-gray-500">Al 100%</p>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* --- SECCIÓN AJUSTES --- */}
           {activeSection === 'ajustes' && (
             <div className="max-w-2xl mx-auto rounded-xl bg-white p-8 shadow-sm border border-gray-100 animate-[fadeIn_0.4s_ease-out]">
                <h3 className="text-xl font-bold mb-6">Configuración de la Aplicación</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema Visual</label>
                    <select className="w-full rounded-lg border bg-gray-50 p-3 outline-none focus:border-blue-500">
                      <option>Claro (Default)</option>
                      <option>Oscuro</option>
                      <option>Sistema</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                    <select className="w-full rounded-lg border bg-gray-50 p-3 outline-none focus:border-blue-500">
                      <option>Español</option>
                      <option>English</option>
                      <option>Français</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="notif" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <label htmlFor="notif" className="text-gray-700">Activar notificaciones de recordatorio</label>
                  </div>
                  <div className="pt-4">
                    <button type="button" className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors">Guardar Cambios</button>
                  </div>
                </form>
             </div>
           )}

        </main>
      </div>
      
      {/* Goal Selector Modal */}
      <GoalModal 
        isOpen={showGoalModal} 
        onClose={() => setShowGoalModal(false)} 
        habits={habits}
        onConfirm={handleRankConfirm} 
      />
    </div>
  );
};

export default Dashboard;
