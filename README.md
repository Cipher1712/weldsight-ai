# WeldSight AI  
### Adaptive Weld Intelligence Platform for Industry 4.0

WeldSight AI is a next-generation industrial intelligence platform designed for real-time weld monitoring, telemetry analytics, spectral diagnostics, and edge AI deployment in smart manufacturing environments.

The platform combines industrial telemetry, AI-assisted analytics, FFT signal processing, runtime infrastructure monitoring, and multi-station operational intelligence into a unified Industry 4.0 dashboard.

Built with a production-oriented architecture using FastAPI, WebSockets, React, and edge-compute principles, WeldSight AI aims to bridge industrial automation with modern AI-driven diagnostics.

---

## Overview

Modern welding systems generate large volumes of electrical, thermal, and operational telemetry data. Traditional monitoring systems often fail to provide:

- real-time defect intelligence,
- predictive operational insights,
- spectral anomaly analysis,
- edge deployment readiness,
- or centralized operational visibility.

WeldSight AI addresses these challenges through a modular industrial analytics platform capable of handling live telemetry streams, runtime diagnostics, and AI-powered monitoring workflows.

---

# Core Features

## Real-Time Telemetry Monitoring
- Live MIG/TIG arc monitoring
- Arc voltage and current tracking
- Thermal drift analysis
- Wire feed telemetry
- Arc stability indexing
- Streaming operational metrics

## FFT & Spectral Intelligence
- Real-time FFT spectrum visualization
- Spectral entropy monitoring
- Ripple variance analytics
- Frequency-domain anomaly detection
- Harmonic behavior analysis

## Historical Analytics
- Pass/fail trend analytics
- Weld defect density tracking
- Cross-station comparisons
- Multi-line production insights
- Plant-wide operational intelligence

## Runtime Infrastructure Monitoring
- GPU utilization tracking
- CPU and memory diagnostics
- TensorRT inference runtime monitoring
- Queue throughput analysis
- Stream uptime visualization

## Industrial Systems Infrastructure
- FastAPI backend architecture
- WebSocket telemetry streaming
- Edge AI deployment compatibility
- Kafka-style transport design
- NVIDIA Jetson integration support

## Validation & Standards Mapping
The platform includes mapping support for industrial welding standards such as:

- AWS D1.1
- ISO 5817
- ISO 3834-2
- ASME IX
- EN 287-1
- IS 9595

---

# System Architecture

```text
Industrial Sensors
        ↓
PLC / Telemetry Stream
        ↓
FastAPI + WebSocket Backend
        ↓
Signal Processing + FFT Engine
        ↓
AI Analytics Layer
        ↓
Realtime Monitoring Dashboard
        ↓
Industrial Decision Intelligence
