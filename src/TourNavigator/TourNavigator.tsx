import { PureComponent, ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './tourNavigator.css'
import { Align, Position, FitPriority, TourNavigatorProps, TourNavigatorStates, Step, ClientBoundingRect } from './types'

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
        scrollIntoViewOptions: { block: 'nearest', inline: 'nearest', behavior: 'auto'},
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
        scrollingElement: (document.scrollingElement || document.documentElement) as HTMLElement,
    }

    private renderElement: HTMLElement = document.body;
    private scrollingElement: HTMLElement = (document.scrollingElement || document.documentElement) as HTMLElement;
    private helper: HTMLElement | null = null;
    private resizeEventListner: (() => void) | null = null;
    private scrollEventListner: (() => void) | null = null;

    constructor(props: TourNavigatorProps) {
        super(props)
        this.state = {
            currentStepIndex: props.startAt ?? 0,
            x: 0,
            y: 0,
            height: 0,
            width: 0,
            isScrolling: false
        }

        if(props.renderElement && props.renderElement instanceof HTMLElement) this.renderElement = props.renderElement
        if(props.scrollingElement && props.scrollingElement instanceof HTMLElement) this.scrollingElement = props.scrollingElement
    }
    get currentStep(): Step | null {
        if (this.props.steps.length == 0) return null
        return this.props.steps[this.state.currentStepIndex]
    }
    get currentElement(): HTMLElement | null {
        if (!this.currentStep) return null
        return document.querySelector(this.currentStep.selector)
    }
    get isCurrentElementInView(): boolean {
        if (!this.currentElement) return false
        let rect = this.currentElement.getBoundingClientRect();
        let container = this.scrollingElement.getBoundingClientRect()
        
        return (
            Math.ceil(rect.top) >= Math.max(0, container.top) &&
            Math.floor(rect.bottom) <= Math.floor(Math.min(window.innerHeight, container.bottom)) &&
            Math.ceil(rect.left) >= Math.max(0, container.left) &&
            Math.floor(rect.right) <= Math.floor(Math.min(window.innerWidth, container.right))
        );
    }
    componentDidMount(): void {
        if(typeof this.props.renderElement == 'string') this.renderElement = document.querySelector(this.props.renderElement) || document.body
        if(typeof this.props.scrollingElement == 'string') this.scrollingElement = document.querySelector(this.props.scrollingElement) || (document.scrollingElement || document.documentElement) as HTMLElement
        this.updateBoundingClientRect()
        if(this.props.resizeListener) window.addEventListener('resize', this.resizeEventListner = this.updateBoundingClientRect.bind(this))
        if(this.props.scrollListener) this.scrollingElement.addEventListener('scroll', this.scrollEventListner = this.updateBoundingClientRect.bind(this))
    }
    componentWillUnmount(): void {
        if(this.resizeEventListner) window.removeEventListener('resize', this.resizeEventListner)
        if(this.scrollEventListner) this.scrollingElement.removeEventListener('scroll', this.scrollEventListner)
    }
    scrollElementIntoView(callback: () => void): void {
        if(!this.currentElement) return
        if (this.isCurrentElementInView) {
            callback()  
        }else{
            if(this.scrollEventListner) this.scrollingElement.removeEventListener('scroll', this.scrollEventListner)
            this.currentElement.scrollIntoView(this.props.scrollIntoViewOptions)
            const revert = () => {
                callback()
                this.setState({isScrolling: false})
                if(this.props.scrollListener) this.scrollingElement.addEventListener('scroll', this.scrollEventListner = this.updateBoundingClientRect.bind(this))
            }

            if(this.props.scrollIntoViewOptions?.behavior == 'smooth'){
                this.setState({isScrolling: true})
                this.scrollingElement.addEventListener('scrollend', () => {
                    revert()
                    window.removeEventListener('scrollend', revert)
                }, {once: true})
                window.addEventListener('scrollend', () => {
                    revert()
                    this.scrollingElement.removeEventListener('scrollend', revert)
                }, {once: true})
            }else revert()
        } 
    }
    updateBoundingClientRect(): void {
        this.scrollElementIntoView(() => {
            if(this.currentElement == null) return
            const { x, y, height, width } = this.currentElement.getBoundingClientRect()
            this.setState({ x, y, height, width })
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
    next(): void {
        let currentStepIndex = Math.min(this.state.currentStepIndex + 1, this.props.steps.length - 1)
        this.setState({currentStepIndex}, () => {
            this.updateBoundingClientRect()
            this.props.onNext && this.props.onNext({
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: currentStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrolling: this.state.isScrolling,
                onRequestClose: this.props.onRequestClose || null
            })
        })
    }
    prev(): void {
        let currentStepIndex = Math.max(this.state.currentStepIndex - 1, 0)
        this.setState({currentStepIndex}, () => {
            this.updateBoundingClientRect()
            this.props.onPrev && this.props.onPrev({
                id: this.props.id,
                currentStep: this.currentStep,
                currentStepIndex: currentStepIndex,
                steps: this.props.steps,
                target: this.currentElement,
                next: this.next.bind(this),
                prev: this.prev.bind(this),
                isScrolling: this.state.isScrolling,
                onRequestClose: this.props.onRequestClose || null
            })
        })
    }
    renderOverLay(): ReactNode {
        const { x, y, height, width } = this.getMaskBoundingClientRect()
        
        const overlayRef = (ref: HTMLElement | null) => {
            if(ref == null) return

            ref.onclick = (event: MouseEvent | PointerEvent) => {
                const isMask = (event.x >= x && event.x <= (x + width)) && (event.y >= y && event.y <= (y + height))
                this.props.onRequestClose?.({event, isMask})
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
        const { currentStepIndex } = this.state
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
                y = maskRect.y - boundingRect.height - boundingRectDistance
            }
            if (position == 'bottom') {
                x = maskRect.x
                y = maskRect.y + maskRect.height + boundingRectDistance
            }
            if (position == 'left') {
                x = maskRect.x - boundingRect.width - boundingRectDistance
                y = maskRect.y
            }
            if (position == 'right') {
                x = maskRect.x + maskRect.width + boundingRectDistance
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

            this.helper.dataset.position = position
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
                <div className={`__tourNavigator ${this.props.className}`}>
                    {this.props.renderOverlay && this.renderOverLay()}
                    {this.props.renderHelper && this.renderHelper()}
                </div>
            </TourNavigatorWrapper>,
            this.renderElement
        )
    }
}