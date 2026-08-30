import { QuestionTypeEnum } from '@/types/models';

export const QUESTION_TYPE_LABELS: Record<QuestionTypeEnum, string> = {
  [QuestionTypeEnum.S]: 'Single choice',
  [QuestionTypeEnum.M]: 'Multiple choice',
  [QuestionTypeEnum.T]: 'Text',
  [QuestionTypeEnum.L]: 'Long text',
};
