import { createElement, render, Component } from "preact";

/** @jsx createElement */

const Test = createElement('div');
render(Test, document.body);

class App extends Component {
}
