export interface Ship {
  id: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  destination: string;
  fuel_usage: number;
  status: 'In Transit' | 'Delayed' | 'Docked';
  cargo_id: string;
  type?: string;
  capacity?: string;
  telemetry?: {
    fuel_usage: number;
    engine_status: string;
    emissions: string;
    oil_pressure: string;
    water_temp: string;
  };
  predictive_analytics?: {
    predicted_eta: string;
    delay_risk: string;
    explanation: string;
  };
  route_options?: {
    current: [number, number][];
    optimized: [number, number][];
    time_saved: string;
    fuel_saved: string;
  };
}

export interface Port {
  id: string;
  name: string;
  location: string;
  congestion_level: 'Low' | 'Medium' | 'High';
  queue_time: string;
  lat: number;
  lng: number;
  berths?: number;
  active_vessels?: number;
}

export interface Cargo {
  id: string;
  ship_id: string;
  status: 'In Transit' | 'Delayed' | 'Delivered';
  weight: string;
  destination: string;
}

export interface Prediction {
  shipId: string;
  destination: string;
  predicted_eta: string;
  confidence: string;
  factors: string[];
}
