import express, { Request } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Extend Express Request type
interface AuthRequest extends Request {
  user?: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = "maritime-os-secret-key-2026";

// Initial System Data
const USERS = [
  { 
    id: "U-001", 
    email: "admin@maritime.os", 
    password: await bcrypt.hash("admin123", 10), 
    role: "admin", 
    name: "Fleet Admiral",
    organization: "Global Fleet Command",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  },
  { 
    id: "U-002", 
    email: "user@maritime.os", 
    password: await bcrypt.hash("user123", 10), 
    role: "user", 
    name: "Vessel Manager",
    organization: "Pacific Logistics",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
  },
];

const SHIPS = [
  { id: "V-101", name: "Oceanic Voyager", lat: 34.0522, lng: -118.2437, speed: 18.5, destination: "Port of Durban", fuel_usage: 85, status: "In Transit", cargo_id: "C-501", type: "Container Ship", capacity: "18,000 TEU" },
  { id: "V-102", name: "Pacific Star", lat: 35.6895, lng: 139.6917, speed: 22.1, destination: "Port of Richards Bay", fuel_usage: 92, status: "In Transit", cargo_id: "C-502", type: "Bulk Carrier", capacity: "120,000 DWT" },
  { id: "V-103", name: "Atlantic Pride", lat: 51.5074, lng: -0.1278, speed: 15.2, destination: "Port of Cape Town", fuel_usage: 78, status: "Delayed", cargo_id: "C-503", type: "Oil Tanker", capacity: "320,000 DWT" },
  { id: "V-104", name: "Global Mariner", lat: 1.3521, lng: 103.8198, speed: 0, destination: "Port of Ngqura", fuel_usage: 12, status: "Docked", cargo_id: "C-504", type: "Ro-Ro", capacity: "6,500 CEU" },
  { id: "V-105", name: "Northern Light", lat: 55.7558, lng: 37.6173, speed: 19.8, destination: "Port of Port Elizabeth", fuel_usage: 88, status: "In Transit", cargo_id: "C-505", type: "LNG Carrier", capacity: "174,000 m3" },
  { id: "V-106", name: "Southern Cross", lat: -33.8688, lng: 151.2093, speed: 16.5, destination: "Port of East London", fuel_usage: 82, status: "In Transit", cargo_id: "C-506", type: "Container Ship", capacity: "14,000 TEU" },
  { id: "V-107", name: "Eastern Wind", lat: 22.3193, lng: 114.1694, speed: 20.2, destination: "Port of Saldanha", fuel_usage: 90, status: "In Transit", cargo_id: "C-507", type: "Bulk Carrier", capacity: "95,000 DWT" },
];

const PORTS = [
  { id: "P-001", name: "Port of Durban", location: "KwaZulu-Natal, SA", congestion_level: "High", queue_time: "48h", lat: -29.87, lng: 31.02, berths: 25, active_vessels: 18 },
  { id: "P-002", name: "Port of Richards Bay", location: "KwaZulu-Natal, SA", congestion_level: "Medium", queue_time: "12h", lat: -28.78, lng: 32.03, berths: 52, active_vessels: 45 },
  { id: "P-003", name: "Port of Cape Town", location: "Western Cape, SA", congestion_level: "Low", queue_time: "4h", lat: -33.91, lng: 18.44, berths: 40, active_vessels: 12 },
  { id: "P-004", name: "Port of Ngqura", location: "Eastern Cape, SA", congestion_level: "High", queue_time: "72h", lat: -33.80, lng: 25.68, berths: 60, active_vessels: 58 },
  { id: "P-005", name: "Port of Port Elizabeth", location: "Eastern Cape, SA", congestion_level: "Medium", queue_time: "18h", lat: -33.96, lng: 25.62, berths: 35, active_vessels: 22 },
  { id: "P-006", name: "Port of East London", location: "Eastern Cape, SA", congestion_level: "Low", queue_time: "6h", lat: -33.02, lng: 27.91, berths: 15, active_vessels: 8 },
  { id: "P-007", name: "Port of Saldanha", location: "Western Cape, SA", congestion_level: "Medium", queue_time: "24h", lat: -33.00, lng: 17.98, berths: 12, active_vessels: 10 },
];

const CARGO = [
  { id: "C-501", ship_id: "V-101", status: "In Transit", weight: "45,000 tons", destination: "Tokyo", value: "$12.5M", type: "Electronics" },
  { id: "C-502", ship_id: "V-102", status: "In Transit", weight: "32,000 tons", destination: "Los Angeles", value: "$8.2M", type: "Automobiles" },
  { id: "C-503", ship_id: "V-103", status: "Delayed", weight: "12,000 tons", destination: "New York", value: "$15.0M", type: "Crude Oil" },
  { id: "C-504", ship_id: "V-104", status: "Delivered", weight: "28,000 tons", destination: "Singapore", value: "$5.4M", type: "Machinery" },
  { id: "C-505", ship_id: "V-105", status: "In Transit", weight: "15,000 tons", destination: "Rotterdam", value: "$22.0M", type: "Natural Gas" },
];

const NOTIFICATIONS = [
  { id: "N-001", type: "congestion", message: "High congestion at Port of Durban. Expected delay: 72h.", severity: "high", timestamp: new Date().toISOString(), read: false },
  { id: "N-002", type: "delay", message: "Atlantic Pride (V-103) reported 12h delay due to weather.", severity: "medium", timestamp: new Date().toISOString(), read: false },
];

const FUEL_STATS = {
  totalCo2: '1,240.5',
  fuelConsumption: '45,820',
  efficiency: 'EEOI 4.2',
  emissionTrend: [
    { name: 'Mon', co2: 45 },
    { name: 'Tue', co2: 52 },
    { name: 'Wed', co2: 48 },
    { name: 'Thu', co2: 61 },
    { name: 'Fri', co2: 55 },
    { name: 'Sat', co2: 42 },
    { name: 'Sun', co2: 38 },
  ],
  fuelDistribution: [
    { name: 'VLSFO', value: 65 },
    { name: 'MGO', value: 25 },
    { name: 'LNG', value: 10 },
  ]
};

const DOCUMENTS = [
  { id: 'DOC-2026-001', name: 'Shipping Manifest - Durban', type: 'Manifest', date: '2026-03-24', status: 'Verified', size: '2.4 MB' },
  { id: 'DOC-2026-002', name: 'Port Clearance Certificate', type: 'Compliance', date: '2026-03-23', status: 'Pending', size: '1.1 MB' },
  { id: 'DOC-2026-003', name: 'Fuel Quality Analysis Report', type: 'Technical', date: '2026-03-22', status: 'Verified', size: '4.8 MB' },
  { id: 'DOC-2026-004', name: 'Crew Safety Certification', type: 'HR', date: '2026-03-21', status: 'Expired', size: '0.9 MB' },
];

const ADMIN_LOGS = [
  { id: 1, action: 'User Permissions Updated', user: 'Admin', time: '2026-03-26 08:30:00', status: 'Success' },
  { id: 2, action: 'Global Route Override', user: 'Admin', time: '2026-03-26 09:12:00', status: 'Warning' },
  { id: 3, action: 'System Backup Initiated', user: 'System', time: '2026-03-26 04:00:00', status: 'Success' },
];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  const authorizeRole = (role: string) => (req: any, res: any, next: any) => {
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };

  // Auth Endpoints
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name,
        organization: user.organization,
        avatar: user.avatar
      }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          name: user.name,
          organization: user.organization,
          avatar: user.avatar
        } 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, name } = req.body;
    if (USERS.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
      id: `U-${Date.now()}`, 
      email, 
      password: hashedPassword, 
      role: "user", 
      name,
      organization: "New Organization",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };
    USERS.push(newUser);
    const token = jwt.sign({ 
      id: newUser.id, 
      email: newUser.email, 
      role: newUser.role, 
      name: newUser.name,
      organization: newUser.organization,
      avatar: newUser.avatar
    }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        name: newUser.name,
        organization: newUser.organization,
        avatar: newUser.avatar
      } 
    });
  });

  app.post("/api/auth/profile", authenticateToken, async (req: AuthRequest, res) => {
    const { name, email, organization, avatar, role } = req.body;
    const userIndex = USERS.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user in system database
    if (name) USERS[userIndex].name = name;
    if (email) USERS[userIndex].email = email;
    if (organization) USERS[userIndex].organization = organization;
    if (avatar) USERS[userIndex].avatar = avatar;
    if (role) USERS[userIndex].role = role;

    const updatedUser = USERS[userIndex];
    
    // Generate new token with updated info
    const token = jwt.sign({ 
      id: updatedUser.id, 
      email: updatedUser.email, 
      role: updatedUser.role, 
      name: updatedUser.name,
      organization: updatedUser.organization,
      avatar: updatedUser.avatar
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        name: updatedUser.name,
        organization: updatedUser.organization,
        avatar: updatedUser.avatar
      } 
    });
  });

  // Protected API Endpoints
  app.get("/api/ships", authenticateToken, (req, res) => {
    res.json(SHIPS);
  });

  app.get("/api/ships/:id", authenticateToken, (req, res) => {
    const ship = SHIPS.find(s => s.id === req.params.id);
    if (ship) {
      // Enhance with telemetry and insights for the detail vie
      const enhancedShip = {
        ...ship,
        telemetry: {
          fuel_usage: ship.fuel_usage,
          engine_status: "Optimal",
          emissions: "12.4 kg/nm",
          oil_pressure: "85 psi",
          water_temp: "78°C"
        },
        predictive_analytics: {
          predicted_eta: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          delay_risk: ship.status === "Delayed" ? "High" : "Low",
          explanation: ship.status === "Delayed" 
            ? "Severe weather systems in the North Atlantic are causing significant speed reductions."
            : "Current trajectory and port slot availability suggest an on-time arrival."
        },
        route_options: {
          current: [
            [ship.lat, ship.lng],
            [ship.lat + 2, ship.lng + 5],
            [ship.lat + 5, ship.lng + 12]
          ],
          optimized: [
            [ship.lat, ship.lng],
            [ship.lat + 1.5, ship.lng + 6],
            [ship.lat + 4.5, ship.lng + 13]
          ],
          time_saved: "4.5 hours",
          fuel_saved: "2.1 tons"
        }
      };
      res.json(enhancedShip);
    }
    else res.status(404).json({ error: "Ship not found" });
  });

  app.post("/api/ships", authenticateToken, authorizeRole('admin'), (req, res) => {
    const newShip = { ...req.body, id: `V-${Date.now()}` };
    SHIPS.push(newShip);
    res.status(201).json(newShip);
  });

  app.get("/api/ports", authenticateToken, (req, res) => {
    res.json(PORTS);
  });

  app.get("/api/cargo", authenticateToken, (req, res) => {
    res.json(CARGO);
  });

  app.post("/api/cargo/:id/update", authenticateToken, (req, res) => {
    const { status, ship_id } = req.body;
    const cargo = CARGO.find(c => c.id === req.params.id);
    
    if (!cargo) return res.status(404).json({ error: "Cargo not found" });

    if (status) cargo.status = status;
    
    if (ship_id !== undefined && ship_id !== cargo.ship_id) {
      // Remove from old ship
      const oldShip = SHIPS.find(s => s.id === cargo.ship_id);
      if (oldShip) oldShip.cargo_id = "";

      // Add to new ship
      const newShip = SHIPS.find(s => s.id === ship_id);
      if (newShip) {
        newShip.cargo_id = cargo.id;
        cargo.ship_id = ship_id;
      } else if (ship_id === "") {
        cargo.ship_id = "";
      }
    }

    res.json(cargo);
  });

  app.get("/api/notifications", authenticateToken, (req, res) => {
    res.json(NOTIFICATIONS);
  });

  app.get("/api/fuel-stats", authenticateToken, (req, res) => {
    res.json(FUEL_STATS);
  });

  app.get("/api/documents", authenticateToken, (req, res) => {
    res.json(DOCUMENTS);
  });

  app.get("/api/admin/logs", authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json(ADMIN_LOGS);
  });

  app.post("/api/notifications/:id/read", authenticateToken, (req, res) => {
    const notification = NOTIFICATIONS.find(n => n.id === req.params.id);
    if (notification) {
      notification.read = true;
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  });

  app.post("/api/predict-eta", authenticateToken, (req, res) => {
    const { shipId, destination } = req.body;
    const confidence = Math.floor(Math.random() * (98 - 85 + 1) + 85);
    const days = Math.floor(Math.random() * 10) + 2;
    res.json({
      shipId,
      destination,
      predicted_eta: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      confidence: `${confidence}%`,
      factors: ["Weather: Clear", "Current Speed: Optimal", "Port Congestion: Low"]
    });
  });

  // Real-time Simulation
  io.on("connection", (socket) => {
    console.log("Client connected");
    
    const interval = setInterval(() => {
      SHIPS.forEach(ship => {
        if (ship.status === "In Transit") {
          ship.lat += (Math.random() - 0.5) * 0.01;
          ship.lng += (Math.random() - 0.5) * 0.01;
        }
      });
      socket.emit("vessel_updates", SHIPS);

      // Randomly generate notifications
      if (Math.random() < 0.1) {
        const types = [
          { type: "congestion", message: "High congestion reported at Port of Durban.", severity: "high" },
          { type: "delay", message: "Pacific Star (V-102) is experiencing minor delays.", severity: "medium" },
          { type: "fuel", message: "Low fuel warning for Global Mariner (V-104). Refuel required.", severity: "high" },
          { type: "weather", message: "Severe weather alert in the South Atlantic. Rerouting suggested.", severity: "medium" }
        ];
        const selected = types[Math.floor(Math.random() * types.length)];
        const newNotification = {
          id: `N-${Date.now()}`,
          ...selected,
          timestamp: new Date().toISOString(),
          read: false
        };
        NOTIFICATIONS.unshift(newNotification);
        if (NOTIFICATIONS.length > 50) NOTIFICATIONS.pop();
        io.emit("new_notification", newNotification);
      }
    }, 3000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Maritime OS Server running on http://localhost:${PORT}`);
  });
}

startServer();

