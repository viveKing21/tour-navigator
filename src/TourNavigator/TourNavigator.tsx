import { PureComponent, ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './tourNavigator.css'
import { Align, Position, FitPriority, TourNavigatorProps, TourNavigatorStates, Step, ClientBoundingRect, HelperProps } from './types'

const fitPriority: FitPriority = {
    left: [Position.RIGHT, Position.BOTTOM, Position.TOP],
    right: [Position.LEFT, Position.BOTTOM, Position.TOP],
    top: [Position.BOTTOM, Position.LEFT, Position.RIGHT],
    bottom: [Position.TOP, Position.LEFT, Position.RIGHT]
}

type TourNavigatorWrapperProps = {
    children?: JSX.Element,
    onAfterOpen?: (() => void) | null,
    onBeforeClose?: (() => void) | null
}
function TourNavigatorWrapper({children, onAfterOpen, onBeforeClose}: TourNavigatorWrapperProps) {
    
    useEffect(() => {
        onAfterOpen?.()
        return () => {
            onBeforeClose?.();
        };
    }, [])

    return children || null
}

export default class TourNavigator extends PureComponent<TourNavigatorProps, TourNavigatorStates> {
    
    static defaultProps: Partial<TourNavigatorProps> = {
        steps: [],
        maskRadius: 5,
        maskPadding: 5,
        startAt: 0,
        maskHelperDistance: 10,
        screenHelperDistance: 10,
        onAfterOpen: null,
        onBeforeClose: null,
        helper: null,
        isOpen: true,
        onRequestClose: null,
        onNext: null,
        onPrev: null,
        scrollBehavior: 'smooth',
        resizeListener: true,
        scrollListener: true,
        overlayFill: 'black',
        overlayOpacity: 0.5,
        maskOpacity: 1,
        overlay: null,
        className: '',
        renderHelper: true,
        renderOverlay: true,
        renderElement: document.body,
        scrollingElement: document,
        rootElement: document,
        waitForElement: false
    }

    private renderElement: HTMLElement = document.body;
    private scrollingElement: HTMLElement | Document | Element = document;
    private helper: HTMLElement | null = null;
    private resizeEventListner: (() => void) | null = null;
    private scrollEventListner: (() => void) | null = null;
    private mutationObserver?: MutationObserver;
    private lastAvailableStepIndex: number = 0;

    constructor(props: TourNavigatorProps) {
        super(props)
        this.state = {
            currentStepIndex: props.startAt ?? 0,
            x: 0,
            y: 0,
            height: 0,
            width: 0,
            isScrolling: false,
            elementsMap: {}
        }

        this.lastAvailableStepIndex = this.state.currentStepIndex;
        if(props.renderElement && props.renderElement instanceof HTMLElement) this.renderElement = props.renderElement
        if(props.scrollingElement && props.scrollingElement instanceof HTMLElement) this.scrollingElement = props.scrollingElement
    }
    get currentStepIndex(): number {
        let {elementsMap, currentStepIndex} = this.state
        let waitForElement = elementsMap[this.props.steps?.[currentStepIndex]?.selector || ''] || this.props.waitForElement == false
        if(waitForElement) return this.lastAvailableStepIndex = currentStepIndex
        return this.lastAvailableStepIndex
    }
    get currentStep(): Step | null {
        if (this.props.steps.length == 0) return null
        return this.props.steps[this.currentStepIndex]
    }
    get currentElement(): HTMLElement | null {
        if(this.currentStep == null) return null
        return this.state.elementsMap[this.currentStep.selector] || document.querySelector(this.currentStep.selector)
    }
    get isCurrentElementInView(): boolean {
        if (!this.currentElement) return false
        if(this.currentStep?.scrollInView === false) return true

        let rect = this.currentElement.getBoundingClientRect();
        
        let container;

        if(this.scrollingElement instanceof HTMLElement) container = this.scrollingElement
        else container = document.body

        let containerBoundingRect = container.getBoundingClientRect()

        let viewAreaLeft = Math.floor(Math.max(0, containerBoundingRect.left))
        let viewAreaTop = Math.floor(Math.max(0, containerBoundingRect.top))
        let viewAreaWidth = Math.floor(Math.min(window.innerWidth, containerBoundingRect.right))
        let viewAreaHeight = Math.floor(Math.min(window.innerHeight, containerBoundingRect.bottom))

        let isInXView = (Math.floor(rect.left) >= viewAreaLeft && Math.floor(rect.right) <= viewAreaWidth) ||
        (Math.floor(rect.width) > viewAreaWidth && Math.floor(rect.left) <= viewAreaLeft && Math.floor(rect.right) >= viewAreaWidth)

        let isInYView = (Math.floor(rect.top) >= viewAreaTop && Math.floor(rect.bottom) <= viewAreaHeight) ||
        (Math.floor(rect.height) > viewAreaHeight && Math.floor(rect.top) <= viewAreaTop && Math.floor(rect.bottom) >= viewAreaHeight)

        return isInXView && isInYView
    }
    componentDidMount(): void {
        if(typeof this.props.renderElement == 'string') this.renderElement = document.querySelector(this.props.renderElement) || document.body
        if(typeof this.props.scrollingElement == 'string') this.scrollingElement = (document.querySelector(this.props.scrollingElement) || (document.scrollingElement || document.documentElement)) as HTMLElement
        if(this.props.resizeListener) window.addEventListener('resize', this.resizeEventListner = this.updateBoundingClientRect.bind(this, undefined))
        if(this.props.scrollListener) this.scrollingElement.addEventListener('scroll', this.scrollEventListner = this.updateBoundingClientRect.bind(this, {behavior: 'auto'}))
        
        this.mapElements(() => {
            this.updateBoundingClientRect() 
        })

        this.initMutationObserver()
    }
    componentWillUnmount(): void {
        if(this.resizeEventListner) window.removeEventListener('resize', this.resizeEventListner)
        if(this.scrollEventListner) this.scrollingElement.removeEventListener('scroll', this.scrollEventListner)
        if(this.mutationObserver) this.mutationObserver.disconnect()
    }
    initMutationObserver() {
        if (this.props.mutationObserve) {
            this.mutationObserver = new MutationObserver((entries) => {
                this.mapElements(() => {
                    this.updateBoundingClientRect();
                });
            });

            const addToObserveList = (target: string | HTMLElement, config: MutationObserverInit = { childList: true }) => {
                let targetElement: HTMLElement | null = null;

                if (typeof target === 'string') {
                    targetElement = document.querySelector(target);
                } else if (target instanceof HTMLElement) {
                    targetElement = target;
                }

                if (targetElement) {
                    this.mutationObserver?.observe(targetElement, config);
                }
            };

            const config = this.props.mutationObserve;

            if (typeof config === 'string' || config instanceof HTMLElement) {
                addToObserveList(config);
            } else if (Array.isArray(config)) {
                if (typeof config[0] === 'string' || config[0] instanceof HTMLElement) {
                    config.forEach(item => {
                        addToObserveList(item as string | HTMLElement);
                    });
                } else {
                    config.forEach(item => {
                        const [target, options] = item as [string | HTMLElement, MutationObserverInit];
                        addToObserveList(target, options);
                    });
                }
            }
        }
    }
    mapElements(callback?: () => void): void{
        this.setState({
            elementsMap: this.props.steps.reduce<{[key: string]: HTMLElement | null}>((acc, cur) => {
                acc[cur.selector] = document.querySelector(cur.selector)
                return acc
            }, {})
        }, callback)
    }
    updateBoundingClientRect(scrollIntoViewOptions?: ScrollIntoViewOptions): void {
        const updateFocus = () => {
            if(this.currentElement == null) return
            const { x, y, height, width } = this.currentElement.getBoundingClientRect()
            this.setState({ x, y, height, width })
        }


        if(this.isCurrentElementInView){
            updateFocus()
        }else{
            this.setState({isScrolling: true})
            if(this.scrollEventListner) this.scrollingElement.removeEventListener('scroll', this.scrollEventListner)
            this.scrollIntoView(() => {
                this.setState({isScrolling: false})
                if(this.scrollEventListner) this.scrollingElement.addEventListener('scroll', this.scrollEventListner)
                updateFocus()
            }, scrollIntoViewOptions)
        }
    }
    scrollIntoView(callback?: (entry: IntersectionObserverEntry) => void, scrollIntoViewOptions?: ScrollIntoViewOptions): void{
        if(this.currentElement === null) return

        const observerCallback: IntersectionObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                let isIntersecting = entry.isIntersecting || this.isCurrentElementInView
                if(entry.target === this.currentElement && isIntersecting){
                    callback?.(entry)
                    observer.disconnect()
                }
            })
        }

        let intersectionOption: IntersectionObserverInit = {
            threshold: Math.max(0, Math.min(Number(this.currentStep?.intersectionThreshold || 1), 1)),
            rootMargin: `${this.currentStep?.intersectionMargin || 1}px`,
            root: this.props.rootElement 
        }

        console.log(intersectionOption)
        const observer = new IntersectionObserver(observerCallback, intersectionOption)
        observer.observe(this.currentElement)

        this.currentElement.scrollIntoView({
            behavior: scrollIntoViewOptions?.behavior || this.props.scrollBehavior,
            block: 'nearest',
            inline: 'nearest'
        })
    }
    getMaskBoundingClientRect(): ClientBoundingRect {
        const { x, y, height, width } = this.state
        const { maskPadding = 0 } = this.props
        return {
            x: x - maskPadding,
            y: y - maskPadding,
            height: height + maskPadding + maskPadding,
            width: width + maskPadding + maskPadding
        }
    }
    getHelperBoundingClientRect(): ClientBoundingRect {
        let rect = (this.helper && this.helper.getBoundingClientRect()) || { x: 0, y: 0, height: 0, width: 0 }
        return {
            x: rect.x,
            y: rect.y,
            height: rect.height,
            width: rect.width
        }
    }
    goto(stepIndex: number): void{
        let currentStepIndex = Math.max(0, Math.min(stepIndex, this.props.steps.length - 1))
        
        this.setState({currentStepIndex}, () => {
            this.updateBoundingClientRect()
            let props: HelperProps = {
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: this.currentStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                goto: this.goto.bind(this),
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrolling: this.state.isScrolling,
                onRequestClose: this.props.onRequestClose || null
            }
            this.props.onMove && this.props.onMove(props)
        })
    }
    next(): void {
        let currentStepIndex = Math.min(this.state.currentStepIndex + 1, this.props.steps.length - 1)
        this.setState({currentStepIndex}, () => {
            this.updateBoundingClientRect()
            const props = {
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: this.currentStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                goto: this.goto.bind(this),
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrolling: this.state.isScrolling,
                onRequestClose: this.props.onRequestClose || null
            }
            this.props.onNext && this.props.onNext(props)
            this.props.onMove && this.props.onMove(props)
        })
    }
    prev(): void {
        let currentStepIndex = Math.max(this.state.currentStepIndex - 1, 0)
        this.setState({currentStepIndex}, () => {
            this.updateBoundingClientRect()
            const props = {
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: this.currentStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                goto: this.goto.bind(this),
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrolling: this.state.isScrolling,
                onRequestClose: this.props.onRequestClose || null
            }
            this.props.onPrev && this.props.onPrev(props)
            this.props.onMove && this.props.onMove(props)
        })
    }
    renderOverLay(): ReactNode {
        const { x, y, height, width } = this.getMaskBoundingClientRect()
        
        const overlayRef = (ref: HTMLElement | null) => {
            if(ref == null) return

            ref.onclick = (event: MouseEvent | PointerEvent) => {
                const isMask = (event.x >= x && event.x <= (x + width)) && (event.y >= y && event.y <= (y + height))
                this.props.onRequestClose?.({event, isMask, isOverlay: true})
            }
        }
        return (
            <div className='__tourNavigator-overlay' ref={overlayRef}>
                {
                    this.props.overlay ? this.props.overlay({x, y, height, width, isScrolling: this.state.isScrolling}):(
                        <svg height='100%' width='100%'>
                            <defs>
                                <mask id={`__tourNavigator-mask-${this.props.id}`}>
                                    <rect x={0} y={0} height={'100%'} width={'100%'} fill='white' />
                                    <rect
                                        x={x}
                                        y={y}
                                        height={height}
                                        width={width}
                                        fill='black'
                                        rx={this.props.maskRadius}
                                        opacity={this.props.maskOpacity}
                                        style={{...this.props.maskStyle, ...(this.state.isScrolling ? this.props.maskStyleDuringScroll:undefined)}}
                                    />
                                </mask>
                            </defs>
                            <rect 
                                x={0} 
                                y={0} 
                                height={'100%'} 
                                width={'100%'} 
                                fill={this.props.overlayFill} 
                                opacity={this.props.overlayOpacity} 
                                mask={`url(#__tourNavigator-mask-${this.props.id})`}
                            />
                        </svg>
                    )
                }
            </div>
        )
    }
    renderHelper(): ReactNode {
        const currentStepIndex = this.currentStepIndex
        const { helper } = this.props

        if (!helper) return null

        const adjustPosition: (helperElm: HTMLElement | null) => void = (helperElm) => {
            if ((this.helper = helperElm) == null ||
                this.currentStep == null) return

            const maskRect = this.getMaskBoundingClientRect()
            const boundingRect = this.getHelperBoundingClientRect()

            const { maskHelperDistance = 0, screenHelperDistance = 0 } = this.props
            const boundingRectDistance = maskHelperDistance + screenHelperDistance

            let canFit = {
                left: maskRect.x >= (boundingRect.width + boundingRectDistance),
                right: (window.innerWidth - (maskRect.x + maskRect.width)) >= (boundingRect.width + boundingRectDistance),
                top: maskRect.y >= (boundingRect.height + boundingRectDistance),
                bottom: (window.innerHeight - (maskRect.y + maskRect.height)) >= (boundingRect.height + boundingRectDistance)
            }

            let position: Position | Position[] = this.currentStep.position || Position.LEFT
            let align: Align = this.currentStep.align || Align.START

            if (Array.isArray(position)) position = position.find(key => canFit[key]) || Position.LEFT
            else position = (canFit[position] ? position : fitPriority[position].find(key => canFit[key])) || Position.LEFT

            let x = 0, y = 0;

            if (position == 'top') {
                x = maskRect.x
                y = maskRect.y - boundingRect.height - maskHelperDistance
            }
            if (position == 'bottom') {
                x = maskRect.x
                y = maskRect.y + maskRect.height + maskHelperDistance
            }
            if (position == 'left') {
                x = maskRect.x - boundingRect.width - maskHelperDistance
                y = maskRect.y
            }
            if (position == 'right') {
                x = maskRect.x + maskRect.width + maskHelperDistance
                y = maskRect.y
            }

            if (position == 'left' || position == 'right') {
                if (align == 'end') y = (y + maskRect.height) - boundingRect.height
                if (align == 'center') y = (y + maskRect.height / 2) - boundingRect.height / 2
            }
            if (position == 'top' || position == 'bottom') {
                if (align == 'end') x = (x + maskRect.width) - boundingRect.width
                if (align == 'center') x = (x + maskRect.width / 2) - boundingRect.width / 2
            }

            x = Math.max(screenHelperDistance, Math.min(window.innerWidth - boundingRect.width - screenHelperDistance, x))
            y = Math.max(screenHelperDistance, Math.min(window.innerHeight - boundingRect.height - screenHelperDistance, y))

            this.helper.dataset.position = position.toLowerCase()
            this.helper.dataset.align = align.toString().toLowerCase()
            this.helper.style.setProperty('--x', String(x))
            this.helper.style.setProperty('--y', String(y))
        }

        return (
            <div className='__tourNavigator-helper' ref={adjustPosition}>
                {
                    helper({
                        id: this.props.id,
                        currentStep: this.currentStep,
                        currentStepIndex: currentStepIndex,
                        steps: this.props.steps,
                        target: this.currentElement,
                        goto: this.goto.bind(this),
                        next: this.next.bind(this),
                        prev: this.prev.bind(this),
                        isScrolling: this.state.isScrolling,
                        onRequestClose: this.props.onRequestClose || null
                    })
                }
            </div>
        )
    }
    render() {
        if (!this.props.isOpen) return null
        return ReactDOM.createPortal(
            <TourNavigatorWrapper onAfterOpen={this.props.onAfterOpen} onBeforeClose={this.props.onBeforeClose}>
                <div className={`__tourNavigator ${this.props.className}`} style={this.props.style}>
                    {this.props.renderOverlay && this.renderOverLay()}
                    {this.props.renderHelper && this.renderHelper()}
                </div>
            </TourNavigatorWrapper>,
            this.renderElement
        )
    }
}