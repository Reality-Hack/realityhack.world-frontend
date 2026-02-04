export const buildChoiceMap = (options: any, fieldName: string): Record<string, string> => {
    const choices = options?.actions?.POST?.[fieldName]?.choices || [];
    return choices.reduce((acc: Record<string, string>, choice: any) => {
      acc[choice.value] = choice.display_name;
      return acc;
    }, {});
  };
  