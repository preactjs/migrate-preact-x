import preact from "preact";
import { render, Component } from "preact";

/** @jsx preact.createElement */

const Test = preact.createElement('div');
render(Test, document.body);

class App extends Component {
}
