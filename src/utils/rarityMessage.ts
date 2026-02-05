/**
 * 희소성/특별함 메시지 생성 유틸리티
 */

export interface RarityInfo {
  badge: string;
  badgeColor: string;
  message: string;
  subMessage: string;
  isRare: boolean;
}

/**
 * 퍼센티지를 기반으로 희소성 정보를 반환
 * @param percentage - 같은 유형의 비율 (0-100)
 * @param ageGroupLabel - 나이대 라벨 (예: "20대")
 * @param _totalCount - 전체 참여자 수 (향후 확장용)
 */
export function getRarityInfo(
  percentage: number,
  ageGroupLabel: string,
  _totalCount: number
): RarityInfo {
  // 1명당 몇 명 꼴인지 계산
  const oneInX = percentage > 0 ? Math.round(100 / percentage) : 100;

  if (percentage <= 5) {
    return {
      badge: '🦄 초희귀',
      badgeColor: 'from-purple-500 to-pink-500',
      message: `${oneInX}명 중 1명 꼴!`,
      subMessage: `${ageGroupLabel}에서 정말 보기 힘든 유형이에요. 당신은 특별해요!`,
      isRare: true,
    };
  }

  if (percentage <= 10) {
    return {
      badge: '💎 희귀',
      badgeColor: 'from-blue-500 to-cyan-500',
      message: `상위 ${percentage}%`,
      subMessage: `${ageGroupLabel}에서 ${oneInX}명 중 1명만 나오는 희귀 유형!`,
      isRare: true,
    };
  }

  if (percentage <= 20) {
    return {
      badge: '⭐ 특별',
      badgeColor: 'from-amber-500 to-yellow-500',
      message: `${ageGroupLabel} ${percentage}%`,
      subMessage: `흔하지 않은 유형이에요. 나만의 개성을 가지고 있어요!`,
      isRare: true,
    };
  }

  if (percentage <= 35) {
    return {
      badge: '👥 평균',
      badgeColor: 'from-green-500 to-emerald-500',
      message: `${ageGroupLabel} ${percentage}%`,
      subMessage: `${ageGroupLabel}에서 꽤 많이 보이는 유형이에요`,
      isRare: false,
    };
  }

  // 35% 초과
  return {
    badge: '🔥 인기',
    badgeColor: 'from-orange-500 to-red-500',
    message: `${ageGroupLabel} ${percentage}%`,
    subMessage: `${ageGroupLabel}에서 가장 많은 사람들이 이 유형이에요!`,
    isRare: false,
  };
}

/**
 * 첫 번째 참여자용 메시지
 */
export function getFirstParticipantInfo(ageGroupLabel: string): RarityInfo {
  return {
    badge: '🎉 선구자',
    badgeColor: 'from-violet-500 to-purple-500',
    message: '첫 번째!',
    subMessage: `${ageGroupLabel}에서 처음으로 테스트한 선구자예요!`,
    isRare: true,
  };
}
