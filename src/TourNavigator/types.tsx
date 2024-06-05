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

export type OverlayProps = ClientBoundingRect & {
    isScrolling: boolean
}

export type HelperProps = {
    id: string;
    currentStep: Step | null;
    currentStepIndex: number;
    steps: Step[];
    isScrolling: boolean;
    next: () => void;
    prev: () => void;
    onRequestClose: ((params: {event: MouseEvent | PointerEvent, isMask: boolean}) => void) | null
}

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
    onRequestClose?: ((params: {event: MouseEvent | PointerEvent, isMask: boolean}) => void) | null;
    onNext?: ((props: HelperProps) => void) | null;
    onPrev?: ((props: HelperProps) => void) | null;
    scrollBehavior?: 'smooth' | 'auto';
    intersectionThreshold?: number;
    intersectionMargin?: number;
    resizeListener?: boolean;
    scrollListener?: boolean;
    overlayFill?: string;
    overlayOpacity?: number;
    overlay?: ((props: OverlayProps) => ReactNode) | null;
    className?: string;
    renderOverlay?: boolean;
    renderHelper?: boolean;
    renderElement?: HTMLElement | string;
    scrollingElement?: HTMLElement | string;
    rootElement?: Element | Document;
}
export interface TourNavigatorStates {
    currentStepIndex: number;
    x: number;
    y: number;
    height: number;
    width: number;
    isScrolling: boolean;
}