import type { DetailedHTMLProps, HTMLAttributes } from "react";

// VTurb ships a custom element, which JSX doesn't know about until it's declared.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "vturb-smartplayer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
