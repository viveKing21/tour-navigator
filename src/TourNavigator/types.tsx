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
    data?: any;
    align?: Align;
    position?: Position | [Position, Position, Position, Position];
    scrollInView?: boolean;
    intersectionThreshold?: number,
    intersectionMargin?: number;
}

export type ClientBoundingRect = {
    x: number;
    y: number;
    height: number;
    width: number;
}

export type OverlayProps = ClientBoundingRect & {
    isScrolling: boolean
}

export type HelperProps = {
    id: string;
    currentStep: Step | null;
    target: HTMLElement | null;
    currentStepIndex: number;
    steps: Step[];
    isScrolling: boolean;
    goto: (stepIndex: number) => void;
    next: () => void;
    prev: () => void;
    onRequestClose: ((params: {event: MouseEvent | PointerEvent, isMask: boolean, isOverlay: boolean}) => void) | null
}
type MutationObserverConfig = 
    | string
    | string[]
    | HTMLElement
    | HTMLElement[]
    | [string | HTMLElement, MutationObserverInit?]
    | [string | HTMLElement, MutationObserverInit?][];
export interface TourNavigatorProps{
    id: string;
    maskRadius?: number;
    maskPadding?: number;
    maskOpacity?: number;
    maskStyle?: CSSProperties;
    maskStyleDuringScroll?: CSSProperties;
    startAt?: number;
    maskHelperDistance?: number;
    screenHelperDistance?: number;
    onAfterOpen?: (() => void) | null;
    onBeforeClose?: (() => void) | null;
    steps: Step[];
    helper?: ((props: HelperProps) => ReactNode) | null,
    isOpen?: boolean;
    onRequestClose?: ((params: {event: MouseEvent | PointerEvent, isMask: boolean, isOverlay: boolean}) => void) | null;
    onNext?: ((props: HelperProps) => void) | null;
    onPrev?: ((props: HelperProps) => void) | null;
    onMove?: ((props: HelperProps) => void) | null;
    scrollBehavior?: 'smooth' | 'auto';
    resizeListener?: boolean;
    scrollListener?: boolean;
    mutationObserve?: MutationObserverConfig
    overlayFill?: string;
    overlayOpacity?: number;
    overlay?: ((props: OverlayProps) => ReactNode) | null;
    className?: string;
    style?: CSSProperties;
    renderOverlay?: boolean;
    renderHelper?: boolean;
    renderElement?: HTMLElement | string;
    scrollingElement?: HTMLElement | Document | Element | string;
    rootElement?: Element | Document;
    waitForElement?: boolean;
}
export interface TourNavigatorStates {
    currentStepIndex: number;
    x: number;
    y: number;
    height: number;
    width: number;
    isScrolling: boolean;
    elementsMap: { [key: string] : HTMLElement | null };
}