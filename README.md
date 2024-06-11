# Tour Navigator

Tour Navigator is a React package designed to facilitate the creation of customizable tours for React websites.

## Installation

To install Tour Navigator, you can use npm or yarn:

```bash
npm install tour-navigator 
# or 
yarn add tour-navigator
```

## Usage

```javascript
import TourNavigator from 'tour-navigator';
import { Align, Position } from "tour-navigator/lib/TourNavigator/types";

// Define your steps
const steps = [
  {
    selector: '.step1',
    data: { /* Step data */ },
    position: Position.LEFT,
    align: Align.START
  },
  {
    selector: '.step2',
    data: { /* Step data */ },
    position: Position.BOTTOM,
    align: Align.CENTER
  },
  // Add more steps as needed
];

// Set up Tour Navigator with your steps
<TourNavigator
  id="my-tour"
  steps={steps}
/>
```
## Demo
Check out the live demo [here](https://leafy-malasada-f02c9a.netlify.app/).

## CodeSandbox Example
For a live interactive example, you can check out this [CodeSandbox](https://codesandbox.io/p/sandbox/tour-navigator-9hvm54?file=%2Fsrc%2Findex.tsx&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clvcpvjpc0006356i3zk5alfq%2522%252C%2522sizes%2522%253A%255B100%252C0%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clvcpvjpc0002356i1n9dlstw%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clvcpvjpc0003356i9pagn38n%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clvcpvjpc0005356i5ne28jfr%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clvcpvjpc0002356i1n9dlstw%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clvcpvjpc0001356i6giznvew%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fsrc%252Findex.tsx%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522id%2522%253A%2522clvcpvjpc0002356i1n9dlstw%2522%252C%2522activeTabId%2522%253A%2522clvcpvjpc0001356i6giznvew%2522%257D%252C%2522clvcpvjpc0005356i5ne28jfr%2522%253A%257B%2522id%2522%253A%2522clvcpvjpc0005356i5ne28jfr%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clvcpvjpc0003356i9pagn38n%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clvcpvjpc0003356i9pagn38n%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D).

| Prop                   | Type                                                                 | Description                                                                                        | Default                      |
|------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------|
| id                     | string                                                               | Unique identifier for the tour.                                                                    | ___tournavigator-${Date.now()}                         |
| maskRadius             | number                                                               | Radius of the mask around highlighted elements.                                                    | 5                            |
| maskPadding            | number                                                               | Padding around the mask.                                                                           | 5                            |
| maskOpacity            | number                                                               | Opacity of the mask.                                                                               | 1                            |
| maskStyle              | CSSProperties                                                        | Custom CSS styles for the mask.                                                                    |                              |
| maskStyleDuringScroll  | CSSProperties                                                        | Custom CSS styles for the mask during scroll.                                                      |                             |
| startAt                | number                                                               | Index of the step to start the tour at.                                                            | 0                            |
| maskHelperDistance     | number                                                               | Distance between the mask and the helper element.                                                  | 10                           |
| screenHelperDistance   | number                                                               | Distance between the screen and the helper element.                                                | 10                           |
| onAfterOpen            | (() => void) \| null                                                 | Callback function triggered after the tour starts.                                                 | null                         |
| onBeforeClose          | (() => void) \| null                                                 | Callback function triggered before the tour ends.                                                  | null                         |
| steps                  | Step[]                                                               | Array of steps defining the tour.                                                                  | []                          |
| helper                 | ((props: HelperProps) => ReactNode) \| null                          | Custom helper component for each step.                                                             | null                         |
| isOpen                 | boolean                                                              | Flag to control the visibility of the tour.                                                        | true                         |
| onRequestClose         | ((params: {event: MouseEvent \| PointerEvent, isMask: boolean, isOverlay: boolean}) => void) \| null | Callback function triggered when the tour is closed.                               | null                         |
| onNext                 | ((props: HelperProps) => void) \| null                               | Callback function triggered when the "Next" button is clicked.                                     | null                         |
| onPrev                 | ((props: HelperProps) => void) \| null                               | Callback function triggered when the "Prev" button is clicked.                                     | null                         |
| onMove                 | ((props: HelperProps) => void) \| null                               | Callback function triggered when the tour moves to the next step.                                  | null                         |
| scrollBehavior         | 'smooth' \| 'auto'                                                   | Defines the scroll behavior when moving to a new step.                                             | 'auto'                       |
| resizeListener         | boolean                                                              | Flag to enable/disable resize listener.                                                            | true                         |
| scrollListener         | boolean                                                              | Flag to enable/disable scroll listener.                                                            | true                         |
| mutationObserve        | MutationObserverConfig                                               | Configuration for mutation observer to watch changes in DOM.                                        |                              |
| overlayFill            | string                                                               | Fill color of the overlay.                                                                         | 'black'                      |
| overlayOpacity         | number                                                               | Opacity of the overlay.                                                                            | 0.5                          |
| overlay                | ((props: OverlayProps) => ReactNode) \| null                         | Custom overlay component.                                                                          | null                         |
| className              | string                                                               | Custom CSS class for the Tour Navigator component.                                                 |                              |
| style                  | CSSProperties                                                        | Custom CSS styles for the Tour Navigator component.                                                |                              |
| renderOverlay          | boolean                                                              | Flag to enable/disable rendering of the overlay.                                                   | true                         |
| renderHelper           | boolean                                                              | Flag to enable/disable rendering of the helper component.                                          | true                         |
| renderElement          | HTMLElement \| string                                                | The element in which the Tour Navigator will be rendered.                                          |                              |
| scrollingElement       | HTMLElement \| Document \| Element \| string                         | The element used for scrolling.                                                                    |                              |
| waitForElementRendered | boolean                                                              | Works only when mutationObserver provided,                                                         |
### Step

```typescript
 Tour Navigator

Tour Navigator is a React package designed to facilitate the creation of customizable tours for React websites.

## Installation

To install Tour Navigator, you can use npm or yarn:

```bash
npm install tour-navigator 
# or 
yarn add tour-navigator
```

## Usage

```javascript
import TourNavigator from 'tour-navigator';
import { Align, Position } from "tour-navigator/lib/TourNavigator/types";

// Define your steps
const steps = [
  {
    selector: '.step1',
    data: { /* Step data */ },
    position: Position.LEFT,
    align: Align.START
  },
  {
    selector: '.step2',
    data: { /* Step data */ },
    position: Position.BOTTOM,
    align: Align.CENTER
  },
  // Add more steps as needed
];

// Set up Tour Navigator with your steps
<TourNavigator
  id="my-tour"
  steps={steps}
/>
```
## Demo
Check out the live demo [here](https://leafy-malasada-f02c9a.netlify.app/).

## CodeSandbox Example
For a live interactive example, you can check out this [CodeSandbox](https://codesandbox.io/p/sandbox/tour-navigator-9hvm54?file=%2Fsrc%2Findex.tsx&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clvcpvjpc0006356i3zk5alfq%2522%252C%2522sizes%2522%253A%255B100%252C0%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clvcpvjpc0002356i1n9dlstw%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clvcpvjpc0003356i9pagn38n%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clvcpvjpc0005356i5ne28jfr%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clvcpvjpc0002356i1n9dlstw%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clvcpvjpc0001356i6giznvew%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fsrc%252Findex.tsx%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522id%2522%253A%2522clvcpvjpc0002356i1n9dlstw%2522%252C%2522activeTabId%2522%253A%2522clvcpvjpc0001356i6giznvew%2522%257D%252C%2522clvcpvjpc0005356i5ne28jfr%2522%253A%257B%2522id%2522%253A%2522clvcpvjpc0005356i5ne28jfr%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clvcpvjpc0003356i9pagn38n%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clvcpvjpc0003356i9pagn38n%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D).

| Prop                   | Type                                                                 | Description                                                                                        | Default                      |
|------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------|
| id                     | string                                                               | Unique identifier for the tour.                                                                    | ___tournavigator-${Date.now()}                         |
| maskRadius             | number                                                               | Radius of the mask around highlighted elements.                                                    | 5                            |
| maskPadding            | number                                                               | Padding around the mask.                                                                           | 5                            |
| maskOpacity            | number                                                               | Opacity of the mask.                                                                               | 1                            |
| maskStyle              | CSSProperties                                                        | Custom CSS styles for the mask.                                                                    |                              |
| maskStyleDuringScroll  | CSSProperties                                                        | Custom CSS styles for the mask during scroll.                                                      |                             |
| startAt                | number                                                               | Index of the step to start the tour at.                                                            | 0                            |
| maskHelperDistance     | number                                                               | Distance between the mask and the helper element.                                                  | 10                           |
| screenHelperDistance   | number                                                               | Distance between the screen and the helper element.                                                | 10                           |
| onAfterOpen            | (() => void) \| null                                                 | Callback function triggered after the tour starts.                                                 | null                         |
| onBeforeClose          | (() => void) \| null                                                 | Callback function triggered before the tour ends.                                                  | null                         |
| steps                  | Step[]                                                               | Array of steps defining the tour.                                                                  | []                          |
| helper                 | ((props: HelperProps) => ReactNode) \| null                          | Custom helper component for each step.                                                             | null                         |
| isOpen                 | boolean                                                              | Flag to control the visibility of the tour.                                                        | true                         |
| onRequestClose         | ((params: {event: MouseEvent \| PointerEvent, isMask: boolean, isOverlay: boolean}) => void) \| null | Callback function triggered when the tour is closed.                               | null                         |
| onNext                 | ((props: HelperProps) => void) \| null                               | Callback function triggered when the "Next" button is clicked.                                     | null                         |
| onPrev                 | ((props: HelperProps) => void) \| null                               | Callback function triggered when the "Prev" button is clicked.                                     | null                         |
| onMove                 | ((props: HelperProps) => void) \| null                               | Callback function triggered when the tour moves to the next step.                                  | null                         |
| scrollBehavior         | 'smooth' \| 'auto'                                                   | Defines the scroll behavior when moving to a new step.                                             | 'auto'                       |
| resizeListener         | boolean                                                              | Flag to enable/disable resize listener.                                                            | true                         |
| scrollListener         | boolean                                                              | Flag to enable/disable scroll listener.                                                            | true                         |
| mutationObserve        | MutationObserverConfig                                               | Configuration for mutation observer to watch changes in DOM.                                        |                              |
| overlayFill            | string                                                               | Fill color of the overlay.                                                                         | 'black'                      |
| overlayOpacity         | number                                                               | Opacity of the overlay.                                                                            | 0.5                          |
| overlay                | ((props: OverlayProps) => ReactNode) \| null                         | Custom overlay component.                                                                          | null                         |
| className              | string                                                               | Custom CSS class for the Tour Navigator component.                                                 |                              |
| style                  | CSSProperties                                                        | Custom CSS styles for the Tour Navigator component.                                                |                              |
| renderOverlay          | boolean                                                              | Flag to enable/disable rendering of the overlay.                                                   | true                         |
| renderHelper           | boolean                                                              | Flag to enable/disable rendering of the helper component.                                          | true                         |
| renderElement          | HTMLElement \| string                                                | The element in which the Tour Navigator will be rendered.                                          |                              |
| scrollingElement       | HTMLElement \| Document \| Element \| string                         | The element used for scrolling.                                                                    |                              |
| waitForElementRendered | boolean                                                              | Works only when mutationObserver provided,                                                         |
### Step

```typescript
type IntersectionOption = {
  root?: Element | Document | string | null; // Default: null
  rootMargin?: string; // Default: dynamically adjusted
  threshold?: number; // Default: dynamically adjusted
}
  
type Step = {
  selector: string;
  align?: Align,
  position?: Position | [Position, Position, Position, Position];
  data: any,
  scrollIntoView?: boolean;  // Default: true (Whether scroll to view element or not)
  intersectionOption?: IntersectionOption | (intersectionOption: IntersectionOption) => IntersectionOption;
}
```

### HelperProps

```typescript
type HelperProps = {
    id?: string;
    currentStep: Step | null;
    target: HTMLElement | null;
    currentStepIndex: number;
    previousStepIndex: number;
    steps: Step[];
    isScrollingIntoView: boolean; // Whether scrolling element into view or not
    focus: (scrollBehavior?: 'auto' | 'smooth') => void; // programmatically focus current targe, In case it loses
    goto: (stepIndex: number) => void; // goto any specific steps
    next: () => void;
    prev: () => void;
    onRequestClose: ((params: {event: MouseEvent | PointerEvent, isMask: boolean, isOverlay: boolean}) => void) | null
}
```

### Passing Ref to TourNavigator

Since TourNavigator is a class component, you can use ref to access various built-in methods directly for enhanced customization.

This README provides an overview of the package, its usage, props, and default props. Let me know if you need further modifications or additions!

### License

This project is licensed under the [MIT](LICENSE).
