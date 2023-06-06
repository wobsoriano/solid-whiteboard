import { Component } from 'solid-js'
import { useSettings } from '../SettingsProvider'

import style from './PenSettings.module.css'

type RangeEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: Element;
}

const PenSettings: Component = () => {
    const { settings, setSettings } = useSettings()

    const handleChange = (e: RangeEvent) => {
        setSettings((prev) => ({
            ...prev,
            [e.target.id]: e.currentTarget.value
        }))
    }

    return (
        <div class="p-1 z-50 shadow rounded bg-white dark:bg-gray-600 mt-2 text-gray-700 dark:text-gray-200">
            <div class="w-full">
                <label class={style.label} for="size">Size</label>
                <input class={style.range} type="range" id="size" min="1" max="64" step="0.63" value={settings().size} onInput={handleChange}  />
            </div>
            <div class="w-full">
                <label class={style.label} for="thinning">Thinning</label>
                <input class={style.range} type="range" id="thinning" min="-1" max="1" step="0.02" value={settings().thinning} onInput={handleChange} />
            </div>
            <div class="w-full">
                <label class={style.label} for="smoothing">Smoothing</label>
                <input class={style.range} type="range" id="smoothing" min="0" max="2" step="0.02" value={settings().smoothing} onInput={handleChange} />
            </div>
            <div class="w-full">
                <label class={style.label} for="streamline">Streamline</label>
                <input class={style.range} type="range" id="streamline" min="0" max="1" step="0.01" value={settings().streamline} onInput={handleChange} />
            </div>
        </div>
    )
}

export default PenSettings
