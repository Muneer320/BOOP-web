import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// react-router 7 needs these, and the jsdom version bundled with
// react-scripts does not provide them.
global.TextEncoder ??= TextEncoder;
global.TextDecoder ??= TextDecoder;

// jsdom has no matchMedia; the theme and hero animation code query it.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
