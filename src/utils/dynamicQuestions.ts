import { ApplicationQuestion } from '@/types/models';

// TODO: turn this into a hook

/**
 * Initialize form data values for dynamic questions based on question types
 */
export function initializeDynamicQuestions(
  questions: ApplicationQuestion[] | undefined,
  existingFormData: Record<string, any>
): Record<string, any> {
  if (!questions) return existingFormData;

  const dynamicFields: Record<string, any> = { ...existingFormData };

  questions.forEach(question => {
    const key = question.question_key;
    
    if (dynamicFields[key] !== undefined) return;

    switch (question.question_type) {
      case 'M':
        dynamicFields[key] = [];
        break;
      case 'S':
        dynamicFields[key] = null;
        break;
      case 'T':
      case 'L':
        dynamicFields[key] = '';
        break;
      default:
        dynamicFields[key] = null;
    }
  });

  return dynamicFields;
}

/**
 * Get all required fields for visible dynamic questions
 */
export function getDynamicRequiredFields(
  questions: ApplicationQuestion[] | undefined,
  formData: Record<string, any>
): string[] {
  if (!questions) return [];

  return questions
    .filter(q => {
      if (!q.required) return false;

      if (q.parent_question) {
        const parentQuestion = questions.find(pq => pq.id === q.parent_question);
        if (!parentQuestion) return false;

        const parentValue = formData[parentQuestion.question_key];
        
        if (!parentValue) return false;

        if (q.trigger_choices && Array.isArray(q.trigger_choices) && q.trigger_choices.length > 0) {
          const parentArray = Array.isArray(parentValue) 
            ? parentValue 
            : [String(parentValue)];
          
          const triggerChoices = q.trigger_choices as unknown as string[];
          const hasMatch = parentArray.some(val => 
            triggerChoices.includes(String(val))
          );
          
          if (!hasMatch) return false;
        }
      }

      return true;
    })
    .map(q => q.question_key);
}

/**
 * Validate a dynamic question response
 */
export function validateDynamicQuestion(
  question: ApplicationQuestion,
  value: any,
  isRequired: boolean
): string {
  if (isRequired) {
    if (question.question_type === 'M' || question.question_type === 'S') {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return 'This field is required.';
      }
    } else if (question.question_type === 'T' || question.question_type === 'L') {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'This field is required.';
      }
    }
  }

  // Type-specific validation
  if (question.question_type === 'T' || question.question_type === 'L') {
    const textValue = String(value || '').trim();
    
    // Min length validation
    if (question.min_length && textValue.length > 0 && textValue.length < question.min_length) {
      return `Response must be at least ${question.min_length} characters.`;
    }
    
    // Max length validation
    if (question.max_length && textValue.length > question.max_length) {
      return `Response must not exceed ${question.max_length} characters.`;
    }
  }

  return '';
}

/**
 * Check if a question should be visible based on parent response
 */
export function shouldShowQuestion(
  question: ApplicationQuestion,
  questions: ApplicationQuestion[],
  formData: Record<string, any>
): boolean {
  // Top-level questions always show
  if (!question.parent_question) return true;

  // Find parent question
  const parentQuestion = questions.find(q => q.id === question.parent_question);
  if (!parentQuestion) return false;

  // Get parent response
  const parentValue = formData[parentQuestion.question_key];
  if (!parentValue) return false;

  // If no trigger choices, show if parent has any response
  if (!question.trigger_choices || question.trigger_choices.length === 0) {
    return true;
  }

  // Check if parent value matches trigger choices
  const parentArray = Array.isArray(parentValue) 
    ? parentValue 
    : [String(parentValue)];
  
  const triggerChoices = question.trigger_choices as unknown as string[];
  return parentArray.some(val => 
    triggerChoices.includes(String(val))
  );
}

/**
 * Check if a field is a thematic dynamic question
 * TODO: should be any question from dynamicQuestions API
 */
export function isThematicQuestion(fieldName: string): boolean {
  return fieldName.startsWith('theme_') || fieldName.startsWith('hardware_hack_');
}

/**
 * Get the question definition for a field
 */
export function getQuestionForField(
  fieldName: string,
  questions: ApplicationQuestion[] | undefined
): ApplicationQuestion | undefined {
  return questions?.find(q => q.question_key === fieldName);
}

/**
 * Check if a tab is valid including dynamic questions
 */
export function validateTabWithDynamicQuestions(
  requiredFields: string[],
  formData: Record<string, any>,
  questions: ApplicationQuestion[] | undefined,
  staticFieldValidator: (field: string, value: any) => string | null
): boolean {
  if (requiredFields.every(field => field === '')) {
    return true;
  }

  for (const field of requiredFields) {
    const fieldValue = formData[field];
    
    const dynamicQuestion = questions?.find(q => q.question_key === field);

    if (dynamicQuestion && isThematicQuestion(field)) {
      const validationError = validateDynamicQuestion(
        dynamicQuestion,
        fieldValue,
        true
      );
      
      if (validationError) return false;
    } else {
      const validationError = staticFieldValidator(field, fieldValue);
      if (validationError) return false;

      if (typeof fieldValue === 'string' && fieldValue.trim().length < 1) {
        return false;
      } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
        return false;
      } else if (typeof fieldValue === 'boolean' && fieldValue === null) {
        return false;
      } else if (!fieldValue) {
        return false;
      }
    }
  }

  return true;
}

