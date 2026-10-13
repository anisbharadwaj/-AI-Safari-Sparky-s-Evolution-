# WondoVerse — current playable slice

WondoVerse is a browser-playable 3D learning adventure built with React, Vite, TypeScript, Three.js, and React Three Fiber.

## Working today

- Third-person exploration in Wonder Meadow with keyboard and touch controls.
- Stylized Zuno companion with animated floating idle motion and a glowing chest marker.
- Central fountain plaza, bridge, crystal cave, trees, paths, and collectible Wonder Stars.
- Local progress saving for stars, XP, rank, completed quests, and the AI mission.
- World Atlas showing all eight planned regions with availability and unlock messaging.
- Number Grove addition activity.
- AI Academy Vision Lab activity with a transparent label, train, and test loop. It is explicitly presented as a rule-based educational simulation rather than a neural network.
- XP rewards and rank progression.
- Installable web app metadata, an install prompt when supported by the browser, and a service worker for the app shell.

## Run and build

Install dependencies, then use the existing development or production build scripts in `package.json`.

The production build currently completes successfully. The Three.js bundle is large because the first playable world is bundled together; later worlds should be lazy-loaded as content expands.

## Current limitations

- The seven additional worlds are atlas previews, not finished explorable regions.
- There is no Android project or APK yet. No download link is shown because no APK has been generated.
- Progress is local to the browser/device. No account or cloud sync is included.
- The AI Academy lesson uses a transparent classifier simulation designed to teach training examples, labels, testing, confidence, and iteration. It does not train a neural network.
- Final illustrated GLB character/environment assets, audio, and voice content are not included; the current 3D assets are procedural prototypes designed for replacement.

## Next development milestone

Complete the AI Academy building as an explorable interior, add the animal-classification dataset mission, then introduce lazy-loaded world modules and a Capacitor Android wrapper.
