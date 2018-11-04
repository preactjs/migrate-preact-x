import { Component, createElement, render } from "preact";

/** @jsx createElement */

render(<App />, document.body);

const Test = createElement('div');

class App extends Component {
}
