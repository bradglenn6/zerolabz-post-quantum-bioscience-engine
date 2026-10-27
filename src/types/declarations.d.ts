declare module '3dmol' {
  const content: any;
  export default content;
  export const createViewer: any;
  export const rasmolElementColors: any;
  export const SurfaceType: any;
  export const builtinColorSchemes: any;
}

declare module 'smiles-drawer' {
  const content: any;
  export default content;
  export class Drawer {
    constructor(options?: any);
    draw(tree: any, target: any, theme?: string, weights?: boolean, infoOnly?: boolean): void;
  }
  export function parse(
    smiles: string,
    successCallback: (tree: any) => void,
    errorCallback?: (err: any) => void
  ): void;
}
