import { Component } from "solid-js";
import Menu from './components/Menu'
import Whiteboard from './components/Whiteboard'
import { ThemeProvider } from "./ThemeProvider";
import { WhiteboardProvider } from "./WhiteboardProvider";

const App: Component = () => {
  return (
    <ThemeProvider>
      <WhiteboardProvider>
        <Menu />
        <Whiteboard />
      </WhiteboardProvider>
    </ThemeProvider>
  );
};

export default App;
