import { useState } from 'react';
import { generateRole } from '../services/gemini';
import { Role } from '../types';
import { Loader2, Wand2, Play, Save, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface RoleGeneratorProps {
  onRoleGenerated: (role: Role) => void;
  onTestRole: (role: Role) => void;
}

export function RoleGenerator({ onRoleGenerated, onTestRole }: RoleGeneratorProps) {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRole, setGeneratedRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const roleData = await generateRole(description);
      const newRole: Role = {
        ...roleData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setGeneratedRole(newRole);
    } catch (err) {
      setError('Failed to generate role. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedRole) {
      navigator.clipboard.writeText(generatedRole.systemInstruction);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 text-center md:text-left"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-display">Create New Persona</h1>
        <p className="text-lg text-gray-500 max-w-2xl">Describe the AI agent you want to build, and we'll craft the perfect system instruction for it.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., A grumpy math teacher who loves puns, or a helpful travel guide for Japan..."
          className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all text-gray-700 placeholder:text-gray-400 font-sans"
        />
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className={cn(
              "flex items-center justify-center py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 shadow-md",
              isGenerating || !description.trim()
                ? "bg-gray-300 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Crafting Persona...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Persona
              </>
            )}
          </motion.button>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center"
          >
            <span className="mr-2">⚠️</span> {error}
          </motion.div>
        )}
      </motion.div>

      {generatedRole && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden ring-1 ring-black/5">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">{generatedRole.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{generatedRole.description}</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTestRole(generatedRole)}
                  className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRoleGenerated(generatedRole)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </motion.button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">System Instruction</h3>
                  <button 
                    onClick={handleCopy}
                    className="text-xs flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-5 rounded-xl font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto shadow-inner border border-gray-800 leading-relaxed selection:bg-indigo-500/30">
                  {generatedRole.systemInstruction}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Opening Message</h3>
                <div className="bg-indigo-50 text-indigo-900 p-5 rounded-xl text-sm italic border border-indigo-100">
                  "{generatedRole.openingMessage}"
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
