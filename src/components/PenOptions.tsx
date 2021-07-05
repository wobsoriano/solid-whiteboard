import { Component } from 'solid-js'
import { createWhiteboard } from '../WhiteboardProvider'

import style from './PenOptions.module.css'

type RangeEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: Element;
}

const PenOptions: Component = () => {
    const { options, setOptions } = createWhiteboard()

    const handleChange = (e: RangeEvent) => {
        setOptions((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <div class="p-1 z-50 shadow rounded bg-white dark:bg-gray-600 mt-2 text-gray-700 dark:text-gray-200">
            <div class="w-full">
                <label class={style.label} for="size">Size</label>
                <input class={style.range} type="range" id="size" min="1" max="64" step="0.63" value={options().size} onInput={handleChange}  />
            </div>
            <div class="w-full">
                <label class={style.label} for="thinning">Thinning</label>
                <input class={style.range} type="range" id="thinning" min="-1" max="1" step="0.02" value={options().thinning} onInput={handleChange} />
            </div>
            <div class="w-full">
                <label class={style.label} for="smoothing">Smoothing</label>
                <input class={style.range} type="range" id="smoothing" min="0" max="2" step="0.02" value={options().smoothing} onInput={handleChange} />
            </div>
            <div class="w-full">
                <label class={style.label} for="streamline">Streamline</label>
                <input class={style.range} type="range" id="streamline" min="0" max="1" step="0.01" value={options().streamline} onInput={handleChange} />
            </div>
        </div>
    )
}

export default PenOptions