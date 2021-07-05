import { For, Component, createMemo } from 'solid-js'

import styles from './Whiteboard.module.css'
import { createTheme } from '../ThemeProvider'
import { createWhiteboard } from '../WhiteboardProvider'

const Whiteboard: Component = () => {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    paths,
    currentPath
  } = createWhiteboard()
  const [theme] = createTheme()
  const color = createMemo(() => theme() === 'dark' ? '#FFF' : '#000')
  
  return (
    <svg class={styles.drawableSvg} onPointerUp={handlePointerUp} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
        <g stroke={color()} fill={color()}>
            <For each={paths()}>
                {path => <path d={path} />}
            </For>
            {currentPath() && <path d={currentPath()} />}
        </g>
    </svg>
  );
};

export default Whiteboard;
