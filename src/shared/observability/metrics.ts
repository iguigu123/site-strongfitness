type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

interface RouteStats {
  count: number;
  errors: number;
  methods: Record<string, number>;
  durationMsTotal: number;
}

class MetricsStore {
  private routes: Map<string, RouteStats> = new Map();
  private startedAt = Date.now();

  record(route: string, method: string, statusCode: number, durationMs: number) {
    const key = route || '/';
    const stats = this.routes.get(key) || {
      count: 0,
      errors: 0,
      methods: {},
      durationMsTotal: 0,
    };
    stats.count += 1;
    if (statusCode >= 500) stats.errors += 1;
    stats.methods[method] = (stats.methods[method] || 0) + 1;
    stats.durationMsTotal += durationMs;
    this.routes.set(key, stats);
  }

  snapshot() {
    const routes: Record<string, RouteStats & { avgDurationMs: number }> = {};
    for (const [k, v] of this.routes.entries()) {
      routes[k] = {
        ...v,
        avgDurationMs: v.count ? Math.round(v.durationMsTotal / v.count) : 0,
      };
    }
    return {
      uptimeMs: Date.now() - this.startedAt,
      routes,
    };
  }
}

export const metrics = new MetricsStore();

