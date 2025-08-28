# Crestron SIMPL# Namespaces Details

This document compiles details on various namespaces in the Crestron SIMPL# API, based on available documentation from the Crestron help site. Note that some namespaces may have limited information due to retrieval constraints, but the structure follows the requested format. Namespaces are listed alphabetically for ease of reference.

## Crestron.DeviceSupport.Support

This namespace contains types related to device support, particularly for AirMedia functionality, including classes and enumerations for handling AirMedia input slots and related options.

### Classes
- AirMediaInputSlot: Air media Input slot class. This is used for devices where Air Media is available as a built in slot. It fires the GenericEventHandler when available as a slot on a device. This class also fires the AirMediaChange event for specific models: "AM-200", "AM-300", "AM-3000", "AM-3100", and "AM-3200".

### Enums
- AirMediaInputSloteCanvasOptions: Enumeration to define the available AirMedia Canvas options.

## Crestron.SimplSharp

Crestron.SimplSharp is the API to create SIMPL# libraries using Visual Studio 2008 and the Crestron SIMPL# compiler. A SIMPL# Library (.CLZ) may be referenced from a SIMPL+ program module (.USP), and that referenced from a SIMPL program (.SMW) to create a Series 3 / LOGOS Control System program (.LPZ).

 (Detailed types list not available in retrieved data; typically includes core classes like CrestronConsole, CTimer, CrestronThread, etc.)

## Crestron.SimplSharp.CrestronIO

This namespace provides classes for input/output operations, similar to System.IO in .NET, adapted for Crestron environments.

 (Detailed types list not available; includes classes like Directory, File, Stream, etc.)

## Crestron.SimplSharp.CrestronXml

This namespace provides classes for XML parsing and manipulation, adapted for Crestron.

 (Detailed types list not available; includes classes like XmlReader, XmlWriter, XmlDocument, etc.)

## Crestron.SimplSharp.Cryptography.X509Certificates

This namespace provides classes and enumerations for working with X.509 certificates and related cryptographic operations.

### Classes
- CryptographicException: The exception that is thrown when an error occurs during a cryptographic operation.
- X509Certificate: Provides methods that help you use X.509 v.3 certificates.
- X509Certificate2: Represents an X.509 certificate. This class cannot be inherited.
- X509Certificate2Collection: Represents a collection of X509Certificate2 objects. This class cannot be inherited.
- X509CertificateCollection: Defines a collection that stores X509Certificate objects.
- X509Store: Represents an X.509 store, which is a physical store where certificates are persisted and managed. This class cannot be inherited.

### Enums
- OpenFlags: Specifies the way to open the X.509 certificate store.
- StoreLocation: Specifies the location of the X.509 certificate store.
- StoreName: Specifies the name of the X.509 certificate store to open.
- X509FindType: Specifies the type of value searched for by the X509Certificate2Collection.Find method.

## Crestron.SimplSharp.Net.Http

This namespace provides classes for HTTP communication, adapted for Crestron.

 (Detailed types list not available; includes classes like HttpClient, HttpHeaders, etc.)

## Crestron.SimplSharp.Net.Https

This namespace provides classes for HTTPS communication.

 (Detailed types list not available; similar to Http but for secure connections.)

## Crestron.SimplSharp.WebScripting

This namespace provides classes for web scripting and server functionality in Crestron systems.

 (Detailed types list not available; includes classes like HttpServer, HttpContext, etc.)

## Crestron.SimplSharpPro

This namespace is the root for SIMPL# Pro, allowing full C# programs for Crestron control systems.

 (Detailed types list not available; includes base classes like CrestronControlSystem, GenericBase, etc.)

## Crestron.SimplSharpPro.AudioDistribution

This namespace contains classes for audio distribution in Crestron systems.

 (Detailed types list not available; includes classes like DSPAudio, etc.)

## Crestron.SimplSharpPro.CrestronConnected

This namespace contains classes for Crestron Connected devices.

 (Detailed types list not available; includes classes like CrestronConnectedAvrZone, etc.)

## Crestron.SimplSharpPro.DM

This namespace contains classes, interfaces, structs, enums, and delegates related to DigitalMedia (DM) functionality, including audio, video, and control features for various DM devices and switchers.

### Classes
- AdvDmOutputCardDmPort: The DM output port with Enable and Disable.
- AnalogEventIds: Event Ids for Analog Audio Input change events on the HD-RX-4K-X10 switches.
- Audio: Classes related to analog audio features on DM.
- Audio.Comp: Audio input port compensation control, triggers DMInputChange event.
- Audio.Input: Audio input port, triggers DMInputChange event.
- Audio.Output: Audio output port.
- Audio.OutputAdvanced: Audio output with expanded functionality.
- Audio.OutputAdvancedWithAuxOutput: Audio output with auxiliary output.
- AudioInput: Audio input class.
- AudioInputPort: Analog Audio input port.
- AudioInputPortEx: Describes an audio port with gain, audio format, and number of channels.
- AudioOutput: Audio output class.
- AudioSource: Audio source control for StreamingSources.
- AudioSource.eAudioFormat: Enumeration for audio formats.
- BladeSwitch: Base class for blade based switchers.
- CameraInput: Camera VideoControls.
- Cec: Represents HDMI ports' ability to send and receive CEC messages.
- CecChangeEventHandler: Delegate for CEC change events.
- CecEventArgs: CEC event arguments to describe what about the CEC information has changed.
- CecEventIds: Valid event ids the CEC object can have.
- Component: Component input group.
- ConnectedDeviceChangeEventHandler: Delegate for connected device change events.
- ConnectedDeviceEventArgs: Connected device event arguments, used with DeviceInformationChange event.
- ConnectedDeviceEventIds: Event ids for feedbacks in the ConnectedDeviceInformation class, triggers DeviceInformationChange event.
- ConnectedDeviceInformation: Provides information about the device connected to a stream, triggers DeviceInformationChange event.
- DgeHdmiVideoControls: Video controls for the Dge Hdmi streams.
- DgeTpmcRgbVideoControls: Video controls for the Dge Rgb streams.
- Dm8x14k: The base class for the DmMd8x14kC and the HdMd8x14k classes.
- DmBladeCardBase: Base class for all DM Blade cards.
- DmCardStreamBase: Base class for all DM streams that are part of switchers.
- DMInput: DMinput base class.
- DMInputEventArgs: Service DM Input Events.
- DMInputEventIds: DM Input Event Enums.
- DMInputOutputBase: Base class for input/output types.
- DMInputPort: DM input stream.
- DMInputPortWithCable: DM input stream with cable info (DMC_CAT).
- DMInputPortWithCec: DM input stream with CEC support.
- DmMd128x128: The DM-MD128x128 switcher for large-scale projects integrating video, audio, networking, and control.
- DmMd16x16: Crestron DigitalMedia switcher for audio-follows-video and stereo matrix switching.
- DmMd16x16Cpu3: Crestron DigitalMedia switcher with CPU3 card, for audio-follows-video and stereo matrix switching.
- DmMd16x16Cpu3rps: DM-MD-Series switcher with RPS, provides audio-follows-video and stereo matrix switching, two internal 12VDC power supplies.
- DmMd16x16rps: DM-MD-Series switcher with RPS, provides audio-follows-video and stereo matrix switching, two internal 12VDC power supplies.
- DmMd32x32: Crestron DigitalMedia switcher for audio-follows-video and stereo matrix switching.
- DmMd32x32Cpu3: Crestron DigitalMedia switcher with CPU3 card, for audio-follows-video and stereo matrix switching.
- DmMd32x32Cpu3rps: DM-MD-Series switcher with RPS, provides audio-follows-video and stereo matrix switching, three internal 12VDC power supplies.
- DmMd32x32rps: DM-MD-Series switcher with RPS, provides audio-follows-video and stereo matrix switching, three internal 12VDC power supplies.
- DmMd4kDmHdmiAudioOutput: DM-MD8X1-4K-C DM/HDMI/Audio output.
- DmMd64x64: The DM-MD64x64 switcher for large-scale projects integrating video, audio, networking, and control.
- DmMd6x1: The DM-MD6x1 audio/video switcher with digital, analog, and DM CAT inputs and outputs.
- DmMd6x4: The DM-MD6x4 DigitalMedia 8G+ audio/video switcher and distribution center.
- DmMd6x6: The DM-MD6x6 DigitalMedia 8G+ audio/video switcher and distribution center.
- DmMd6XN: Base class for DM_MD6x1 (truncated in retrieval).

### Delegates
- CecChangeEventHandler: Delegate for CEC change events.
- ConnectedDeviceChangeEventHandler: Delegate for connected device change events.

### Enums
- AudioSource.eAudioFormat: Enumeration for audio formats.
- CecEventIds: Valid event ids for CEC.
- ConnectedDeviceEventIds: Event ids for connected device information.
- DMInputEventIds: DM Input Event Enums.

## Crestron.SimplSharpPro.DM.VideoWindowing

This namespace contains classes for video windowing in DigitalMedia systems.

 (Detailed types list not available; likely includes classes for window control and layouts.)

## Crestron.SimplSharpPro.Keypads.CresnetConnected

This namespace contains types for Cresnet connected keypads.

### Classes
- C2nConnectedChip: Class for connected chip.
- C2nGenericKeypad: Class for generic keypad.

## Crestron.SimplSharpPro.Lighting.Metering

This namespace contains classes for lighting metering.

 (Detailed types list not available; includes classes like Phase.)

## Crestron.SimplSharpPro.UI

This namespace contains classes for user interfaces in Crestron systems, including touchpanels and extenders.

 (Detailed types list not available; includes classes like Tpmc12Base, Dge100ApplicationControl, etc.)

Note: This document is based on available retrieved data from the Crestron SIMPL# API documentation. Some namespaces and types may be incomplete due to limitations in accessing full page contents. For complete details, refer to the official Crestron help site.