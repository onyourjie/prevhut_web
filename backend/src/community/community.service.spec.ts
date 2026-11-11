import { describe, expect, it, vi } from 'vitest';
import { PostCategory, PostStatus } from '@prisma/client';
import { CommunityService } from './community.service.js';

describe('CommunityService geospatial radius query & clusterCode reconciliation', () => {
  it('returns nearby DARURAT posts within 25 km regardless of stale clusterCode and reconciles clusterCode', async () => {
    const updatedPosts: Array<{ id: string; clusterCode: string }> = [];

    const mockPrisma = {
      post: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'post-old-resolved',
            authorId: 'u1',
            category: PostCategory.DARURAT,
            status: PostStatus.SELESAI,
            latitude: -1.91,
            longitude: 115.86,
            kabupaten: 'Kabupaten Paser',
            kecamatan: 'Kecamatan Batu Sopang',
            clusterCode: 'Area Pantau 01',
            createdAt: new Date('2026-11-10T02:00:00Z'),
            assignments: [],
            updates: [],
            _count: { comments: 0, updates: 0 },
          },
          {
            id: 'post-rania',
            authorId: 'u2',
            category: PostCategory.DARURAT,
            status: PostStatus.MENUNGGU_VERIFIKASI,
            latitude: -1.90281,
            longitude: 115.85895,
            kabupaten: 'Kabupaten Paser',
            kecamatan: 'Kecamatan Batu Sopang',
            clusterCode: 'Area Pantau 04',
            createdAt: new Date('2026-11-11T02:34:00Z'),
            assignments: [],
            updates: [],
            _count: { comments: 0, updates: 0 },
          },
          {
            id: 'post-far-other-regency',
            authorId: 'u3',
            category: PostCategory.DARURAT,
            status: PostStatus.SELESAI,
            latitude: -0.5,
            longitude: 117.1,
            kabupaten: 'Kabupaten Kutai Kartanegara',
            kecamatan: 'Kecamatan Loa Janan',
            clusterCode: 'Area Pantau 01',
            createdAt: new Date('2026-11-09T04:00:00Z'),
            assignments: [],
            updates: [],
            _count: { comments: 0, updates: 0 },
          },
        ]),
        update: vi.fn().mockImplementation(async ({ where, data }: any) => {
          updatedPosts.push({ id: where.id, clusterCode: data.clusterCode });
          return { id: where.id, ...data };
        }),
      },
      volunteerAssignment: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const mockHotspotsService = {
      getCanonicalClustersOrNull: vi.fn().mockResolvedValue([
        {
          id: 'area_pantau_01',
          code: 'Area Pantau 01',
          kabupaten: 'Kabupaten Paser',
          centroid: { latitude: -1.90281, longitude: 115.85895 },
        },
      ]),
    };

    const service = new CommunityService(
      mockPrisma as any,
      {} as any,
      mockHotspotsService as any,
    );

    const results = await service.getPosts({
      category: PostCategory.DARURAT,
      lat: -1.90281,
      lon: 115.85895,
      radiusKm: 25,
    });

    // Prisma query includes bounding box constraint around centroid
    expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: expect.arrayContaining([
            { category: PostCategory.DARURAT },
            expect.objectContaining({
              latitude: expect.objectContaining({ gte: expect.any(Number), lte: expect.any(Number) }),
              longitude: expect.objectContaining({ gte: expect.any(Number), lte: expect.any(Number) }),
            }),
          ]),
        },
      }),
    );

    // Distant post filtered out despite sharing Area Pantau 01; active Rania post ordered first
    expect(results.map((r) => r.id)).toEqual(['post-rania', 'post-old-resolved']);
    expect(results[0].clusterCode).toBe('Area Pantau 01');
    expect(results[0].activeClusterCode).toBe('Area Pantau 01');
    expect(updatedPosts).toEqual([{ id: 'post-rania', clusterCode: 'Area Pantau 01' }]);
  });
});
