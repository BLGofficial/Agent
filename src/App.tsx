import { useState } from 'react';
import { RoleGenerator } from './components/RoleGenerator';
import { RoleTester } from './components/RoleTester';
import { RoleEngineerChat } from './components/RoleEngineerChat';
import { Role } from './types';
import { LayoutGrid, Plus, Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'create' | 'test' | 'engineer'>('create');
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const handleRoleGenerated = (role: Role) => {
    // Check if role already exists
    if (!roles.find(r => r.id === role.id)) {
      setRoles(prev => [role, ...prev]);
    }
  };

  const handleTestRole = (role: Role) => {
    // Auto-save on test if not exists
    if (!roles.find(r => r.id === role.id)) {
      setRoles(prev => [role, ...prev]);
    }
    setCurrentRole(role);
    setView('test');
  };

  const handleDeleteRole = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoles(prev => prev.filter(r => r.id !== id));
    if (currentRole?.id === id) {
      setCurrentRole(null);
      setView('create');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg ring-4 ring-indigo-50">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-gray-900 font-display">Role Architect</h1>
              <p className="text-xs text-gray-500 font-medium">Powered by Gemini</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentRole(null);
                setView('create');
              }}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm",
                view === 'create' && !currentRole
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                  : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
              )}
            >
              <Plus className="w-4 h-4" />
              New Persona
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentRole(null);
                setView('engineer');
              }}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm",
                view === 'engineer'
                  ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Consult Expert
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-3">Your Personas</h3>
          <AnimatePresence initial={false} mode="popLayout">
            {roles.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 px-4"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                  <MessageSquare className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No personas yet</p>
                <p className="text-xs text-gray-400 mt-1">Create one to get started!</p>
              </motion.div>
            ) : (
              roles.map(role => (
                <motion.div
                  key={role.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => handleTestRole(role)}
                  className={cn(
                    "group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border",
                    currentRole?.id === role.id
                      ? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50 z-10"
                      : "bg-transparent border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden w-full pr-8">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors",
                      currentRole?.id === role.id 
                        ? "bg-indigo-100 text-indigo-700" 
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-50"
                    )}>
                      {role.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-semibold truncate transition-colors",
                        currentRole?.id === role.id ? "text-indigo-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {role.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate group-hover:text-gray-500">
                        {new Date(role.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteRole(role.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                    title="Delete Persona"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {currentRole?.id === role.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full"
                    />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
           <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg py-2 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              System Operational
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-8 overflow-y-auto h-screen scrollbar-hide">
        <div className="max-w-5xl mx-auto h-full pb-20">
          <AnimatePresence mode="wait">
            {view === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RoleGenerator 
                  onRoleGenerated={handleRoleGenerated}
                  onTestRole={handleTestRole}
                />
              </motion.div>
            )}
            {view === 'test' && currentRole && (
              <motion.div
                key={`test-${currentRole.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RoleTester 
                  role={currentRole} 
                  onBack={() => {
                    setCurrentRole(null);
                    setView('create');
                  }}
                />
              </motion.div>
            )}
            {view === 'engineer' && (
              <motion.div
                key="engineer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <RoleEngineerChat />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
