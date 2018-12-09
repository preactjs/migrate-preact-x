import preact from "preact";
import { Component } from "preact";

/** @jsx preact.h */

preact.render(<App />, document.body);

const Test = preact.h('div');

if (Test.attributes.isValid && Test.nodeName === 'div') {
  // do nothing
}

class App extends Component {
}
