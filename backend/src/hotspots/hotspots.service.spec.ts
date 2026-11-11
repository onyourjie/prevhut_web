import { afterEach, describe, expect, it, vi } from 'vitest';
import { PostStatus } from '@prisma/client';
import { HotspotsService } from './hotspots.service.js';
import { getTodayWibDateString } from '../common/date.util.js';

describe('HotspotsService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('re-assigns canonical Area Pantau codes after citizen boost re-ranking and preserves them across filters', async () => {
    const todayWib = getTodayWibDateString();
    const rawClusters = [
      {
        id: 'area_pantau_01',
        code: 'Area Pantau 01',
        province: 'Kalimantan Tengah',
        kabupaten: 'Kabupaten Seruyan',
        kecamatan: 'Kecamatan Hanau',
        centroid: { latitude: -2.4, longitude: 112.1 },
        base_risk_score: 63.0,
        risk_score: 63.0,
        hotspot_count_24h: 10,
      },
      {
        id: 'area_pantau_02',
        code: 'Area Pantau 02',
        province: 'Kalimantan Timur',
        kabupaten: 'Kabupaten Paser',
        kecamatan: 'Kecamatan Batu Sopang',
        centroid: { latitude: -1.90281, longitude: 115.85895 },
        base_risk_score: 60.6,
        risk_score: 60.6,
        hotspot_count_24h: 15,
      },
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => rawClusters,
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockConfig = {
      get: vi.fn().mockReturnValue('http://localhost:8000'),
    };
    const mockPrisma = {
      post: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'post-rania',
            clusterCode: 'Area Pantau 04',
            kabupaten: 'Kabupaten Paser',
            latitude: -1.90281,
            longitude: 115.85895,
            status: PostStatus.MENUNGGU_VERIFIKASI,
          },
        ]),
      },
    };

    const service = new HotspotsService(mockConfig as any, mockPrisma as any);
    const allClusters = await service.getClusters({});

    // Default date parameter uses today's WIB calendar date (no unfiltered multi-day merge)
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:8000/api/clusters?date=${todayWib}`,
      expect.any(Object),
    );

    // Paser boosted (+5 -> 65.6) rises to #1 and receives canonical Area Pantau 01
    expect(allClusters[0].kabupaten).toBe('Kabupaten Paser');
    expect(allClusters[0].risk_score).toBe(65.6);
    expect(allClusters[0].code).toBe('Area Pantau 01');
    expect(allClusters[0].id).toBe('area_pantau_01');
    expect(allClusters[0].citizen_reports_count).toBe(1);

    // Seruyan becomes canonical Area Pantau 02 even when filtered by province
    const kaltengFiltered = await service.getClusters({ province: 'Kalimantan Tengah' });
    expect(kaltengFiltered).toHaveLength(1);
    expect(kaltengFiltered[0].kabupaten).toBe('Kabupaten Seruyan');
    expect(kaltengFiltered[0].code).toBe('Area Pantau 02');
    expect(kaltengFiltered[0].id).toBe('area_pantau_02');
  });
});
