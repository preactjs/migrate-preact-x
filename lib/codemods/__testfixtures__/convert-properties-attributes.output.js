import { createElement } from "preact";

/** @jsx createElement */

const container = createElement('div', { myprop: 'test'});

const props = container.props;
if (container.props.myprop) {

}

const obj = {
  attributes: {},
};

if (obj.attributes.isValid) {
  // nothing
}

const Component = ({ children }) => {
  const validChildren = children.map(child => {
    // we can't detect that child is a vnode
    if (child.attributes.isValid) {
      return child;
    }
  });

  return validChildren.filter(Boolean);
};

