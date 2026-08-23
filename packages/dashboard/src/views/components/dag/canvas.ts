export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.1;

export const clampZoom = (zoom: number): number =>
    Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));

// #state
export const canvas = {
    zoom: 1,
    position: { x: 0, y: 0 },
};

export const resetCanvas = (): void => {
    canvas.zoom = 1;
    canvas.position.x = 0;
    canvas.position.y = 0;
};
