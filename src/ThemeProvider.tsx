import { Accessor, createContext, createEffect, createSignal, useContext } from 'solid-js'

const themeName = 'theme'
const html = document.querySelector('html')

function getInitialTheme() {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const storageTheme = localStorage.getItem(themeName)
    
    if (storageTheme) return storageTheme

    return isDark ? 'dark' : 'light'
}

type ThemeContextValue = [Accessor<string>, { toggle(): void }]
const ThemeContext = createContext<ThemeContextValue>()

export function ThemeProvider(props) {
    const [theme, setTheme] = createSignal(getInitialTheme())

    createEffect(() => {
        localStorage.setItem(themeName, theme())
        if (theme() === 'dark') {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    })

    const store: ThemeContextValue = [
        theme,
        {
            toggle() {
                setTheme((prev) => prev === 'dark' ? 'light' : 'dark')
            }
        }
    ]
  
    return <ThemeContext.Provider value={store}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext)
}
