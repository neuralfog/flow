import { describe, expect, it } from 'bun:test';
import { defineJob } from '../src/job';
import { register } from '../src/registry';

describe('register', () => {
    it('keys each handler by its job name', () => {
        const A = defineJob('a');
        const B = defineJob('b');
        class AHandler {
            static job = A;
            async run(): Promise<void> {}
        }
        class BHandler {
            static job = B;
            async run(): Promise<void> {}
        }

        const registry = register([AHandler, BHandler]);

        expect(registry.size).toBe(2);
        expect(registry.get('a')).toBe(AHandler);
        expect(registry.get('b')).toBe(BHandler);
        expect(registry.get('missing')).toBeUndefined();
    });

    it('lets the last handler win for a duplicate job name', () => {
        const Dup = defineJob('dup');
        class First {
            static job = Dup;
            async run(): Promise<void> {}
        }
        class Second {
            static job = Dup;
            async run(): Promise<void> {}
        }

        const registry = register([First, Second]);

        expect(registry.size).toBe(1);
        expect(registry.get('dup')).toBe(Second);
    });

    it('returns an empty registry for no handlers', () => {
        expect(register([]).size).toBe(0);
    });
});
