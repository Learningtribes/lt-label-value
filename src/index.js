import React from "react";
import { render } from "react-dom";
import Component from "./component";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const arr = [
    { value:'a0', text:'name' },
    { value:'a1', text:'address' },
    { value:'a2', text:'city' },
    { value:'a3', text:'gender' },
    { value:'a4', text:'country' },

]

const App = () => (
  <div style={styles}>
    <Component data={arr} />
  </div>
);

render(<App />, document.querySelector(".root"));
