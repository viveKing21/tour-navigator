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

// Define your steps
const steps = [
  {
    selector: '.step1',
    data: { /* Step data */ }
  },
  {
    selector: '.step2',
    data: { /* Step data */ }
  },
  // Add more steps as needed
];

// Set up Tour Navigator with your steps
<TourNavigator
  id="my-tour"
  steps={steps}
/>
```

## Props
**TourNavigatorProps**

| Prop                 | Type                                                              | Description                                                                                           | Default           |
|----------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-------------------|
| id                   | string                                                            | Unique identifier for the tour.                                                                      |                   |
| maskRadius           | number                                                            | Radius of the mask around highlighted elements.                                           | 5                 |
| maskPadding          | number                                                            | Padding around the mask.                                                                  | 5                 |
| startAt              | number                                                            | Index of the step to start the tour at.                                                   | 0                 |
| maskHelperDistance   | number                                                            | Distance between the mask and the helper element.                                         | 10                |
| screenHelperDistance | number                                                            | Distance between the screen and the helper element.                                       | 10                |
| onAfterOpen          | (() => void) \| null                                             | Callback function triggered after the tour starts.                                                     | null              |
| onBeforeClose        | (() => void) \| null                                             | Callback function triggered before the tour ends.                                                      | null              |
| steps                | Step[]                                                            | Array of steps defining the tour.                                                                     |                   |
| helper               | ((props: HelperProps) => ReactNode) \| null                      | Custom helper component for each step.                                                                 | null              |
| isOpen               | boolean                                                           | Flag to control the visibility of the tour.                                             | true              |
| onRequestClose       | ((params: {event: MouseEvent \| PointerEvent, isMask: boolean}) => void) \| null | Callback function triggered when the tour is closed.                                          | null              |
| onNext               | ((props: HelperProps) => void) \| null                           | Callback function triggered when the "Next" button is clicked.                                          | null              |
| onPrev               | ((props: HelperProps) => void) \| null                           | Callback function triggered when the "Prev" button is clicked.                                          | null              |
| scrollIntoViewOptions | ScrollIntoViewOptions                                            | Options for scrolling the highlighted element into view. | { block: 'nearest', inline: 'nearest'} |
| resizeListener       | boolean                                                           | Flag to enable/disable resize listener.                                                  | true              |
| scrollListener       | boolean                                                           | Flag to enable/disable scroll listener.                                                  | true              |
| overlayFill          | string                                                            | Fill color of the overlay.                                                             | 'black'           |
| overlayOpacity       | number                                                            | Opacity of the overlay.                                                                   | 0.5               |
| maskOpacity          | number                                                            | Opacity of the mask.                                                                        | 1                 |
| overlay              | ((boundingRect: ClientBoundingRect) => ReactNode) \| null       | Custom overlay component.                                                                              | null              |
| className            | string                                                            | Custom CSS class for the Tour Navigator component.                                                      |                   |
| renderOverlay        | boolean                                                           | Flag to enable/disable rendering of the overlay.                                         | true              |
| renderHelper         | boolean                                                           | Flag to enable/disable rendering of the helper component.                                | true              |

### Step

```typescript
type Step = {
  selector: string;
  align?: Align,
  position?: Position | [Position, Position, Position, Position];
  data: any
}
```

### HelperProps

```typescript
type HelperProps = {
  id: string;
  currentStep: Step | null;
  currentStepIndex: number;
  steps: Step[];
  next: () => void;
  prev: () => void;
  onRequestClose: ((params: {event: MouseEvent | PointerEvent, isMask: boolean}) => void) | null
}
```

This README provides an overview of the package, its usage, props, and default props. Let me know if you need further modifications or additions!

## License

This project is licensed under the [MIT](LICENSE).
