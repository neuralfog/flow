export type Job = {
    id: string;
    dependsOn?: string[];
};

export type LayoutNode = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Segment = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Arrow = {
    id: string;
    x: number;
    y: number;
};

export type LayoutEdge = {
    id: string;
    from: string;
    to: string;
    segments: Segment[];
    headX: number;
    headY: number;
};

export type DagLayout = {
    width: number;
    height: number;
    edges: LayoutEdge[];
    nodes: LayoutNode[];
};
