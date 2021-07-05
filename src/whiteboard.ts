import { createSignal, createMemo } from 'solid-js'
import getStroke from 'perfect-freehand'
import { createSettings } from './SettingsProvider'

const initialPointsData = {
    allPoints: [],
    currentPoints: null
}

function getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) return ""
    
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
        return acc
      },
      ["M", ...stroke[0], "Q"]
    )
  
    d.push("Z")
    return d.join(" ")
}

export function createWhiteboard() {
    const [history, setHistory] = createSignal([initialPointsData])
    const [historyStep, setHistoryStep] = createSignal(0)
    const [points, setPoints] = createSignal(history()[0])
    const { setIsDrawing, isDrawing, settings } = createSettings()

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

    const handlePointerLeave = (e: PointerEvent) => {
        if (!isDrawing()) return
        handlePointerUp(e)
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
            return getSvgPathFromStroke(getStroke(point, settings()))
        })
    })

    const currentPath = createMemo(() => {
        if (!points().currentPoints) return null
        return getSvgPathFromStroke(getStroke(points().currentPoints, settings()))
    })

    return {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerLeave,
        handleUndo,
        handleRedo,
        handleReset,
        paths,
        currentPath
    }
}