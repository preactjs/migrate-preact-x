import { Component, createElement, render } from "preact";

/** @jsx createElement */

render(<App />, document.body);

const Test = createElement('div');

if (Test.props.isValid && Test.type === 'div') {
  // do nothing
}

class App extends Component {
}
