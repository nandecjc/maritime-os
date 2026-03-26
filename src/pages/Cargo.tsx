import React, { useEffect, useState } from 'react';
import { Package, Ship, MapPin, CheckCircle2, Clock, AlertCircle, Search, Filter, ArrowRight, X, Save, MoreHorizontal, FileText, History } from 'lucide-react';
import { Cargo, Ship as ShipType } from '../types';
import { authFetch } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const CargoSkeleton = () => (
  <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 animate-pulse">
    <div className="h-16 bg-white/5 border-b border-white/5" />
    <div className="p-8 space-y-6">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl" />
            <div className="w-32 h-6 bg-white/5 rounded-lg" />
          </div>
          <div className="w-24 h-6 bg-white/5 rounded-full" />
          <div className="w-32 h-6 bg-white/5 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export default function CargoPage() {
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [ships, setShips] = useState<ShipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cargoData, shipsData] = await Promise.all([
          authFetch('/api/cargo').then(res => res.json()),
          authFetch('/api/ships').then(res => res.json())
        ]);
        setCargo(cargoData);
        setShips(shipsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCargo) return;

    setUpdateLoading(true);
    try {
      const res = await authFetch(`/api/cargo/${editingCargo.id}/update`, {
        method: 'POST',
        body: JSON.stringify({
          status: editingCargo.status,
          ship_id: editingCargo.ship_id
        })
      });
      const updated = await res.json();
      setCargo(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditingCargo(null);
      handleAction(`Updated Cargo ${updated.id}`);
    } catch (err) {
      console.error('Failed to update cargo:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'Cargo manifest command sent to global logistics center.',
      });
    });
  };

  const filteredCargo = cargo.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-blue">Logistics Core</span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Manifest Sync Active</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Cargo Management</h1>
        </motion.div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search manifest ID or destination..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-sm outline-none focus:border-brand-500 transition-all w-80 placeholder:text-white/10"
            />
          </div>
          <button 
            onClick={() => handleAction('New Shipment')}
            className="btn-primary"
          >
            New Shipment
          </button>
        </div>
      </div>

      {loading ? (
        <CargoSkeleton />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Cargo Manifest</th>
                  <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Assigned Vessel</th>
                  <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Status</th>
                  <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Payload</th>
                  <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20">Destination</th>
                  <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCargo.map((item, i) => {
                  const ship = ships.find(s => s.id === item.ship_id);
                  return (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-all group cursor-pointer"
                      onClick={() => setEditingCargo(item)}
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all border border-white/10">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-bold tracking-tight text-lg">{item.id}</span>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">Manifest Verified</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                            <Ship className="w-4 h-4 text-white/20" />
                          </div>
                          <div>
                            <span className="text-sm font-bold">{ship ? ship.name : 'Unlinked'}</span>
                            <p className="text-[10px] text-white/20 font-mono mt-0.5">{ship ? ship.id : 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full w-fit text-[10px] font-bold uppercase tracking-widest border",
                          item.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          item.status === 'Delayed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-brand-500/10 text-brand-400 border-brand-500/20'
                        )}>
                          {item.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : 
                           item.status === 'Delayed' ? <AlertCircle className="w-3 h-3" /> : 
                           <Clock className="w-3 h-3" />}
                          {item.status}
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span className="text-sm font-mono text-white/60">{item.weight}</span>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <MapPin className="w-4 h-4 text-white/20" />
                          {item.destination}
                        </div>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <button className="p-3 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {editingCargo && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark w-full max-w-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cargo Logistics</h2>
                    <p className="text-white/20 text-xs mt-1">Update manifest status and vessel assignment.</p>
                  </div>
                  <button onClick={() => setEditingCargo(null)} className="p-3 hover:bg-white/5 rounded-full transition-all text-white/20 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                    <FileText className="w-4 h-4 text-brand-400 mb-3" />
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">Manifest ID</p>
                    <p className="text-lg font-bold">{editingCargo.id}</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                    <History className="w-4 h-4 text-amber-400 mb-3" />
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">Last Sync</p>
                    <p className="text-lg font-bold">2m ago</p>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Operational Status</label>
                      <select 
                        value={editingCargo.status}
                        onChange={(e) => setEditingCargo({ ...editingCargo, status: e.target.value as any })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-brand-500 transition-all appearance-none text-sm font-bold"
                      >
                        <option value="In Transit">In Transit</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Vessel Assignment</label>
                      <select 
                        value={editingCargo.ship_id}
                        onChange={(e) => setEditingCargo({ ...editingCargo, ship_id: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-brand-500 transition-all appearance-none text-sm font-bold"
                      >
                        <option value="">Unlinked</option>
                        {ships.map(ship => (
                          <option key={ship.id} value={ship.id}>{ship.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingCargo(null)}
                      className="flex-1 py-5 glass hover:bg-white/10 rounded-[2rem] font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={updateLoading}
                      className="flex-[2] py-5 bg-white text-black hover:bg-white/90 disabled:opacity-50 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/10"
                    >
                      {updateLoading ? <Clock className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> <span>Commit Changes</span></>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
