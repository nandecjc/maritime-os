import React from 'react';
import { FileText, Upload, Search, Filter, MoreHorizontal, Download, Trash2, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { authFetch } from '../lib/api';

export default function Documents() {
  const [docs, setDocs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await authFetch('/api/documents').then(res => res.json());
        setDocs(data);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'Document request is being processed by the secure vault.',
      });
    });
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-emerald">Secure Vault</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">AES-256 Encryption Active</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Document & Compliance</h1>
        </motion.div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="pl-12 pr-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-sm outline-none focus:border-brand-500 transition-all w-80 placeholder:text-white/10"
            />
          </div>
          <button 
            onClick={() => handleAction('Upload Document')}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Files', value: loading ? '...' : docs.length.toString(), icon: FileText, color: 'text-brand-400' },
          { label: 'Verified', value: loading ? '...' : docs.filter(d => d.status === 'Verified').length.toString(), icon: ShieldCheck, color: 'text-emerald-400' },
          { label: 'Pending Review', value: loading ? '...' : docs.filter(d => d.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-400' },
          { label: 'Action Required', value: loading ? '...' : docs.filter(d => d.status === 'Expired').length.toString(), icon: AlertCircle, color: 'text-rose-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5"
          >
            <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Document Name</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Category</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Upload Date</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Status</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">File Size</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-10 py-10 text-center text-white/20">Loading documents...</td></tr>
              ) : docs.map((doc, i) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.02] transition-all group cursor-pointer"
                >
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all border border-white/10">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold tracking-tight">{doc.name}</span>
                        <p className="text-[10px] text-white/20 font-mono mt-0.5">{doc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-bold text-white/60">{doc.type}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-mono text-white/40">{doc.date}</span>
                  </td>
                  <td className="px-10 py-7">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest border",
                      doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      doc.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    )}>
                      {doc.status}
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-mono text-white/40">{doc.size}</span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAction('Download')}
                        className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction('Delete')}
                        className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-rose-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction('More Options')}
                        className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
