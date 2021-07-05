import getStroke from "perfect-freehand";
import { Accessor, createContext, createMemo, createSignal, useContext } from "solid-js";
import { getSvgPathFromStroke } from "./utils";

const initialPointsData = {
    allPoints: [],
    currentPoints: null
}

const defaultOptions = {
    size: 16,
    thinning: 0.75,
    smoothing: 0.5,
    streamline: 0.5
}

type Options = typeof defaultOptions

type WhiteboardContextValue = {
    isDrawing: Accessor<boolean>
    options: Accessor<{
        size: number
        thinning: number
        smoothing: number
        streamline: number
    }>
    setOptions: (v: Options | ((prev: Options) => Options)) => Options
    handlePointerMove: (e: PointerEvent) => void
    handlePointerUp: (e: PointerEvent) => void
    handlePointerDown: (e: PointerEvent) => void
    handleUndo: () => void
    handleRedo: () => void
    handleReset: () => void
    paths: Accessor<string[]>
    currentPath: Accessor<string>
}

const WhiteboardContext = createContext<WhiteboardContextValue>()

export const WhiteboardProvider = (props) => {
    const [history, setHistory] = createSignal([initialPointsData])
    const [historyStep, setHistoryStep] = createSignal(0)
    const [isDrawing, setIsDrawing] = createSignal(false)
    const [points, setPoints] = createSignal(history()[0])
    const [options, setOptions] = createSignal(defaultOptions)

    const handlePointerDown = (e: PointerEvent) => {
        e.preventDefault()
        setIsDrawing(true)
    }

    const handlePointerMove = (e: PointerEvent) => {
        if (!isDrawing()) return

        if (e.buttons === 1) {
            e.preventDefault()
            setPoints(prev => ({
                ...prev,
                currentPoints: [...prev.currentPoints ?? [], [e.pageX, e.pageY, e.pressure]]
            }))
        }
    }

    const handlePointerUp = (e: PointerEvent) => {
        e.preventDefault()
        setIsDrawing(false)

        if (!points().currentPoints) return

        const newEntry = {
            allPoints: [...points().allPoints, points().currentPoints],
            currentPoints: null
        }
        setPoints(newEntry)
        setHistory(prev => [...prev, newEntry])
        setHistoryStep((prev) => prev + 1)
    }

    const handleUndo = () => {
        if (historyStep() === 0) return
        setHistoryStep((prev) => prev - 1)
        const previous = history()[historyStep()]
        setPoints(previous)
    }
    
    const handleRedo = () => {
        if (historyStep() === history().length - 1) return
        setHistoryStep((prev) => prev + 1)
        const next = history()[historyStep()]
        setPoints(next)
    }

    const handleReset = () => {
        setHistory([initialPointsData])
        setHistoryStep(0)
        setPoints(history()[0])
    }

    const paths = createMemo(() => {
        return points().allPoints.map((point) => {
            return getSvgPathFromStroke(getStroke(point, options()))
        })
    })

    const currentPath = createMemo(() => {
        if (!points().currentPoints) return null
        return getSvgPathFromStroke(getStroke(points().currentPoints, options()))
    })

    const store: WhiteboardContextValue = {
        isDrawing,
        options,
        setOptions,
        handlePointerMove,
        handlePointerUp,
        handlePointerDown,
        handleUndo,
        handleRedo,
        handleReset,
        paths,
        currentPath
    }

    return <WhiteboardContext.Provider value={store}>{props.children}</WhiteboardContext.Provider>
}

export const createWhiteboard = () => {
    return useContext(WhiteboardContext)
}