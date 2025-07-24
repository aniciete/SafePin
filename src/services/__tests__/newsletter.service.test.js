import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscribeToNewsletter, unsubscribeFromNewsletter, getDataPrivacyInfo } from '../newsletter.service';

// Mock Supabase
vi.mock('../../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      }))
    }))
  }
}));

describe('Newsletter Service - Philippine Data Privacy Act Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribeToNewsletter', () => {
    it('should require consent for Philippine Data Privacy Act compliance', async () => {
      const result = await subscribeToNewsletter('test@example.com', {
        consentGiven: false,
        dataRetentionAcknowledged: true,
        npcRightsAcknowledged: true
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Consent is required under the Philippine Data Privacy Act of 2012');
    });

    it('should require data retention acknowledgment', async () => {
      const result = await subscribeToNewsletter('test@example.com', {
        consentGiven: true,
        dataRetentionAcknowledged: false,
        npcRightsAcknowledged: true
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('data retention policy as required by NPC guidelines');
    });

    it('should require NPC rights acknowledgment', async () => {
      const result = await subscribeToNewsletter('test@example.com', {
        consentGiven: true,
        dataRetentionAcknowledged: true,
        npcRightsAcknowledged: false
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('acknowledge your rights under Philippine data protection law');
    });

    it('should validate email format', async () => {
      const result = await subscribeToNewsletter('invalid-email', {
        consentGiven: true,
        dataRetentionAcknowledged: true,
        npcRightsAcknowledged: true
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('valid email address');
    });
  });

  describe('unsubscribeFromNewsletter', () => {
    it('should include Philippine data privacy information in unsubscribe message', async () => {
      // Mock the supabase chain properly
      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: '123', email: 'test@example.com' },
        error: null
      });
      
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });
      
      const mockSupabase = await import('../../config/supabase');
      mockSupabase.supabase.from = mockFrom;

      const result = await unsubscribeFromNewsletter('test@example.com', 'No longer interested');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Data Privacy Act of 2012');
      expect(result.message).toContain('data retention policy');
    });
  });

  describe('getDataPrivacyInfo', () => {
    it('should return Philippine Data Privacy Act information', () => {
      const info = getDataPrivacyInfo();

      expect(info.dataPrivacyAct.name).toBe('Data Privacy Act of 2012');
      expect(info.dataPrivacyAct.republicAct).toBe('Republic Act No. 10173');
      expect(info.npcInfo.name).toBe('National Privacy Commission');
      expect(info.npcInfo.complaintEmail).toBe('complaints@privacy.gov.ph');
      expect(info.npcInfo.hotline).toBe('+63 2 8234 2228');
    });

    it('should include all required data subject rights', () => {
      const info = getDataPrivacyInfo();

      const expectedRights = [
        'Right to be informed',
        'Right to access',
        'Right to object',
        'Right to erasure or blocking',
        'Right to rectify',
        'Right to file a complaint',
        'Right to damages'
      ];

      expectedRights.forEach(right => {
        expect(info.dataSubjectRights).toContain(right);
      });
    });

    it('should include proper data retention policy', () => {
      const info = getDataPrivacyInfo();

      expect(info.dataRetentionPolicy.activeSubscriptions).toContain('while subscription is active');
      expect(info.dataRetentionPolicy.inactiveSubscriptions).toContain('2 years after unsubscription');
      expect(info.dataRetentionPolicy.deletionRequest).toContain('Data Privacy Act');
    });
  });
});