# VL London Streaming Setup

<style>
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }
  body {
    zoom: 0.7;
  }
}
svg {
  max-width: 100%;
  height: auto;
}
</style>

## Current Setup (As-Is)

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'12px', 'fontFamily':'arial'}}}%%
flowchart TD

    %% VL LONDON EQUIPMENT
    subgraph VLL["VL London Equipment"]
        subgraph Camera["Camera Layer"]
            R50Current["Canon R50 + Sigma 18-50mm - Main Camera"]
            R6Rent["Canon R6 + 100mm - Close-Up Camera (Rented)"]
            iPhone["iPhone - Wireless Backup via Camo Studio"]
        end

        subgraph Capture["Capture Layer"]
            Camlink["Elgato Cam Link"]
            Ugreen["Ugreen Capture Card"]
        end
    end

    %% THI'S PERSONAL EQUIPMENT
    subgraph Thi["Thi's Equipment"]
        subgraph IO["Connection Layer"]
            Hub["HyperX USB-C Hub"]
        end

        subgraph Computer["Computer Layer"]
            Mac["MacBook Air M1"]
            OBSCurrent["OBS Studio"]
            Camo["Camo Studio"]
        end
    end

    %% STREAMING
    subgraph StreamCurrent["Streaming Layer"]
        StreamKeyCurrent["Facebook Stream Key"]
        FacebookCurrent["Facebook Live - Creator Studio"]
    end

    %% CONNECTIONS
    R50Current -- "Micro-HDMI → HDMI" --> Camlink --> Hub
    R6Rent -- "Micro-HDMI → HDMI" --> Ugreen --> Hub
    Hub --> Mac
    Mac --> OBSCurrent --> StreamKeyCurrent --> FacebookCurrent
    iPhone -- "Wireless (Wi-Fi)" --> Camo --> OBSCurrent

    %% STYLES
    classDef rented fill:#ffe6cc,stroke:#cc6600,color:#000;
    classDef thi fill:#e0ecff,stroke:#3366cc,color:#000;
    classDef vl fill:#f2f2f2,stroke:#999,color:#000;
    classDef stream fill:#e8f8e8,stroke:#55aa55,color:#000;

    class R6Rent rented;
    class Hub,Mac,Camo thi;
    class R50Current,Camlink,Ugreen,iPhone vll;
    class StreamKeyCurrent,FacebookCurrent stream;
```

---

## Proposed New Setup

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'12px', 'fontFamily':'arial'}}}%%
flowchart TD

    %% ========================
    %% 1. CAMERA BODIES
    %% ========================
    subgraph CAMS["Camera Bodies"]
        R50["Canon R50 Body"]
        R8["Canon R8 Body (Full-Frame Upgrade)"]
        iPhone["iPhone (Backup via Camo Studio)"]
    end

    %% ========================
    %% 2. LENSES
    %% ========================
    subgraph LENSES["Lenses"]
        LensR50["Sigma 18–50mm (For R50)"]
        LensR8["Canon RF 100mm f/2.8L Macro IS USM (For R8)"]
    end

    %% ========================
    %% 3. CAPTURE
    %% ========================
    subgraph CAPTURE["Capture Layer (PCIe)"]
        DeckQuad["Blackmagic DeckLink Quad HDMI - 4× HDMI Inputs"]
    end

    %% ========================
    %% 4. LIVESTREAM HARDWARE
    %% ========================
    subgraph HARDWARE["Livestream Hardware"]
        PC["Desktop PC with PCIe Slot"]
        PCStand["PC Stand / Mobile Workstation"]
    end

    %% ========================
    %% 5. STREAM
    %% ========================
    subgraph STREAM["Stream Output"]
        OBS["OBS Studio - Switcher + Mix + Stream"]
        StreamKey["Facebook Stream Key"]
        FacebookLive["Facebook Live - Creator Studio"]
    end

    %% ========================
    %% 6. AUDIO
    %% ========================
    subgraph AUDIO["Audio Chain"]
        MV7["Shure MV7 × 2"]
        XLR["XLR Cables x 2"]
        AI["Focusrite Scarlett 18i16 - 4× XLR Inputs"]
    end


    %% ========================
    %% CAMERA FLOW (VERTICAL)
    %% ========================
    R50 --> LensR50 --> DeckQuad --> PC
    R8  --> LensR8  --> DeckQuad

    %% iPhone backup (direct to PC)
    iPhone -- "Wi-Fi → Camo Studio" --> PC

    %% PC → Stand → OBS → Stream
    PC --> PCStand --> OBS --> StreamKey --> FacebookLive

    %% ========================
    %% AUDIO FLOW (PARALLEL VERTICAL)
    %% ========================
    MV7 --> XLR --> AI --> PC


    %% ========================
    %% STYLES
    %% ========================
    classDef buy fill:#ffe6cc,stroke:#cc6600,color:#000;
    classDef cams fill:#f2f2f2,stroke:#999,color:#000;
    classDef lenses fill:#f9f9f9,stroke:#aaa,color:#000;
    classDef cap fill:#fff6cc,stroke:#d1a100,color:#000;
    classDef hardware fill:#e0ecff,stroke:#3366cc,color:#000;
    classDef stream fill:#e8f8e8,stroke:#55aa55,color:#000;
    classDef audio fill:#e8f1ff,stroke:#3366cc,color:#000;

    %% Highlight "need to buy"
    class R8,LensR8,DeckQuad,MV7,AI,XLR,PCStand buy;

    %% Existing items
    class R50,iPhone cams;
    class LensR50 lenses;
    class PC hardware;
    class OBS,StreamKey,FacebookLive stream;
```

---

## Current Equipment (Already Have)

| Category | Item | Notes |
|----------|------|-------|
| **Camera Body** | Canon R50 | APS-C sensor, 1.6x crop factor |
| **Primary Lens** | Sigma 18-50mm f/2.8 DC DN | For R50, versatile zoom |
| **Backup Camera** | iPhone | Wireless via Camo Studio |
| **Video Capture** | Elgato Cam Link | USB HDMI capture |
| **Video Capture** | Ugreen Capture Card | USB HDMI capture |
| **Computer** | Desktop PC | With PCIe slot available |
| **Connection Hub** | HyperX USB-C Hub | For connecting capture cards |
| **Streaming Software** | OBS Studio | Free, open-source |
| **Camera Software** | Camo Studio | For iPhone wireless input |
| **Streaming Platform** | Facebook Live | Via Creator Studio (VL London account) |

---

## Proposed Purchases - Budget Options

| Category | Low Budget | Medium Budget | High Budget |
|----------|---------------------|------------------------|----------------------|
| **Camera** | Canon R50V (£900) | Canon R8 Body (£1,500) | Canon R6 Mark II (£2,200) |
| **Lens** | RF 50mm f/1.8 STM (£200)<br>*80mm equiv. with 1.6x crop* | RF 100mm f/2.8L Macro IS USM (£1,200) | RF 100mm f/2.8L Macro IS USM (£1,200) |
| **Video Capture** | Elgato Cam Link Pro (£250) | DeckLink Quad HDMI PCIe (£400) | DeckLink 8K Pro (£600) |
| **Microphone** | Rode PodMic × 2 (£200) | Shure MV7 × 2 (£500) | Shure SM7B × 2 (£700) |
| **Audio Cables** | XLR Cables × 2 (£40) | XLR Cables × 2 (£40) | XLR Cables × 2 (£40) |
| **Audio Interface** | Focusrite 2i2 4th Gen (£180) | Focusrite Scarlett 18i8 3rd Gen (£350) | Focusrite 18i16 3rd Gen (£450) |
| **Hardware** | PC Stand (£200) | PC Stand (£200) | PC Stand (£200) |
| **TOTAL** | **£2,770** | **£4,190** | **£5,390** |

---

## Signal Flow

| Path | Flow |
|------|------|
| Video | Cameras → Lenses → DeckLink Quad HDMI → PC → OBS → Facebook Live |
| Audio | Shure MV7 Mics → XLR Cables → Focusrite 18i16 → PC → OBS → Facebook Live |
| Backup | iPhone → Wi-Fi (Camo Studio) → PC → OBS |

