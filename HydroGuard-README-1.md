# 💧 HydroGuard

> **Smart Water Monitoring & Management System**

HydroGuard is a smart water monitoring and management platform designed to work alongside an IoT-based water-level monitoring and automated pumping system.

The physical system monitors water levels using an ultrasonic sensor and controls a submersible pump through a relay. HydroGuard provides a web-based interface where users can monitor the system, view historical readings, receive alerts, and configure system settings.

## 🎯 Objectives

- Monitor water levels in real time.
- Automatically control a submersible pump when required.
- Display current water level through a web dashboard.
- Track pump activity.
- Generate alerts for abnormal water levels.
- Detect when the IoT controller becomes unavailable.
- Store historical readings.
- Configure water-level thresholds.
- Provide centralized system management.
- Provide a foundation for future remote control and analytics.

## 🏗️ System Architecture

```text
                    USER
                     │
                     ▼
             ┌────────────────┐
             │ React Frontend │
             │ Dashboard      │
             │ Monitoring     │
             │ History        │
             │ Alerts         │
             │ Settings       │
             └───────┬────────┘
                     │
                REST / WebSocket
                     │
                     ▼
             ┌────────────────┐
             │ Spring Boot    │
             │ Backend        │
             │ REST API       │
             │ Business Logic │
             │ IoT Integration│
             └───────┬────────┘
                     │
              ┌──────┴───────┐
              │              │
              ▼              ▼
       ┌──────────────┐  ┌───────────────┐
       │   Supabase   │  │ IoT Controller│
       │  PostgreSQL  │  │               │
       └──────────────┘  └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        Ultrasonic             Relay            Buzzer/
          Sensor                 │               LEDs
                                 ▼
                           Submersible Pump
```

The basic principle is:

> **The hardware measures and controls the physical water system, the backend manages communication and business logic, Supabase stores system data, and the HydroGuard frontend gives users a clear interface for monitoring and management.**

## ⚙️ How It Works

```text
Ultrasonic Sensor
       │
       ▼
Measure distance to water
       │
       ▼
Calculate water level
       │
       ▼
Convert to percentage
       │
       ▼
Determine status
       │
       ▼
IoT Controller
       │
       ▼
Spring Boot Backend
       │
       ├──► Supabase PostgreSQL
       │
       └──► React Frontend
```

A typical sensor payload can look like:

```json
{
  "waterLevelPercentage": 64,
  "distanceCm": 12.8,
  "pumpStatus": false,
  "buzzerStatus": false,
  "deviceStatus": "ONLINE"
}
```

## 🖥️ Web Application

The application contains:

```text
HydroGuard
├── Login
├── Dashboard
├── Live Monitoring
├── History
├── Alerts
└── Settings
```

### 🔐 Login

Provides authenticated access to HydroGuard.

Possible authentication implementation:

- Supabase Auth
- Protected Spring Boot API endpoints

### 🏠 Dashboard

The main overview page displays:

- Current water level
- Water-level status
- Pump status
- System status
- Last sensor update
- Recent alerts
- Water-level chart

Example:

```text
┌───────────────────────────────────────────────┐
│ HYDROGUARD                    ● SYSTEM ONLINE │
├───────────────────────────────────────────────┤
│ WATER LEVEL       PUMP STATUS    SYSTEM       │
│    64%               OFF          ONLINE      │
│   NORMAL                                      │
├───────────────────────────────────────────────┤
│              WATER LEVEL HISTORY              │
│                    📈 Chart                   │
├───────────────────────────────────────────────┤
│                 RECENT ALERTS                 │
└───────────────────────────────────────────────┘
```

### 📡 Live Monitoring

Provides detailed current system information.

| Component | Information |
|---|---|
| Ultrasonic Sensor | Online/offline, distance |
| Water Level | Current percentage |
| Relay | Current state |
| Pump | Running/off |
| Buzzer | Active/inactive |
| LEDs | Current status |
| Controller | Online/offline |
| Last Communication | Timestamp |

### 📈 History

Stores and displays:

- Water-level history
- Distance measurements
- Pump activity
- Pump events
- Buzzer events
- Alerts
- Device communication history

Possible filters:

- Last hour
- Today
- Last 7 days
- Last 30 days

### 🚨 Alerts

Possible alerts include:

- Low water level
- High water level
- Device offline
- Pump activated
- Pump stopped
- Sensor communication failure

Each alert should contain its type, message, severity, timestamp and resolution status.

### ⚙️ Settings

Possible settings:

```text
Low Water Threshold:    [ 30 ] %
High Water Threshold:   [ 80 ] %

Pump Mode:
(●) Automatic
( ) Manual

Buzzer:
[✓] Enable Buzzer Alerts
```

## 🔌 Hardware Integration

The physical system consists of:

- Arduino/controller
- Ultrasonic sensor
- Relay module
- Submersible pump
- Buzzer
- Traffic LEDs
- 7-segment display
- External battery supply for the pump

### Ultrasonic Sensor

Measures the distance between the sensor and water surface. The controller uses this measurement to calculate the water-level percentage.

### Relay

Acts as the electrically controlled switch between the controller and submersible pump. The pump is powered by its appropriate external supply rather than directly from an Arduino output.

### Submersible Pump

Moves water according to the final tank/plumbing arrangement.

### Buzzer and LEDs

Provide physical warnings and status indications.

### 7-Segment Display

Provides a local indication of a selected system value, such as water level.

## 🧠 Backend

The backend uses **Spring Boot** and acts as the central API/business-logic layer.

Responsibilities:

- Receive sensor data.
- Validate incoming data.
- Process water-level logic.
- Store readings.
- Retrieve historical data.
- Generate alerts.
- Record pump events.
- Track device status.
- Manage settings.
- Provide frontend APIs.
- Provide IoT APIs.
- Handle pump-control commands where enabled.

Suggested structure:

```text
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/hydroguard/
        │       ├── controller/
        │       ├── service/
        │       ├── repository/
        │       ├── model/
        │       ├── dto/
        │       ├── config/
        │       ├── exception/
        │       └── integration/
        └── resources/
            └── application.properties
```

## 🗄️ Database

HydroGuard uses **Supabase PostgreSQL**.

### `devices`

Stores physical device information:

- `id`
- `name`
- `status`
- `last_seen`
- `created_at`

### `water_readings`

Stores sensor readings:

- `id`
- `device_id`
- `water_level_percentage`
- `distance_cm`
- `pump_status`
- `buzzer_status`
- `created_at`

### `pump_events`

Stores pump activity:

- `id`
- `device_id`
- `status`
- `trigger_type`
- `created_at`

### `alerts`

Stores generated alerts:

- `id`
- `device_id`
- `type`
- `message`
- `severity`
- `is_resolved`
- `created_at`
- `resolved_at`

### `system_settings`

Stores configuration:

- `id`
- `low_threshold`
- `high_threshold`
- `pump_mode`
- `buzzer_enabled`
- `updated_at`

## 🔄 Data Flow

```text
Ultrasonic Sensor
       │
       ▼
IoT Controller
       │
       ▼
Spring Boot API
       │
       ├──────────► Business Logic
       │
       └──────────► Supabase
                       │
                       ▼
                 React Frontend
                       │
                       ▼
                      User
```

## 💧 Automatic Pump Operation

Example using a 30% low-water threshold:

```text
Water Level = 24%
       │
       ▼
Below Low Threshold
       │
       ▼
LOW WATER DETECTED
       │
       ├──► Create Alert
       │
       ▼
Activate Relay
       │
       ▼
Pump ON
       │
       ▼
Water Level Increases
       │
       ▼
Safe Level Reached
       │
       ▼
Pump OFF
       │
       ▼
System Returns to NORMAL
```

The web application does not necessarily need to remain open for the physical automatic operation to continue, depending on the final IoT implementation.

## 🎛️ Manual Pump Control

If enabled:

```text
React Frontend
      │
      ▼
Spring Boot API
      │
      ▼
IoT Controller
      │
      ▼
Relay
      │
      ▼
Submersible Pump
```

Manual pump actions should be recorded in `pump_events`.

## 📡 Device Status

HydroGuard should track communication with the physical controller.

```text
● ONLINE
```

or:

```text
● OFFLINE
```

A `last_seen` timestamp can be used to determine whether communication is recent.

## 🔗 API

Initial planned endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check backend availability |
| `GET` | `/api/status` | Current system status |
| `GET` | `/api/water/history` | Historical readings |
| `GET` | `/api/alerts` | System alerts |
| `POST` | `/api/water/readings` | Submit sensor reading |
| `POST` | `/api/pump/on` | Turn pump on |
| `POST` | `/api/pump/off` | Turn pump off |
| `GET` | `/api/settings` | Get settings |
| `PUT` | `/api/settings` | Update settings |

These endpoints are an initial design and may expand during implementation.

## 📁 Project Structure

```text
HydroGuard/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── alerts/
│       │   ├── common/
│       │   ├── dashboard/
│       │   ├── layout/
│       │   ├── monitoring/
│       │   └── settings/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── utils/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/hydroguard/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── model/
│   │       │       ├── dto/
│   │       │       ├── config/
│   │       │       └── integration/
│   │       └── resources/
│   └── pom.xml
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Backend | Spring Boot |
| Backend Language | Java |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth / backend authorization |
| IoT Controller | Arduino/controller |
| Water Sensor | Ultrasonic sensor |
| Pump | Submersible pump |
| Pump Switching | Relay |
| Local Alerts | Buzzer + LEDs |
| Local Display | 7-Segment Display |
| Communication | REST API / WebSocket |

## 🚀 Installation and Setup

### Prerequisites

Install:

- Node.js
- npm
- Java 17+
- Maven
- Git
- Supabase account
- Arduino IDE

### Clone

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd HydroGuard
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

Run:

```bash
npm run dev
```

### Backend

```bash
cd backend
```

Configure:

```env
SUPABASE_DB_URL=jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=YOUR_PASSWORD
```

Run:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## 🔐 Security

Never commit sensitive credentials to GitHub.

Do not commit:

```text
.env
.env.local
application-local.properties
database passwords
API secrets
Supabase service-role keys
```

Use environment variables for secrets.

## 🧪 Example Scenario

Assume:

```text
Low-water threshold = 30%
```

The system detects:

```text
Water Level = 24%
```

The system:

1. Classifies the level as LOW.
2. Activates the relay.
3. Turns on the submersible pump.
4. Activates appropriate physical indicators.
5. Sends the reading to the backend.
6. Stores the reading in Supabase.
7. Creates a low-water alert.
8. Updates the Dashboard.

The user sees:

```text
WATER LEVEL: 24%
STATUS: LOW

PUMP: RUNNING

🚨 LOW WATER LEVEL
Pump activated automatically.
```

## 🔮 Future Improvements

Potential future features:

- Multiple tanks/devices
- Multiple user accounts
- Role-based access control
- Email notifications
- Push notifications
- SMS alerts
- Mobile application
- Remote pump control
- Advanced analytics
- Pump runtime statistics
- Water consumption estimation
- Device health monitoring
- CSV/PDF reports
- Real-time WebSocket updates
- Advanced charts
- Predictive water-level analysis

## 📌 Project Status

**Status: Development**

- [x] Project concept defined
- [x] Physical water-monitoring system designed
- [x] Submersible pump integration planned
- [x] Web application concept defined
- [x] Frontend/backend architecture defined
- [x] Supabase selected as database
- [x] Initial project structure created
- [ ] Complete frontend implementation
- [ ] Complete Spring Boot API
- [ ] Connect backend to Supabase
- [ ] Connect IoT controller to backend
- [ ] Implement authentication
- [ ] Implement real-time monitoring
- [ ] Implement alerts
- [ ] Implement historical charts
- [ ] Final deployment

## 👥 Development Philosophy

HydroGuard is designed as a modular system.

The physical hardware, backend, database and frontend have clearly separated responsibilities. This makes it possible to:

- Replace hardware without rebuilding the entire web application.
- Change the frontend without changing the database structure.
- Add additional sensors.
- Support multiple IoT devices.
- Add mobile applications.
- Expand the backend API as requirements grow.

## 📄 License

This project is currently an academic/project development system.

License information can be added when the project's distribution terms are finalized.

---

## 💧 HydroGuard

**Smart Water Monitoring & Management System**

> *Monitor. Protect. Manage.*
