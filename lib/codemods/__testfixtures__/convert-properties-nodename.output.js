import { createElement } from "preact";

/** @jsx createElement */

const container = createElement('div', { myprop: 'test'});

const type = container.type;
if (container.type === 'div') {

}

const obj = {
  nodeName: 'a',
};

if (obj.nodeName === 'div') {
  // nothing
}

const Component = ({ children }) => {
  const validChildren = children.map(child => {
    // we can't detect that child is a vnode
    if (child.nodeName === 'div') {
      return child;
    }
  });

  return validChildren.filter(Boolean);
};

