import { createSignal, createMemo, createEffect } from 'solid-js'
import getStroke from 'perfect-freehand'

import { useSettings } from './SettingsProvider'
import { getInitialData, getSvgPathFromStroke } from './utils'

const initialPointsData = {
    allPoints: [] as [number, number, number][][],
    currentPoints: null as [number, number, number][] | null
}

export function createWhiteboard() {
    let history = [getInitialData<typeof initialPointsData>('points', initialPointsData)]
    let historyStep = 0
    const [points, setPoints] = createSignal(history[0])
    const { setIsDrawing, isDrawing, settings } = useSettings()

    createEffect(() => {
        localStorage.setItem('points', JSON.stringify(points()))
    })

    const handlePointerDown = (e: PointerEvent) => {
        e.preventDefault()
        setIsDrawing(true)
        setPoints(prev => ({
            ...prev,
            currentPoints: [[e.pageX, e.pageY, e.pressure]]
        }))        
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
        history = [...history, newEntry]
        historyStep += 1
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
        if (historyStep === 0) return
        historyStep -= 1
        const previous = history[historyStep]
        setPoints(previous)
    }
    
    const handleRedo = () => {
        if (historyStep === history.length - 1) return
        historyStep += 1
        const next = history[historyStep]
        setPoints(next)
    }

    const handleReset = async () => {
        const result = await window.confirm('Are you sure?')
        if (result) {
            history = [initialPointsData]
            historyStep = 0
            setPoints(history[0])
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
