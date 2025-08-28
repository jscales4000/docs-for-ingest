# SIMPL# / SIMPL# Pro — Namespace Catalog
*A single, AI‑readable reference of the namespaces exposed by Crestron SIMPL# and SIMPL# Pro (plus notable auxiliary namespaces). Use this to pick the right API surface while generating code.*

> **Structure per entry**
> - **Scope/Role** — what this namespace covers
> - **Key types** — representative classes/enums
> - **Typical uses** — common tasks
> - **Notes** — gotchas, version hints

---

## Table of Contents
- [Core SIMPL#](#core-simpl)
  - [Crestron.SimplSharp](#crestronsimplsharp)
  - [Crestron.SimplSharp.CrestronSockets](#crestronsimplsharpcrestronsockets)
  - [Crestron.SimplSharp.CrestronIO](#crestronsimplsharpcrestronio)
  - [Crestron.SimplSharp.CrestronXml](#crestronsimplsharpcrestronxml)
  - [Crestron.SimplSharp.CrestronXmlLinq](#crestronsimplsharpcrestronxmllinq)
  - [Crestron.SimplSharp.Net](#crestronsimplsharpnet)
  - [Crestron.SimplSharp.WebScripting](#crestronsimplsharpwebscripting)
  - [Crestron.SimplSharp.Cryptography](#crestronsimplsharpcryptography)
  - [Crestron.SimplSharp.Reflection](#crestronsimplsharpreflection)
  - [Crestron.SimplSharp.Ssh](#crestronsimplsharpssh)
  - [Crestron.SimplSharp.Ssh.Common](#crestronsimplsharpsshcommon)
  - [Crestron.SimplSharp.Ssh.Sftp](#crestronsimplsharpsshsftp)
  - [Crestron.SimplSharp.SQLite](#crestronsimplsharpsqlite)
  - [Crestron.SimplSharp.CrestronData.Common](#crestronsimplsharpcrestrondatacommon)
  - [Crestron.SimplSharp.AutoUpdate](#crestronsimplsharpautoupdate)
- [SIMPL# Pro](#simpl-pro)
  - [Crestron.SimplSharpPro](#crestronsimplsharppro)
  - [Crestron.SimplSharpPro.DeviceSupport](#crestronsimplsharpprodevicesupport)
  - [Crestron.SimplSharpPro.UI](#crestronsimplsharpproui)
  - [Crestron.SimplSharpPro.DM](#crestronsimplsharppro-dm)
    - [Crestron.SimplSharpPro.DM.VideoWindowing](#crestronsimplsharppro-dm-videowindowing)
    - [Crestron.SimplSharpPro.DM.Streaming](#crestronsimplsharppro-dm-streaming)
    - [Crestron.SimplSharpPro.DM.Endpoints.Receivers](#crestronsimplsharppro-dm-endpoints-receivers)
  - [Crestron.SimplSharpPro.CrestronConnected](#crestronsimplsharpprocrestronconnected)
  - [Crestron.SimplSharpPro.AudioDistribution](#crestronsimplsharpproaudiodistribution)
  - [Crestron.SimplSharpPro.GeneralIO](#crestronsimplsharpprogeneralio)
  - [Crestron.SimplSharpPro.Lighting](#crestronsimplsharpprolighting)
  - [Crestron.SimplSharpPro.Remotes](#crestronsimplsharpproremotes)
  - [Crestron.SimplSharpPro.ZumWiredSupport](#crestronsimplsharpprozumwiredsupport)
- [Device Support (non-Pro)](#device-support-non-pro)
  - [Crestron.DeviceSupport.Support](#crestrondevicesupportsupport)
- [Auxiliary/3rd‑party namespaces shipped in distribution](#auxiliary3rd-party-namespaces)
  - [Independentsoft.Exchange](#independentsoftexchange)

---

## Core SIMPL#

### Crestron.SimplSharp
**Scope/Role**: Core runtime utilities, threading, timers, environment, console, networking helpers, error logging.

**Key types**: `CTimer`, `ErrorLog`, `CrestronConsole`, `InitialParametersClass`, `CrestronEnvironment` (and `OSVersion`, `SystemInfo`, `MemoryInfo`), `CrestronQueue<T>`, `SimplSharpString`, `SNTP`, `Stopwatch`.

**Typical uses**: event timers, logging, console commands, environment detection, basic threading/synchronization.

**Notes**: Many classes are firmware‑aware (e.g., logging routes to remote syslog when enabled). Some features may differ on VC‑4 vs hardware.

---

### Crestron.SimplSharp.CrestronSockets
**Scope/Role**: TCP/UDP client/server sockets (secure and non‑secure) and async callback delegates.

**Key types**: `TCPClient`, `TCPServer`, `SecureTCPServer`, `UDPServer` + delegate types for connect/receive/send and socket status.

**Typical uses**: device drivers over IP, custom protocols, broadcast listeners.

**Notes**: Secure servers/clients depend on controller SSL configuration/certificates.

---

### Crestron.SimplSharp.CrestronIO
**Scope/Role**: File/stream/reader/writer APIs and application directories.

**Key types**: `Stream`, `StreamReader`, `StreamWriter`, `Directory` (e.g., `GetApplicationDirectory()`), `File`, `TextReader`/`TextWriter`.

**Typical uses**: reading/writing config, logs, assets; resolving controller storage paths.

**Notes**: Prefer removable media for heavy writes; manage lifetime of streams carefully on embedded storage.

---

### Crestron.SimplSharp.CrestronXml
**Scope/Role**: XML reader/writer/DOM APIs compatible with SIMPL#.

**Key types**: `XmlReader`, `XmlWriter`, `XmlNode`, `XmlElement`, `XmlReaderSettings`, `XmlNodeList`.

**Typical uses**: parse device XML, config files, simple SOAP/REST payloads.

**Notes**: XPath support via namespace managers; be mindful of memory on large docs.

---

### Crestron.SimplSharp.CrestronXmlLinq
**Scope/Role**: LINQ‑to‑XML style APIs.

**Key types**: `XElement`, `XDocument`, `XAttribute` and helpers like `GetNamespaceOfPrefix`.

**Typical uses**: declarative XML creation/manipulation.

**Notes**: Interoperates with `CrestronXml` DOM types when converting.

---

### Crestron.SimplSharp.Net
**Scope/Role**: Networking helpers (HTTP auth kinds, etc.).

**Key types**: `AuthMethod` (e.g., `BASIC`), related net enums/utilities.

**Typical uses**: HTTP client configuration, auth mode selection.

**Notes**: For raw sockets use `CrestronSockets`; higher‑level HTTP APIs may surface under other namespaces depending on SDK version.

---

### Crestron.SimplSharp.WebScripting
**Scope/Role**: CWS (Crestron Web Server) helpers and HTTP context/route utilities.

**Key types**: `HttpCwsContext`, `HttpCwsCookie`, `CwsRouteValueDictionary`.

**Typical uses**: building lightweight web endpoints for diagnostics/config.

**Notes**: Runs within controller web server constraints; avoid blocking.

---

### Crestron.SimplSharp.Cryptography
**Scope/Role**: Symmetric/legacy crypto wrappers (DES/3DES/RC2/SHA1) and hash/signature helpers.

**Key types**: `DES`, `DESCryptoServiceProvider`, `RC2`, `TripleDES`, `SHA1Managed`, `SymmetricAlgorithm`, `SignatureDescription`.

**Typical uses**: legacy device protocol auth, checksums, simple encryption at rest.

**Notes**: Prefer modern algorithms when available externally; store secrets via `CrestronSecureStorage`.

---

### Crestron.SimplSharp.Reflection
**Scope/Role**: Reflection surfaces adapted for SIMPL#.

**Key types**: `Assembly`, `Type` (as `CType`), `MethodInfo`, `PropertyInfo`, `FieldInfo`, `ConstructorInfo`, `Module`, `DefaultMemberAttribute`.

**Typical uses**: plugin discovery, metadata, dynamic binding.

**Notes**: Feature set is a subset of desktop .NET; verify availability on target platform.

---

### Crestron.SimplSharp.Ssh
**Scope/Role**: SSH client abstractions and shell stream.

**Key types**: `ShellStream` and SSH client base classes.

**Typical uses**: automate SSH‑based devices (shell commands/interactive sessions).

**Notes**: Combine with parsers/queues; manage authentication and timeouts.

---

### Crestron.SimplSharp.Ssh.Common
**Scope/Role**: Shared primitives for SSH (async results, buffers, etc.).

**Key types**: `AsyncResult<T>`, common error/utility types.

**Typical uses**: underpinning for SSH operations and callbacks.

**Notes**: Internal helper layer typically used indirectly.

---

### Crestron.SimplSharp.Ssh.Sftp
**Scope/Role**: SFTP client operations and async results.

**Key types**: `SftpClient`, `SftpDownloadAsyncResult`, directory listing and transfer helpers.

**Typical uses**: move files to/from devices over SFTP (logs, configs, firmware).

**Notes**: Ensure permissions/paths; consider bandwidth/latency.

---

### Crestron.SimplSharp.SQLite
**Scope/Role**: ADO.NET‑style SQLite provider tailored for SIMPL#.

**Key types**: `SQLiteConnection`, `SQLiteCommand`, `SQLiteDataAdapter`, `SQLiteDataReader`, `SQLiteTransaction`, `SQLiteParameter`, `SQLiteException` + enums (`SQLiteJournalModeEnum`, `SQLiteExecuteType`, etc.).

**Typical uses**: local databases for settings, history, caching.

**Notes**: Prefer removable media for DB files; watch write‑amplification.

---

### Crestron.SimplSharp.CrestronData.Common
**Scope/Role**: ADO.NET base abstractions mirrored for SIMPL#.

**Key types**: `DbConnection`, `DbCommand`, `DbCommandBuilder`, `DbDataAdapter`, `DataSet`, `CommandBehavior`.

**Typical uses**: used by SQLite provider and any DB abstractions.

**Notes**: Typically consumed indirectly via provider namespaces (e.g., SQLite).

---

### Crestron.SimplSharp.AutoUpdate
**Scope/Role**: Auto‑update discovery/status types.

**Key types**: `InitialUpdateInformationEventArgs` (e.g., `DevicesFound`), related discovery models.

**Typical uses**: firmware/app update discovery workflows.

**Notes**: Controller/firmware dependent.

---

## SIMPL# Pro

### Crestron.SimplSharpPro
**Scope/Role**: Base classes, device registration, signals, program lifecycle.

**Key types**: `CrestronControlSystem` (program entry), `GenericBase`/`GenericDevice` (device hierarchy), `SigEventArgs`, `ComPort` (`ComPortSpec`).

**Typical uses**: main S# Pro program shell; device registration and system integration.

**Notes**: Always `Register()` devices; wire `SigChange`/events in `InitializeSystem()`.

---

### Crestron.SimplSharpPro.DeviceSupport
**Scope/Role**: Common device extenders/reserved joins, VOIP/auto‑update helpers, output mixers, etc.

**Key types**: `Tswx52VoipReservedSigs`, `OutputMixerBase` (and `UserSpecifiedObject`), `AutoUpdateReservedSigs`, numerous extender/event‑ID classes.

**Typical uses**: add capabilities to touch panels and devices (VOIP, system reserved joins, etc.).

**Notes**: Many members surface as input/output sigs; consult device family docs for applicability.

---

### Crestron.SimplSharpPro.UI
**Scope/Role**: Touch panels (TS‑series, TSW, DGE), XPanel, Capture HD, and UI‑specific reserved joins/events.

**Key types**: `Ts770`, `CaptureHd`, `Dge100ApplicationControlReservedSigs`, base classes for various panels.

**Typical uses**: instantiate panels, handle `SigChange`, manage UI behaviors.

**Notes**: Requires IPID and control system instance; some features only on certain models.

---

### Crestron.SimplSharpPro.DM
**Scope/Role**: DigitalMedia device tree (switchers, endpoints, cards, streaming, windowing).

**Key types**: Root namespace for `DM` families (sub‑namespaces below).

**Typical uses**: route audio/video, subscribe to device/attribute changes.

**Notes**: DM has many model‑specific classes—use the correct sub‑namespace.

#### Crestron.SimplSharpPro.DM.VideoWindowing
**Scope/Role**: Multi‑window processors (e.g., HD‑WP‑4K‑401‑C) and overlay/layout events.

**Key types**: `HdWp4k401C` and nested `Inputs`/`Outputs` classes; events: `WindowLayoutChange`, `OverlayPropertiesChange`, `StreamChange`.

**Typical uses**: control layout presets, monitor stream/CEC changes.

**Notes**: Subscribes to many events; ensure handlers are efficient.

#### Crestron.SimplSharpPro.DM.Streaming
**Scope/Role**: NVX and related streaming endpoints/control classes.

**Key types**: `DmNvxControl`, stream control/feedback.

**Typical uses**: start/stop streams, manage encoders/decoders.

**Notes**: Model‑specific; verify supported properties per device.

#### Crestron.SimplSharpPro.DM.Endpoints.Receivers
**Scope/Role**: DM receivers such as `DmRmcScalerC`.

**Key types**: Receiver device classes with scaler/OSD/CEC features.

**Typical uses**: register endpoints, manage HDMI/CEC, route inputs/outputs.

**Notes**: Some models require companion switcher/cards.

---

### Crestron.SimplSharpPro.CrestronConnected
**Scope/Role**: Crestron Connected AVR/zone devices.

**Key types**: Zone/tuner/media player base classes; `CrestronConnectedAvrZone` (e.g., `AvailableVideoTypesFeedback`).

**Typical uses**: monitor/select inputs, volume/power control, feedback.

**Notes**: Uses strongly‑typed `*_Feedback` signals; ensure device capabilities.

---

### Crestron.SimplSharpPro.AudioDistribution
**Scope/Role**: Distributed audio DSPs/zones and mixers.

**Key types**: `DSPAudio` (with `Owner`), mixer base classes.

**Typical uses**: route audio, manage inputs/outputs, link state.

**Notes**: Pay attention to event lifecycles and parent/owner relationships.

---

### Crestron.SimplSharpPro.GeneralIO
**Scope/Role**: General sensors/IO devices (occupancy, relays, partitions, doorbells, etc.).

**Key types**: `GlsOccupancySensorBase` (e.g., `RemoteTimeout`), `AxxessPIC` doorbell chime, GLS family devices.

**Typical uses**: read/write general IO, trigger logic based on sensors.

**Notes**: Many classes fire `BaseEvent`; check event IDs for semantics.

---

### Crestron.SimplSharpPro.Lighting
**Scope/Role**: DIN lighting modules, motors/shades, loads.

**Key types**: `DinMotor` (via `MotorBase`), other DIN lighting device classes.

**Typical uses**: control loads, motors, monitor movement/state.

**Notes**: Device model coverage varies; confirm owner relationships.

---

### Crestron.SimplSharpPro.Remotes
**Scope/Role**: Handheld remotes (HR‑1x0, MLX‑3, UFO‑WPR‑3ER, WPR‑48) and their pages/events.

**Key types**: `Hr100`, `Hr150`, `UfoWpr3er*`, `Wpr48`, numerous `*EventIds` and page classes.

**Typical uses**: handle button/sig events, RF reserved sigs, page navigation.

**Notes**: Some features are IR‑only in S# Pro; device registration rules vary by gateway.

---

### Crestron.SimplSharpPro.ZumWiredSupport
**Scope/Role**: Zūm Wired common interfaces and event IDs.

**Key types**: `IZumWiredCommon`, `ZumWiredCommonEventIds`.

**Typical uses**: implement common behaviors for Zūm Wired devices.

**Notes**: Primarily interface/event scaffolding; concrete devices reside elsewhere.

---

## Device Support (non-Pro)

### Crestron.DeviceSupport.Support
**Scope/Role**: Device support helpers usable across platforms; currently includes the AirMedia input slot abstraction.

**Key types**: `AirMediaInputSlot`, `AirMediaInputSlot.eCanvasOptions`.

**Typical uses**: query/toggle AirMedia Canvas, receive `AirMediaChange` events on supported models.

**Notes**: Availability depends on device (e.g., AM‑200/300/3000/3100/3200 etc.).

---

## Auxiliary/3rd‑party namespaces

### Independentsoft.Exchange
**Scope/Role**: Exchange Web Services (EWS) types used by mail/calendar integrations.

**Key types**: `UserResponse`, `UserSetting`, `UserSettingList`, `WebClientUrl`, `WebProtocol`.

**Typical uses**: EWS autodiscover/queries when building mail‑aware solutions.

**Notes**: Shipped for compatibility; not core to most control workflows.

---

## Notes on Versioning
- Many pages indicate **.NET 6** and **.NET CF 3.5** support; S# Pro on 4‑Series/VC‑4 typically targets modern .NET when using current SDKs.
- Some APIs are not supported on Server/VC‑4 (e.g., certain Cresnet helpers). Always check per‑type notes.

---

## Using this Catalog
1. Pick the **namespace** based on task (e.g., sockets → `Crestron.SimplSharp.CrestronSockets`).
2. Use the **Key types** as anchors for IntelliSense/discovery.
3. Follow PRD best‑practices for timers, queues, and event handling.

