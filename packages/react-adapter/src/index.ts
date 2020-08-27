import React from 'react';

export function elementToReact<P>(elTagName: string, defaultProps: P) {
  return React.forwardRef((props: P = defaultProps, ref: ((instance: unknown) => void) | React.MutableRefObject<unknown> | null) =>
    React.createElement(elTagName, { ...props, ref })
  );
}