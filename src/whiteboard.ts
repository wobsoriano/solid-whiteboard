import { createSignal, createMemo, createEffect } from 'solid-js'
import getStroke from 'perfect-freehand'

import { createSettings } from './SettingsProvider'
import { getInitialData, getSvgPathFromStroke } from './utils'

const initialPointsData = {
    allPoints: [] as [number, number, number][][],
    currentPoints: null as [number, number, number][] | null
}

export function createWhiteboard() {
    const [history, setHistory] = createSignal([getInitialData<typeof initialPointsData>('points', initialPointsData)])
    const [historyStep, setHistoryStep] = createSignal(0)
    const [points, setPoints] = createSignal(history()[0])
    const { setIsDrawing, isDrawing, settings } = createSettings()

    createEffect(() => {
        localStorage.setItem('points', JSON.stringify(points()))
    })

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

    const handlePointerEnter = (e: PointerEvent) => {
        if (e.buttons === 1) {
            handlePointerDown(e)
        }
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

    const handleReset = async () => {
        const result = await window.confirm('Are you sure?')
        if (result) {
            setHistory([initialPointsData])
            setHistoryStep(0)
            setPoints(history()[0])
        }
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
        handlePointerEnter,
        handlePointerLeave,
        handleUndo,
        handleRedo,
        handleReset,
        paths,
        currentPath
    }
}