# MediPulse Clinical IoT Patient Monitoring System

A real-time hospital and clinical IoT telemetry system designed for physicians and nurses to monitor patient vital signs, cardiac trends, microvascular perfusion, body temperature, mobility, acoustic state, and ambulatory GPS positioning.

---

## 🏥 Features
- **Real-Time Vitals Feed**: Live biometrics streamed instantly via WebSockets (`Socket.IO`).
- **Clinical Telemetry Trends**: Sliding 10-point rolling line charts for:
  - **Cardiac Pulse Rate (ECG / BPM)**
  - **Blood Volume Pulse (BVP / Perfusion %)**
  - **Core Thermal Homeostasis (°C)**
- **Ambulatory Tracking & Geofencing**: Real-time Leaflet OpenStreetMap with reverse-geocoded location resolution.
- **Modern Medical Aesthetics**: Clinical dark/cyan glassmorphic theme designed for ICU and nurse command workstations.

---

## 🚀 Getting Started

### 1. Start the Clinical Backend Service
```bash
cd backend
npm install
npm start
```
*The server will start listening on port 5000 (`http://localhost:5000`).*

### 2. Start the Frontend Telemetry Dashboard
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

### 3. Log In & Connect
- On the Login screen, enter the authorized Biosensor ID: **`00:11:22`** (or click the quick auto-fill button).
- Confirm the Patient Dossier (**Evelyn Reed - ICU Bay 04**).
- Launch the Telemetry Command Center.

---

## 📡 Sensor Telemetry Payload

IoT devices push sensor telemetry via `POST /api/sensors`:

```json
{
  "gps": "9.0765, 7.3986",
  "temperature": 36.8,
  "heartbeat": 74,
  "bloodVolumePulse": 88,
  "motion": "Resting",
  "voice": "Stable"
}
```

### Quick Test via PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/sensors" -Method Post -ContentType "application/json" -Body '{"gps": "9.0765, 7.3986", "temperature": 37.1, "heartbeat": 78, "bloodVolumePulse": 85, "motion": "Ambulation", "voice": "Clear"}'
```
