import { IsEnum } from 'class-validator';

enum RATING_PERIOD_ENUM {
  MONTH = 'month',
  THREE_MONTH = 'three-month',
  ALL_TIME = 'all-time',
}
export type PeriodRatingType = 'month' | 'three-month' | 'all-time';

export class GetRatingsDto {
  @IsEnum(RATING_PERIOD_ENUM)
  period: PeriodRatingType;
}
