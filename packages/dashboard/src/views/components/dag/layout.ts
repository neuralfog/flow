import type {
    DagLayout,
    Job,
    LayoutEdge,
    LayoutNode,
    Segment,
} from '#src/views/components/dag/dag';

const NODE_WIDTH = 192;
const NODE_HEIGHT = 72;
const COLUMN_GAP = 80;
const ROW_GAP = 28;
const PADDING = 12;
const ORDER_PASSES = 6;

type Adjacency = Map<string, string[]>;

const buildAdjacency = (
    jobs: Job[],
): { deps: Adjacency; children: Adjacency } => {
    const deps: Adjacency = new Map();
    const children: Adjacency = new Map();
    for (const job of jobs) {
        deps.set(job.id, []);
        children.set(job.id, []);
    }
    for (const job of jobs) {
        for (const parent of job.dependsOn ?? []) {
            if (!deps.has(parent)) continue;
            deps.get(job.id)?.push(parent);
            children.get(parent)?.push(job.id);
        }
    }
    return { deps, children };
};

const rankNodes = (jobs: Job[], deps: Adjacency): Map<string, number> => {
    const rank = new Map<string, number>();
    const visiting = new Set<string>();
    const resolve = (id: string): number => {
        const cached = rank.get(id);
        if (cached !== undefined) return cached;
        if (visiting.has(id)) return 0;
        visiting.add(id);
        let value = 0;
        for (const parent of deps.get(id) ?? []) {
            value = Math.max(value, resolve(parent) + 1);
        }
        visiting.delete(id);
        rank.set(id, value);
        return value;
    };
    for (const job of jobs) resolve(job.id);
    return rank;
};

const groupByRank = (jobs: Job[], rank: Map<string, number>): string[][] => {
    const depth = Math.max(0, ...jobs.map((job) => rank.get(job.id) ?? 0));
    const columns: string[][] = Array.from({ length: depth + 1 }, () => []);
    for (const job of jobs) columns[rank.get(job.id) ?? 0].push(job.id);
    return columns;
};

const indexOf = (column: string[]): Map<string, number> => {
    const map = new Map<string, number>();
    column.forEach((id, i) => {
        map.set(id, i);
    });
    return map;
};

const sortByBarycenter = (
    column: string[],
    adjacency: Adjacency,
    reference: Map<string, number>,
): void => {
    const weight = new Map<string, number>();
    column.forEach((id, i) => {
        const neighbours = (adjacency.get(id) ?? [])
            .map((n) => reference.get(n))
            .filter((v): v is number => v !== undefined);
        const mean = neighbours.length
            ? neighbours.reduce((sum, v) => sum + v, 0) / neighbours.length
            : i;
        weight.set(id, mean);
    });
    column.sort((a, b) => (weight.get(a) ?? 0) - (weight.get(b) ?? 0));
};

const orderColumns = (
    columns: string[][],
    deps: Adjacency,
    children: Adjacency,
): void => {
    for (let pass = 0; pass < ORDER_PASSES; pass++) {
        if (pass % 2 === 0) {
            for (let c = 1; c < columns.length; c++) {
                sortByBarycenter(columns[c], deps, indexOf(columns[c - 1]));
            }
        } else {
            for (let c = columns.length - 2; c >= 0; c--) {
                sortByBarycenter(columns[c], children, indexOf(columns[c + 1]));
            }
        }
    }
};

const placeNodes = (
    columns: string[][],
): { nodes: LayoutNode[]; width: number; height: number } => {
    const columnHeight = (count: number): number =>
        count * NODE_HEIGHT + Math.max(0, count - 1) * ROW_GAP;
    const tallest = Math.max(0, ...columns.map((c) => columnHeight(c.length)));
    const nodes: LayoutNode[] = [];
    columns.forEach((column, c) => {
        const x = PADDING + c * (NODE_WIDTH + COLUMN_GAP);
        const startY = PADDING + (tallest - columnHeight(column.length)) / 2;
        column.forEach((id, i) => {
            nodes.push({
                id,
                x,
                y: startY + i * (NODE_HEIGHT + ROW_GAP),
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
            });
        });
    });
    const width =
        PADDING * 2 +
        columns.length * NODE_WIDTH +
        Math.max(0, columns.length - 1) * COLUMN_GAP;
    return { nodes, width, height: PADDING * 2 + tallest };
};

const elbow = (id: string, from: LayoutNode, to: LayoutNode): LayoutEdge => {
    const sx = from.x + from.width;
    const sy = from.y + from.height / 2;
    const tx = to.x;
    const ty = to.y + to.height / 2;
    const midX = sx + (tx - sx) / 2;
    const segments: Segment[] = [];
    if (sy === ty) {
        segments.push({
            id: `${id}:h`,
            x: sx,
            y: sy - 1,
            width: tx - sx,
            height: 2,
        });
    } else {
        segments.push({
            id: `${id}:h1`,
            x: sx,
            y: sy - 1,
            width: midX - sx + 1,
            height: 2,
        });
        segments.push({
            id: `${id}:v`,
            x: midX - 1,
            y: Math.min(sy, ty),
            width: 2,
            height: Math.abs(ty - sy),
        });
        segments.push({
            id: `${id}:h2`,
            x: midX - 1,
            y: ty - 1,
            width: tx - midX + 1,
            height: 2,
        });
    }
    return { id, from: from.id, to: to.id, segments, headX: tx, headY: ty };
};

const routeEdges = (
    jobs: Job[],
    nodes: Map<string, LayoutNode>,
): LayoutEdge[] => {
    const edges: LayoutEdge[] = [];
    for (const job of jobs) {
        for (const parent of job.dependsOn ?? []) {
            const from = nodes.get(parent);
            const to = nodes.get(job.id);
            if (from && to) edges.push(elbow(`${parent}->${job.id}`, from, to));
        }
    }
    return edges;
};

export const computeDagLayout = (jobs: Job[]): DagLayout => {
    if (jobs.length === 0) {
        return { width: 0, height: 0, edges: [], nodes: [] };
    }
    const { deps, children } = buildAdjacency(jobs);
    const rank = rankNodes(jobs, deps);
    const columns = groupByRank(jobs, rank);
    orderColumns(columns, deps, children);
    const { nodes, width, height } = placeNodes(columns);
    const byId = new Map(nodes.map((node) => [node.id, node]));
    return {
        width,
        height,
        edges: routeEdges(jobs, byId),
        nodes,
    };
};
