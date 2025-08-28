# Crestron SIMPL# Full Documentation

This Markdown file compiles an exhaustive collection of information on the Crestron SIMPL# API, based on available data from Crestron documentation, including namespaces, classes, methods, properties, events, fields, and more. The content is drawn from previous summaries, snippets from search results, and detailed extractions where available. Due to access limitations on some pages, not every member is fully detailed, but this aims to be as comprehensive as possible for training and mastery. The structure is organized by namespaces, then types, with members listed.

## Overview

SIMPL# is Crestron's .NET-based language for creating advanced modules and programs for control systems. It includes core .NET-like namespaces and Crestron-specific ones for hardware integration.

## Namespaces and Details

### Crestron.DeviceSupport.Support

Description: Contains types related to device support, particularly for AirMedia functionality, including classes and enumerations for handling AirMedia input slots and related options.

#### Classes

- **AirMediaInputSlot**

  Description: Air media Input slot class. This is used for devices where Air Media is available as a built in slot. It fires the GenericEventHandler when available as a slot on a device. This class also fires the AirMediaChange event for specific models: "AM-200", "AM-300", "AM-3000", "AM-3100", and "AM-3200".

  (Full members not extracted in detail; refer to general event handling in SIMPL#.)

#### Enums

- **AirMediaInputSloteCanvasOptions**

  Description: Enumeration to define the available AirMedia Canvas options.

### Crestron.SimplSharp

Description: The core namespace for SIMPL# libraries, allowing C# code for Crestron systems.

 (Detailed types: Core utilities like CrestronConsole, CTimer, CrestronThread, etc. Full list not available; see subnamespaces.)

### Crestron.SimplSharp.CrestronIO

Description: Provides classes for input/output operations, adapted for Crestron.

#### Classes

- **File**

  Methods:

  - Open(String, FileMode, FileAccess, FileShare): Opens a CrestronIO.FileStream on the specified path, having the specified mode with read, write, or read/write access and the specified sharing option.

### Crestron.SimplSharp.CrestronXml

Description: Provides classes for XML parsing and manipulation.

#### Classes

- **XmlReaderSettings**

  Properties:

  - ConformanceLevel: Gets or sets the level of conformance which the XmlReader will comply.

  - CloseInput: Gets or sets a value indicating whether the underlying stream or TextReader should be closed when the reader is closed.

- **XmlTextReader**

  Properties:

  - HasValue: Gets a value indicating whether the current node can have a XmlTextReader.Value other than String.Empty.

- **XmlWriter**

  Methods:

  - Flush: Flushes whatever is in the buffer to the underlying streams and also flushes the underlying stream.

- **XmlNode**

  Methods:

  - SelectSingleNode(String, XmlNamespaceManager): Selects the first XmlNode that matches the XPath expression. Any prefixes found in the XPath expression are resolved using the supplied XmlNamespaceManager.

### Crestron.SimplSharp.Cryptography.X509Certificates

Description: Provides classes and enumerations for working with X.509 certificates.

#### Classes

- CryptographicException: The exception that is thrown when an error occurs during a cryptographic operation.

- X509Certificate: Provides methods that help you use X.509 v.3 certificates.

- X509Certificate2: Represents an X.509 certificate. This class cannot be inherited.

- X509Certificate2Collection: Represents a collection of X509Certificate2 objects. This class cannot be inherited.

- X509CertificateCollection: Defines a collection that stores X509Certificate objects.

- X509Store: Represents an X.509 store, which is a physical store where certificates are persisted and managed. This class cannot be inherited.

#### Enums

- OpenFlags: Specifies the way to open the X.509 certificate store.

- StoreLocation: Specifies the location of the X.509 certificate store.

- StoreName: Specifies the name of the X.509 certificate store to open.

- X509FindType: Specifies the type of value searched for by the X509Certificate2Collection.Find method.

### Crestron.SimplSharp.Net.Http

Description: Provides classes for HTTP communication.

 (Details limited; includes HttpClient, HttpHeaders, etc.)

### Crestron.SimplSharp.Net.Https

Description: Provides classes for HTTPS communication.

#### Enums

- AuthMethod: The method of authentication to an HTTPS server.

### Crestron.SimplSharp.WebScripting

Description: Provides classes for web scripting and server functionality.

 (Details limited; includes HttpServer, HttpContext, etc.)

### Crestron.SimplSharp.Ssh.Sftp

Description: Exposes a System.IO.Stream around a remote SFTP file, supporting both synchronous and asynchronous read and write operations.

#### Classes

- SftpFileStream: Exposes a Stream around a remote SFTP file.

  Methods:

  - Read: Reads a sequence of bytes from the current stream and advances the position within the stream by the number of bytes read.

- SftpClient: Client for SFTP.

  Methods:

  - BeginListDirectory: Begins an asynchronous operation of retrieving list of files in remote directory.

  - BeginDownloadFile(String, Stream): Begins an asynchronous file downloading into the stream.

### Crestron.SimplSharp.CrestronSockets

Description: Socket-related classes.

#### Classes

- SecureTCPServer: Secure TCP server class.

  Methods:

  - GetFile: Function to read data asynchronously from the TCP client. This is a non-blocking call. This assumes a single client is connected to the server and reads data ...

### Crestron.SimplSharp.SQLLite

Description: SQLite database support.

#### Classes

- SQLiteConnection

  Properties:

  - ConnectionString: Gets or sets the string used to open a SQL Server database. The connection string that includes the source database name, and other parameters needed to ...

### Crestron.SimplSharpPro

Description: Root namespace for SIMPL# Pro, for full C# programs.

#### Classes

- CrestronControlSystem: Base class for control system programs.

 (Details limited; extends for subnamespaces.)

### Crestron.SimplSharpPro.AudioDistribution

Description: Classes for audio distribution.

#### Classes

- C2nAmp4X100: The C2nAmp4X100 is a Cresnet 6-input, 4-output stereo audio switcher and amplifier.

- C2nAmp6X100: The C2NAMP6x100 is a Ethernet supported 6 stereo room power amplifier with 12 stereo lines designed for residential applications.The unit supports bridging ...

- Amp8xxxBase: Base class for AMP-8xxx devices. This class will trigger event with events IDs defined in the class.

### Crestron.SimplSharpPro.BACnet

Description: BACnet protocol support.

#### Classes

- BACnetHostAnalogValueObject: Specifies the number of digits to the right of the decimal point for PresentValue or PresentValue. Valid values are as follows: 0 (indicates present value ...

### Crestron.SimplSharpPro.DM

Description: DigitalMedia functionality.

#### Subnamespaces

- Crestron.SimplSharpPro.DM.Streaming

  Classes:

  - DmNvxBaseClass.DmNvx35xXioRouting: Xio Routing class for DM-NVX-35X(C) devices. This class will trigger and events.

### Crestron.SimplSharpPro.DeviceSupport

Description: Device support classes.

#### Classes

- Tswx52VoipReservedSigs: Class for TSW x52 VoIP reserved signals.

  Methods:

  - DialPound: Method to dial a pound sign "#".

  - Dial (inherited from VOIPReservedCues): Method to dial the current number string in the buffer.

- Dge2SystemReservedSigs: Reserved signals for DGE2 system.

  Properties:

  - StandbyTimeout: Property to set the standby timeout in minutes. The standby timeout is the period from the last use of the touchscreen before going into standby mode ...

- Tss752System3ReservedSigs: Reserved signals for TSS752 system.

  Properties:

  - BankABlue: Property to set the Bank A of hardkey LEDs to the blue color, where: "Bank A" refers to the five hardkeys on the left side of the touch screen.

### Crestron.SimplSharpPro.Lighting

Description: Lighting control classes.

#### Classes

- DaliLoop: DaliLoop class for lighting.

  Properties:

  - AllBallastRaise: Property to raise the light levels of all the ballasts on the DaliLoop, using the ramp rate defined in the DaliBallast.

- DinMotor: Motor Class for DIN Motor Control Modules. This class will trigger BaseEvent event of Din2Mc2 that owns it.

### Crestron.SimplSharpPro.UI

Description: User interface classes.

 (Details limited; includes touchpanel classes like Tpmc12Base, Dge100, etc.)

### Independentsoft.Exchange

Description: Exchange-related classes (third-party integration).

#### Classes

- Task: Task object.

  Methods:

  - ToString: Converts the value of the current Task object to its equivalent string representation. (Overrides Item.ToString().)

- RuleActions: Represents the set of actions that are available to be taken on a message when the conditions are fulfilled.

- AlternateId: Describes an identifier to convert in a request and the results of a converted identifier in the response.

### Crestron.SimplSharp.Onvif

Description: ONVIF protocol for cameras.

#### Classes

- PTZControl

  Methods:

  - AbsoluteMove: AbsoluteMove moves the device to the PTZ position with corresponding speed.

### Crestron.SimplSharp.CrestronFileTransferClient

Description: File transfer classes.

#### Methods

- GetFile: Retrieves the remote file pointed by URL. This method directly uses the URL supplied. The URL is retrieved to the destination (localPath) file.

### Crestron.SimplSharp.Reflection

Description: Reflection classes.

#### Classes

- CType

  Properties:

  - IsNestedFamily: Gets a value indicating whether the CType is nested and visible only within its own family.

### Newtonsoft.Json.Schema

Description: JSON schema classes.

#### Classes

- JsonSchema

  Properties:

  - AllowAdditionalProperties: Gets or sets a value indicating whether additional properties are allowed.

### Crestron.SimplSharp.CrestronAuthentication

Description: Authentication classes.

#### Classes

- Authentication

  Methods:

  - Disable(UserToken, Boolean): Method to disable authentication on the control system.

## Additional Best Practices and Tips

- Use Crestron-specific threading and console for compatibility.

- For drivers, use Entity Model V2 for new development.

- Ensure error handling with try/catch and CrestronConsole logging.

This document is a compilation and may not cover every member due to source limitations. For complete mastery, refer to official Crestron tools and practice in Visual Studio with Crestron plugins.