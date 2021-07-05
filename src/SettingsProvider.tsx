import { Accessor, Component, createContext, createSignal, useContext } from "solid-js"

const defaultSettings = {
    size: 16,
    thinning: 0.75,
    smoothing: 0.5,
    streamline: 0.5
}

type Settings = typeof defaultSettings

type SettingsContextValue = {
    isDrawing: Accessor<boolean>
    setIsDrawing: (v: boolean | ((prev: boolean) => boolean)) => boolean 
    settings: Accessor<Settings>
    setSettings: (v: Settings | ((prev: Settings) => Settings)) => Settings
}

const SettingsContext = createContext<SettingsContextValue>()

export function SettingsProvider (props) {
    const [isDrawing, setIsDrawing] = createSignal(false)
    const [settings, setSettings] = createSignal(defaultSettings)

    const store: SettingsContextValue = {
        isDrawing,
        setIsDrawing,
        settings,
        setSettings
    }

    return <SettingsContext.Provider value={store}>{props.children}</SettingsContext.Provider>
}

export const createSettings = () => {
    return useContext(SettingsContext)
}