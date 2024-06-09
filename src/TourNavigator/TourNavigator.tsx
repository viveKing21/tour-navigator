import { PureComponent, ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './tourNavigator.css'
import { Align, Position, FitPriority, TourNavigatorProps, TourNavigatorStates, Step, ClientBoundingRect, HelperProps, RecursiveFunction } from './types'

const fitPriority: FitPriority = {
    left: [Position.RIGHT, Position.BOTTOM, Position.TOP],
    right: [Position.LEFT, Position.BOTTOM, Position.TOP],
    top: [Position.BOTTOM, Position.LEFT, Position.RIGHT],
    bottom: [Position.TOP, Position.LEFT, Position.RIGHT]
}

interface TourNavigatorWrapperProps {
    children: JSX.Element
    onAfterOpen?: (() => void) | null
    onBeforeClose?: (() => void) | null
}
function TourNavigatorWrapper({children, onAfterOpen, onBeforeClose}: TourNavigatorWrapperProps){
    
    useEffect(() => {
        onAfterOpen?.()
        return () => {
            onBeforeClose?.()
        }
    }, [])

    return children
}


class TourNavigator extends PureComponent<TourNavigatorProps, TourNavigatorStates> {
    static defaultProps: Partial<TourNavigatorProps> = {
        id: `___tournavigator-${Date.now()}`,
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
        waitForElementRendered: false
    }

    private renderElement: HTMLElement = document.body;
    private scrollingElement: HTMLElement | Document | Element = document;
    private helper: HTMLElement | null = null;
    private mutationObserver?: MutationObserver;
    private lastAvailableStepIndex: number = 0;
    private subscribe: Map<Element | Document | Window, () => RecursiveFunction> = new Map;

    constructor(props: TourNavigatorProps) {
        super(props)
        this.state = {
            currentStepIndex: props.startAt ?? 0,
            previousStepIndex: -1,
            x: 0,
            y: 0,
            height: 0,
            width: 0,
            isScrollingIntoView: false,
            elementsMap: {}
        }

        this.lastAvailableStepIndex = this.state.currentStepIndex;
        if(props.renderElement && props.renderElement instanceof HTMLElement) this.renderElement = props.renderElement
        if(props.scrollingElement && props.scrollingElement instanceof HTMLElement) this.scrollingElement = props.scrollingElement
    }
    get currentStepIndex(): number {
        let {elementsMap, currentStepIndex} = this.state
        let dontWaitForElement = elementsMap[this.props.steps?.[currentStepIndex]?.selector || ''] || this.props.waitForElementRendered == false
        if(dontWaitForElement) return this.lastAvailableStepIndex = currentStepIndex
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
    get currentScrollingContainer(): HTMLElement  {
        let selector = this.currentStep?.container
        if(typeof selector === 'string'){
            return this.state.elementsMap[selector] || document.querySelector(selector) || document.body
        }
        return (this.currentStep?.container || document.body) as HTMLElement
    }
    componentDidMount(): void {
        if(typeof this.props.renderElement == 'string') this.renderElement = document.querySelector(this.props.renderElement) || document.body
        if(typeof this.props.scrollingElement == 'string') this.scrollingElement = (document.querySelector(this.props.scrollingElement) || (document.scrollingElement || document.documentElement)) as HTMLElement
        
        if(this.props.resizeListener) this.addListener(window, ['resize', this.updateBoundingClientRect.bind(this, undefined)])
        if(this.props.scrollListener) this.addListener(this.scrollingElement, ['scroll', this.updateBoundingClientRect.bind(this, {behavior: 'auto'})])
        
        this.mapElements(() => {
            this.updateBoundingClientRect() 
        })

        this.initMutationObserver()
    }
    componentWillUnmount(): void {
        this.subscribe.forEach((unsubscribe) => unsubscribe())
        if(this.mutationObserver) this.mutationObserver.disconnect()
    }
    addListener(element: Element | Document | Window | string, args: [string, (e: Event) => void]){
        if(typeof element === 'string'){
            let element_ = document.querySelector(element)
            if(element_) element = element_
            else return
        }
        
        let target = element as Element | Document | Window

        if(this.subscribe.has(target)) {
            let unsubscribe = this.subscribe.get(target)
            unsubscribe?.()
        }

        let subscribe = () => {
            target.addEventListener(...args)
            this.subscribe.set(target, unsubscribe)
            return unsubscribe
        }
        
        let unsubscribe = () => {
            target.removeEventListener(...args)
            this.subscribe.delete(target)
            return subscribe
        }

        subscribe()
    }
    initMutationObserver() {
        if (this.props.mutationObserve) {
            this.mutationObserver = new MutationObserver((entries) => {
                this.mapElements(() => {
                    this.updateBoundingClientRect();
                });
            });

            const addToObserveList = (target: string | HTMLElement, config?: MutationObserverInit) => {
                let targetElement: HTMLElement | null = null;

                config = { childList: true, ...config }

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
                if(typeof cur.container === 'string') acc[cur.container] = document.querySelector(cur.container)
                return acc
            }, {})
        }, callback)
    }
    updateBoundingClientRect(scrollIntoViewOptions?: ScrollIntoViewOptions): void {
        if(this.currentElement == null) return

        let subscriptions: RecursiveFunction[] = []

        if(this.props.scrollListener && this.subscribe.has(this.scrollingElement)) {
            let unsubscribe = this.subscribe.get(this.scrollingElement)
            unsubscribe && subscriptions.push(unsubscribe)
        }

        const updateFocus = () => {
            if(this.currentElement == null) return
            const { x, y, height, width } = this.currentElement.getBoundingClientRect()
            this.setState({ x, y, height, width, isScrollingIntoView: false })
        }

        if(this.currentStep?.scrollIntoView === false) return updateFocus()

        const observerCallback: IntersectionObserverCallback = (entries, observer) => {
            if(entries[0].isIntersecting) {
                this.stopCurrentScrollIntoView()
                updateFocus()
                subscriptions.forEach(subscribe => subscribe())
                observer.disconnect()
            }
        }

        const observer = new IntersectionObserver(observerCallback, this.getDynamicIntersectionOption())
        observer.observe(this.currentElement)
        
        subscriptions.forEach((unsubscribe, index) => {
            let subscribe = unsubscribe()
            subscriptions[index] = subscribe
        })

        this.setState({isScrollingIntoView: true})

        this.currentElement.scrollIntoView({
            behavior: scrollIntoViewOptions?.behavior || this.props.scrollBehavior,
            block: 'nearest',
            inline: 'nearest'
        })
    }
    stopCurrentScrollIntoView(){
        let currentElement: Element | undefined | null = this.currentElement?.parentElement

        while(currentElement){
            let hasScrolling = currentElement.scrollHeight > currentElement.clientHeight || currentElement.scrollWidth > currentElement.clientWidth
            if(hasScrolling){
                currentElement.scrollTo({
                    top: currentElement.scrollTop,
                    left: currentElement.scrollLeft
                })
            }
            currentElement = currentElement.parentElement
        }
    }
    getDynamicIntersectionOption(): IntersectionObserverInit | undefined{
        if(this.currentElement == null) return

        const computedStyle = window.getComputedStyle(this.currentElement);
        const borderTopWidth = parseInt(computedStyle.borderTopWidth, 10) || 1;
        const borderRightWidth = parseInt(computedStyle.borderRightWidth, 10) || 1;
        const borderBottomWidth = parseInt(computedStyle.borderBottomWidth, 10) || 1;
        const borderLeftWidth = parseInt(computedStyle.borderLeftWidth, 10) || 1;

        const contentHeight = this.currentElement.offsetHeight - borderTopWidth - borderBottomWidth;
        const contentWidth = this.currentElement.offsetWidth - borderLeftWidth - borderRightWidth;

        const containerHeight = Math.min(this.currentScrollingContainer.offsetHeight, window.innerHeight) - borderTopWidth - borderBottomWidth;
        const containerWidth = Math.min(this.currentScrollingContainer.offsetWidth, window.innerWidth) - borderLeftWidth - borderRightWidth;

        let adjustedThresholdY = containerHeight > contentHeight ? contentHeight / this.currentElement.offsetHeight: containerHeight / this.currentElement.offsetHeight;
        let adjustedThresholdX = containerWidth > contentWidth ? contentWidth / this.currentElement.offsetWidth : containerWidth / contentWidth;

        let adjustedThreshold = Math.min(adjustedThresholdY, adjustedThresholdX);

        let intersectionOption: IntersectionObserverInit = {
            threshold: this.currentStep?.intersectionOption?.threshold ?? adjustedThreshold,
            rootMargin: this.currentStep?.intersectionOption?.rootMargin ?? `-${borderTopWidth}px -${borderRightWidth}px -${borderBottomWidth}px -${borderLeftWidth}px`,
        }

        if(typeof this.currentStep?.intersectionOption?.root === 'string'){
            intersectionOption.root = document.querySelector(this.currentStep?.intersectionOption?.root)
        }

        return intersectionOption
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
    focus(scrollBehavior: 'smooth' | 'auto' = 'auto'){
        this.updateBoundingClientRect(scrollBehavior && {behavior: scrollBehavior})
    }
    goto(stepIndex: number): void{
        let currentStepIndex = Math.max(0, Math.min(stepIndex, this.props.steps.length - 1))
        
        this.setState({currentStepIndex, previousStepIndex: this.state.currentStepIndex}, () => {
            this.updateBoundingClientRect()
            let props: HelperProps = {
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: this.currentStepIndex,
                previousStepIndex: this.state.previousStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                focus: this.focus.bind(this),
                goto: this.goto.bind(this),
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrollingIntoView: this.state.isScrollingIntoView,
                onRequestClose: this.props.onRequestClose || null
            }
            this.props.onMove && this.props.onMove(props)
        })
    }
    next(): void {
        let currentStepIndex = Math.min(this.state.currentStepIndex + 1, this.props.steps.length - 1)
        this.setState({currentStepIndex, previousStepIndex: this.state.currentStepIndex}, () => {
            this.updateBoundingClientRect()
            const props: HelperProps = {
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: this.currentStepIndex,
                previousStepIndex: this.state.previousStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                focus: this.focus.bind(this),
                goto: this.goto.bind(this),
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrollingIntoView: this.state.isScrollingIntoView,
                onRequestClose: this.props.onRequestClose || null
            }
            this.props.onNext && this.props.onNext(props)
            this.props.onMove && this.props.onMove(props)
        })
    }
    prev(): void {
        let currentStepIndex = Math.max(this.state.currentStepIndex - 1, 0)
        this.setState({currentStepIndex, previousStepIndex: this.state.currentStepIndex}, () => {
            this.updateBoundingClientRect()
            const props: HelperProps = {
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: this.currentStepIndex,
                previousStepIndex: this.state.previousStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                focus: this.focus.bind(this),
                goto: this.goto.bind(this),
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrollingIntoView: this.state.isScrollingIntoView,
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
                    this.props.overlay ? this.props.overlay({x, y, height, width, isScrollingIntoView: this.state.isScrollingIntoView}):(
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
                                        style={{...this.props.maskStyle, ...(this.state.isScrollingIntoView ? this.props.maskStyleDuringScroll:undefined)}}
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
                        previousStepIndex: this.state.previousStepIndex,
                        steps: this.props.steps,
                        target: this.currentElement,
                        focus: this.focus.bind(this),
                        goto: this.goto.bind(this),
                        next: this.next.bind(this),
                        prev: this.prev.bind(this),
                        isScrollingIntoView: this.state.isScrollingIntoView,
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

export default TourNavigator