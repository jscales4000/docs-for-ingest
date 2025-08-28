# SIMPL# / SIMPL# Pro — Unabridged API Field Guide (AI Training Edition)

> **Purpose**: A single, AI‑readable Markdown that maps the Crestron SIMPL# & SIMPL# Pro landscape: namespaces → classes/enums/structs → key members you actually use. Where the official docs enumerate large member sets, this file links or summarizes only verified members. Use together with the **PRD** and **Namespace Catalog** in this project.

> **Versioning note**: Many types indicate support for **.NET 6** and **.NET Compact Framework 3.5** on their pages. Always verify a device’s exact firmware and SDK version in your build environment.

---

## 1) Core SIMPL# Namespaces

### 1.1 `Crestron.SimplSharp`

**Role**: Core runtime utilities, threading, timers, environment, console, networking helpers, error logging.

**Representative classes (from official index):**

- Synchronization & threading: `CCriticalSection`, `CEvent`, `CEventHandle`, `CMonitor`, `CMutex`, `CNamedEvent`, `CNamedMutex`
- Console & logging: `CrestronConsole`, `ErrorLog`, `RemoteSysLogging`, `ICrestronConsole`
- System/env: `CrestronEnvironment` (with `OSVersion`, `MemoryInfo`, `SystemInfo`, `GC`), `InitialParametersClass`, `SystemSettingsStorage`, `TaskMonitor`
- Collections & primitives: `CrestronQueue`, `CrestronQueue<T>`, `SimplSharpString`, `ReadOnlyDictionary<TKey,TValue>`
- Time & events: `CTimer`, `Timeout`, `Stopwatch`, `ProgramStatusEventHandler`, `SystemEventHandler`
- Networking basics: `Dns`, `IPAddress`, `IPEndPoint`, `IPHostEntry`, `CrestronEthernetHelper`, `EthernetAutodiscovery`
- Storage/crypto/db: `CrestronSecureStorage`, `JsonDb`, `CrestronZIP`
- File transfer & mail: `CrestronFileTransferClient`, `CrestronMailFunctions`
- Exceptions: `SocketException`, `XmlException`

**Representative enumerations/delegates (from official index):**

- Enums: `AddressFamily`, `ConsoleAccessLevelEnum`, `eProgramStatusEventType`, `eSystemEventType`, `eRuntimeEnvironment`, `eDevicePlatform`, `EthernetAdapterType`, `CrestronEthernetHelper.*`, `JsonDb.*`, `CrestronZIP.ResultCode`, `eCrestronSecureStorageStatus`, etc.
- Delegates: `CTimerCallbackFunction`, `ProgramStatusEventHandler`, `EthernetEventHandler`, `SimplSharpProConsoleCmdFunction`, `CrestronPrintDelegate`, various `…Callback` delegates.

**Notable members you’ll actually call (selection):**

- `ErrorLog`: `Notice(...)`, `Warn(...)`, `Error(...)` — central logging.
- `CTimer`: construct timers and schedule callbacks (IDisposable).
- `CrestronConsole`: register CLI commands for diagnostics.
- `InitialParametersClass`: access `ProgramIDTag` and other startup context.
- `CrestronEthernetHelper`: port mapping, adapter info.
- `JsonDb`: lightweight key/value store for persistent settings.

---

### 1.2 `Crestron.SimplSharp.CrestronSockets`

**Role**: TCP/UDP client/server sockets (secure and non‑secure), async IO.

**Key classes**

- `TCPClient`
  - **Properties (examples)**: `IncomingDataBuffer`, `LocalAddressOfClient`, `LocalPortNumberOfClient` (valid once connected)
  - **Methods (examples)**: `SendData(byte[] data, int length)`, `SendData(byte[] data, int index, int length)`, `Dispose()`
- `SecureTCPServer`
  - **Notes**: Multi‑client Secure TCP server; requires controller SSL enabled; can default to control system certificate state.
- `TCPServer`, `UDPServer` (not expanded here)

**Usage pattern**

- Open/connect → non‑blocking reads → enqueue writes via `SendData(...)` → dispose on shutdown; add reconnect/heartbeat in app code.

---

### 1.3 `Crestron.SimplSharp.CrestronIO`

**Role**: Files/streams/paths.

- `Directory.GetApplicationDirectory()` → returns the working directory of the application.
- Standard `Stream`/`StreamReader`/`StreamWriter` wrappers for SIMPL#.

---

### 1.4 `Crestron.SimplSharp.CrestronXml` & `…CrestronXmlLinq`

**Role**: XML DOM + LINQ‑to‑XML.

- DOM: `XmlReader`, `XmlWriter`, `XmlReaderSettings`, `XmlNode`, `XmlElement`, `XmlNodeList`.
- LINQ: `XElement`, `XDocument`, `XAttribute`, helpers like `XElement.GetNamespaceOfPrefix(...)`.

---

### 1.5 `Crestron.SimplSharp.WebScripting`

**Role**: CWS (Crestron Web Server) request/response helpers.

- `CwsRouteValueDictionary` — case‑insensitive route values
- `HttpCwsContext` — request context
- `HttpCwsCookie` — cookie helper

---

### 1.6 `Crestron.SimplSharp.Cryptography`

**Role**: Crypto service providers (legacy DES/3DES families).

- `DES`, `DESCryptoServiceProvider`, `TripleDES`, `TripleDESCryptoServiceProvider`

---

### 1.7 `Crestron.SimplSharp.Reflection`

**Role**: Reflection surface adapted to SIMPL#.

- `Assembly`, `Type`/`CType`, `MethodInfo`, `PropertyInfo`, `FieldInfo`, `ConstructorInfo`, `Module`, `Activator`, `AmbiguousMatchException`, etc.

---

### 1.8 `Crestron.SimplSharp.Ssh` (+ `.Common`, `.Sftp`)

**Role**: SSH & SFTP support.

- `ShellStream` (interactive shell), `CipherInfo`
- `.Common`: `AsyncResult<TResult>` and helpers
- `.Sftp`: SFTP stream/read/write and transfer helpers

---

### 1.9 `Crestron.SimplSharp.SQLite` & `Crestron.SimplSharp.CrestronData.Common`

**Role**: Embedded DB provider & ADO.NET‑style bases.

- SQLite: `SQLiteConnection`, `SQLiteCommand`, `SQLiteDataAdapter`, `SQLiteDataReader`, `SQLiteTransaction`, `SQLiteParameter`, `SQLiteException`, plus enums like `SQLiteJournalModeEnum`, `SQLiteExecuteType`.
- Data.Common: `DbConnection`, `DbCommand`, `DbCommandBuilder`, `DbDataAdapter`, `DataSet`, `CommandBehavior` (usually consumed via SQLite provider).

---

## 2) SIMPL# Pro Namespaces (Program Model & Devices)

### 2.1 `Crestron.SimplSharpPro` (Program shell & core device base)

**Role**: Application entry point and device base hierarchy.

- **Program entry**: `CrestronControlSystem` (override constructor + `InitializeSystem()`)
- **Signals/events**: `SigEventArgs` (inspect changed joins), `BoolInputSig`, `BoolOutputSig`, `UShortInputSig`, `UShortOutputSig`, `SigGroup`, `SigIoMaskInvalidException`
- **Ports & IO**: `ComPort` (with `ComPortSpec` struct & `eCom*` enums), `Versiport` & event args
- **Common events/enums**: online/offline, system/base events, various device‑specific enums

> **Example constructor signature** (typical pattern in device classes) Many device constructors take an `IPID`/ID and a `CrestronControlSystem` instance, e.g. `Ts770(uint ipid, CrestronControlSystem controlSystem)`.

---

### 2.2 `Crestron.SimplSharpPro.DeviceSupport`

**Role**: Extenders, reserved sigs, VOIP helpers, mixers, etc.

- Examples: `Tswx52VoipReservedSigs`, `OutputMixerBase`, `AutoUpdateReservedSigs`, `TswFt5Button` (`ButtonStateChange` event), `UserSpecifiedObject` patterns.

---

### 2.3 `Crestron.SimplSharpPro.UI`

**Role**: Touch panels, DGE, Capture HD, XPanel, etc.

- Examples: `CaptureHd`, `CaptureHdPro`, `CrestronApp`, `Tsr310`, `Tsw5/7/7x/7xx/770/570…` devices.
- Panels raise `SigChange`, `ButtonStateChange`, and `DeviceExtenderSigChange` events.

---

### 2.4 `Crestron.SimplSharpPro.DM` (+ sub‑namespaces)

**Role**: DigitalMedia switchers, windowing, streaming, endpoints.

- **Video Windowing**: layout/overlay/stream change events on multi‑window processors.
- **Streaming**: `DmNvxControl` control class for NVX 35x families, with events and properties.
- **Endpoints.Receivers**: receiver/scaler classes with CEC/OSD.

---

### 2.5 Other device families

- ``: connected AVR/zone types (typed feedbacks for available video types, etc.)
- ``: distributed audio switchers/amps (e.g., `C2nAmp4X100`)
- ``: sensors/relays/partition modules (e.g., `GlsPartCn`) and event args/handlers
- ``: DIN and GLPP families (e.g., `Din8Sw8i`, `Glpp1Sw3Cn`) with rich property/method/event sets
- ``: HR/UFO/WPR handhelds (e.g., `Wpr48`); note IR‑only support in S# Pro for some models
- ``: interfaces & event IDs for Zūm Wired
- ``: CEN-IDOC/iServer browsing/transport helpers

---

## 3) Deep‑Dive Member Maps (Selected High‑Value Types)

> Below are **explicit member lists** for commonly used classes, as captured from the official docs. Use these as canonical signatures when coding.

### 3.1 `Crestron.SimplSharp.CrestronSockets.TCPClient`

**Properties (examples)**

- `IncomingDataBuffer` — buffer for incoming data
- `LocalAddressOfClient` — local IP address of the client
- `LocalPortNumberOfClient` — local port number (valid after connect)

**Methods (examples)**

- `SendData(byte[] data, int length)`
- `SendData(byte[] data, int index, int length)`
- `Dispose()` (and `Dispose(bool)`) — close and free resources

**Typical flow**

- Connect → begin async read loop → write via `SendData` → handle disconnects → `Dispose()` on shutdown

---

### 3.2 `Crestron.SimplSharp.CrestronSockets.SecureTCPServer`

**Notes**

- Multi‑client Secure TCP server
- Requires controller SSL enabled; uses control system cert when none provided
- Firmware requirement noted on official page

**Members**

- Async read function for single connected client (non‑blocking)

---

### 3.3 `Crestron.SimplSharpPro.ComPort.ComPortSpec`

**Purpose**: one‑shot configuration of serial port

**Usage**: set baud, parity, stop, handshake, then apply to `ComPort`

**Related enums**: `eComBaudRates`, `eComDataBits`, `eComParityType`, `eComHardwareHandshakeType`, `eComportCapabilities`

---

### 3.4 `Crestron.SimplSharpPro.IROutputPort`

**Common methods**

- `Press(uint slotOrIndex, string command, ushort time)` — send IR for a duration
- `PressAndRelease(uint slotOrIndex, string command, ushort time)` — fire and release
- `Release(uint slotOrIndex, string command)` — release if held
- `IsIRCommandAvailable(string command)` — check if command exists in current driver

**Typical flow**: load IR driver on the port/slot → validate via `IsIRCommandAvailable` → `Press` / `PressAndRelease`

---

### 3.5 `Crestron.SimplSharpPro.SigEventArgs`

**Role**: describes what changed on a device’s signals (joins)

**Usage**: inspect in your `SigChange` handlers to route UI → logic; provides access to changed sig and its new value/type

---

### 3.6 `Crestron.SimplSharpPro.UI.Ts770`

**Constructor (typical)**

```csharp
public Ts770(uint ipid, CrestronControlSystem controlSystem)
```

**Events**: `SigChange`, `ButtonStateChange`, `DeviceExtenderSigChange` (when extenders in use)

---

### 3.7 `Crestron.SimplSharpPro.DM.Streaming.DmNvxControl`

**Role**: control/feedback surface for NVX 35x family; triggers `BaseEvent`

**Members**: properties + methods for transport control and stream params (see official page when coding exact members)

---

### 3.8 `Crestron.SimplSharp.InitialParametersClass`

**Role**: static startup/environment parameters

**Useful member**

- `ProgramIDTag` — human‑readable program tag for diagnostics

---

### 3.9 `Crestron.SimplSharp.CTimer`

**Role**: embedded timer (IDisposable)

**Pattern**: construct with callback → start/stop/reset per your logic; ensure `Dispose()` during shutdown

---

## 4) Program Skeleton Checklists (for SIMPL# Pro)

1. Subclass `CrestronControlSystem`; wire `OnlineStatusChange`, `SigChange` handlers
2. Create devices with IDs (e.g., `Ts770` with IPID) and call `Register()`
3. For serial devices, configure `ComPortSpec` before opening
4. For IP devices, use `TCPClient`/queues; timebox all I/O; implement reconnect/backoff
5. Centralize logs with `ErrorLog`; include durations and last error text

---

## 5) Patterns: Sockets, Serial, IR, Panels

- **Sockets**: non‑blocking reads, back‑pressure on writes, `Dispose()` safely
- **Serial**: `ComPortSpec` → `Open` → line framing/parser → command queue
- **IR**: load driver → `IsIRCommandAvailable` → `Press/Release`
- **Panels**: map joins → `SigChange` → service methods → feedback to serial joins

---

## 6) Device Examples & Signatures (Grab‑and‑Go)

- **Lighting (DIN)**: `Din8Sw8i(uint cresnetId, CrestronControlSystem cs)` — supports .NET 6 and CF 3.5
- **General IO**: `GlsPartCn(uint cresnetId, CrestronControlSystem cs)` — partition sensor
- **Audio Distribution**: `C2nAmp4X100` — Cresnet audio matrix/amp

---

## 7) Appendix — Glossary of Frequently Seen Types

- **Signals**: `BoolInputSig`, `BoolOutputSig`, `UShortInputSig`, `UShortOutputSig`, `SigGroup`
- **Events**: `OnlineStatusChange`, `IpInformationChange`, `BaseEvent`, `ButtonStateChange`
- **Helpers**: `UserSpecifiedObject` (attach context), `OutputMixerBase` (audio)
- **Enums**: `CrestronControlSystem.eDmps34K50Outputs` and other device‑specific enums

---

## 8) How to Extend This File

When you add a device or API surface, include:

- Namespace path (e.g., `Crestron.SimplSharpPro.DM.Streaming`)
- Class signature(s) and constructor signatures
- Methods/Properties/Events (only verified ones)
- Short usage note and pitfalls

---

*End of Field Guide.*

