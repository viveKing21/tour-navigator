import { CSSProperties, ReactNode } from "react";

export enum Align{
    START = 'start',
    CENTER = 'center',
    END = 'end'
}

export enum Position{
    LEFT = 'left',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom'
}

export type FitPriority = {
    [key in Position]: [Position, Position, Position];
};

export type Step = {
    selector: string;
    align?: Align,
    position?: Position | [Position, Position, Position, Position];
    data: any
}

export type ClientBoundingRect = {
    x: number;
    y: number;
    height: number;
    width: number;
}

export type HelperProps = {
    id: string;
    currentStep: Step | null;
    currentStepIndex: number;
    steps: Step[];
    next: () => void;
    prev: () => void;
    onRequestClose: ((params: {event: MouseEvent | PointerEvent, isMask: boolean}) => void) | null
}

export interface TourNavigatorProps{
    id: string;
    maskRadius?: number;
    maskPadding?: number;
    startAt?: number;
    maskHelperDistance?: number;
    screenHelperDistance?: number;
    onAfterOpen?: (() => void) | null;
    onBeforeClose?: (() => void) | null;
    steps: Step[];
    helper?: ((props: HelperProps) => ReactNode) | null,
    isOpen?: boolean;
    onRequestClose?: ((params: {event: MouseEvent | PointerEvent, isMask: boolean}) => void) | null;
    onNext?: ((props: HelperProps) => void) | null;
    onPrev?: ((props: HelperProps) => void) | null;
    scrollIntoViewOptions?: ScrollIntoViewOptions;
    resizeListener?: boolean;
    scrollListener?: boolean;
    overlayFill?: string;
    overlayOpacity?: number;
    maskOpacity?: number;
    overlay?: ((boundingRect: ClientBoundingRect) => ReactNode) | null;
    className?: string;
    renderOverlay?: boolean;
    renderHelper?: boolean;
    maskStyle?: CSSProperties;
}
export interface TourNavigatorStates {
    currentStepIndex: number;
    x: number;
    y: number;
    height: number;
    width: number;
}