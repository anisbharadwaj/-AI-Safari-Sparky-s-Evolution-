# AI Safari: Sparky's Evolution

AI-native educational game for ages 3–7 that blends generative AI, voice recognition, computer vision, and emotion detection into a playful Safari adventure.

## Overview

This project is a child-focused AI literacy game where Sparky the robo-puppy learns and grows through interactions that teach:

- Phonics and sound recognition
- Shape and color sorting
- Social-emotional learning (SEL)
- The building blocks of AI: generation, classification, voice input, and learning loops

The game is designed to be text-free, intuitive, and encouraging. Children interact through touch, voice, and facial expressions rather than reading instructions.

## Core Gameplay Loop

1. Creation Lab: The child draws a snack or accessory for Sparky using a paint tool.
2. Soundwave Gate: The child mimics a sound to unlock the path.
3. Empathy Mirror: The child smiles to calm a sad animal.
4. Sorting Conveyor: The child teaches Sparky through training examples.
5. Autonomous Test: Sparky uses the learned pattern to act on his own.
6. Custom Reward Engine: The game generates a custom badge based on the child’s unique play style.

## Core Design Principles

- Zero written text
- Intuitive iconography and sound cues
- Friendly, non-punishing feedback
- Local AI-first architecture for privacy and low latency
- Calm, vibrant claymation visual style

## Technical Roadmap

### Phase 1 — Foundation & Specs
- Finalize game vision and technical blueprint
- Define repository layout and tooling
- Set acceptance criteria for AI, UI, and gameplay systems

### Phase 2 — Core Gameplay Architecture
- Build core game loop, controllers, UI, and state flow
- Implement game scenes and interactions

### Phase 3 — Local AI Integration
- Connect local inference models for generation and classification
- Expose trigger payloads from gameplay to AI systems

### Phase 4 — Database & State Tracking
- Persist player progress, choices, and reward data
- Support save-state and local tracking

### Phase 5 — Polish & Deployment
- Tune performance and optimize for smooth gameplay
- Release vertical slices for testing and feedback

## Target Technical Stack

The stack will be finalized during implementation, with options including:

- Game Engine: Unity, Phaser, or Godot
- Local AI Runtime: ONNX Runtime, Transformers.js, or llama.cpp
- Database: Supabase or SQLite
- State Management: Redux Toolkit or Zustand

## Repository Structure

```text
.
├── README.md
├── docs/
│   ├── design/
│   ├── technical/
│   └── development/
├── src/
│   ├── game/
│   ├── ai/
│   ├── ui/
│   ├── state/
│   └── utils/
├── assets/
│   ├── audio/
│   ├── models/
│   ├── sprites/
│   └── fonts/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── config/
└── .github/
```

## Status

Current focus: repository foundation and technical planning.

## Next Steps

- Confirm the chosen game engine
- Define the initial project folder structure
- Draft database schema and gameplay state model
- Set up GitHub issues for the first development milestones
