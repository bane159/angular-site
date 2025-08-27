export interface TopUser {
  id: number;
  name: string;
  username: string;
  reputation: number;
  mostPopularQuestion: {
    id: number;
    title: string;
    content: string;
    categories: string[];
    tags: string[];
    askedAt: string;
    numberOfComments: number;
    numberOfAnswers: number;
    numberOfViews: number;
  };
}
