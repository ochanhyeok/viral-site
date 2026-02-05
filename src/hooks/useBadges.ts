import { useCallback, useState } from 'react';
import { useUserData } from './useLocalStorage';
import type { BadgeDefinition, BadgeCheckStats } from '../data/badges';
import { badges } from '../data/badges';

export function useBadges() {
  const { userData, addBadge } = useUserData();
  const [newBadge, setNewBadge] = useState<BadgeDefinition | null>(null);

  // 현재 통계로 뱃지 체크
  const checkBadges = useCallback(() => {
    const stats: BadgeCheckStats = {
      totalTests: userData.profile?.totalTests || 0,
      testCounts: {},
      bestScores: {},
      results: {},
      reactionTimes: [],
      colorScores: [],
      emojiScores: [],
    };

    // 테스트별 통계 수집
    Object.entries(userData.stats).forEach(([testType, testStats]) => {
      stats.testCounts[testType] = testStats.totalAttempts;
      if (testStats.bestScore !== undefined) {
        stats.bestScores[testType] = testStats.bestScore;
      }
    });

    // 기록에서 상세 데이터 수집
    userData.records.forEach(record => {
      // 결과 수집
      if (!stats.results[record.testType]) {
        stats.results[record.testType] = [];
      }
      stats.results[record.testType].push(record.result);

      // 반응속도
      if (record.testType === 'reaction-test' && record.details?.avgTime) {
        stats.reactionTimes.push(record.details.avgTime as number);
      }

      // 색감 점수
      if (record.testType === 'color-test' && record.percentage !== undefined) {
        stats.colorScores.push(record.percentage);
      }

      // 이모지 정답률
      if (record.testType === 'emoji-quiz' && record.percentage !== undefined) {
        stats.emojiScores.push(record.percentage);
      }
    });

    // 획득하지 않은 뱃지 중 조건 충족 확인
    const earnedBadgeIds = userData.badges.map(b => b.id);

    for (const badge of badges) {
      if (!earnedBadgeIds.includes(badge.id) && badge.checkCondition(stats)) {
        // 새 뱃지 획득!
        addBadge({
          id: badge.id,
          name: badge.name,
          emoji: badge.emoji,
          description: badge.description,
          condition: badge.condition,
          rarity: badge.rarity,
        });
        setNewBadge(badge);
        break; // 한 번에 하나씩만 표시
      }
    }
  }, [userData, addBadge]);

  // 새 뱃지 알림 닫기
  const dismissNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  // 획득한 뱃지 목록
  const earnedBadges = userData.badges;

  // 미획득 뱃지 목록
  const lockedBadges = badges.filter(
    b => !userData.badges.some(earned => earned.id === b.id)
  );

  // 전체 진행률
  const progress = {
    earned: earnedBadges.length,
    total: badges.length,
    percentage: Math.round((earnedBadges.length / badges.length) * 100),
  };

  return {
    checkBadges,
    earnedBadges,
    lockedBadges,
    newBadge,
    dismissNewBadge,
    progress,
    allBadges: badges,
  };
}
