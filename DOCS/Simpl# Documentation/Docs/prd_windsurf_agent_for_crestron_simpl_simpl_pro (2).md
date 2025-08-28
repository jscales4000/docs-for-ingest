# Product Requirements Document (PRD)
**Product Name:** Windsurf Agent for Crestron SIMPL# / SIMPL# Pro  
**Owner:** Jordan + AI Dev Tools  
**Doc Purpose:** Give an AI coding agent everything it needs to reliably generate, refactor, and ship SIMPL# Libraries, SIMPL# Pro Programs, and small feature drivers using the official Crestron APIs and patterns.

---

## 1) Problem & Goals
### Problem
Crestron development spans multiple runtimes (SIMPL#, SIMPL# Pro) with device-heavy APIs, event-driven flows, and strict packaging/registration rules. New work often repeats scaffolding patterns (ControlSystem boot, device registration, sockets, serial, feedback events, logging).

### Goals (what success looks like)
- **G1. Scaffolding:** Agent can generate ready-to-build projects for:
  - **SIMPL# Library** (.CLZ) for 3‑Series/SIMPL wrappers
  - **SIMPL# Pro Program** for 4‑Series & VC‑4
- **G2. Device Control:** Agent can add and register common devices (DM, UI panels, lighting, audio, IR, etc.), bind events, map feedback, and expose simple service methods.
- **G3. I/O Robustness:** Agent handles TCP/UDP, serial COM ports, and IR output with queues, timeouts, reconnects, and telemetry.
- **G4. Testability:** Agent produces parsers/state machines that are unit-testable; provides a smoke-test harness.
- **G5. Operability:** Built-in logging, health signals (online state, last error), and safe shutdown.

### Non‑Goals
- Full Certified Driver submission workflows (portal/legal).  
- CH5/Smart Graphics UI authoring beyond minimal sample joins.

---

## 2) Target Platforms & Build Matrix
- **SIMPL# Library** (consumed by SIMPL/SIMPL+)
  - Output: **.CLZ**
  - Public interface must use primitives/arrays for SIMPL+ wrappers
- **SIMPL# Pro Program** (4‑Series, VC‑4)
  - Output: Program package deployed to controller/VC‑4
  - Entrypoint: `ControlSystem : CrestronControlSystem` with `InitializeSystem()`
- **.NET Targeting**
  - SIMPL# Pro API supports modern .NET (e.g., classes show support in **.NET 6** and **.NET CF 3.5** where applicable)

---

## 3) Personas & Use Cases
- **Integrator/Programmer:** Needs boilerplate for devices, transports, and reliable feedback mapping.
- **Sales Engineer/POC Builder:** Spins up demos (e.g., AirMedia Canvas toggling, switch routes, touch panel joins) quickly.

**Top Use Cases**
1. Create a skeleton **S# Pro** program that registers a touch panel, a DM switch, and an IR output; subscribes to `Sig` events; exposes service methods.
2. Add a TCPClient-based device service with command queue, `SendData`, RX parser, and reconnect.
3. Configure a serial `ComPort` with one-shot spec struct, map responses to feedback.
4. Control AirMedia Input slot (enable/disable Canvas, read connection address and status).

---

## 4) Functional Requirements
### F1. Project Scaffolding
- **F1.1** Generate **S# Pro** skeleton with:
  - `ControlSystem` subclass with `InitializeSystem()`
  - Device registration pattern (constructor → create devices → `Register()`)
  - Central `ErrorLog` logger wrapper and health object (uptime, last error)
- **F1.2** Generate **SIMPL# Library** project with public, primitive-only API surface and events for feedback.

### F2. Device Layer
- **F2.1** **Touch Panels (e.g., TS‑770)**: construct with IPID + `CrestronControlSystem`; bind `Sig` events (`SigEventArgs`).
- **F2.2** **DM / Video Windowing / Streaming**: instantiate classes, subscribe to device events (e.g., `WindowLayoutChange`, `AttributeChange`) and provide helper methods for switching.
- **F2.3** **Lighting/Relays (e.g., GLPP)**: register devices, wire standard events (online, button state, load state).
- **F2.4** **IR Output**: load/unload IR drivers; `Press`, `PressAndRelease`, `Release`; optional serial IR.

### F3. Transports & I/O
- **F3.1 TCP (client)**: Use `TCPClient` with `SendData(...)`, async read, and `Dispose()`; implement backoff/retry, heartbeat.
- **F3.2 TCP (secure/server)**: Provide `SecureTCPServer` helpers when needed.
- **F3.3 Serial**: Use `ComPort` with `ComPortSpec` for baud/params; open, read/write, and event routing.
- **F3.4 UDP**: Basic socket wrapper for discovery/status beacons.

### F4. Feedback & Events
- **F4.1** Standardize subscriptions: online/offline, attribute change, window/layout change, stream change.
- **F4.2** Normalize device feedback into DTOs and push to logs + optional UI serial joins.
- **F4.3** For AirMedia Input slot, surface: connection address, login code/mode, users connected/presenting, canvas enable/disable, and adapter index where supported.

### F5. AirMedia Canvas Controls (if device present)
- **F5.1** Methods: `CanvasEnable()`, `CanvasDisable()`, `AssignLanEnable/Disable()`, `AssignWlanEnable/Disable()`
- **F5.2** eCanvasOptions: allow **AllSourceTypes**, **NetworkSourceTypes**, **NA**
- **F5.3** Feedback mapping: status, number of users, error feedback, hostname/IP, and reboot required flag.

### F6. Logging & Telemetry
- **F6.1** Structured logger with severity → controller console/syslog
- **F6.2** Correlate TX commands with RX responses; include durations and timeout causes

### F7. Config & Secrets
- **F7.1** JSON/INI config on controller flash with defaulting/validation
- **F7.2** Mask secrets in logs; provide reset-to-defaults path

### F8. Testing
- **F8.1** Unit tests for parsers/state machines
- **F8.2** Smoke test task: device boot, route, feedback, error path (network flap)

---

## 5) Non‑Functional Requirements
- **NFR1 Reliability:** Reconnect within 5–15s with jitter; circuit-breaker after repeated failures.
- **NFR2 Performance:** Command queue guarantees in‑order writes; parse loop non-blocking.
- **NFR3 Maintainability:** Layering (Transport → Protocol → Service → App), one class per file, consistent naming.

---

## 6) Technical Background & Canonical APIs (for the Agent)
> This section lists concrete API anchors the agent can rely on while generating code.

### 6.1 Control System & Device Construction
- Devices commonly accept `CrestronControlSystem` in constructors and must be **registered**; common patterns rely on overrides inside `ControlSystem.InitializeSystem()`.

### 6.2 Touch Panel & Sig Events
- `Ts770(ipid, CrestronControlSystem)` example constructor.  
- `SigEventArgs` to inspect changed joins and values.

### 6.3 TCP Sockets
- `Crestron.SimplSharp.CrestronSockets.TCPClient` exposes properties (e.g., local IP/port) and `SendData(...)` overloads; proper disposal via `Dispose()`.

### 6.4 Serial Ports
- `ComPort.ComPortSpec` to set baud/parity/stop/handshake in a single struct; apply before open.

### 6.5 IR Output
- `IROutputPort` supports driver load/unload, and methods such as `Press`, `PressAndRelease`, `Release`, plus command discovery helpers.

### 6.6 AirMedia Input Slot
- `AirMediaInputSlot` exposes Canvas controls, connection/hostname/login feedbacks, user counts, and an `AirMediaChange` event; `eCanvasOptions` enumerates allowed Canvas modes.

---

## 7) Agent Design (Implementation Plan)
### 7.1 Generators
- **S# Pro Starter**: emits ControlSystem class, registration of optional devices (panel, DM switch, an IR output), default log scaffolding, and task scheduler (`CTimer`).
- **Transport Module**: emits TCP/Serial client with queue, timers, retry policy, and pluggable parser interface.
- **AirMedia Feature**: conditionally emits a service wrapping `AirMediaInputSlot` with enable/disable and feedback DTOs.

### 7.2 Conventions
- Names: `DeviceService`, `ConnectionState`, `SendCommandAsync`, `OnSigChanged`, `OnLineReceived`
- Folders: `App/`, `Devices/`, `Transports/`, `Services/`, `Util/`, `Config/`, `Tests/`

### 7.3 Error Strategy
- All I/O calls wrapped with cancellation/timeout; retries with exponential backoff; emit status transitions `Offline → Connecting → Online → Fault`.

---

## 8) Deliverables
1. **Repo template** (S# Pro + optional SIMPL# Library variant)
2. **Build scripts** (`msbuild` / `dotnet build`) and VS solution
3. **README** with deployment steps (controller/VC‑4)
4. **Samples**: TCP device, serial device, AirMedia Canvas demo
5. **Tests**: parser unit tests + smoke test checklist

---

## 9) Acceptance Criteria
- Build in CI
- Boots and registers devices without exceptions
- TCP/Serial service recovers from link drop
- AirMedia Canvas toggles and reports feedback when present
- Logs show command/response pairs with durations

---

## 10) Open Questions / Risks
- Exact controller mix (CP4 vs VC‑4) for final delivery?
- Any CH5/GUI integration required beyond basic serial joins?
- Driver packaging scope (not covered here) if we pivot to Certified Drivers.

---

## Appendix A — API Anchors (for further reading while coding)
(Agent should prefer current help.crestron.com pages for specifics.)
- **TCPClient**: properties (`LocalPortNumberOfClient`), `SendData(...)`, and `Dispose()`
- **SigEventArgs**: inspect Sig changes
- **ComPort.ComPortSpec**: serial spec struct
- **IROutputPort**: IR driver load/unload and send
- **AirMediaInputSlot & eCanvasOptions**: Canvas control and feedback
- **Video Windowing**: multi-window processors raise layout/overlay change events

— End of PRD —

