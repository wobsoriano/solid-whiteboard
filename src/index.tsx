import { render } from 'solid-js/web'

import App from './App'
import { ThemeProvider } from './ThemeProvider'
import { SettingsProvider } from './SettingsProvider'

import './index.css'

render(() => (
    <ThemeProvider>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </ThemeProvider>
), document.getElementById("root"));
