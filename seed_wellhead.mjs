import mysql from 'mysql2/promise';

const COURSE_ID = 2; // Wellhead Maintenance Course

const modules = [
  {
    courseId: COURSE_ID,
    moduleNumber: 1,
    titleAr: "مقدمة في صناعة النفط والغاز ورؤوس الآبار",
    titleEn: "Introduction to Oil & Gas Industry and Wellheads",
    descriptionAr: "فهم دورة حياة بئر النفط والغاز، التمييز بين البيئات onshore وoffshore، وتحديد وظائف ومكونات رأس البئر.",
    descriptionEn: "Understand the life cycle of an oil and gas well, distinguish between onshore and offshore environments, and identify wellhead functions and components.",
    duration: "3.5 hours",
    order: 1,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 2,
    titleAr: "أساسيات أنظمة رأس البئر",
    titleEn: "Fundamentals of Wellhead Systems",
    descriptionAr: "تحديد ووصف المكونات الرئيسية لنظام رأس البئر وشرح وظائفها في سياقات onshore وoffshore.",
    descriptionEn: "Identify and describe the main components of a wellhead system and explain their functions in onshore and offshore contexts.",
    duration: "3.5 hours",
    order: 2,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 3,
    titleAr: "أدوات ومعدات رأس البئر",
    titleEn: "Wellhead Tools and Equipment",
    descriptionAr: "تشغيل الأدوات اليدوية والهيدروليكية بأمان وتكييفها مع مهام الصيانة المختلفة.",
    descriptionEn: "Safely operate hand and hydraulic tools and adapt them to various maintenance tasks.",
    duration: "3 hours",
    order: 3,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 4,
    titleAr: "السلامة أولاً: إدارة الضغط والمخاطر",
    titleEn: "Safety First: Wellhead Pressure and Hazard Management",
    descriptionAr: "إتقان التحكم في الضغط وتنفيذ إجراءات السلامة واللوائح التنظيمية.",
    descriptionEn: "Master pressure control and implement safety procedures and regulatory requirements.",
    duration: "4.5 hours",
    order: 4,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 5,
    titleAr: "تقنيات الفحص والصيانة الدورية",
    titleEn: "Inspection Techniques and Routine Maintenance",
    descriptionAr: "إجراء الفحوصات المنهجية وتنفيذ المهام اليومية والأسبوعية للصيانة.",
    descriptionEn: "Conduct systematic inspections and perform daily and weekly maintenance tasks.",
    duration: "3.5 hours",
    order: 5,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 6,
    titleAr: "الصيانة التصحيحية: استبدال الصمامات والمانعات",
    titleEn: "Corrective Maintenance: Valve and Seal Replacement",
    descriptionAr: "تنفيذ مهام الصيانة التصحيحية بأمان واتباع سير العمل الصحيح.",
    descriptionEn: "Safely perform corrective maintenance tasks and follow proper work procedures.",
    duration: "3.5 hours",
    order: 6,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 7,
    titleAr: "أنظمة رأس البئر البحرية (Offshore)",
    titleEn: "Offshore-Specific Wellhead Systems",
    descriptionAr: "التمييز بين أنظمة السطح وتحت البحر ومعالجة تحديات البيئة البحرية.",
    descriptionEn: "Distinguish between surface and subsea systems and address offshore environment challenges.",
    duration: "3.5 hours",
    order: 7,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 8,
    titleAr: "الصيانة المتقدمة واستكشاف الأعطال",
    titleEn: "Advanced Maintenance and Troubleshooting",
    descriptionAr: "تشخيص وحل المشكلات وتطبيق استراتيجيات الصيانة التنبؤية.",
    descriptionEn: "Diagnose and resolve problems and apply predictive maintenance strategies.",
    duration: "4.5 hours",
    order: 8,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 9,
    titleAr: "تركيب رأس البئر وعمليات الـ Workover",
    titleEn: "Wellhead Installation and Workovers",
    descriptionAr: "فهم عمليات التركيب ودعم التدخلات في البئر.",
    descriptionEn: "Understand installation operations and support well interventions.",
    duration: "3.5 hours",
    order: 9,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 10,
    titleAr: "التوثيق والتقارير ونظام CMMS",
    titleEn: "Documentation, Reporting, and CMMS",
    descriptionAr: "توثيق الأنشطة واستخدام نظام إدارة الصيانة الحاسوبية (CMMS).",
    descriptionEn: "Document activities and use Computerized Maintenance Management Systems (CMMS).",
    duration: "3 hours",
    order: 10,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 11,
    titleAr: "استراتيجيات الصيانة الوقائية والتنبؤية والهجينة",
    titleEn: "Preventive, Predictive, and Hybrid Maintenance Strategies",
    descriptionAr: "تنفيذ استراتيجيات الصيانة المختلفة وتحسين التكلفة والعمر الافتراضي للمعدات.",
    descriptionEn: "Implement various maintenance strategies and optimize cost and equipment lifespan.",
    duration: "3.5 hours",
    order: 11,
  },
  {
    courseId: COURSE_ID,
    moduleNumber: 12,
    titleAr: "مشروع التخرج: بناء رأس بئر افتراضي والتحضير لسوق العمل",
    titleEn: "Capstone Project: Build Your Virtual Wellhead and Job Preparation",
    descriptionAr: "تطبيق المعرفة المكتسبة في مشروع شامل والتحضير لسوق العمل.",
    descriptionEn: "Apply acquired knowledge in a comprehensive project and prepare for the job market.",
    duration: "4 hours",
    order: 12,
  },
];

const lessons = [
  // Module 1: Introduction
  { moduleNumber: 1, lessonNumber: 1, titleEn: "The Big Picture: From Exploration to Production", estimatedMinutes: 45, order: 1,
    content: `# The Big Picture: From Exploration to Production

## Overview
The oil and gas industry is one of the world's most complex and capital-intensive industries. Understanding the full lifecycle of a well — from the first geological survey to the final abandonment — is essential for any wellhead maintenance technician.

## The Upstream Lifecycle

The journey of oil and gas from reservoir to market follows a well-defined sequence:

| Phase | Description | Key Activities |
|-------|-------------|----------------|
| **Exploration** | Finding hydrocarbons | Seismic surveys, geological mapping, exploration drilling |
| **Appraisal** | Evaluating the discovery | Appraisal wells, reservoir testing, flow testing |
| **Development** | Building infrastructure | Development drilling, facility construction, pipeline installation |
| **Production** | Extracting hydrocarbons | Well operations, surface processing, export |
| **Abandonment** | Decommissioning | Well plugging, facility removal, site restoration |

## The Role of the Wellhead Technician

The wellhead maintenance technician is critical throughout the **Production** phase and plays a supporting role in **Development** and **Abandonment**. Your responsibilities include:

- **Routine inspections** of wellhead components to detect early signs of wear or leakage
- **Preventive maintenance** to extend equipment life and prevent unplanned shutdowns
- **Corrective maintenance** when components fail or degrade
- **Safety compliance** with API, OSHA, and company-specific standards

## Regulatory Framework

All wellhead operations are governed by strict regulations:

- **API (American Petroleum Institute)**: Standards for wellhead equipment design and testing (API 6A, API 11D1)
- **OSHA (Occupational Safety and Health Administration)**: Worker safety requirements
- **EPA (Environmental Protection Agency)**: Environmental protection standards
- **Local regulations**: Country-specific requirements (e.g., NOPSEMA in Australia, HSE in the UK)

> **Key Takeaway**: A wellhead technician who understands the full lifecycle can make better decisions about maintenance priorities, safety risks, and environmental impacts.

## Summary

The oil and gas industry operates in a complex regulatory and operational environment. As a wellhead technician, you are the last line of defense against equipment failure, environmental spills, and safety incidents. Understanding the big picture helps you appreciate why every maintenance task matters.`
  },
  { moduleNumber: 1, lessonNumber: 2, titleEn: "Onshore vs. Offshore: Understanding the Environment", estimatedMinutes: 40, order: 2,
    content: `# Onshore vs. Offshore: Understanding the Environment

## Introduction

Wellhead maintenance is performed in two fundamentally different environments: **onshore** (land-based) and **offshore** (marine-based). Each presents unique challenges that affect equipment design, maintenance procedures, and safety requirements.

## Onshore Operations

Onshore wellheads are located on land and are generally more accessible:

**Advantages:**
- Direct road access for equipment and personnel
- Lower logistical costs
- Easier emergency response
- More space for equipment and operations

**Challenges:**
- Desert heat, arctic cold, or tropical humidity depending on location
- Dust and sand contamination
- Remote locations with limited infrastructure
- Wildlife and environmental sensitivities

## Offshore Operations

Offshore wellheads are located on platforms or subsea in marine environments:

| Platform Type | Description | Water Depth |
|--------------|-------------|-------------|
| **Fixed Platform** | Steel jacket fixed to seabed | Up to 500m |
| **Jack-up Rig** | Movable platform with legs | Up to 150m |
| **Semi-submersible** | Floating platform | Up to 3,000m |
| **FPSO** | Floating Production, Storage & Offloading vessel | Deep water |
| **Subsea** | Equipment on seabed | Up to 3,000m+ |

**Offshore Challenges:**
- Corrosive marine environment (salt water, humidity)
- Limited workspace and weight restrictions
- Helicopter or boat access only
- Strict personnel safety requirements
- High cost of operations (day rates for platforms)
- Weather windows for maintenance operations

## Equipment Design Differences

The harsh offshore environment requires specialized equipment:

- **Corrosion-resistant materials**: Duplex stainless steel, Inconel alloys
- **Compact design**: Space is at a premium on platforms
- **Remote operation capability**: ROVs for subsea equipment
- **Enhanced sealing**: More stringent leak prevention requirements

> **Key Takeaway**: Always adapt your maintenance approach to the specific environment. What works onshore may not be appropriate or safe offshore.`
  },
  { moduleNumber: 1, lessonNumber: 3, titleEn: "What is a Wellhead? The Gateway to the Reservoir", estimatedMinutes: 50, order: 3,
    content: `# What is a Wellhead? The Gateway to the Reservoir

## Definition

A **wellhead** is the surface equipment at the top of a drilled well that provides the structural and pressure-containing interface between the wellbore and the surface facilities. It is the critical connection point between the underground reservoir and the surface production system.

## Primary Functions

The wellhead serves four essential functions:

1. **Structural Support**: Supports the weight of the casing strings and tubing
2. **Pressure Containment**: Maintains well integrity by containing formation pressures
3. **Flow Control**: Provides the means to control and direct well fluids
4. **Well Intervention Access**: Allows access for workover and well service operations

## Position in the Production Chain

\`\`\`
RESERVOIR
    ↓
WELLBORE (casing & tubing)
    ↓
WELLHEAD ← You are here
    ↓
CHRISTMAS TREE (flow control valves)
    ↓
FLOWLINE
    ↓
PRODUCTION FACILITY (separation, treatment)
    ↓
EXPORT (pipeline or tanker)
\`\`\`

## Pressure Ratings

Wellheads are designed and rated for specific working pressures:

| API Pressure Rating | Working Pressure (psi) | Typical Application |
|--------------------|----------------------|---------------------|
| 2,000 psi | 2,000 | Low-pressure wells |
| 3,000 psi | 3,000 | Medium-pressure wells |
| 5,000 psi | 5,000 | High-pressure wells |
| 10,000 psi | 10,000 | Very high-pressure wells |
| 15,000 psi | 15,000 | Ultra-high pressure wells |
| 20,000 psi | 20,000 | Extreme pressure wells |

## API Standards

The primary standard governing wellhead equipment is **API Specification 6A** (Wellhead and Tree Equipment). This standard covers:
- Design requirements
- Material specifications
- Testing procedures
- Marking and documentation

> **Critical Safety Note**: Never exceed the rated working pressure of any wellhead component. Always verify pressure ratings before performing any maintenance work.`
  },
  { moduleNumber: 1, lessonNumber: 4, titleEn: "Introduction to Wellhead Components and Terminology", estimatedMinutes: 35, order: 4,
    content: `# Introduction to Wellhead Components and Terminology

## Core Components Overview

A conventional wellhead assembly consists of several stacked components, each serving a specific purpose:

### 1. Casing Head (Conductor Head)
The **casing head** is the bottom-most component of the wellhead assembly. It is welded to the surface casing (conductor pipe) and provides:
- The foundation for the entire wellhead stack
- Sealing between the conductor casing and the surface casing
- Connection point for the blowout preventer (BOP) during drilling

### 2. Casing Spool
The **casing spool** is installed on top of the casing head and accommodates additional casing strings. Each casing string (surface, intermediate, production) may have its own spool.

### 3. Tubing Head (Tubing Head Spool)
The **tubing head** sits on top of the casing spools and:
- Supports and seals the production tubing string
- Contains the tubing hanger
- Provides access to the annulus between tubing and casing

### 4. Christmas Tree (X-mas Tree)
The **Christmas tree** is the assembly of valves, spools, and fittings connected to the top of the tubing head. It controls production flow.

## Key Terminology

| Term | Definition |
|------|-----------|
| **PSI** | Pounds per Square Inch — unit of pressure measurement |
| **BBL** | Barrel — unit of liquid volume (1 BBL = 42 US gallons = 159 liters) |
| **Annulus** | The space between two concentric pipes (e.g., between tubing and casing) |
| **Hanger** | A device that supports and seals a casing or tubing string |
| **Flange** | A flat rim used to connect pipes and equipment |
| **BOP** | Blowout Preventer — safety device to control well kicks |
| **WHP** | Wellhead Pressure — pressure measured at the wellhead |
| **SIWHP** | Shut-In Wellhead Pressure — pressure when well is closed |
| **FWHP** | Flowing Wellhead Pressure — pressure during production |

## Wellhead Assembly Stack-Up

\`\`\`
CHRISTMAS TREE (top)
      ↕
TUBING HEAD
      ↕
INTERMEDIATE CASING SPOOL (if applicable)
      ↕
SURFACE CASING SPOOL
      ↕
CASING HEAD (bottom — welded to conductor)
      ↕
GROUND SURFACE
\`\`\`

> **Pro Tip**: Always identify the API pressure rating and size of each component before starting any maintenance work. This information is stamped on the equipment nameplate.`
  },
  { moduleNumber: 1, lessonNumber: 5, titleEn: "Historical Evolution and Basic Safety Overview", estimatedMinutes: 40, order: 5,
    content: `# Historical Evolution and Basic Safety Overview

## Historical Evolution of Wellheads

The development of wellhead technology mirrors the growth of the oil and gas industry:

| Era | Development | Significance |
|-----|-------------|--------------|
| **1859** | First commercial oil well (Drake Well, Pennsylvania) | Simple wooden derrick, no formal wellhead |
| **1900s** | Early steel wellheads | Basic pressure containment |
| **1920s** | Standardization begins | API founded in 1919 |
| **1930s** | High-pressure wells | Development of BOP technology after Spindletop blowout |
| **1950s** | Offshore operations begin | New challenges for marine environments |
| **1970s** | API 6A standard published | Formal wellhead equipment standards |
| **1990s** | Subsea wellheads | Deep water exploration |
| **2000s+** | Smart wellheads | IoT sensors, remote monitoring |

## The Macondo Disaster (2010)

The Deepwater Horizon blowout in the Gulf of Mexico killed 11 workers and caused the largest marine oil spill in US history. Key lessons:
- Proper wellhead integrity is critical
- Multiple safety barriers are essential
- Never bypass safety systems

## Personal Protective Equipment (PPE)

Working around wellheads requires specific PPE:

| Hazard | Required PPE |
|--------|-------------|
| Head injury | Hard hat (ANSI Z89.1) |
| Eye/face injury | Safety glasses, face shield |
| Hearing damage | Ear protection (>85 dB) |
| Hand injury | Chemical-resistant gloves |
| Foot injury | Steel-toed boots |
| Fall hazard | Full-body harness (at heights >6 ft) |
| H₂S exposure | SCBA or supplied air respirator |
| Fire/explosion | Flame-resistant clothing (FRC) |

## Primary Hazards at Wellheads

1. **High-pressure fluids**: Sudden release can cause serious injury or death
2. **Toxic gases**: H₂S (hydrogen sulfide) is odorless at high concentrations and immediately fatal
3. **Flammable gases**: Methane and other hydrocarbons create explosion risk
4. **Rotating equipment**: Pumps and compressors
5. **Extreme temperatures**: Hot fluids, steam, cold weather
6. **Confined spaces**: Pits, sumps, vessels

> **Safety Rule #1**: Never work on pressurized equipment without proper isolation, depressurization, and a valid work permit.`
  },

  // Module 2: Fundamentals
  { moduleNumber: 2, lessonNumber: 1, titleEn: "The Foundation: Casing Head and Casing Spool", estimatedMinutes: 40, order: 1,
    content: `# The Foundation: Casing Head and Casing Spool

## The Casing Head

The **casing head** (also called the surface casing head or conductor head) is the foundation of the entire wellhead assembly. It is the first permanent wellhead component installed during well construction.

### Construction and Installation
- Welded directly to the surface casing (conductor pipe) at the wellsite
- Typically made of carbon steel or alloy steel
- Rated for the maximum anticipated wellhead pressure

### Key Features of the Casing Head

| Feature | Function |
|---------|----------|
| **Casing hanger bowl** | Supports and seals the next casing string |
| **Annulus access ports** | Allow monitoring and control of annular pressure |
| **Flange connection** | Connects to the next spool or BOP stack |
| **Lockdown screws** | Secure the casing hanger in position |

## Casing Hangers

A **casing hanger** is a device that:
1. Supports the weight of the casing string (which can weigh hundreds of thousands of pounds)
2. Seals the annular space between casing strings
3. Allows for thermal expansion of the casing

### Types of Casing Hangers

**Slip-type hanger**: Uses slips (wedge-shaped pieces) to grip the casing pipe
**Mandrel-type hanger**: A machined profile on the casing that lands in a matching profile in the wellhead

## The Casing Spool

For wells with multiple casing strings, **casing spools** are stacked on top of the casing head. Each spool:
- Has a hanger bowl at the bottom to receive the previous casing hanger
- Has a flange at the top to connect to the next spool or tubing head
- Provides annulus access for the associated casing string

## Maintenance Considerations

Regular inspection of casing heads and spools should check for:
- **Corrosion**: Especially at flange faces and around access ports
- **Annulus pressure**: Sustained casing pressure (SCP) indicates a seal failure
- **Flange integrity**: Check for leaks at all connections
- **Lockdown screw condition**: Ensure screws are properly torqued

> **Important**: Annulus pressure monitoring is one of the most critical routine maintenance tasks. Unexpected pressure buildup can indicate a casing leak or tubing failure.`
  },
  { moduleNumber: 2, lessonNumber: 2, titleEn: "Containing the Flow: Tubing Head and Tubing Hanger", estimatedMinutes: 45, order: 2,
    content: `# Containing the Flow: Tubing Head and Tubing Hanger

## The Tubing Head

The **tubing head** (or tubing head spool) sits at the top of the casing spool stack and serves as the interface between the subsurface tubing string and the surface Christmas tree.

### Primary Functions
1. **Support**: Bears the weight of the entire tubing string
2. **Sealing**: Seals the tubing-casing annulus (A-annulus)
3. **Access**: Provides access ports for annulus monitoring and injection
4. **Connection**: Provides the flange connection for the Christmas tree

## The Tubing Hanger

The **tubing hanger** is the component that actually suspends the production tubing string within the tubing head. It is a critical sealing element.

### Tubing Hanger Types

| Type | Description | Application |
|------|-------------|-------------|
| **Mandrel hanger** | Machined profile lands in tubing head bowl | Most common in production wells |
| **Slip hanger** | Slips grip the tubing pipe | Older design, still in use |
| **Threaded hanger** | Threaded connection to tubing head | High-pressure applications |

### Tubing Hanger Seals

The tubing hanger must seal:
- **Primary seal**: Metal-to-metal seal between hanger and tubing head bowl
- **Secondary seal**: Elastomeric backup seal
- **Packoff seal**: Seals the annulus above the hanger

## The A-Annulus (Tubing-Casing Annulus)

The space between the production tubing and the innermost casing string is called the **A-annulus** or tubing-casing annulus. Managing this annulus is critical:

- **Normal condition**: Annulus is filled with completion fluid at a known pressure
- **Pressure buildup**: May indicate a tubing leak or packer failure
- **Monitoring**: Pressure gauges on the tubing head access ports

## Maintenance Tasks

**Routine (Daily/Weekly):**
- Record A-annulus pressure
- Check for external leaks at tubing head flanges
- Verify access port valve positions

**Periodic (Monthly/Quarterly):**
- Function test annulus access valves
- Grease valve stems
- Inspect flange bolts for corrosion

> **Safety Note**: Never open an annulus access valve without first checking the pressure reading. Unexpected high pressure requires investigation before proceeding.`
  },
  { moduleNumber: 2, lessonNumber: 3, titleEn: "Controlling the Well: The Christmas Tree", estimatedMinutes: 50, order: 3,
    content: `# Controlling the Well: The Christmas Tree

## What is a Christmas Tree?

The **Christmas tree** (or X-mas tree) is the assembly of valves, spools, and fittings installed on top of the tubing head. It controls the flow of oil, gas, and water from the well to the production facilities.

The name "Christmas tree" comes from the visual appearance of the early valve assemblies, which resembled a decorated Christmas tree with their multiple branches and fittings.

## Christmas Tree Components

### Master Valves

| Valve | Position | Function |
|-------|----------|----------|
| **Lower Master Valve (LMV)** | Bottom of tree | Primary well isolation valve — the most critical valve |
| **Upper Master Valve (UMV)** | Above LMV | Secondary isolation, used for maintenance on upper tree |

### Wing Valves

| Valve | Position | Function |
|-------|----------|----------|
| **Production Wing Valve (PWV)** | Side of tree | Controls flow to production flowline |
| **Kill Wing Valve (KWV)** | Opposite side | Allows injection of kill fluid into the well |

### Swab Valve (Crown Valve)

Located at the top of the tree, the **swab valve** provides access for:
- Wireline operations
- Coiled tubing interventions
- Well testing equipment

### Choke

The **choke** (or production choke) is a flow restriction device that:
- Controls the production rate from the well
- Maintains backpressure on the reservoir
- Protects downstream equipment from pressure surges

**Types of chokes:**
- **Fixed choke**: A fixed orifice size (bean choke)
- **Adjustable choke**: Variable opening controlled manually or remotely

## Christmas Tree Configurations

**Conventional (Vertical) Tree**: Valves stacked vertically above the tubing hanger. Most common onshore and on shallow offshore platforms.

**Horizontal Tree (Monobore Tree)**: Tubing hanger installed inside the tree body. Used for subsea applications and high-pressure wells.

## Valve Operation

Gate valves in Christmas trees operate by raising or lowering a gate (disc) to open or close the flow path:

- **Open**: Gate raised, full bore opening
- **Closed**: Gate lowered, sealing against seats
- **Never throttle**: Gate valves should be fully open or fully closed — never partially open (causes erosion)

> **Critical Rule**: The Lower Master Valve (LMV) is the primary well barrier. It must always be in perfect working condition and must never be left in a partially open position.`
  },
  { moduleNumber: 2, lessonNumber: 4, titleEn: "Seals and Gaskets: The Unsung Heroes", estimatedMinutes: 35, order: 4,
    content: `# Seals and Gaskets: The Unsung Heroes

## Why Seals Matter

Seals and gaskets are the components that prevent high-pressure wellhead fluids from escaping to the environment. A single seal failure can result in:
- Hydrocarbon release and fire/explosion risk
- Environmental contamination
- Production loss
- Regulatory penalties
- Injury or death

## Metal-to-Metal Seals

**Metal-to-metal (MTM) seals** are the primary sealing mechanism in wellhead equipment. They work by creating a controlled interference fit between two precision-machined metal surfaces.

### Advantages of MTM Seals
- Excellent performance at high temperatures and pressures
- Long service life
- Not affected by H₂S or sour service
- Can be tested and verified

### API Ring Gaskets

The most common wellhead seal is the **API ring gasket** (ring joint gasket), used at flange connections:

| Ring Type | Cross-Section | Application |
|-----------|---------------|-------------|
| **R** | Oval | Standard API flanges, lower pressure |
| **RX** | Modified oval | Higher pressure, self-energizing |
| **BX** | Rectangular | Very high pressure (>10,000 psi) |
| **SRX** | Spiral wound | Special applications |

**Ring gasket materials:**
- Soft iron (most common)
- Low-carbon steel
- 316 stainless steel (sour service)
- Inconel (high temperature)

## Elastomeric Seals

**Elastomeric (rubber) seals** are used as secondary seals and in lower-pressure applications:

- **O-rings**: Circular cross-section, used in grooves
- **Lip seals**: Used in rotating equipment
- **Packoff seals**: Used in tubing hangers

**Common elastomer materials:**
- Nitrile (NBR): General service
- Viton (FKM): High temperature, chemical resistance
- HNBR: Sour service (H₂S environments)
- EPDM: Steam service

## Seal Inspection and Replacement

**Inspection criteria for ring gaskets:**
- Surface finish: No scratches, pits, or corrosion
- Dimensional accuracy: Must meet API tolerances
- Material condition: No cracks or deformation

> **Golden Rule**: Never reuse a ring gasket. Once a flange has been broken, always install a new ring gasket. The cost of a new gasket is negligible compared to the cost of a leak.`
  },
  { moduleNumber: 2, lessonNumber: 5, titleEn: "Auxiliary Components and System Integration", estimatedMinutes: 30, order: 5,
    content: `# Auxiliary Components and System Integration

## Pressure Gauges and Sensors

Wellheads are equipped with multiple pressure measurement points:

| Location | Measurement | Importance |
|----------|-------------|------------|
| **Tubing head** | Tubing pressure (FWHP/SIWHP) | Primary production monitoring |
| **A-annulus** | Tubing-casing annulus pressure | Tubing/packer integrity |
| **B-annulus** | Intermediate casing annulus | Casing integrity |
| **C-annulus** | Surface casing annulus | Outer casing integrity |

### Types of Pressure Gauges

**Bourdon tube gauges**: Mechanical gauges, simple and reliable
**Electronic pressure transmitters**: Digital output for SCADA systems
**Dead weight testers**: High-accuracy calibration instruments

## Temperature Sensors

Temperature monitoring helps detect:
- Abnormal flow conditions
- Hydrate formation risk
- Equipment overheating

## Safety Valves

**Surface Safety Valve (SSV)**: Installed on the Christmas tree, automatically closes on loss of control signal or abnormal pressure.

**Subsurface Safety Valve (SSSV)**: Installed downhole in the tubing string, provides a second barrier against uncontrolled flow.

## Chemical Injection Points

Wellheads typically have chemical injection ports for:
- **Corrosion inhibitors**: Protect internal surfaces
- **Scale inhibitors**: Prevent mineral scale buildup
- **Hydrate inhibitors**: Prevent gas hydrate formation (MEG or methanol)
- **Demulsifiers**: Help separate oil and water

## System Integration — Flow Path

Understanding how all components work together:

\`\`\`
RESERVOIR PRESSURE
    ↓ (through tubing)
TUBING HANGER (seals annulus)
    ↓
LOWER MASTER VALVE (primary isolation)
    ↓
UPPER MASTER VALVE (secondary isolation)
    ↓
CHOKE (flow control)
    ↓
PRODUCTION WING VALVE
    ↓
FLOWLINE → PRODUCTION FACILITY
\`\`\`

> **System Thinking**: Every component in the wellhead system depends on the others. A failure in one component affects the entire system. This is why comprehensive maintenance of ALL components is essential.`
  },

  // Module 3: Tools
  { moduleNumber: 3, lessonNumber: 1, titleEn: "The Technician's Toolbox: Hand and Power Tools", estimatedMinutes: 35, order: 1,
    content: `# The Technician's Toolbox: Hand and Power Tools

## Essential Hand Tools

Every wellhead technician must be proficient with the following hand tools:

### Wrenches

| Tool | Application |
|------|-------------|
| **Adjustable wrench (Crescent)** | General fastener work |
| **Combination wrench** | Hex bolts and nuts |
| **Pipe wrench (Stillson)** | Threaded pipe connections |
| **Strap wrench** | Smooth surfaces, no marring |
| **Chain wrench** | Large diameter pipes |
| **Spanner wrench** | Locknut removal |

### Hammers and Striking Tools

- **Ball-peen hammer**: General metalwork, driving pins
- **Sledgehammer**: Heavy driving tasks
- **Dead-blow hammer**: Minimizes rebound, protects surfaces
- **Brass hammer**: Use near flammable materials (non-sparking)

### Measuring Tools

- **Steel tape measure**: Linear measurements
- **Vernier calipers**: Precise diameter measurements
- **Micrometer**: Very precise measurements (±0.001 inch)
- **Feeler gauge**: Measuring small gaps
- **Depth gauge**: Measuring recess depths

## Power Tools

### Grinders

**Angle grinder**: Used for:
- Cutting metal
- Grinding weld spatter
- Preparing flange faces

**Safety rules for grinders:**
- Always use the correct disc for the material
- Inspect disc for cracks before use
- Wear face shield AND safety glasses
- Never remove the guard

### Impact Wrenches

**Pneumatic impact wrench**: Rapid bolt removal and installation
**Hydraulic impact wrench**: Higher torque for large fasteners

**Important**: Impact wrenches are for removal only — never use for final tightening of critical fasteners. Always use a calibrated torque wrench for final torque.

## Tool Care and Maintenance

- Clean tools after each use
- Inspect for damage before use
- Store in organized toolbox
- Calibrate measuring tools regularly
- Replace worn or damaged tools immediately

> **Safety Rule**: Never use damaged tools. A broken wrench or cracked grinding disc can cause serious injury. Inspect every tool before use.`
  },
  { moduleNumber: 3, lessonNumber: 2, titleEn: "Heavy Lifting: Flange Spreaders and Lifting Gear", estimatedMinutes: 40, order: 2,
    content: `# Heavy Lifting: Flange Spreaders and Lifting Gear

## Hydraulic Flange Spreaders

**Hydraulic flange spreaders** are used to safely separate flanged connections during maintenance. They are essential when:
- Removing Christmas tree components
- Breaking flange connections for gasket replacement
- Separating stuck flanges

### How Flange Spreaders Work

1. Insert spreader wedges into the flange gap
2. Apply hydraulic pressure to expand the wedges
3. Gradually separate the flange faces
4. Support the separated components before removing fasteners

**Safety precautions:**
- Always depressurize the system before using spreaders
- Never use spreaders on pressurized equipment
- Use appropriate spreader size for the flange rating
- Have a plan for supporting the separated component

## Lifting Equipment

### Slings and Rigging

| Sling Type | Material | Application |
|-----------|----------|-------------|
| **Wire rope sling** | Steel wire | Heavy loads, abrasive environments |
| **Chain sling** | Alloy steel | High temperature, rugged use |
| **Synthetic sling** | Nylon/polyester | Delicate surfaces, lighter loads |
| **Round sling** | Polyester core | Versatile, easy to use |

### Lifting Hardware

- **Shackles**: Connect slings to loads and lifting points
- **Eye bolts**: Threaded into equipment for lifting
- **Swivel hooks**: Allow rotation without twisting slings
- **Turnbuckles**: Adjust sling length and tension

## Rigging Safety — Critical Rules

1. **Never exceed the Safe Working Load (SWL)** of any rigging component
2. **Inspect all rigging** before each lift — look for cuts, kinks, corrosion
3. **Calculate the load** before selecting rigging equipment
4. **Use a tag line** to control load swing
5. **Keep personnel clear** of the load path
6. **Never stand under a suspended load**
7. **Use a qualified rigger** for complex lifts

## Lift Planning

For any lift involving wellhead components:

1. Calculate the weight of the component
2. Identify lifting points (use manufacturer's data)
3. Select appropriate rigging
4. Verify crane/hoist capacity
5. Conduct a pre-lift meeting
6. Execute the lift with a designated signal person

> **Critical**: A dropped Christmas tree or wellhead spool can cause catastrophic damage and injury. Never rush a lifting operation.`
  },
  { moduleNumber: 3, lessonNumber: 3, titleEn: "High Pressure: Hydraulic Torque and Tensioning Tools", estimatedMinutes: 45, order: 3,
    content: `# High Pressure: Hydraulic Torque and Tensioning Tools

## Why Proper Bolt Loading Matters

Wellhead flanges are sealed by compressing the ring gasket between the flange faces. This compression is achieved by properly loading the flange bolts. Incorrect bolt loading causes:

- **Under-torque**: Insufficient gasket compression → leaks
- **Over-torque**: Gasket damage, bolt yielding, flange distortion
- **Uneven torque**: Flange cocking, partial seal failure

## Hydraulic Torque Wrenches

**Hydraulic torque wrenches** use hydraulic pressure to apply precise, repeatable torque to large fasteners.

### Advantages over Manual Torque Wrenches
- Can achieve very high torque values (up to 100,000 ft-lbs)
- More accurate and repeatable
- Less physical effort for the technician
- Can be used in confined spaces with appropriate tooling

### Operating a Hydraulic Torque Wrench

1. Select the correct socket size
2. Set the hydraulic pressure to achieve the required torque
3. Position the wrench on the fastener
4. Apply hydraulic pressure — wrench advances and stops
5. Release pressure — wrench resets
6. Repeat until the fastener stops advancing

## Hydraulic Bolt Tensioners

**Bolt tensioners** apply direct tension (stretching) to the bolt, rather than torque. This method:
- Eliminates friction variables in torque calculations
- Provides more accurate and uniform bolt loading
- Is preferred for critical high-pressure flanges

### Tensioning vs. Torquing

| Method | Mechanism | Accuracy | Application |
|--------|-----------|----------|-------------|
| **Torquing** | Rotational force | ±25% | General flanges |
| **Tensioning** | Direct stretch | ±5% | Critical HP flanges |

## Bolt Tightening Sequence

For any flange, always follow a cross-pattern tightening sequence:

\`\`\`
For an 8-bolt flange:
Round 1 (snug): 1-5-3-7-2-6-4-8 (cross pattern, 30% torque)
Round 2: Same pattern, 70% torque
Round 3: Same pattern, 100% torque
Round 4: Clockwise verification pass
\`\`\`

> **API Requirement**: All critical wellhead flange connections must be torqued using calibrated equipment following the manufacturer's torque specifications. Document all torque values in the maintenance record.`
  },
  { moduleNumber: 3, lessonNumber: 4, titleEn: "Testing and Measurement: Gauges, Calipers, and Test Pumps", estimatedMinutes: 40, order: 4,
    content: `# Testing and Measurement: Gauges, Calipers, and Test Pumps

## Pressure Gauges

### Reading Analog Pressure Gauges

Analog (Bourdon tube) gauges have a circular dial with a pointer:
- **Range**: Select a gauge with a range 1.5-2x the expected pressure
- **Accuracy**: Typically ±2% of full scale
- **Zero check**: Verify pointer is at zero before use

### Digital Pressure Gauges

Digital gauges provide:
- Higher accuracy (±0.1% or better)
- Data logging capability
- Easy reading in poor lighting

### Gauge Calibration

All pressure gauges used for critical measurements must be:
- Calibrated against a traceable standard
- Calibrated at regular intervals (typically annually)
- Tagged with calibration date and due date

## Calipers and Dimensional Measurement

### Vernier Calipers

Used to measure:
- Outside diameter (OD) of pipes and fittings
- Inside diameter (ID) of bores
- Depth of recesses
- Step heights

**Reading a vernier caliper:**
1. Read the main scale (mm or inches)
2. Find the vernier scale line that aligns with the main scale
3. Add the vernier reading to the main scale reading

### Micrometer

For very precise measurements (±0.001 inch or 0.01 mm):
- Used for measuring bolt diameters, seal groove dimensions
- Must be calibrated with gauge blocks

## Hydrostatic Test Pumps

**Hydrostatic pressure testing** verifies the integrity of wellhead components and connections after maintenance.

### Test Procedure

1. **Isolate** the section to be tested
2. **Fill** with test fluid (water or hydraulic oil)
3. **Pressurize** to the test pressure (typically 1.5x working pressure)
4. **Hold** for the specified time (minimum 15 minutes for API 6A)
5. **Monitor** for pressure drop (indicates a leak)
6. **Document** test results

### Test Pressure Requirements (API 6A)

| Component | Test Pressure |
|-----------|--------------|
| Body pressure test | 1.5 × rated working pressure |
| Seat test | 1.1 × rated working pressure |
| Low-pressure seat test | 50-100 psi |

> **Documentation Requirement**: All pressure tests must be documented with: date, test pressure, hold time, result (pass/fail), and technician signature. These records are legal documents.`
  },
  { moduleNumber: 3, lessonNumber: 5, titleEn: "Digital and Specialized Tools", estimatedMinutes: 30, order: 5,
    content: `# Digital and Specialized Tools

## Electronic Torque Wrenches

Modern electronic torque wrenches provide:
- Real-time torque display
- Audible and visual alerts at target torque
- Data logging for maintenance records
- Bluetooth connectivity to tablets/phones

## Ultrasonic Thickness Gauges

**Ultrasonic thickness (UT) gauges** measure wall thickness without removing the component:
- Detect corrosion and erosion
- Measure remaining wall thickness
- No need to disassemble equipment

**How they work**: A sound wave is transmitted through the material and reflects off the far surface. The time of flight determines the thickness.

## Leak Detection Equipment

### Electronic Gas Detectors

- **Fixed gas detectors**: Permanently installed, continuous monitoring
- **Portable gas detectors**: Carried by technicians during inspections
- **Multi-gas monitors**: Detect H₂S, CO, LEL (combustible gas), O₂

### Acoustic Leak Detection

Ultrasonic leak detectors can detect:
- Gas leaks through valve seats
- Leaks at flange connections
- Underground pipeline leaks

## CMMS Mobile Applications

Modern Computerized Maintenance Management Systems (CMMS) have mobile apps that allow technicians to:
- Access work orders in the field
- Record maintenance activities in real-time
- Scan equipment QR codes for instant history access
- Upload photos of defects
- Request spare parts

**Common CMMS platforms**: SAP PM, IBM Maximo, Infor EAM, UpKeep

## Drone Inspection Technology

Drones are increasingly used for:
- Visual inspection of elevated wellhead components
- Thermal imaging to detect hot spots
- Gas leak detection (methane sensors)
- Reducing risk to technicians in hazardous areas

> **Technology Adoption**: Embrace digital tools — they improve accuracy, reduce errors, and create better maintenance records. A technician who can use both traditional tools and digital technology is more valuable to any employer.`
  },

  // Module 4: Safety
  { moduleNumber: 4, lessonNumber: 1, titleEn: "Understanding Pressure: Hydrostatic and Formation Pressure", estimatedMinutes: 45, order: 1,
    content: `# Understanding Pressure: Hydrostatic and Formation Pressure

## Types of Pressure in Wellhead Operations

Understanding pressure is fundamental to wellhead safety. There are several types of pressure that a technician must understand:

## Hydrostatic Pressure

**Hydrostatic pressure** is the pressure exerted by a column of fluid due to gravity:

\`\`\`
P_hydrostatic = ρ × g × h

Where:
P = pressure (psi)
ρ = fluid density (lb/gal)
g = gravitational constant
h = depth (ft)

Simplified: P (psi) = 0.052 × fluid density (ppg) × depth (ft)
\`\`\`

**Example**: A 10,000 ft well with 10 ppg mud:
P = 0.052 × 10 × 10,000 = **5,200 psi**

## Formation (Reservoir) Pressure

**Formation pressure** is the pressure of fluids within the reservoir rock. It can be:

| Pressure Type | Description | Gradient |
|--------------|-------------|---------|
| **Normal** | Equal to hydrostatic pressure of salt water | ~0.465 psi/ft |
| **Subnormal** | Below normal (depleted reservoirs) | <0.465 psi/ft |
| **Abnormal (overpressured)** | Above normal | >0.465 psi/ft |

## Wellhead Pressure

**Wellhead pressure** is the pressure measured at the surface:

- **SIWHP (Shut-In Wellhead Pressure)**: Pressure when the well is closed
- **FWHP (Flowing Wellhead Pressure)**: Pressure during production

## The Blowout Risk

A **blowout** occurs when formation pressure exceeds the wellbore pressure, causing an uncontrolled flow of reservoir fluids to surface. Blowouts can be:

- **Underground**: Flow between formations
- **Surface**: Flow to the wellsite (most dangerous)

**Blowout causes:**
- Insufficient mud weight during drilling
- Failure of wellhead seals or valves
- Improper well control procedures

## Pressure Monitoring

As a wellhead technician, you must monitor and record:
1. Tubing pressure (FWHP)
2. All annulus pressures (A, B, C annuli)
3. Flowline pressure
4. Any pressure changes from baseline

> **Critical Safety Rule**: Any unexpected pressure increase in any annulus must be reported immediately to the supervisor. It may indicate a well integrity failure that could lead to a blowout.`
  },
  { moduleNumber: 4, lessonNumber: 2, titleEn: "PPE and Job Safety Analysis (JSA)", estimatedMinutes: 35, order: 2,
    content: `# PPE and Job Safety Analysis (JSA)

## Personal Protective Equipment (PPE)

PPE is the last line of defense against workplace hazards. It does not eliminate hazards — it only reduces the risk of injury.

### PPE Selection Matrix for Wellhead Work

| Task | Minimum PPE Required |
|------|---------------------|
| General inspection | Hard hat, safety glasses, steel-toed boots, FRC |
| Flange breaking | Add: face shield, chemical-resistant gloves |
| H₂S area | Add: H₂S monitor, SCBA ready |
| High-pressure testing | Add: full face shield, blast shield |
| Working at height | Add: full-body harness, lanyard |
| Chemical handling | Add: chemical splash goggles, chemical suit |

### Flame-Resistant Clothing (FRC)

FRC is mandatory in all hydrocarbon-handling areas. It:
- Does not ignite easily
- Self-extinguishes when the ignition source is removed
- Protects against flash fire (not sustained fire)

**Important**: FRC must be clean and free of hydrocarbon contamination to be effective.

## Job Safety Analysis (JSA)

A **JSA** (also called Job Hazard Analysis, JHA) is a systematic process to:
1. Identify all steps in a job
2. Identify hazards associated with each step
3. Determine controls to eliminate or reduce each hazard

### JSA Format

| Step | Potential Hazard | Risk Level | Control Measure |
|------|-----------------|------------|-----------------|
| 1. Isolate well | Pressurized fluids | HIGH | Follow LOTO procedure, verify zero energy |
| 2. Break flange | Residual pressure | HIGH | Crack flange slowly, stand to side |
| 3. Remove gasket | Sharp edges | LOW | Wear cut-resistant gloves |
| 4. Clean flange face | Chemical exposure | MEDIUM | Wear chemical gloves, eye protection |
| 5. Install new gasket | Pinch point | LOW | Use gasket alignment tools |
| 6. Torque bolts | Ergonomic strain | MEDIUM | Use hydraulic torque wrench |
| 7. Pressure test | High pressure | HIGH | Stand clear during test, use barriers |

### JSA Requirements

- Must be completed **before** starting any non-routine task
- Must involve **all workers** who will perform the task
- Must be reviewed and signed by the supervisor
- Must be kept on file for the duration of the job

> **Culture of Safety**: A good JSA is not a paperwork exercise — it is a genuine discussion about hazards. Take time to think through each step carefully. The few minutes spent on a JSA can save lives.`
  },
  { moduleNumber: 4, lessonNumber: 3, titleEn: "Lockout/Tagout (LOTO) and Energy Isolation", estimatedMinutes: 40, order: 3,
    content: `# Lockout/Tagout (LOTO) and Energy Isolation

## What is LOTO?

**Lockout/Tagout (LOTO)** is a safety procedure that ensures hazardous energy is properly isolated and cannot be accidentally released while maintenance work is being performed.

**LOTO protects against:**
- Unexpected energization of equipment
- Unexpected startup of machinery
- Release of stored energy (pressure, gravity, springs)

## Types of Hazardous Energy

| Energy Type | Wellhead Example | Isolation Method |
|-------------|-----------------|-----------------|
| **Hydraulic** | Wellhead pressure | Close and lock valves, bleed pressure |
| **Pneumatic** | Instrument air | Close and lock air supply, bleed |
| **Electrical** | Actuator motors | Disconnect and lock electrical supply |
| **Gravitational** | Suspended loads | Block or lower to stable position |
| **Thermal** | Hot fluids | Allow to cool, verify temperature |
| **Chemical** | Toxic/flammable fluids | Purge and flush system |

## The LOTO Procedure — Step by Step

### Step 1: Notify
Inform all affected personnel that LOTO is being applied.

### Step 2: Identify Energy Sources
Identify ALL energy sources that could affect the work area.

### Step 3: Shut Down
Follow the normal shutdown procedure for the equipment.

### Step 4: Isolate
Close all isolation valves, disconnect electrical supplies.

### Step 5: Apply Lockout/Tagout Devices
- **Lockout**: Apply a physical lock to the isolation device
- **Tagout**: Attach a tag identifying the worker and reason for isolation

### Step 6: Release Stored Energy
- Bleed pressure to zero
- Drain fluids
- Release spring tension
- Block suspended parts

### Step 7: Verify Zero Energy State
- Check pressure gauges (must read zero)
- Try to operate the equipment (should not move)
- Test for voltage (electrical systems)

### Step 8: Perform Maintenance Work

### Step 9: Remove LOTO (Reverse order)
Only the person who applied the lock can remove it.

## Multiple Lock Hasp

When multiple workers are on the same job, each worker applies their own lock to a **hasp** (a device that accepts multiple locks). The equipment cannot be energized until ALL locks are removed.

> **Non-Negotiable Rule**: Never remove another worker's lock. Never work on equipment that is not properly isolated. These rules save lives.`
  },
  { moduleNumber: 4, lessonNumber: 4, titleEn: "Emergency Shutdown (ESD) Systems and Fire Safety", estimatedMinutes: 45, order: 4,
    content: `# Emergency Shutdown (ESD) Systems and Fire Safety

## Emergency Shutdown (ESD) Systems

An **Emergency Shutdown (ESD) system** is an automated safety system that shuts down wellhead operations when abnormal conditions are detected.

### ESD System Components

| Component | Function |
|-----------|----------|
| **Sensors/detectors** | Detect abnormal conditions (pressure, gas, fire) |
| **Logic controller (SIS)** | Processes sensor signals and initiates shutdown |
| **ESD valves** | Automatically close to isolate the well |
| **Pressure safety valves (PSV)** | Relieve excess pressure |
| **Surface Safety Valve (SSV)** | Closes the Christmas tree on ESD signal |

### ESD Activation Conditions

ESD systems are typically activated by:
- **High wellhead pressure**: Exceeds set point (e.g., 110% of MAOP)
- **Low wellhead pressure**: May indicate a line rupture
- **Gas detection**: Combustible gas above 25% LEL
- **Fire detection**: Heat or flame sensors activated
- **Manual activation**: Emergency stop button pressed
- **Loss of control signal**: Fail-safe closure

### ESD Testing

ESD systems must be regularly tested:
- **Partial stroke testing**: Test valve movement without full closure (online)
- **Full stroke testing**: Complete valve closure test (requires shutdown)
- **Functional testing**: Test entire system including sensors and logic

## Fire Safety at Wellheads

### Fire Triangle

Fire requires three elements:
1. **Fuel**: Hydrocarbons (oil, gas)
2. **Oxygen**: Air
3. **Ignition source**: Spark, flame, hot surface

Removing any one element extinguishes the fire.

### Fire Classes and Extinguishers

| Class | Fuel Type | Extinguisher |
|-------|-----------|-------------|
| **A** | Ordinary combustibles | Water, foam |
| **B** | Flammable liquids/gases | CO₂, dry chemical, foam |
| **C** | Electrical equipment | CO₂, dry chemical |
| **D** | Combustible metals | Dry powder |

**For wellhead fires (Class B):**
- **Foam system**: Most effective for liquid hydrocarbon fires
- **Dry chemical**: Quick knockdown
- **CO₂**: For enclosed spaces

### Fire Response Procedure

1. **Activate ESD** (emergency stop)
2. **Sound alarm** — evacuate non-essential personnel
3. **Call emergency services**
4. **Account for all personnel**
5. **Fight fire only if**: Small, contained, escape route available, trained personnel

> **Golden Rule**: If in doubt, get out. No equipment is worth a human life. Evacuate first, fight fire only when safe to do so.`
  },
  { moduleNumber: 4, lessonNumber: 5, titleEn: "Hazard Identification, Risk Assessment, and Regulations", estimatedMinutes: 50, order: 5,
    content: `# Hazard Identification, Risk Assessment, and Regulations

## Hazard Identification and Risk Assessment (HIRA)

**HIRA** is a systematic process to identify hazards and evaluate the associated risks before performing work.

### The Risk Assessment Process

**Step 1: Identify Hazards**
Walk through the job mentally and physically. Ask: "What could go wrong?"

**Step 2: Assess Risk**
For each hazard, evaluate:
- **Likelihood**: How probable is the hazard occurring? (1-5 scale)
- **Consequence**: How severe would the outcome be? (1-5 scale)
- **Risk = Likelihood × Consequence**

**Risk Matrix:**

| | **Consequence 1 (Minor)** | **2 (Moderate)** | **3 (Serious)** | **4 (Major)** | **5 (Catastrophic)** |
|---|---|---|---|---|---|
| **Likelihood 5 (Almost certain)** | Medium | High | High | Extreme | Extreme |
| **4 (Likely)** | Low | Medium | High | High | Extreme |
| **3 (Possible)** | Low | Medium | Medium | High | High |
| **2 (Unlikely)** | Low | Low | Medium | Medium | High |
| **1 (Rare)** | Low | Low | Low | Medium | Medium |

**Step 3: Implement Controls (Hierarchy of Controls)**

1. **Elimination**: Remove the hazard entirely
2. **Substitution**: Replace with less hazardous alternative
3. **Engineering controls**: Physical barriers, ventilation
4. **Administrative controls**: Procedures, training, permits
5. **PPE**: Last resort

## Key Regulatory Standards

### API Standards for Wellheads

| Standard | Scope |
|----------|-------|
| **API 6A** | Wellhead and Christmas tree equipment |
| **API 6D** | Pipeline valves |
| **API 11D1** | Packers and bridge plugs |
| **API 14A** | Subsurface safety valve equipment |
| **API 14C** | Surface safety systems |

### OSHA Standards

- **29 CFR 1910.119**: Process Safety Management (PSM) — for highly hazardous chemicals
- **29 CFR 1910.147**: Control of Hazardous Energy (LOTO)
- **29 CFR 1910.134**: Respiratory Protection

> **Regulatory Compliance**: Following API and OSHA standards is not optional — it is a legal requirement. Violations can result in fines, shutdown orders, and criminal prosecution. More importantly, these standards exist to protect lives.`
  },
  { moduleNumber: 4, lessonNumber: 6, titleEn: "Environmental Safety and Audits", estimatedMinutes: 30, order: 6,
    content: `# Environmental Safety and Audits

## Environmental Hazards at Wellheads

Wellhead operations can cause environmental damage through:

1. **Hydrocarbon spills**: Oil contaminating soil and groundwater
2. **Gas emissions**: Methane (greenhouse gas), H₂S (toxic)
3. **Produced water discharge**: Saline water with dissolved hydrocarbons
4. **Chemical spills**: Treatment chemicals, lubricants

## Spill Prevention

### Primary Containment
- Wellhead integrity (no leaks)
- Properly maintained seals and gaskets
- Functional safety valves

### Secondary Containment
- **Bunds (berms)**: Earthen or concrete walls around wellheads
- **Drip pans**: Collect small leaks
- **Lined pits**: Collect larger spills

### Spill Response

If a spill occurs:
1. **Stop the source** if safe to do so
2. **Contain the spill** using absorbents, berms
3. **Report immediately** to supervisor and environmental team
4. **Document**: Volume, location, time, cause
5. **Clean up** using approved methods
6. **Investigate** root cause to prevent recurrence

## Environmental Audits

Regular environmental audits verify:
- Spill containment systems are functional
- Chemical storage is compliant
- Waste management procedures are followed
- Air emissions are within permitted limits
- Groundwater monitoring wells are sampled

### Audit Checklist Items

- [ ] Secondary containment intact and not full
- [ ] No visible leaks from wellhead components
- [ ] Chemical storage area properly labeled and contained
- [ ] Waste containers properly labeled and not overfull
- [ ] Emergency spill response equipment available
- [ ] Environmental monitoring records up to date

> **Environmental Responsibility**: Environmental violations can result in large fines, permit revocation, and reputational damage. More importantly, protecting the environment is the right thing to do. A professional wellhead technician takes environmental stewardship seriously.`
  },

  // Module 5: Inspection
  { moduleNumber: 5, lessonNumber: 1, titleEn: "The Daily Walk-Around: Visual Inspection Procedures", estimatedMinutes: 40, order: 1,
    content: `# The Daily Walk-Around: Visual Inspection Procedures

## Purpose of Daily Inspections

The daily walk-around inspection is the most important routine maintenance activity for a wellhead technician. Its purpose is to:
- Detect early signs of equipment degradation
- Identify leaks before they become major incidents
- Verify all safety systems are functional
- Maintain a baseline record of equipment condition

## Systematic Inspection Approach

Always follow the same systematic route to ensure nothing is missed. A good approach is **bottom to top, inside to outside**:

### 1. Ground Level — Foundation and Casing Head
- Check for soil staining (hydrocarbon leaks)
- Inspect casing head for external corrosion
- Check annulus access valve positions and condition
- Record all annulus pressures

### 2. Mid-Level — Casing Spools and Tubing Head
- Inspect all flange connections for leaks (look for staining, crystalline deposits)
- Check tubing head pressure gauge
- Inspect chemical injection points
- Check condition of insulation (if present)

### 3. Upper Level — Christmas Tree
- Inspect all valve bodies and stems for leaks
- Check valve position indicators (open/closed)
- Inspect choke body and downstream piping
- Check SSV (surface safety valve) condition
- Inspect pressure gauges for accuracy

### 4. Flowline Connection
- Check flowline connection for leaks
- Inspect flowline supports and clamps
- Check for erosion at choke outlet

## What to Look For

### Leak Indicators
- **Liquid leaks**: Wet spots, staining, drips
- **Gas leaks**: Hissing sound, ice formation (gas expansion cooling), dead vegetation
- **Seal leaks**: White crystalline deposits (salt from produced water)

### Corrosion Indicators
- Orange/red rust on carbon steel
- Green deposits on copper alloys
- Pitting on stainless steel
- Flaking or blistering paint

### Mechanical Damage
- Dents, cracks, or deformation
- Damaged valve handwheels
- Missing or damaged nameplates
- Loose or missing bolts

## Documentation

Every inspection must be documented:
- Date and time
- Inspector name
- Equipment condition (Normal/Abnormal)
- Any defects found (description, location, severity)
- Actions taken or recommended

> **Professional Standard**: A well-documented inspection record is a legal document. It demonstrates due diligence and protects both the company and the technician. Never skip documentation.`
  },
  { moduleNumber: 5, lessonNumber: 2, titleEn: "Valve Greasing and Actuator Function Testing", estimatedMinutes: 45, order: 2,
    content: `# Valve Greasing and Actuator Function Testing

## Why Valve Greasing is Critical

Gate valves in Christmas trees and wellheads rely on grease for:
1. **Lubrication**: Reduces friction between gate and seats
2. **Sealing**: Grease fills microscopic gaps in the seat sealing surfaces
3. **Corrosion protection**: Prevents corrosion of internal metal surfaces
4. **Contamination exclusion**: Keeps sand and debris out of the valve body

A valve that is not regularly greased will:
- Become difficult to operate
- Develop seat leaks
- Eventually seize completely

## Valve Greasing Procedure

### Required Equipment
- Grease gun (manual or pneumatic)
- Correct grease type (API 6A compliant, compatible with well fluids)
- Grease nipple adapter
- Rags for cleanup

### Procedure

1. **Identify the grease fitting**: Located on the valve body, usually a Zerk fitting
2. **Clean the fitting**: Remove dirt and old grease
3. **Attach grease gun**: Ensure positive connection
4. **Apply grease**: Pump slowly until fresh grease appears at the relief fitting or until resistance increases
5. **Record**: Log the amount of grease applied and valve condition

### Grease Quantities

| Valve Size | Approximate Grease Volume |
|-----------|--------------------------|
| 2-inch | 2-4 oz |
| 3-inch | 4-6 oz |
| 4-inch | 6-10 oz |
| 6-inch | 10-16 oz |

**Note**: These are approximate — always follow manufacturer's recommendations.

## Actuator Function Testing

**Actuators** are devices that open and close valves remotely (pneumatic, hydraulic, or electric). They must be regularly tested to ensure they will operate when needed.

### Pneumatic Actuator Testing

1. Verify instrument air supply pressure (typically 60-120 psi)
2. Apply control signal to open valve — verify full open position
3. Apply control signal to close valve — verify full closed position
4. Check for air leaks at actuator connections
5. Verify fail-safe position (spring return to open or closed)

### Hydraulic Actuator Testing

1. Check hydraulic fluid level
2. Verify hydraulic pressure
3. Cycle valve open and closed
4. Check for hydraulic fluid leaks
5. Verify response time is within specification

### ESD Valve Testing

ESD (Emergency Shutdown) valves must be tested more frequently:
- **Partial stroke test**: Monthly (valve moves 10-15% to verify it can move)
- **Full stroke test**: Annually (complete open/close cycle)

> **Documentation Requirement**: All valve function tests must be recorded with the date, result, and any anomalies observed. Failed tests must be reported immediately and the valve repaired or replaced before returning to service.`
  },
  { moduleNumber: 5, lessonNumber: 3, titleEn: "Pressure Monitoring and Annulus Management", estimatedMinutes: 35, order: 3,
    content: `# Pressure Monitoring and Annulus Management

## Understanding Wellhead Annuli

A typical production well has multiple annular spaces:

| Annulus | Location | Normal Condition |
|---------|----------|-----------------|
| **A-annulus** | Between production tubing and production casing | Completion fluid at known pressure |
| **B-annulus** | Between production casing and intermediate casing | Cement or drilling fluid |
| **C-annulus** | Between intermediate casing and surface casing | Cement or drilling fluid |

## Sustained Casing Pressure (SCP)

**Sustained Casing Pressure (SCP)** is pressure in any annulus that:
- Cannot be bled to zero, OR
- Returns to a positive value after bleeding

SCP is a serious well integrity issue that must be investigated.

### Causes of SCP

1. **Tubing leak**: Hole or connection failure in production tubing
2. **Packer failure**: Loss of seal between tubing and casing
3. **Casing leak**: Corrosion hole or connection failure
4. **Cement failure**: Gas migration through cement sheath
5. **Wellhead seal failure**: Leak at tubing hanger or casing hanger seals

### SCP Management Protocol

1. **Detect**: Regular pressure monitoring
2. **Record**: Document pressure readings and trends
3. **Report**: Notify supervisor and well integrity engineer
4. **Investigate**: Determine source of pressure
5. **Remediate**: Repair or manage the source
6. **Monitor**: Continue enhanced monitoring

## Pressure Recording

Wellhead pressures must be recorded:
- **Frequency**: Minimum daily for producing wells
- **Method**: Manual gauge reading or automated SCADA
- **Documentation**: Pressure log with date, time, values, and any anomalies

### Pressure Trend Analysis

Comparing current readings to historical baseline:
- **Stable pressure**: Normal operation
- **Gradual increase**: Possible seal degradation
- **Sudden increase**: Possible well control event
- **Gradual decrease**: Possible leak or depletion
- **Sudden decrease**: Possible line failure

> **Regulatory Requirement**: In many jurisdictions, SCP above regulatory thresholds must be reported to the regulatory authority. Know your local requirements and reporting obligations.`
  },
  { moduleNumber: 5, lessonNumber: 4, titleEn: "Non-Destructive Testing (NDT) Basics", estimatedMinutes: 40, order: 4,
    content: `# Non-Destructive Testing (NDT) Basics

## What is NDT?

**Non-Destructive Testing (NDT)** refers to a group of analysis techniques used to evaluate the properties of a material, component, or system without causing damage. For wellhead maintenance, NDT allows us to:

- Measure remaining wall thickness
- Detect internal and external corrosion
- Find cracks and defects
- Verify weld quality
- Assess equipment condition without disassembly

## Common NDT Methods for Wellheads

### 1. Visual Testing (VT)

The simplest and most common NDT method:
- Direct visual inspection with the naked eye
- Enhanced with mirrors, borescopes, cameras
- Detects surface defects, corrosion, damage

### 2. Ultrasonic Testing (UT)

High-frequency sound waves are used to measure:
- **Wall thickness**: Detect corrosion thinning
- **Internal defects**: Cracks, voids, inclusions

**How it works**: A transducer sends sound waves through the material. The time for the echo to return indicates thickness.

**Advantages**: Can be performed from one side only, no radiation hazard, portable equipment

### 3. Magnetic Particle Testing (MT)

Used to detect surface and near-surface defects in ferromagnetic materials:
1. Magnetize the component
2. Apply magnetic particles (dry powder or wet suspension)
3. Particles accumulate at defects (flux leakage)
4. Inspect under UV light (fluorescent particles)

**Limitations**: Only works on magnetic materials (carbon steel, not stainless steel)

### 4. Dye Penetrant Testing (PT)

Detects surface-breaking defects in any material:
1. Apply penetrant dye to clean surface
2. Allow dwell time (10-30 minutes)
3. Remove excess penetrant
4. Apply developer (draws penetrant out of defects)
5. Inspect — defects appear as colored indications

### 5. Radiographic Testing (RT)

X-rays or gamma rays are used to create images of internal structure:
- Detects internal defects, corrosion, weld quality
- Requires radiation safety precautions
- Produces permanent records (radiographs)

## NDT Qualification

NDT technicians must be qualified and certified:
- **Level I**: Performs tests under supervision
- **Level II**: Performs and interprets tests
- **Level III**: Develops procedures, trains others

**Certification bodies**: ASNT (American Society for Nondestructive Testing), PCN (UK)

> **Important**: NDT results must be interpreted by qualified personnel. As a wellhead technician, you may assist with NDT but should not interpret results unless properly certified.`
  },
  { moduleNumber: 5, lessonNumber: 5, titleEn: "Housekeeping and Environmental Care", estimatedMinutes: 30, order: 5,
    content: `# Housekeeping and Environmental Care

## Why Housekeeping Matters

Good housekeeping at wellhead sites is not just about appearance — it is a critical safety and environmental practice:

- **Safety**: A clean site prevents slips, trips, and falls
- **Early detection**: Clean equipment makes leaks easier to spot
- **Environmental protection**: Prevents contamination of soil and water
- **Regulatory compliance**: Regulators inspect site cleanliness
- **Professional image**: Reflects the quality of maintenance work

## Wellhead Site Housekeeping Standards

### Daily Tasks
- Remove all waste materials from the wellhead area
- Clean up any spills immediately
- Return tools to storage after use
- Clear access paths and escape routes
- Empty drip pans before they overflow

### Weekly Tasks
- Pressure wash wellhead equipment (where appropriate)
- Inspect and clean secondary containment (bunds)
- Check and clean drain systems
- Inspect chemical storage areas

### Monthly Tasks
- Inspect and maintain vegetation control (weeds can hide leaks)
- Check and clean wellhead identification signs
- Inspect and test spill response equipment

## Waste Management

### Types of Waste at Wellheads

| Waste Type | Examples | Disposal Method |
|-----------|---------|----------------|
| **Produced water** | Brine from well | Reinjection or treatment |
| **Oily rags** | Contaminated cleaning materials | Hazardous waste disposal |
| **Chemical containers** | Empty chemical drums | Return to supplier or hazardous waste |
| **Metal scrap** | Old gaskets, bolts | Recycling (if not contaminated) |
| **Hydrocarbons** | Spilled oil | Recovery and treatment |

### Waste Minimization

- Use only the amount of chemicals needed
- Choose reusable containers where possible
- Segregate waste for recycling
- Keep accurate waste records

## Spill Response Equipment

Every wellhead site should have:
- **Absorbent pads and booms**: For liquid spills
- **Spill kit**: Gloves, bags, absorbents
- **Drain plugs**: To block drains during spills
- **Emergency contact numbers**: Posted visibly

> **Environmental Stewardship**: The oil and gas industry operates under intense public and regulatory scrutiny. Every technician is an ambassador for the industry. Maintaining a clean, well-managed wellsite demonstrates professionalism and environmental responsibility.`
  },
  { moduleNumber: 5, lessonNumber: 6, titleEn: "Reporting Initial Findings", estimatedMinutes: 35, order: 6,
    content: `# Reporting Initial Findings

## The Importance of Accurate Reporting

Accurate and timely reporting of inspection findings is as important as the inspection itself. Poor reporting leads to:
- Defects not being repaired
- Regulatory non-compliance
- Liability issues if incidents occur
- Loss of maintenance history

## What to Report

Any finding that deviates from normal should be reported:

### Immediate Report (Stop Work if Necessary)
- Active hydrocarbon leaks
- Unusual pressure readings (high or low)
- Structural damage to wellhead components
- Gas detection alarm activations
- Any safety hazard that cannot be immediately controlled

### Routine Report (End of Shift)
- Minor corrosion observed
- Valve grease consumption higher than normal
- Equipment showing signs of wear
- Housekeeping issues

## How to Write an Effective Defect Report

A good defect report answers six questions:

| Question | Example |
|---------|---------|
| **What** | Corrosion on production wing valve body |
| **Where** | Well XY-15, Christmas tree, production wing valve, north face |
| **When** | Observed during daily inspection, 08:30, March 15 |
| **How bad** | Surface corrosion, approximately 20% of valve body, no visible pitting |
| **Photo** | Attached (photo reference: XY15-PWV-001) |
| **Recommendation** | Monitor at next inspection; schedule for cleaning and coating within 30 days |

## Inspection Templates

Using standardized templates ensures consistency and completeness:

### Daily Inspection Checklist Template

\`\`\`
Well ID: _______ Date: _______ Inspector: _______

PRESSURE READINGS:
Tubing pressure: _____ psi (Normal range: _____ to _____ psi)
A-annulus: _____ psi  B-annulus: _____ psi  C-annulus: _____ psi

VISUAL INSPECTION:
Casing head: □ Normal □ Abnormal (describe): _______
Tubing head: □ Normal □ Abnormal (describe): _______
Christmas tree: □ Normal □ Abnormal (describe): _______
Flowline connection: □ Normal □ Abnormal (describe): _______
Secondary containment: □ Normal □ Abnormal (describe): _______

DEFECTS FOUND: (use separate defect report for each)
□ None □ See attached defect reports

Signature: _______ Time completed: _______
\`\`\`

> **Professional Advice**: Your inspection reports are your professional record. Write them as if they will be read by a court of law — because someday, they might be.`
  },
];

// Quiz

  // Module 6: Corrective Maintenance
  { moduleNumber: 6, lessonNumber: 1, titleEn: "Valve Replacement: Gate Valves and Ball Valves", estimatedMinutes: 50, order: 1,
    content: `# Valve Replacement: Gate Valves and Ball Valves

## When to Replace a Valve

Valves should be replaced when:
- **Seat leakage**: Valve cannot achieve a bubble-tight shut-off
- **Stem leakage**: Packing is leaking and cannot be repacked
- **Body damage**: Corrosion, erosion, or mechanical damage
- **Actuator failure**: Actuator cannot be repaired in place
- **End of service life**: Reached maximum number of cycles or age

## Gate Valve Replacement Procedure

### Pre-Work Requirements
1. Obtain a valid **Work Permit** (hot work or cold work depending on conditions)
2. Complete a **JSA** for the specific task
3. Verify **LOTO** is applied — well is isolated and depressurized
4. Confirm **zero pressure** on all gauges
5. Gather all required tools, spare parts, and new valve

### Replacement Steps

1. **Drain residual fluids**: Open drain valve to collect any trapped fluids
2. **Remove bolts**: Use hydraulic torque wrench — follow cross-pattern
3. **Spread flanges**: Use hydraulic flange spreaders carefully
4. **Support old valve**: Use crane or chain hoist — never let it drop
5. **Remove old valve**: Lift clear of the flanges
6. **Inspect flange faces**: Check for damage, clean thoroughly
7. **Install new ring gaskets**: Never reuse old gaskets
8. **Position new valve**: Ensure correct flow direction (arrow on body)
9. **Install bolts**: Hand-tight first, then torque in cross-pattern
10. **Pressure test**: Hydrostatic test to 1.5× working pressure
11. **Function test**: Open and close valve, verify operation
12. **Document**: Record all work in maintenance management system

## Ball Valve Replacement

Ball valves are used in some wellhead applications (particularly for smaller bore connections):

**Key differences from gate valves:**
- Quarter-turn operation (90° from open to closed)
- Full bore or reduced bore options
- Soft seats (PTFE) or metal seats
- Soft seats require lower operating torque but have temperature limitations

## Torque Specifications

Always follow manufacturer's torque specifications. Example for 4-inch, 5000 psi flange:

| Bolt Size | Torque (ft-lbs) |
|-----------|----------------|
| 1-inch stud | 450-500 |
| 1.25-inch stud | 850-950 |
| 1.5-inch stud | 1,400-1,600 |

> **Critical**: Never estimate torque. Always use a calibrated torque wrench and follow the manufacturer's specifications. Improper torque is a leading cause of flange leaks.`
  },
  { moduleNumber: 6, lessonNumber: 2, titleEn: "Seal and Gasket Replacement", estimatedMinutes: 45, order: 2,
    content: `# Seal and Gasket Replacement

## Types of Seals Replaced During Wellhead Maintenance

### 1. Ring Joint Gaskets (Flange Seals)

The most common seal replacement task. Required whenever a flange is broken.

**Procedure:**
1. Clean the ring groove thoroughly — remove all old gasket material
2. Inspect the groove for damage (scratches, corrosion)
3. Measure the groove dimensions — verify correct ring size
4. Select correct ring material for the service (soft iron, SS316, etc.)
5. Lubricate the ring with anti-seize compound
6. Install ring in groove — do not force
7. Align flanges carefully — ring must seat evenly
8. Install and torque bolts per specification

### 2. Valve Stem Packing

Valve stem packing prevents leakage along the valve stem:

**Signs of packing failure:**
- Visible leakage along the stem
- Staining or crystalline deposits on the stem

**Repacking procedure:**
1. Isolate and depressurize the valve
2. Remove the packing gland nut
3. Extract old packing rings using a packing hook
4. Clean the stuffing box
5. Install new packing rings (correct material and size)
6. Install packing gland — tighten to manufacturer's specification
7. Pressure test and check for leaks

### 3. Tubing Hanger Seals

Tubing hanger seal replacement is a major operation requiring:
- Well kill (filling with heavy fluid to control pressure)
- Christmas tree removal
- Tubing hanger removal
- Seal replacement
- Reassembly and pressure testing

This work is typically performed by a specialized well intervention crew.

## Seal Material Selection

| Service Condition | Recommended Material |
|------------------|---------------------|
| Standard service | Nitrile (NBR) |
| High temperature (>120°C) | Viton (FKM) |
| Sour service (H₂S) | HNBR or Viton |
| Steam service | EPDM |
| Cryogenic | PTFE |

> **Material Compatibility**: Always verify that the seal material is compatible with the well fluids. Using the wrong material can cause rapid seal failure and a dangerous leak.`
  },
  { moduleNumber: 6, lessonNumber: 3, titleEn: "Choke Maintenance and Replacement", estimatedMinutes: 40, order: 3,
    content: `# Choke Maintenance and Replacement

## The Production Choke

The **production choke** is one of the most critical and most frequently maintained components of the Christmas tree. It controls the flow rate from the well by restricting the flow area.

## Why Chokes Wear Out

Chokes are subjected to:
- **Erosion**: Sand and solids in the production stream erode the choke bean
- **Corrosion**: Acidic fluids attack metal surfaces
- **Cavitation**: Pressure drop across the choke can cause cavitation damage
- **Hydrate formation**: Gas hydrates can plug the choke

## Fixed Choke (Bean Choke) Replacement

A **bean choke** is a simple orifice plate with a fixed hole size (measured in 64ths of an inch — "beans"):

**Replacement procedure:**
1. Isolate and depressurize the choke body
2. Remove the choke cap (threaded or flanged)
3. Extract the old bean using a bean puller tool
4. Inspect the choke body for erosion damage
5. Install new bean of correct size
6. Replace choke cap with new seal
7. Pressure test
8. Verify flow rate matches expected value

## Adjustable Choke Maintenance

**Adjustable chokes** use a needle-and-seat or disc-and-seat mechanism:

**Regular maintenance:**
- Lubricate the stem and packing
- Check for seat erosion (measure opening size)
- Inspect for body erosion downstream of the seat
- Verify position indicator accuracy

**Replacement criteria:**
- Seat erosion >10% of original dimension
- Body wall thickness below minimum
- Actuator failure (for remote-operated chokes)

## Choke Sizing

Choke size is critical for well management:
- **Too small**: Excessive backpressure, reduced production
- **Too large**: Insufficient backpressure, potential reservoir damage
- **Correct size**: Optimizes production while protecting the reservoir

The production engineer specifies the choke size based on reservoir data and production targets.

> **Never change choke size without authorization from the production engineer.** Incorrect choke sizing can damage the reservoir or cause surface equipment problems.`
  },
  { moduleNumber: 6, lessonNumber: 4, titleEn: "Flange Bolt Replacement and Torque Procedures", estimatedMinutes: 35, order: 4,
    content: `# Flange Bolt Replacement and Torque Procedures

## Wellhead Flange Fasteners

Wellhead flanges use **stud bolts** with two nuts (not cap screws). The studs are made of high-strength alloy steel:

| Material | Standard | Application |
|---------|---------|-------------|
| **B7 studs / 2H nuts** | ASTM A193/A194 | Standard service |
| **L7 studs / 4 nuts** | ASTM A320/A194 | Low temperature service |
| **B7M studs / 2HM nuts** | ASTM A193/A194 | Sour service (H₂S) |

## When to Replace Bolts

Replace bolts when:
- Corrosion reduces the diameter below minimum
- Thread damage prevents proper torquing
- Bolt has been stretched beyond yield (cannot be reused)
- Hydrogen embrittlement is suspected (sour service)
- Any bolt that has been fire-damaged

## Bolt Replacement Procedure

1. **Verify zero pressure** before starting
2. **Remove one bolt at a time** — never remove all bolts simultaneously
3. **Inspect the stud hole** — clean threads with tap if necessary
4. **Apply anti-seize compound** to threads (unless specified otherwise)
5. **Install new stud** — hand tight
6. **Install both nuts** — hand tight
7. **Torque in sequence** — follow cross-pattern

## Torque Sequence — Critical

For any flange, use the **cross-bolt tightening pattern**:

\`\`\`
8-bolt flange cross pattern:
1 → 5 → 3 → 7 → 2 → 6 → 4 → 8

Pass 1: 30% of final torque
Pass 2: 70% of final torque  
Pass 3: 100% of final torque
Pass 4: Clockwise verification (no movement = correct)
\`\`\`

## Torque Values

Torque values depend on:
- Bolt size and material
- Flange pressure rating
- Gasket type
- Lubrication condition

**Always use the manufacturer's torque table** — do not use generic values.

> **Documentation**: Record all torque values in the maintenance record. Include: bolt size, material, torque specification, actual torque applied, and date. This documentation is required for regulatory compliance.`
  },

  // Module 7: Offshore
  { moduleNumber: 7, lessonNumber: 1, titleEn: "Offshore Platform Types and Wellhead Configurations", estimatedMinutes: 45, order: 1,
    content: `# Offshore Platform Types and Wellhead Configurations

## Types of Offshore Platforms

Offshore oil and gas production uses several platform types, each suited to different water depths and conditions:

### Fixed Platforms
- **Steel jacket**: Tubular steel structure fixed to seabed with piles
- **Concrete gravity base (GBS)**: Massive concrete structure resting on seabed by gravity
- **Water depth**: Up to 500m
- **Wellheads**: Surface wellheads on the platform deck

### Compliant Structures
- **Tension Leg Platform (TLP)**: Floating platform held down by tendons
- **Spar platform**: Deep-draft floating cylinder
- **Water depth**: 300-2,000m

### Floating Production Systems
- **Semi-submersible**: Two pontoons support upper deck
- **FPSO (Floating Production, Storage and Offloading)**: Ship-shaped vessel
- **Water depth**: Up to 3,000m

### Subsea Systems
- **Subsea wellheads**: Equipment on the seabed, no surface platform
- **Controlled by**: Umbilicals from a floating facility or shore
- **Water depth**: Up to 3,000m+

## Offshore Wellhead Configurations

### Dry Tree (Surface Wellhead)
- Wellhead and Christmas tree on the platform deck
- Direct access for maintenance
- Similar to onshore but in marine environment

### Wet Tree (Subsea Wellhead)
- Wellhead and Christmas tree on the seabed
- Maintenance requires ROV (Remotely Operated Vehicle) or diver
- More complex and expensive to maintain

## Key Differences: Onshore vs. Offshore Wellheads

| Aspect | Onshore | Offshore |
|--------|---------|---------|
| **Access** | Direct, road access | Helicopter or boat |
| **Materials** | Carbon steel common | Corrosion-resistant alloys |
| **Maintenance** | Relatively easy | Complex, weather-dependent |
| **Cost** | Lower | Much higher |
| **Emergency response** | Fast | Slower, more complex |
| **Environmental impact** | Land contamination | Marine contamination |

> **Offshore Safety Priority**: On offshore platforms, the primary concern is always personnel safety. The sea is unforgiving — always follow the platform's safety management system and never take shortcuts.`
  },
  { moduleNumber: 7, lessonNumber: 2, titleEn: "Corrosion in Marine Environments", estimatedMinutes: 40, order: 2,
    content: `# Corrosion in Marine Environments

## Why Offshore Corrosion is More Severe

The marine environment is extremely corrosive due to:
- **Salt water**: Chloride ions accelerate electrochemical corrosion
- **High humidity**: Promotes atmospheric corrosion
- **Oxygen**: Dissolved oxygen in seawater drives corrosion reactions
- **Microbiological activity**: Sulfate-reducing bacteria (SRB) cause MIC (Microbiologically Influenced Corrosion)
- **Temperature**: Warm water increases corrosion rates
- **Wave action**: Mechanical erosion combined with corrosion

## Types of Corrosion at Offshore Wellheads

### 1. General (Uniform) Corrosion
- Uniform thinning of the metal surface
- Predictable and manageable
- Monitored by thickness measurements

### 2. Pitting Corrosion
- Localized attack creating deep pits
- More dangerous than uniform corrosion
- Can penetrate through wall while average thickness appears acceptable

### 3. Crevice Corrosion
- Occurs in confined spaces (under gaskets, in bolt holes)
- Accelerated by oxygen depletion in the crevice

### 4. Galvanic Corrosion
- Occurs when two dissimilar metals are in electrical contact in an electrolyte
- More noble metal (cathode) is protected; less noble metal (anode) corrodes

**Galvanic series (selected):**
- Most noble (protected): Gold, Platinum, Titanium, Stainless Steel (passive)
- Intermediate: Copper, Nickel, Monel
- Least noble (corrodes): Zinc, Aluminum, Carbon Steel, Cast Iron

## Corrosion Protection Methods

### Coatings and Linings
- **Epoxy coatings**: Barrier protection for submerged and splash zone
- **Thermal spray coatings**: Zinc or aluminum for long-term protection
- **Fusion-bonded epoxy (FBE)**: Pipeline internal and external protection

### Cathodic Protection (CP)
- **Sacrificial anodes**: Zinc or aluminum anodes attached to structure
- **Impressed current**: External electrical current applied to structure
- CP is essential for all submerged steel structures

### Material Selection
- **Duplex stainless steel**: High strength, excellent corrosion resistance
- **Super duplex**: Even better for very aggressive environments
- **Inconel/Incoloy**: Nickel alloys for extreme conditions
- **Titanium**: Excellent corrosion resistance, high cost

## Corrosion Monitoring

Regular monitoring is essential:
- **Ultrasonic thickness measurements**: Track wall loss over time
- **Corrosion coupons**: Weighed before and after exposure
- **Corrosion probes**: Electronic resistance or linear polarization
- **Chemical analysis**: Monitor inhibitor effectiveness

> **Proactive Approach**: Corrosion management is most cost-effective when done proactively. Waiting until corrosion causes a failure is always more expensive — and potentially catastrophic.`
  },
  { moduleNumber: 7, lessonNumber: 3, titleEn: "ROV Operations and Subsea Maintenance", estimatedMinutes: 45, order: 3,
    content: `# ROV Operations and Subsea Maintenance

## What is an ROV?

A **Remotely Operated Vehicle (ROV)** is an unmanned underwater robot used for inspection and intervention at subsea wellheads. ROVs are essential for:
- Visual inspection of subsea equipment
- Operating valves and actuators
- Installing and retrieving tools
- Performing light maintenance tasks

## ROV Classes

| Class | Depth Rating | Capability | Application |
|-------|-------------|------------|-------------|
| **Observation class** | <300m | Camera only | Inspection |
| **Work class** | Up to 3,000m | Manipulators, tools | Maintenance |
| **Trenching class** | Variable | Trenching tools | Pipeline burial |

## ROV Tooling for Wellhead Maintenance

Work-class ROVs are equipped with:
- **Manipulator arms**: For gripping and operating equipment
- **Torque tools**: For operating valves and bolts
- **Hot stab panels**: For connecting hydraulic and electrical circuits
- **Cameras**: Multiple HD cameras for inspection
- **Sonar**: For navigation in low visibility
- **Lights**: High-intensity LED lighting

## Subsea Wellhead Components

### Subsea Christmas Tree (SCT)

The subsea Christmas tree is more complex than a surface tree:
- **Horizontal tree**: Most common modern design
- **Vertical tree**: Older design, tubing hanger in wellhead
- **All valves**: Hydraulically or electrically actuated (no manual operation)
- **ROV panels**: Dedicated panels for ROV tool interfaces

### Subsea Control System

Subsea wellheads are controlled through:
- **Umbilical**: Bundle of hydraulic hoses, electrical cables, and fiber optics
- **Subsea Control Module (SCM)**: Electronic controller on the tree
- **Topside Control System**: Platform or vessel control room

## Diver-Assisted Maintenance

In shallower water (typically <200m), **saturation divers** can perform maintenance:
- More dexterous than ROVs for complex tasks
- Can work for extended periods at depth
- Expensive and high-risk
- Being replaced by ROVs for many tasks

> **Subsea Complexity**: Subsea wellhead maintenance is highly specialized work. As a wellhead technician, understanding subsea systems helps you appreciate the full scope of the industry, even if your primary work is surface wellheads.`
  },
  { moduleNumber: 7, lessonNumber: 4, titleEn: "Weather Windows and Offshore Logistics", estimatedMinutes: 35, order: 4,
    content: `# Weather Windows and Offshore Logistics

## The Challenge of Offshore Logistics

Getting people and equipment to offshore platforms is complex, expensive, and weather-dependent. Understanding logistics is essential for planning maintenance activities.

## Helicopter Operations

Most personnel travel to offshore platforms by helicopter:

| Helicopter Type | Capacity | Range | Common Use |
|----------------|---------|-------|------------|
| **Sikorsky S-92** | 19 passengers | 750 nm | Large platforms |
| **AgustaWestland AW139** | 12 passengers | 500 nm | Medium platforms |
| **Airbus H175** | 16 passengers | 450 nm | Various |

**Helicopter safety requirements:**
- Helicopter Underwater Escape Training (HUET) certification
- Survival suit worn during flight
- Weight and baggage restrictions
- Weather minimums (visibility, wind, wave height)

## Supply Vessel Operations

Heavy equipment and bulk materials travel by supply vessel:
- **Platform Supply Vessel (PSV)**: Deck cargo and liquid bulk
- **Anchor Handling Tug Supply (AHTS)**: Anchor handling and towing
- **Fast Supply Vessel (FSV)**: Urgent personnel and small cargo

## Weather Windows

Offshore maintenance is highly weather-dependent:

| Operation | Maximum Wave Height | Maximum Wind Speed |
|-----------|--------------------|--------------------|
| Helicopter operations | 4-6m Hs | 35-45 knots |
| Supply vessel operations | 3-5m Hs | 30-40 knots |
| Crane lifts | 1.5-3m Hs | 20-30 knots |
| Diving operations | 1.5-2m Hs | 20 knots |
| ROV operations | 3-4m Hs | 35 knots |

## Planning Offshore Maintenance

Due to weather uncertainty, offshore maintenance requires careful planning:

1. **Long-lead items**: Order spare parts well in advance
2. **Contingency planning**: Have backup plans if weather delays work
3. **Integrated schedule**: Coordinate with production, drilling, and logistics
4. **Personnel competency**: Ensure all personnel have required certifications
5. **Equipment certification**: All lifting equipment must be certified

> **Offshore Mindset**: On an offshore platform, you cannot just "run to the store" for a missing part or tool. Thorough preparation before going offshore is essential. A missing tool or wrong spare part can delay a job by days and cost tens of thousands of dollars.`
  },

  // Module 8: Advanced Troubleshooting
  { moduleNumber: 8, lessonNumber: 1, titleEn: "Systematic Fault Diagnosis", estimatedMinutes: 45, order: 1,
    content: `# Systematic Fault Diagnosis

## The Importance of Systematic Troubleshooting

When a wellhead problem occurs, the temptation is to immediately start replacing parts. This approach is:
- Expensive (unnecessary part replacement)
- Time-consuming (wrong diagnosis)
- Potentially dangerous (wrong fix)

A systematic approach saves time, money, and ensures the real problem is identified and fixed.

## The 6-Step Troubleshooting Process

### Step 1: Define the Problem
- What exactly is the symptom?
- When did it start?
- Has anything changed recently (maintenance, production rate, fluid composition)?
- Is it getting worse or stable?

### Step 2: Gather Information
- Review maintenance history
- Check pressure and flow data trends
- Interview operators who noticed the problem
- Review any recent work orders

### Step 3: Identify Possible Causes
- List all possible causes of the observed symptom
- Use cause-and-effect (fishbone) diagrams if helpful
- Consider: mechanical, process, environmental, and human factors

### Step 4: Test Hypotheses
- Start with the most likely and easiest-to-test causes
- Use diagnostic tests to confirm or eliminate each cause
- Change only one variable at a time

### Step 5: Implement the Fix
- Once the root cause is identified, implement the appropriate repair
- Follow proper procedures and work permits
- Document all work performed

### Step 6: Verify and Monitor
- Confirm the fix resolved the problem
- Monitor for recurrence
- Update maintenance records

## Common Wellhead Problems and Causes

| Symptom | Possible Causes |
|---------|----------------|
| **Annulus pressure buildup** | Tubing leak, packer failure, casing leak, cement failure |
| **Wellhead pressure drop** | Tubing scale, wax buildup, choke plugging, reservoir depletion |
| **Valve won't close fully** | Seat erosion, debris on seat, stem damage, actuator failure |
| **Flange leak** | Gasket failure, insufficient torque, flange face damage, thermal cycling |
| **Choke erosion** | High sand production, incorrect choke size, cavitation |

> **Root Cause Analysis**: The goal is not just to fix the symptom but to identify and eliminate the root cause. A valve that keeps leaking needs a root cause analysis — why does it keep failing? Is it the wrong material? Wrong operating procedure? Excessive sand production?`
  },
  { moduleNumber: 8, lessonNumber: 2, titleEn: "Predictive Maintenance Technologies", estimatedMinutes: 40, order: 2,
    content: `# Predictive Maintenance Technologies

## From Reactive to Predictive

The evolution of maintenance strategies:

| Strategy | Approach | Cost | Reliability |
|---------|---------|------|------------|
| **Reactive** | Fix when broken | High (emergency) | Low |
| **Preventive** | Maintain on schedule | Medium | Medium |
| **Predictive** | Maintain when needed | Low | High |
| **Prescriptive** | AI recommends actions | Lowest | Highest |

## Vibration Analysis

**Vibration monitoring** detects mechanical problems in rotating equipment:
- Imbalance
- Misalignment
- Bearing wear
- Looseness

**How it works**: Accelerometers measure vibration. Changes in vibration signature indicate developing problems before failure occurs.

## Acoustic Emission Testing

**Acoustic emission (AE)** detects stress waves produced by:
- Active corrosion
- Crack propagation
- Leak detection
- Valve seat leakage

Particularly useful for detecting valve seat leakage without disassembly.

## Infrared Thermography

**Thermal imaging** detects temperature anomalies:
- **Hot spots**: Electrical problems, friction, blocked flow
- **Cold spots**: Insulation failure, hydrate formation
- **Leaks**: Temperature difference at leak points

## Online Corrosion Monitoring

**Corrosion probes** provide continuous data:
- **Electrical resistance (ER) probes**: Measure metal loss over time
- **Linear polarization resistance (LPR)**: Instantaneous corrosion rate
- **Hydrogen probes**: Detect hydrogen permeation (SCC risk)

## Data Analytics and IIoT

The **Industrial Internet of Things (IIoT)** connects wellhead sensors to cloud platforms:
- Real-time monitoring of all parameters
- Trend analysis and anomaly detection
- Machine learning algorithms predict failures
- Automated alerts to maintenance teams

**Key performance indicators (KPIs) for predictive maintenance:**
- Mean Time Between Failures (MTBF)
- Mean Time To Repair (MTTR)
- Overall Equipment Effectiveness (OEE)
- Maintenance cost per unit of production

> **The Future of Maintenance**: Predictive maintenance using IIoT and AI is transforming the oil and gas industry. Technicians who understand both the physical equipment and the digital tools will be the most valuable professionals in the field.`
  },
  { moduleNumber: 8, lessonNumber: 3, titleEn: "Emergency Response Procedures", estimatedMinutes: 45, order: 3,
    content: `# Emergency Response Procedures

## Types of Wellhead Emergencies

### 1. Well Blowout
An uncontrolled flow of reservoir fluids to surface.

**Signs of impending blowout:**
- Unexpected increase in wellhead pressure
- Increase in gas-oil ratio
- Unusual flow behavior
- Loss of well control

**Immediate response:**
1. Activate ESD system
2. Evacuate non-essential personnel
3. Notify supervisor and emergency response team
4. Do NOT attempt to manually close valves on a flowing well without training
5. Call well control specialists (Wild Well Control, Boots & Coots)

### 2. Fire at Wellhead

**Immediate response:**
1. Activate ESD to shut in the well (removes fuel source)
2. Sound fire alarm
3. Evacuate to muster point
4. Account for all personnel
5. Call emergency services
6. Fight fire only if: small, contained, trained personnel, escape route available

**Important**: A wellhead fire fed by gas or oil cannot be extinguished until the fuel source is shut off. Focus on shutting in the well, not fighting the fire.

### 3. H₂S Release

Hydrogen sulfide (H₂S) is an extremely toxic gas:
- **Detectable by smell**: Rotten egg odor at low concentrations
- **Olfactory fatigue**: At high concentrations, you CANNOT smell it
- **Immediately dangerous**: >100 ppm can cause rapid incapacitation

**H₂S emergency response:**
1. Don SCBA immediately if alarm sounds
2. Evacuate upwind
3. Account for all personnel
4. Do not re-enter without SCBA
5. Notify emergency response team

### 4. Major Hydrocarbon Spill

**Immediate response:**
1. Stop the source if safe to do so
2. Contain the spill (close drains, deploy booms)
3. Eliminate ignition sources
4. Notify supervisor and environmental team
5. Document: time, volume, location

## Emergency Muster and Evacuation

All personnel must know:
- Location of muster points
- Evacuation routes
- Assembly point
- Emergency contact numbers
- Their role in the emergency response plan

> **Emergency Preparedness**: Emergencies happen without warning. Know your emergency procedures BEFORE you need them. Participate actively in all drills — they save lives.`
  },
  { moduleNumber: 8, lessonNumber: 4, titleEn: "Root Cause Analysis (RCA) Methods", estimatedMinutes: 35, order: 4,
    content: `# Root Cause Analysis (RCA) Methods

## What is Root Cause Analysis?

**Root Cause Analysis (RCA)** is a systematic process to identify the fundamental cause of a problem or incident. The goal is to prevent recurrence by addressing the root cause, not just the symptom.

## The 5 Whys Method

The simplest RCA tool — ask "why" five times:

**Example: Flange leak on Christmas tree**

1. **Why** did the flange leak? → The gasket failed
2. **Why** did the gasket fail? → It was not replaced during the last maintenance
3. **Why** was it not replaced? → The maintenance procedure did not require it
4. **Why** did the procedure not require it? → The procedure was not updated after the last revision
5. **Why** was the procedure not updated? → There is no procedure review process

**Root cause**: Lack of a procedure review process
**Corrective action**: Implement a regular procedure review cycle

## Fishbone (Ishikawa) Diagram

The **fishbone diagram** organizes potential causes into categories:

\`\`\`
                    PROBLEM
                       ↑
Man ──────────────────┤
Machine ──────────────┤
Method ───────────────┤
Material ─────────────┤
Environment ──────────┤
Measurement ──────────┘
\`\`\`

For each category, brainstorm possible causes.

## Fault Tree Analysis (FTA)

**FTA** is a top-down, deductive analysis that uses logic gates (AND, OR) to trace from the top event (failure) to root causes.

## RCA Documentation

A complete RCA report includes:
1. **Incident description**: What happened, when, where
2. **Timeline**: Sequence of events leading to the incident
3. **Evidence**: Physical evidence, data, witness statements
4. **Root cause(s)**: The fundamental cause(s)
5. **Contributing factors**: Factors that allowed the root cause to exist
6. **Corrective actions**: Specific actions to prevent recurrence
7. **Lessons learned**: Broader lessons for the organization

> **Learning Culture**: A good RCA is not about assigning blame — it is about learning and improvement. Organizations that conduct thorough RCAs and implement corrective actions continuously improve their safety and reliability performance.`
  },

  // Module 9: Installation and Workovers
  { moduleNumber: 9, lessonNumber: 1, titleEn: "Wellhead Installation: From Spud to First Production", estimatedMinutes: 50, order: 1,
    content: `# Wellhead Installation: From Spud to First Production

## The Drilling and Completion Process

Understanding wellhead installation requires understanding the drilling process:

### Phase 1: Conductor Installation
1. Drill the conductor hole (typically 26-36 inches diameter)
2. Run the conductor pipe (surface casing)
3. Cement the conductor in place
4. **Install the casing head** — weld to the conductor pipe

### Phase 2: Surface Casing
1. Drill the surface hole (typically 17.5 inches)
2. Run the surface casing
3. Cement the surface casing
4. **Install the surface casing spool** — land the casing hanger

### Phase 3: Intermediate Casing (if required)
1. Drill to intermediate depth
2. Run intermediate casing
3. Cement
4. **Install intermediate casing spool**

### Phase 4: Production Casing
1. Drill to total depth (TD)
2. Log the well
3. Run production casing
4. Cement
5. **Install production casing spool or tubing head**

### Phase 5: Completion
1. Perforate the production zone
2. Run production tubing with packer
3. **Land tubing hanger in tubing head**
4. **Install Christmas tree**
5. Test all wellhead components
6. Open well to production

## Wellhead Installation Best Practices

- **Cleanliness**: Keep all components clean during installation
- **Thread protection**: Use thread protectors until ready to make up
- **Torque specifications**: Follow manufacturer's specs for all connections
- **Pressure testing**: Test each component as it is installed
- **Documentation**: Record all installation data

## The Wellhead Technician's Role During Installation

During well construction, the wellhead technician:
- Inspects incoming equipment
- Assists with installation of wellhead components
- Witnesses and documents pressure tests
- Ensures correct API ring gaskets are used
- Verifies torque values

> **Quality During Installation**: Problems that are not caught during installation become expensive maintenance issues later. A thorough installation with proper documentation is the foundation of reliable well performance.`
  },
  { moduleNumber: 9, lessonNumber: 2, titleEn: "Workover Operations: Well Interventions", estimatedMinutes: 45, order: 2,
    content: `# Workover Operations: Well Interventions

## What is a Workover?

A **workover** is any operation performed on an existing well to restore or improve production, or to perform maintenance on downhole equipment. Workovers require removing the Christmas tree and accessing the wellbore.

## Types of Workover Operations

### 1. Tubing Replacement
- Tubing string is pulled and replaced
- Reasons: Corrosion, scale buildup, mechanical damage, size change
- Requires: Well kill, tree removal, workover rig

### 2. Packer Replacement
- Downhole packer is retrieved and replaced
- Reasons: Packer seal failure, stuck packer
- Requires: Well kill, tree removal, workover rig

### 3. Sand Control
- Installing or replacing sand screens or gravel pack
- Reasons: Excessive sand production damaging surface equipment
- Requires: Specialized sand control equipment

### 4. Stimulation
- **Acidizing**: Acid injection to dissolve formation damage
- **Hydraulic fracturing**: High-pressure fluid injection to create fractures
- Reasons: Improve productivity of damaged or tight formations

### 5. Plug and Abandonment (P&A)
- Permanently plugging the well
- Reasons: End of economic life, regulatory requirement
- Requires: Multiple cement plugs, wellhead removal

## The Workover Process

1. **Plan**: Engineering design, risk assessment, regulatory approval
2. **Kill the well**: Pump heavy fluid (kill fluid) to balance formation pressure
3. **Remove the Christmas tree**: Safely with well killed
4. **Install BOP stack**: Blowout preventer for safety during workover
5. **Perform the workover operation**
6. **Run completion**: New tubing, packer, etc.
7. **Install Christmas tree**: New or refurbished
8. **Pressure test**: All wellhead components
9. **Return to production**

## Wellhead Technician's Role in Workovers

- Assist with Christmas tree removal and installation
- Inspect and refurbish wellhead components during the workover
- Replace worn seals, gaskets, and valves
- Witness and document all pressure tests
- Ensure all components are correctly installed and torqued

> **Workover Safety**: Workovers are high-risk operations because the well is opened and the BOP is the primary barrier. All personnel must be fully briefed on the well control procedures before starting any workover.`
  },
  { moduleNumber: 9, lessonNumber: 3, titleEn: "Wireline and Coiled Tubing Operations", estimatedMinutes: 40, order: 3,
    content: `# Wireline and Coiled Tubing Operations

## Well Intervention Without Full Workover

Many downhole operations can be performed without a full workover using **wireline** or **coiled tubing** through the Christmas tree. These are called **well interventions** or **light workovers**.

## Wireline Operations

**Wireline** uses a single wire or multi-strand cable to lower tools into the well through the Christmas tree.

### Types of Wireline

| Type | Description | Application |
|------|-------------|-------------|
| **Slickline** | Single smooth wire | Mechanical operations (plugs, gauges) |
| **Electric line (e-line)** | Multi-conductor cable | Logging, perforating |

### Common Wireline Operations

- **Gauge runs**: Measure downhole pressure and temperature
- **Plug setting/retrieval**: Install or remove downhole plugs
- **Perforation**: Create holes in casing to connect to formation
- **Scale removal**: Mechanical tools to remove scale deposits
- **Safety valve maintenance**: Test and replace SSSV

### Wireline Equipment at the Wellhead

- **Lubricator**: Pressure-containing tube above the Christmas tree
- **Stuffing box**: Seals around the wireline
- **Injector head**: Drives the wireline into the well
- **Control panel**: Monitors depth and tension

## Coiled Tubing Operations

**Coiled tubing (CT)** uses a continuous length of small-diameter steel tubing (typically 1-3.5 inches) wound on a reel.

### Advantages of Coiled Tubing

- Can pump fluids downhole while moving
- Can be used in live wells (under pressure)
- Faster than conventional workover for many operations
- Can reach horizontal sections of wells

### Common CT Operations

- **Nitrogen kick-off**: Unloading a dead well
- **Acid stimulation**: Pumping acid through CT to target zone
- **Scale removal**: Mechanical or chemical
- **Sand cleanout**: Removing sand from the wellbore
- **Cement remediation**: Squeezing cement to repair leaks

## Wellhead Technician's Role

During wireline and CT operations:
- Ensure Christmas tree valves are in correct position
- Monitor wellhead pressure during operations
- Assist with lubricator installation and removal
- Maintain communication with the wireline/CT crew
- Document all operations

> **Live Well Operations**: Wireline and CT operations are performed on live wells (under pressure). The wellhead valves and lubricator are the primary barriers. Never compromise the integrity of these barriers.`
  },

  // Module 10: Documentation
  { moduleNumber: 10, lessonNumber: 1, titleEn: "Maintenance Records and Work Orders", estimatedMinutes: 35, order: 1,
    content: `# Maintenance Records and Work Orders

## The Importance of Documentation

Maintenance documentation serves multiple critical purposes:

1. **Safety**: Records demonstrate that safety procedures were followed
2. **Legal**: Documentation protects against liability claims
3. **Regulatory**: Regulators require maintenance records
4. **Technical**: Historical data enables trend analysis
5. **Financial**: Records support cost tracking and budgeting
6. **Knowledge management**: Captures institutional knowledge

## Work Order System

A **work order** is the formal document that authorizes, describes, and records maintenance work.

### Work Order Lifecycle

\`\`\`
IDENTIFY NEED → CREATE WORK ORDER → PLAN → SCHEDULE → EXECUTE → CLOSE → ANALYZE
\`\`\`

### Work Order Types

| Type | Description | Priority |
|------|-------------|---------|
| **Emergency** | Immediate safety or production threat | Immediate |
| **Urgent** | Significant risk if not addressed quickly | Same day |
| **Routine** | Scheduled preventive maintenance | As scheduled |
| **Deferred** | Can be postponed without significant risk | Next opportunity |

### Work Order Content

A complete work order includes:
- **Equipment ID**: Unique identifier for the equipment
- **Location**: Exact location of the equipment
- **Description**: What work needs to be done
- **Priority**: Emergency/Urgent/Routine/Deferred
- **Safety requirements**: PPE, permits, LOTO requirements
- **Procedure reference**: Which procedure to follow
- **Parts required**: Spare parts needed
- **Labor estimate**: Hours required
- **Actual work performed**: What was actually done
- **Parts used**: Actual parts consumed
- **Completion date**: When work was completed
- **Technician signature**: Who performed the work

## As-Found / As-Left Documentation

For any maintenance task, document:
- **As-found condition**: Equipment condition when work started
- **Work performed**: Detailed description of all work done
- **As-left condition**: Equipment condition when work was completed
- **Test results**: Pressure test values, function test results

> **Professional Standard**: If it's not documented, it didn't happen. This is the fundamental principle of maintenance documentation. Your records are your professional legacy.`
  },
  { moduleNumber: 10, lessonNumber: 2, titleEn: "CMMS: Computerized Maintenance Management Systems", estimatedMinutes: 40, order: 2,
    content: `# CMMS: Computerized Maintenance Management Systems

## What is a CMMS?

A **Computerized Maintenance Management System (CMMS)** is software that manages maintenance activities, equipment data, and maintenance history. It is the digital backbone of modern maintenance operations.

## Core CMMS Functions

### 1. Equipment Registry (Asset Management)
- Complete list of all equipment with unique IDs
- Equipment specifications and documentation
- Maintenance history for each asset
- Spare parts list for each equipment type

### 2. Work Order Management
- Create, assign, and track work orders
- Priority management
- Labor and parts tracking
- Work order history

### 3. Preventive Maintenance Scheduling
- Automatic generation of PM work orders
- Calendar-based or meter-based triggers
- PM compliance tracking

### 4. Spare Parts Management
- Inventory tracking
- Reorder point management
- Parts reservation for planned work
- Supplier information

### 5. Reporting and Analytics
- Equipment reliability metrics
- Maintenance cost analysis
- PM compliance reports
- Backlog management

## Common CMMS Platforms in Oil & Gas

| Platform | Vendor | Common Use |
|---------|--------|-----------|
| **SAP PM** | SAP | Large integrated companies |
| **IBM Maximo** | IBM | Asset-intensive industries |
| **Infor EAM** | Infor | Manufacturing and O&G |
| **UpKeep** | UpKeep | Smaller operations |
| **Fiix** | Rockwell | Mid-size operations |

## Using CMMS as a Wellhead Technician

Daily CMMS tasks:
1. **Check assigned work orders**: What is scheduled for today?
2. **Update work order status**: In progress, completed, waiting for parts
3. **Record work performed**: Detailed notes on what was done
4. **Record parts used**: Update inventory
5. **Close work orders**: When work is complete and tested

> **CMMS Discipline**: The CMMS is only as good as the data entered into it. Incomplete or inaccurate entries undermine the entire maintenance management system. Take time to enter complete, accurate information — your colleagues and future technicians depend on it.`
  },
  { moduleNumber: 10, lessonNumber: 3, titleEn: "Regulatory Reporting and Compliance", estimatedMinutes: 35, order: 3,
    content: `# Regulatory Reporting and Compliance

## Regulatory Framework Overview

Wellhead operations are subject to multiple layers of regulation:

| Level | Examples |
|-------|---------|
| **International** | ISO standards, IOGP guidelines |
| **National** | OSHA (US), HSE (UK), NOPSEMA (Australia) |
| **State/Regional** | State oil and gas commissions |
| **Company** | Internal standards and procedures |

## Required Reports and Records

### Well Integrity Reports

Most jurisdictions require regular well integrity reporting:
- **Annual well integrity assessment**: Comprehensive review of all barriers
- **Sustained casing pressure reports**: Any SCP above threshold
- **Incident reports**: Any well integrity failures

### Environmental Reports

- **Spill reports**: Any hydrocarbon release above threshold volume
- **Air emissions reports**: Annual greenhouse gas reporting
- **Produced water discharge**: Volume and quality monitoring

### Safety Reports

- **Incident reports**: Injuries, near-misses, dangerous occurrences
- **Safety statistics**: Lost time injury frequency (LTIF), total recordable case rate (TRCR)

## Permit to Work (PTW) System

The **Permit to Work** system is a formal safety management tool:

| Permit Type | Application |
|------------|-------------|
| **Cold work permit** | Non-sparking work in non-hazardous areas |
| **Hot work permit** | Welding, grinding, spark-producing work |
| **Confined space entry** | Work inside vessels, pits, tanks |
| **Electrical isolation** | Work on electrical systems |
| **Excavation permit** | Ground disturbance |
| **Radiation permit** | Use of radioactive sources |

### PTW Process

1. **Identify the work**: What needs to be done?
2. **Assess the hazards**: JSA/risk assessment
3. **Apply for permit**: Describe work, hazards, controls
4. **Authorize**: Supervisor/area authority signs off
5. **Execute**: Perform work per permit conditions
6. **Close**: Verify work complete, area safe, permit closed

> **Compliance Culture**: Regulatory compliance is not optional. Violations can result in fines, shutdown orders, loss of operating license, and criminal prosecution. More importantly, regulations exist to protect workers and the environment.`
  },

  // Module 11: Maintenance Strategies
  { moduleNumber: 11, lessonNumber: 1, titleEn: "Preventive Maintenance Programs", estimatedMinutes: 40, order: 1,
    content: `# Preventive Maintenance Programs

## What is Preventive Maintenance?

**Preventive Maintenance (PM)** is maintenance performed at predetermined intervals or according to prescribed criteria, intended to reduce the probability of failure or degradation of equipment.

## PM Interval Types

### Time-Based PM
- Performed at fixed time intervals (daily, weekly, monthly, annually)
- Simple to schedule and manage
- May result in over-maintenance (replacing parts that are still good)

### Condition-Based PM (CBM)
- Performed when equipment condition indicates maintenance is needed
- Requires monitoring (vibration, temperature, thickness measurements)
- More cost-effective but requires more sophisticated monitoring

### Usage-Based PM
- Performed after a certain number of operating hours or cycles
- Common for rotating equipment and valves

## Wellhead PM Schedule Example

| Task | Frequency | Trigger |
|------|-----------|---------|
| Visual inspection | Daily | Time-based |
| Pressure recording | Daily | Time-based |
| Valve greasing | Monthly | Time-based |
| Actuator function test | Monthly | Time-based |
| Flange bolt torque check | Quarterly | Time-based |
| Pressure gauge calibration | Annually | Time-based |
| Full wellhead inspection | Annually | Time-based |
| Hydrostatic pressure test | Per API 6A | Time/condition |
| Ultrasonic thickness measurement | Annually | Time-based |
| Valve overhaul | 5 years or condition | Time/condition |

## Developing a PM Program

1. **Identify all equipment**: Complete asset register
2. **Identify failure modes**: What can go wrong?
3. **Determine PM tasks**: What maintenance prevents each failure?
4. **Set intervals**: How often should each task be performed?
5. **Assign responsibilities**: Who performs each task?
6. **Document procedures**: How is each task performed?
7. **Track compliance**: Are PMs being completed on time?
8. **Analyze and improve**: Are PMs effective? Adjust intervals based on data.

## PM Effectiveness Metrics

- **PM compliance**: % of PMs completed on time (target: >95%)
- **Defects found per PM**: Indicates PM is finding problems
- **Emergency work ratio**: % of work that is emergency vs. planned (target: <10% emergency)

> **Investment in Prevention**: Every dollar spent on preventive maintenance saves $3-5 in reactive maintenance costs. PM programs also improve safety and production reliability.`
  },
  { moduleNumber: 11, lessonNumber: 2, titleEn: "Reliability-Centered Maintenance (RCM)", estimatedMinutes: 45, order: 2,
    content: `# Reliability-Centered Maintenance (RCM)

## What is RCM?

**Reliability-Centered Maintenance (RCM)** is a systematic process to determine the maintenance requirements of physical assets in their operating context. It was developed by the aviation industry and is now widely used in oil and gas.

## RCM Principles

RCM is based on the understanding that:
1. Different failure modes require different maintenance strategies
2. Not all failures are equally important
3. The goal is to preserve function, not equipment
4. Maintenance cannot improve inherent reliability — only design can

## The RCM Process

### Step 1: Select Equipment
Focus on equipment where failure has significant consequences:
- Safety consequences
- Environmental consequences
- Production consequences
- Economic consequences

### Step 2: Define Functions
What is the equipment supposed to do?
- Primary function: "The Christmas tree shall control flow from the well"
- Secondary functions: "The tree shall provide access for well interventions"

### Step 3: Identify Functional Failures
How can the equipment fail to perform its function?
- "The Christmas tree fails to stop flow when required"
- "The Christmas tree fails to allow flow when required"

### Step 4: Identify Failure Modes
What causes each functional failure?
- Gate valve seat erosion
- Actuator hydraulic failure
- Valve stem packing leak

### Step 5: Analyze Failure Effects and Consequences
What happens when each failure mode occurs?

### Step 6: Select Maintenance Tasks
For each failure mode, select the most appropriate task:
- **Scheduled restoration**: Overhaul at fixed intervals
- **Scheduled discard**: Replace at fixed intervals
- **Condition monitoring**: Monitor and act when condition deteriorates
- **Failure-finding**: Test to find hidden failures
- **Run to failure**: Accept the failure and repair when it occurs

## RCM Decision Logic

\`\`\`
Is the failure evident to operators?
  YES → Does it affect safety/environment?
    YES → Can PM prevent it? → Scheduled task or redesign
    NO → Is PM cost-effective? → Scheduled task or run to failure
  NO → Does it affect safety/environment?
    YES → Failure-finding task mandatory
    NO → Failure-finding task if cost-effective
\`\`\`

> **RCM Value**: RCM typically reduces maintenance costs by 25-35% while improving reliability. It ensures that maintenance resources are focused where they add the most value.`
  },
  { moduleNumber: 11, lessonNumber: 3, titleEn: "Total Productive Maintenance (TPM) and Continuous Improvement", estimatedMinutes: 35, order: 3,
    content: `# Total Productive Maintenance (TPM) and Continuous Improvement

## What is TPM?

**Total Productive Maintenance (TPM)** is a maintenance philosophy that involves all employees — not just maintenance technicians — in equipment care and improvement. The goal is **zero breakdowns, zero defects, zero accidents**.

## The 8 Pillars of TPM

| Pillar | Description |
|--------|-------------|
| **Autonomous Maintenance** | Operators perform basic maintenance tasks |
| **Planned Maintenance** | Systematic preventive and predictive maintenance |
| **Quality Maintenance** | Eliminate defects through equipment improvement |
| **Focused Improvement** | Eliminate major losses through cross-functional teams |
| **Early Equipment Management** | Design maintenance-friendly equipment |
| **Training and Education** | Develop skills of all employees |
| **Safety, Health, Environment** | Zero accidents and environmental incidents |
| **TPM in Administration** | Apply TPM principles to office functions |

## Autonomous Maintenance

**Autonomous Maintenance (AM)** empowers operators to:
- Perform basic cleaning and inspection
- Identify and report abnormalities
- Perform simple lubrication and adjustments
- Maintain their equipment in optimal condition

**AM Steps:**
1. Initial cleaning (eliminate contamination)
2. Eliminate sources of contamination
3. Develop cleaning and lubrication standards
4. Conduct general inspections
5. Conduct autonomous inspections
6. Standardize and manage the workplace
7. Full autonomous management

## Continuous Improvement (Kaizen)

**Kaizen** (Japanese: "change for the better") is the practice of continuous small improvements:
- Every employee can suggest improvements
- Small improvements are implemented quickly
- Results are measured and shared
- Success builds a culture of improvement

## Key Performance Indicators

| KPI | Formula | Target |
|-----|---------|--------|
| **OEE** | Availability × Performance × Quality | >85% |
| **MTBF** | Total uptime / Number of failures | Maximize |
| **MTTR** | Total repair time / Number of repairs | Minimize |
| **PM Compliance** | PMs completed on time / Total PMs due | >95% |

> **Culture Change**: TPM is not just a set of tools — it is a cultural transformation. It requires commitment from top management and active participation from all employees. The most successful TPM implementations are those where every person, from the CEO to the newest technician, is engaged.`
  },

  // Module 12: Capstone
  { moduleNumber: 12, lessonNumber: 1, titleEn: "Capstone Project: Virtual Wellhead Design", estimatedMinutes: 60, order: 1,
    content: `# Capstone Project: Virtual Wellhead Design

## Project Overview

In this capstone project, you will design a complete wellhead system for a hypothetical oil well. This project integrates all the knowledge from the previous 11 modules.

## Project Scenario

**Well Parameters:**
- Location: Onshore, desert environment
- Well type: Oil producer
- Reservoir depth: 8,500 ft
- Reservoir pressure: 4,200 psi
- Reservoir temperature: 180°F
- Production rate: 2,500 BOPD (barrels of oil per day)
- GOR (Gas-Oil Ratio): 500 scf/bbl
- H₂S content: 50 ppm (sour service)
- Sand production: Moderate

## Project Tasks

### Task 1: Wellhead Component Selection

Based on the well parameters, select appropriate wellhead components:

1. **Pressure rating**: What API pressure rating is required?
   - Consider: Reservoir pressure + safety factor
   - Minimum rating: _____ psi

2. **Material selection**: What materials are required?
   - Consider: H₂S content (sour service), temperature, corrosion
   - Casing head material: _____
   - Christmas tree material: _____
   - Seal material: _____

3. **Christmas tree configuration**: Conventional or horizontal tree?
   - Justify your selection

### Task 2: Maintenance Program Development

Develop a preventive maintenance schedule for your wellhead:

| Task | Frequency | Responsible | Procedure Reference |
|------|-----------|-------------|---------------------|
| Visual inspection | | | |
| Pressure recording | | | |
| Valve greasing | | | |
| Actuator testing | | | |
| Pressure gauge calibration | | | |
| Full inspection | | | |

### Task 3: Risk Assessment

Identify the top 5 risks for your wellhead and develop mitigation measures:

| Risk | Likelihood | Consequence | Risk Level | Mitigation |
|------|-----------|-------------|------------|------------|
| H₂S release | | | | |
| Flange leak | | | | |
| Valve failure | | | | |
| Choke erosion | | | | |
| Annulus pressure buildup | | | | |

### Task 4: Emergency Response Plan

Develop a brief emergency response plan for:
1. H₂S release
2. Wellhead fire
3. Major hydrocarbon spill

### Task 5: Presentation

Prepare a 10-minute presentation covering:
- Your wellhead design choices and justifications
- Maintenance program highlights
- Key risks and mitigations
- Lessons learned from the course

## Evaluation Criteria

| Criterion | Weight |
|-----------|--------|
| Technical accuracy | 40% |
| Safety considerations | 25% |
| Environmental considerations | 15% |
| Documentation quality | 10% |
| Presentation | 10% |

> **Capstone Purpose**: This project tests your ability to apply knowledge, not just recall facts. A good wellhead technician can take information from multiple sources and make sound engineering and maintenance decisions. This is the skill that employers value most.`
  },
  { moduleNumber: 12, lessonNumber: 2, titleEn: "Career Development and Industry Certifications", estimatedMinutes: 45, order: 2,
    content: `# Career Development and Industry Certifications

## Career Pathways in Wellhead Maintenance

The wellhead maintenance field offers several career progression paths:

### Technical Track

\`\`\`
Trainee Technician
    ↓ (1-2 years)
Wellhead Technician
    ↓ (3-5 years)
Senior Wellhead Technician
    ↓ (5-8 years)
Lead Technician / Supervisor
    ↓ (8-12 years)
Maintenance Superintendent
    ↓
Operations Manager
\`\`\`

### Specialist Track

\`\`\`
Wellhead Technician
    ↓
Specialist (NDT, Subsea, Offshore)
    ↓
Subject Matter Expert (SME)
    ↓
Technical Authority
\`\`\`

### Engineering Track

\`\`\`
Wellhead Technician (with engineering degree)
    ↓
Maintenance Engineer
    ↓
Senior Engineer
    ↓
Principal Engineer / Technical Lead
\`\`\`

## Key Industry Certifications

### Safety Certifications

| Certification | Issuing Body | Requirement |
|--------------|-------------|-------------|
| **BOSIET** | OPITO | Basic Offshore Safety Induction and Emergency Training |
| **HUET** | OPITO | Helicopter Underwater Escape Training |
| **H₂S Alive** | Energy Safety Canada | H₂S safety training |
| **IWCF** | IWCF | Well control (for supervisors) |

### Technical Certifications

| Certification | Issuing Body | Scope |
|--------------|-------------|-------|
| **API 6A** | API | Wellhead equipment |
| **ASNT Level II** | ASNT | Non-destructive testing |
| **CSWIP** | TWI | Welding inspection |
| **CompEx** | CompEx | Electrical in explosive atmospheres |

### Management Certifications

| Certification | Scope |
|--------------|-------|
| **NEBOSH** | Health and safety management |
| **IOSH** | Occupational safety |
| **PMP** | Project management |

## Building Your Professional Profile

1. **Gain diverse experience**: Work in different environments (onshore, offshore, different well types)
2. **Pursue certifications**: Start with safety certifications, then technical
3. **Join professional organizations**: SPE (Society of Petroleum Engineers), ASME
4. **Network**: Attend industry conferences and events
5. **Stay current**: Follow industry publications (JPT, World Oil, Offshore Magazine)
6. **Mentor others**: Teaching reinforces your own knowledge

> **Career Advice**: The oil and gas industry rewards those who combine technical excellence with safety leadership. Be the technician who is known for doing the job right, safely, every time. That reputation is more valuable than any certification.`
  },
  { moduleNumber: 12, lessonNumber: 3, titleEn: "The Future of Wellhead Technology", estimatedMinutes: 35, order: 3,
    content: `# The Future of Wellhead Technology

## Digital Transformation in Wellhead Operations

The oil and gas industry is undergoing a digital transformation that is changing how wellheads are monitored, maintained, and operated.

## Smart Wellheads

**Smart wellheads** integrate sensors, actuators, and communication systems:

- **Continuous monitoring**: Pressure, temperature, flow rate, vibration — all monitored 24/7
- **Automated control**: ESD systems respond in milliseconds
- **Remote operation**: Valves operated from a control room hundreds of miles away
- **Predictive analytics**: AI algorithms predict failures before they occur
- **Digital twin**: Virtual replica of the wellhead for simulation and planning

## IIoT and Edge Computing

**Industrial IoT (IIoT)** connects wellhead sensors to cloud platforms:
- Data collected at the wellhead (edge computing)
- Transmitted via satellite, cellular, or fiber
- Analyzed in the cloud
- Insights delivered to tablets and phones

## Autonomous Inspection

**Drones and robots** are increasingly used for wellhead inspection:
- **Aerial drones**: Visual inspection, thermal imaging, gas detection
- **Ground robots**: Inspection of hard-to-reach areas
- **AI image analysis**: Automatic detection of corrosion, leaks, damage

## Augmented Reality (AR)

**AR glasses** provide technicians with:
- Real-time equipment data overlaid on their field of view
- Step-by-step maintenance procedures
- Remote expert guidance
- Automatic documentation of work performed

## Hydrogen and Carbon Capture

The energy transition is creating new applications for wellhead technology:
- **Hydrogen production**: Wellheads adapted for hydrogen service
- **Carbon capture and storage (CCS)**: Injection wellheads for CO₂ storage
- **Geothermal energy**: Wellheads for geothermal wells

## Preparing for the Future

As a wellhead technician, prepare for the future by:
1. **Embrace digital tools**: Learn CMMS, data analytics, mobile apps
2. **Develop data literacy**: Understand how to interpret sensor data
3. **Stay curious**: Follow technology developments in the industry
4. **Adapt**: The technicians who thrive are those who can combine traditional skills with new technologies

> **The Future is Bright**: Despite the energy transition, oil and gas will remain important for decades. Wellhead technicians who combine deep technical knowledge with digital skills will be in high demand. The future belongs to those who are prepared for it.`
  },
];

const quizQuestions = [
  // Module 1 Quiz
  {
    moduleNumber: 1,
    questions: [
      {
        textEn: "What is the primary function of a wellhead?",
        options: [
          { id: "a", textEn: "To pump oil to the surface" },
          { id: "b", textEn: "To provide structural support, pressure containment, and flow control at the top of a well" },
          { id: "c", textEn: "To separate oil, gas, and water" },
          { id: "d", textEn: "To store produced hydrocarbons" },
        ],
        correctOptionId: "b",
        explanationEn: "The wellhead serves as the structural and pressure-containing interface between the wellbore and surface facilities, providing structural support, pressure containment, flow control, and well intervention access.",
        order: 1,
      },
      {
        textEn: "Which API standard governs wellhead and Christmas tree equipment?",
        options: [
          { id: "a", textEn: "API 6D" },
          { id: "b", textEn: "API 14A" },
          { id: "c", textEn: "API 6A" },
          { id: "d", textEn: "API 11D1" },
        ],
        correctOptionId: "c",
        explanationEn: "API Specification 6A (Wellhead and Tree Equipment) is the primary standard governing the design, testing, and manufacture of wellhead and Christmas tree equipment.",
        order: 2,
      },
      {
        textEn: "What is the main challenge of offshore wellhead maintenance compared to onshore?",
        options: [
          { id: "a", textEn: "Offshore wells have higher pressure" },
          { id: "b", textEn: "Limited access, corrosive marine environment, and weather dependency" },
          { id: "c", textEn: "Offshore wells produce more sand" },
          { id: "d", textEn: "Offshore regulations are less strict" },
        ],
        correctOptionId: "b",
        explanationEn: "Offshore maintenance is more challenging due to limited access (helicopter or boat only), the corrosive marine environment, weather windows for operations, and higher operational costs.",
        order: 3,
      },
      {
        textEn: "In the well lifecycle, during which phase does the wellhead technician play the most critical role?",
        options: [
          { id: "a", textEn: "Exploration" },
          { id: "b", textEn: "Appraisal" },
          { id: "c", textEn: "Production" },
          { id: "d", textEn: "Abandonment" },
        ],
        correctOptionId: "c",
        explanationEn: "The wellhead maintenance technician is most critical during the Production phase, performing routine inspections, preventive maintenance, and corrective maintenance to ensure safe and reliable production.",
        order: 4,
      },
      {
        textEn: "What does SIWHP stand for?",
        options: [
          { id: "a", textEn: "Surface Injection Wellhead Pressure" },
          { id: "b", textEn: "Shut-In Wellhead Pressure" },
          { id: "c", textEn: "Standard Injection Well Hydraulic Pressure" },
          { id: "d", textEn: "Safety Isolation Wellhead Protocol" },
        ],
        correctOptionId: "b",
        explanationEn: "SIWHP stands for Shut-In Wellhead Pressure — the pressure measured at the wellhead when the well is closed (shut in) and not flowing.",
        order: 5,
      },
      {
        textEn: "Which PPE is mandatory in all hydrocarbon-handling areas?",
        options: [
          { id: "a", textEn: "Chemical splash suit" },
          { id: "b", textEn: "Flame-Resistant Clothing (FRC)" },
          { id: "c", textEn: "Full-face respirator" },
          { id: "d", textEn: "Hearing protection" },
        ],
        correctOptionId: "b",
        explanationEn: "Flame-Resistant Clothing (FRC) is mandatory in all hydrocarbon-handling areas to protect against flash fire hazards. It does not ignite easily and self-extinguishes when the ignition source is removed.",
        order: 6,
      },
    ],
  },
  // Module 2 Quiz
  {
    moduleNumber: 2,
    questions: [
      {
        textEn: "What is the purpose of the casing head in a wellhead assembly?",
        options: [
          { id: "a", textEn: "To control the flow rate from the well" },
          { id: "b", textEn: "To provide the foundation and support the first casing string" },
          { id: "c", textEn: "To measure wellhead pressure" },
          { id: "d", textEn: "To inject chemicals into the well" },
        ],
        correctOptionId: "b",
        explanationEn: "The casing head is the foundation of the wellhead assembly, welded to the surface casing. It supports the weight of the casing strings and provides the base for the entire wellhead stack.",
        order: 1,
      },
      {
        textEn: "What is the A-annulus?",
        options: [
          { id: "a", textEn: "The space between the production casing and intermediate casing" },
          { id: "b", textEn: "The space between the production tubing and the innermost casing" },
          { id: "c", textEn: "The space between the intermediate and surface casing" },
          { id: "d", textEn: "The space inside the production tubing" },
        ],
        correctOptionId: "b",
        explanationEn: "The A-annulus (tubing-casing annulus) is the space between the production tubing and the innermost casing string (production casing). It is sealed by the tubing hanger and packer.",
        order: 2,
      },
      {
        textEn: "Which valve in the Christmas tree is considered the primary well barrier?",
        options: [
          { id: "a", textEn: "Production Wing Valve (PWV)" },
          { id: "b", textEn: "Kill Wing Valve (KWV)" },
          { id: "c", textEn: "Lower Master Valve (LMV)" },
          { id: "d", textEn: "Swab Valve" },
        ],
        correctOptionId: "c",
        explanationEn: "The Lower Master Valve (LMV) is the primary well barrier. It is the most critical valve in the Christmas tree and must always be in perfect working condition.",
        order: 3,
      },
      {
        textEn: "What is the golden rule regarding API ring gaskets?",
        options: [
          { id: "a", textEn: "Reuse gaskets if they appear undamaged" },
          { id: "b", textEn: "Never reuse a ring gasket — always install a new one when breaking a flange" },
          { id: "c", textEn: "Gaskets can be reused up to three times" },
          { id: "d", textEn: "Only replace gaskets when a leak is detected" },
        ],
        correctOptionId: "b",
        explanationEn: "The golden rule is to never reuse a ring gasket. Once a flange has been broken, always install a new ring gasket. The cost of a new gasket is negligible compared to the cost of a leak.",
        order: 4,
      },
      {
        textEn: "What does the production choke do?",
        options: [
          { id: "a", textEn: "Prevents backflow from the flowline" },
          { id: "b", textEn: "Controls the production rate and maintains backpressure on the reservoir" },
          { id: "c", textEn: "Separates gas from liquid" },
          { id: "d", textEn: "Measures the flow rate" },
        ],
        correctOptionId: "b",
        explanationEn: "The production choke controls the flow rate from the well by restricting the flow area, and maintains backpressure on the reservoir to protect it from damage.",
        order: 5,
      },
      {
        textEn: "What type of ring gasket is used for very high pressure applications (>10,000 psi)?",
        options: [
          { id: "a", textEn: "R ring" },
          { id: "b", textEn: "RX ring" },
          { id: "c", textEn: "BX ring" },
          { id: "d", textEn: "SRX ring" },
        ],
        correctOptionId: "c",
        explanationEn: "BX ring gaskets with rectangular cross-section are used for very high pressure applications above 10,000 psi, providing superior sealing performance.",
        order: 6,
      },
    ],
  },
  // Module 3 Quiz
  {
    moduleNumber: 3,
    questions: [
      {
        textEn: "Why should impact wrenches NOT be used for final tightening of critical fasteners?",
        options: [
          { id: "a", textEn: "They are too slow for critical fasteners" },
          { id: "b", textEn: "They cannot achieve the required torque values" },
          { id: "c", textEn: "They do not provide accurate, controlled torque — use a calibrated torque wrench instead" },
          { id: "d", textEn: "They are only for removing bolts, not installing them" },
        ],
        correctOptionId: "c",
        explanationEn: "Impact wrenches do not provide accurate, controlled torque. They are suitable for rapid bolt removal, but final tightening of critical fasteners must always be done with a calibrated torque wrench to ensure proper bolt loading.",
        order: 1,
      },
      {
        textEn: "What is the advantage of bolt tensioning over bolt torquing for critical flanges?",
        options: [
          { id: "a", textEn: "Tensioning is faster" },
          { id: "b", textEn: "Tensioning provides more accurate bolt loading (±5% vs ±25%) by eliminating friction variables" },
          { id: "c", textEn: "Tensioning requires less equipment" },
          { id: "d", textEn: "Tensioning is cheaper" },
        ],
        correctOptionId: "b",
        explanationEn: "Bolt tensioning applies direct tension (stretching) to the bolt, eliminating friction variables that affect torque accuracy. This provides ±5% accuracy compared to ±25% for torquing, making it preferred for critical high-pressure flanges.",
        order: 2,
      },
      {
        textEn: "What is the correct bolt tightening pattern for a wellhead flange?",
        options: [
          { id: "a", textEn: "Clockwise sequential (1-2-3-4...)" },
          { id: "b", textEn: "Random order" },
          { id: "c", textEn: "Cross-pattern (opposite bolts), in multiple passes" },
          { id: "d", textEn: "Start from the bottom and work upward" },
        ],
        correctOptionId: "c",
        explanationEn: "The correct pattern is cross-bolt tightening (opposite bolts), performed in multiple passes (typically 30%, 70%, 100% of final torque). This ensures even gasket compression and prevents flange cocking.",
        order: 3,
      },
      {
        textEn: "What is the minimum hold time for a hydrostatic pressure test per API 6A?",
        options: [
          { id: "a", textEn: "5 minutes" },
          { id: "b", textEn: "15 minutes" },
          { id: "c", textEn: "30 minutes" },
          { id: "d", textEn: "60 minutes" },
        ],
        correctOptionId: "b",
        explanationEn: "API 6A requires a minimum hold time of 15 minutes for hydrostatic pressure tests. During this time, the pressure must remain stable — any drop indicates a leak.",
        order: 4,
      },
      {
        textEn: "What is the body pressure test requirement per API 6A?",
        options: [
          { id: "a", textEn: "Equal to rated working pressure" },
          { id: "b", textEn: "1.5 times the rated working pressure" },
          { id: "c", textEn: "2 times the rated working pressure" },
          { id: "d", textEn: "1.1 times the rated working pressure" },
        ],
        correctOptionId: "b",
        explanationEn: "Per API 6A, the body pressure test must be performed at 1.5 times the rated working pressure. This verifies the structural integrity of the component.",
        order: 5,
      },
    ],
  },
  // Module 4 Quiz
  {
    moduleNumber: 4,
    questions: [
      {
        textEn: "What is the correct sequence for the LOTO procedure?",
        options: [
          { id: "a", textEn: "Lock → Isolate → Notify → Verify → Work" },
          { id: "b", textEn: "Notify → Identify energy sources → Shut down → Isolate → Apply LOTO → Release stored energy → Verify zero energy → Work" },
          { id: "c", textEn: "Isolate → Lock → Work → Remove lock" },
          { id: "d", textEn: "Shut down → Work → Lock → Verify" },
        ],
        correctOptionId: "b",
        explanationEn: "The correct LOTO sequence is: Notify affected personnel → Identify all energy sources → Shut down equipment → Isolate energy sources → Apply lockout/tagout devices → Release stored energy → Verify zero energy state → Perform maintenance work.",
        order: 1,
      },
      {
        textEn: "At what concentration of H₂S can you lose your sense of smell (olfactory fatigue)?",
        options: [
          { id: "a", textEn: "1 ppm" },
          { id: "b", textEn: "10 ppm" },
          { id: "c", textEn: "100 ppm or higher" },
          { id: "d", textEn: "1,000 ppm" },
        ],
        correctOptionId: "c",
        explanationEn: "At concentrations of 100 ppm or higher, H₂S causes olfactory fatigue — you lose your ability to smell it. This is extremely dangerous because you may not realize you are in a lethal concentration. Always use electronic gas detectors.",
        order: 2,
      },
      {
        textEn: "What is the first action to take when a wellhead fire is detected?",
        options: [
          { id: "a", textEn: "Grab a fire extinguisher and fight the fire" },
          { id: "b", textEn: "Activate the ESD system to shut in the well (remove the fuel source)" },
          { id: "c", textEn: "Call the fire brigade and wait" },
          { id: "d", textEn: "Open all valves to reduce pressure" },
        ],
        correctOptionId: "b",
        explanationEn: "The first action is to activate the ESD system to shut in the well. A wellhead fire fed by gas or oil cannot be extinguished until the fuel source is removed. Shutting in the well removes the fuel.",
        order: 3,
      },
      {
        textEn: "What does a JSA (Job Safety Analysis) require?",
        options: [
          { id: "a", textEn: "Only the supervisor needs to complete it" },
          { id: "b", textEn: "It must be completed before starting any non-routine task, involving all workers who will perform the task" },
          { id: "c", textEn: "It is only required for offshore work" },
          { id: "d", textEn: "It can be completed after the job is done" },
        ],
        correctOptionId: "b",
        explanationEn: "A JSA must be completed before starting any non-routine task and must involve all workers who will perform the task. It must be reviewed and signed by the supervisor and kept on file for the duration of the job.",
        order: 4,
      },
      {
        textEn: "What is the hierarchy of controls for hazard management (from most to least preferred)?",
        options: [
          { id: "a", textEn: "PPE → Administrative → Engineering → Substitution → Elimination" },
          { id: "b", textEn: "Elimination → Substitution → Engineering controls → Administrative controls → PPE" },
          { id: "c", textEn: "Administrative → PPE → Engineering → Elimination → Substitution" },
          { id: "d", textEn: "Engineering → Elimination → PPE → Administrative → Substitution" },
        ],
        correctOptionId: "b",
        explanationEn: "The hierarchy of controls from most to least preferred is: Elimination (remove the hazard) → Substitution (replace with less hazardous) → Engineering controls → Administrative controls → PPE (last resort).",
        order: 5,
      },
      {
        textEn: "What is Sustained Casing Pressure (SCP)?",
        options: [
          { id: "a", textEn: "Normal operating pressure in the tubing" },
          { id: "b", textEn: "Pressure in any annulus that cannot be bled to zero or returns to positive after bleeding" },
          { id: "c", textEn: "The maximum allowable operating pressure" },
          { id: "d", textEn: "Pressure applied during hydrostatic testing" },
        ],
        correctOptionId: "b",
        explanationEn: "Sustained Casing Pressure (SCP) is pressure in any annulus that either cannot be bled to zero, or returns to a positive value after bleeding. It indicates a well integrity issue that must be investigated.",
        order: 6,
      },
    ],
  },
  // Module 5 Quiz
  {
    moduleNumber: 5,
    questions: [
      {
        textEn: "What is the recommended inspection approach for a wellhead daily walk-around?",
        options: [
          { id: "a", textEn: "Random inspection of whatever looks problematic" },
          { id: "b", textEn: "Bottom to top, inside to outside — systematic and consistent" },
          { id: "c", textEn: "Top to bottom, starting with the Christmas tree" },
          { id: "d", textEn: "Only inspect components that have had recent maintenance" },
        ],
        correctOptionId: "b",
        explanationEn: "The recommended approach is bottom to top, inside to outside. A systematic and consistent route ensures nothing is missed and
