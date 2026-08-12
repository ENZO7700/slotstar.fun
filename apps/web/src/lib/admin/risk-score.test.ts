import { describe, expect, it } from 'vitest';
import {
  calculateRiskScore,
  riskFromPlayer,
  riskTone,
  type RiskInput,
} from './risk-score';
import type { Player } from '@/types/admin';

const baseInput: RiskInput = {
  kycStatus: 'VERIFIED',
  method: 'VISA',
  depositMethod: 'VISA',
  winRatio: 1.2,
  wageredDepositRatio: 1.4,
  isNewWallet: false,
};

describe('calculateRiskScore', () => {
  it('starts near baseline for a clean verified player', () => {
    const result = calculateRiskScore(baseInput);
    // baseline 10, method match -8 => 2
    expect(result.score).toBe(2);
    expect(result.flags).toEqual([]);
  });

  it('flags unverified KYC and increases score', () => {
    const result = calculateRiskScore({ ...baseInput, kycStatus: 'UNVERIFIED' });
    expect(result.flags).toContain('Unverified_KYC');
    expect(result.score).toBeGreaterThan(30);
  });

  it('flags new wallet and method mismatch', () => {
    const result = calculateRiskScore({
      ...baseInput,
      isNewWallet: true,
      depositMethod: 'CRYPTO',
      method: 'VISA',
    });
    expect(result.flags).toContain('New_Wallet');
    expect(result.flags).toContain('Method_Mismatch');
  });

  it('flags unwagered deposit and high win ratio', () => {
    const result = calculateRiskScore({
      ...baseInput,
      wageredDepositRatio: 0.2,
      winRatio: 3.1,
    });
    expect(result.flags).toContain('Unwagered_Deposit');
    expect(result.flags).toContain('High_Win_Ratio');
  });

  it('clamps score between 0 and 100', () => {
    const high = calculateRiskScore({
      kycStatus: 'UNVERIFIED',
      method: 'CRYPTO',
      depositMethod: 'VISA',
      winRatio: 10,
      wageredDepositRatio: 0,
      isNewWallet: true,
    });
    expect(high.score).toBeLessThanOrEqual(100);
    expect(high.score).toBeGreaterThanOrEqual(0);
  });
});

describe('riskTone', () => {
  it('maps score bands', () => {
    expect(riskTone(10)).toBe('low');
    expect(riskTone(45)).toBe('mid');
    expect(riskTone(80)).toBe('high');
  });
});

describe('riskFromPlayer', () => {
  it('derives risk from player KYC defaults', () => {
    const player = {
      kycStatus: 'VERIFIED',
    } as Player;
    const result = riskFromPlayer(player, 'SEPA');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.flags).not.toContain('Unverified_KYC');
  });
});
