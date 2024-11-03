
export interface DisplayQueryAndAnswerProps {
  colorScheme: "light" | "dark";
  item: QueryAndAnswer;
}

export interface QueryAndAnswer {
  id?: string;
  query?: string;
  answer?: string;
  isEditable: boolean;
  pdf?: File;
}
