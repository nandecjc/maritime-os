import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { 
  Ship as ShipIcon, 
  Navigation, 
  Wind, 
  Fuel, 
  Package, 
  Clock, 
  Shield, 
  X, 
  AlertCircle,
  Maximize2,
  Minimize2,
  Layers,
  CloudRain,
  Zap,
  ChevronRight,
  TrendingUp,
  Activity,
  Route
} from 'lucide-react';
import { Ship } from '../types';
import { authFetch } from '../lib/api';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// Fix for Leaflet marker icons in React
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942005.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const routeIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

interface VesselModalProps {
  ship: Ship;
  onClose: () => void;
  prediction: any;
  onPredict: (ship: Ship) => void;
  loading: boolean;
}

const VesselModal = ({ ship, onClose, prediction, onPredict, loading }: VesselModalProps) => {
  const { notifications } = useNotifications();
  const shipAlerts = notifications.filter(n => n.message.includes(ship.name) || n.message.includes(ship.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-dark w-full max-w-4xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-48 bg-gradient-to-br from-brand-500/20 to-indigo-600/20 flex items-center justify-center border-b border-white/5">
          <div className="absolute top-6 right-6">
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl"
          >
            <ShipIcon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-blue">{ship.type || 'Container Ship'}</span>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">MMSI: 235092341</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight">{ship.name}</h2>
            </div>
            <div className={cn(
              "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
              ship.status === 'In Transit' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' :
              ship.status === 'Delayed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            )}>
              {ship.status}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Navigation, label: 'Speed', value: `${ship.speed} kn`, color: 'text-brand-400' },
              { icon: Fuel, label: 'Fuel', value: `${ship.fuel_usage}%`, color: 'text-amber-400' },
              { icon: Package, label: 'Cargo', value: ship.cargo_id, color: 'text-emerald-400' },
              { icon: Activity, label: 'Engine', value: ship.telemetry?.engine_status || 'Optimal', color: 'text-indigo-400' },
            ].map((stat, i) => (
              <div key={i} className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                <stat.icon className={cn("w-4 h-4 mb-3", stat.color)} />
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Safety & Compliance</h4>
              <div className="space-y-3">
                {shipAlerts.length > 0 ? (
                  shipAlerts.map(alert => (
                    <div key={alert.id} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <p className="text-xs text-rose-200/70">{alert.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-xs text-emerald-200/70">No active safety violations detected.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Predictive Analytics</h4>
              {prediction ? (
                <div className="bg-brand-500/10 border border-brand-500/20 p-6 rounded-[2rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">Predicted ETA</p>
                    <span className="text-[10px] font-bold text-emerald-500">{prediction.confidence} Confidence</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">
                    {new Date(prediction.predicted_eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.factors.map((f: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-white/40">{f}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => onPredict(ship)}
                  disabled={loading}
                  className="w-full h-full min-h-[140px] bg-white text-black hover:bg-white/90 disabled:opacity-50 rounded-[2rem] font-bold transition-all flex flex-col items-center justify-center gap-3 shadow-2xl shadow-white/10"
                >
                  {loading ? <Clock className="w-8 h-8 animate-spin" /> : <><TrendingUp className="w-8 h-8" /> <span>Run Predictive Analytics</span></>}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Route Optimization</h4>
              {ship.route_options ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Optimized Route</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Time Saved</span>
                      <span className="text-emerald-400 font-bold">{ship.route_options.time_saved}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Fuel Saved</span>
                      <span className="text-emerald-400 font-bold">{ship.route_options.fuel_saved}</span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Apply Now</button>
                </div>
              ) : (
                <div className="h-full min-h-[140px] bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center p-6 text-center">
                  <p className="text-xs text-white/20 italic">Optimization data loading...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Tracking() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [map, setMap] = useState<L.Map | null>(null);

  const handleAction = (action: string) => {
    import('sonner').then(({ toast }) => {
      toast.info(`Action Initiated: ${action}`, {
        description: 'The system is processing your request in the background.',
      });
    });
  };

  const fetchShipDetails = async (shipId: string) => {
    setDetailsLoading(true);
    try {
      const res = await authFetch(`/api/ships/${shipId}`);
      const data = await res.json();
      setSelectedShip(data);
      // Auto-run prediction for better UX
      handlePredict(data);
    } catch (err) {
      console.error('Failed to fetch ship details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const socket = io();
    
    socket.on('vessel_updates', (data: Ship[]) => {
      setShips(data);
    });

    authFetch('/api/ships')
      .then(res => res.json())
      .then(setShips);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (selectedShip && map) {
      map.flyTo([selectedShip.lat, selectedShip.lng], 6, {
        duration: 1.5
      });
    }
  }, [selectedShip, map]);

  const handlePredict = async (ship: Ship) => {
    setLoading(true);
    try {
      const res = await authFetch('/api/predict-eta', {
        method: 'POST',
        body: JSON.stringify({ shipId: ship.id, destination: ship.destination })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Simulated optimized route for selected ship
  const optimizedRoute = useMemo(() => {
    if (!selectedShip) return null;
    const start: [number, number] = [selectedShip.lat, selectedShip.lng];
    const end: [number, number] = [selectedShip.lat + 10, selectedShip.lng + 20]; // Destination coordinates
    return [start, [start[0] + 2, start[1] + 5], [start[0] + 5, start[1] + 12], end];
  }, [selectedShip]);

  return (
    <div className={cn(
      "flex gap-6 transition-all duration-500",
      isFullscreen ? "fixed inset-0 z-[4000] bg-[#050505] p-6" : "h-[calc(100vh-160px)]"
    )}>
      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden relative border border-white/10 shadow-2xl">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {showWeather && (
            <TileLayer
              url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
              opacity={0.4}
            />
          )}

          {ships.map(ship => (
            <Marker 
              key={ship.id} 
              position={[ship.lat, ship.lng]} 
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  fetchShipDetails(ship.id);
                  setPrediction(null);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white">{ship.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                    <span>{ship.speed} kn</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                    <span>{ship.destination}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsModalOpen(true);
                      handleAction(`View Telemetry: ${ship.name}`);
                    }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all mt-2"
                  >
                    View Telemetry
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {showRoutes && selectedShip?.route_options && (
            <>
              {/* Current Route */}
              <Polyline 
                positions={selectedShip.route_options.current} 
                color="#ef4444" 
                weight={2} 
                opacity={0.4}
              />
              {/* Optimized Route */}
              <Polyline 
                positions={selectedShip.route_options.optimized} 
                color="#10b981" 
                weight={3} 
                dashArray="10, 10" 
                opacity={0.8}
              />
              {selectedShip.route_options.optimized.map((pos: any, i: number) => (
                <Marker key={i} position={pos} icon={routeIcon} />
              ))}
            </>
          )}
        </MapContainer>
        
        {/* Map Controls */}
        <div className="absolute top-8 left-8 z-[1000] flex flex-col gap-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark p-2 rounded-2xl flex flex-col gap-1 shadow-2xl border border-white/10"
          >
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={cn("p-3 rounded-xl transition-all", isFullscreen ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5")}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowWeather(!showWeather)}
              className={cn("p-3 rounded-xl transition-all", showWeather ? "bg-brand-500 text-white" : "text-white/40 hover:text-white hover:bg-white/5")}
              title="Weather Layers"
            >
              <CloudRain className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowRoutes(!showRoutes)}
              className={cn("p-3 rounded-xl transition-all", showRoutes ? "bg-brand-500 text-white" : "text-white/40 hover:text-white hover:bg-white/5")}
              title="Toggle Routes"
            >
              <Route className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-8 z-[1000]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark px-6 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-bold tracking-tight">Live Fleet Feed</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Active</span>
                <span className="text-sm font-bold">{ships.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Delayed</span>
                <span className="text-sm font-bold text-rose-400">{ships.filter(s => s.status === 'Delayed').length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {!isFullscreen && (
        <div className="w-[400px] flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {detailsLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center h-full border border-white/10"
              >
                <Clock className="w-10 h-10 text-brand-400 animate-spin mb-4" />
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Fetching Vessel Data...</p>
              </motion.div>
            ) : selectedShip ? (
              <motion.div 
                key={selectedShip.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-8 rounded-[2.5rem] space-y-8 border border-white/10 shadow-2xl h-full overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{selectedShip.name}</h2>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">ID: {selectedShip.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedShip(null)}
                    className="p-2 hover:bg-white/5 rounded-full transition-all text-white/20 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Navigation, label: 'Speed', value: `${selectedShip.speed} kn`, color: 'text-brand-400' },
                    { icon: Fuel, label: 'Fuel Usage', value: `${selectedShip.fuel_usage}%`, color: 'text-amber-400' },
                    { icon: Package, label: 'Cargo ID', value: selectedShip.cargo_id, color: 'text-emerald-400' },
                    { icon: Activity, label: 'Engine', value: selectedShip.telemetry?.engine_status || 'Optimal', color: 'text-indigo-400' },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all">
                      <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
                      <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">{stat.label}</p>
                      <p className="text-lg font-bold truncate">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {selectedShip.telemetry && (
                  <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 space-y-4">
                    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Real-time Telemetry</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Emissions</p>
                        <p className="text-sm font-bold text-white">{selectedShip.telemetry.emissions}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Oil Pressure</p>
                        <p className="text-sm font-bold text-white">{selectedShip.telemetry.oil_pressure}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500/10 rounded-xl">
                      <TrendingUp className="w-4 h-4 text-brand-400" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Predictive Analytics</h4>
                  </div>
                  
                  {prediction ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Predicted ETA</span>
                        <span className="text-[10px] font-bold text-emerald-500">{prediction.confidence} Confidence</span>
                      </div>
                      <p className="text-2xl font-bold tracking-tight">
                        {new Date(prediction.predicted_eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="space-y-2">
                        {prediction.factors.map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                            <div className="w-1 h-1 bg-brand-500 rounded-full"></div>
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handlePredict(selectedShip)}
                      disabled={loading}
                      className="w-full py-4 bg-white text-black hover:bg-white/90 disabled:opacity-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                    >
                      {loading ? <Clock className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> <span>Run Analytics</span></>}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Route Optimization</h4>
                  {selectedShip.route_options ? (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Optimal Path Found</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Switching to the <span className="text-white">Optimized Corridor</span> could save <span className="text-emerald-400 font-bold">{selectedShip.route_options.time_saved}</span> and <span className="text-emerald-400 font-bold">{selectedShip.route_options.fuel_saved}</span> fuel.
                      </p>
                      <button 
                        onClick={() => handleAction(`Apply Optimization for ${selectedShip.name}`)}
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-emerald-400 transition-all mt-4"
                      >
                        Apply Optimization
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-xs text-white/30 italic">Calculating optimal routes based on current weather and traffic...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 glass rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center border border-white/10"
              >
                <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 border border-white/5">
                  <ShipIcon className="w-10 h-10 text-white/10" />
                </div>
                <h3 className="text-xl font-bold">Select a Vessel</h3>
                <p className="text-sm text-white/30 mt-3 leading-relaxed">Click on a ship on the map to view real-time telemetry, predictive analytics, and route optimization data.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && selectedShip && (
          <VesselModal 
            ship={selectedShip} 
            onClose={() => setIsModalOpen(false)}
            prediction={prediction}
            onPredict={handlePredict}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
