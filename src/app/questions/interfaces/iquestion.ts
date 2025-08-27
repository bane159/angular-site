export interface IQuestionHome {
    id: number;
    title: string;
    content: string;
    categories: Array<string>;
    tags: Array<string>;
    askedAt: Date;
    userName: string;
    userId: string;
    numberOfComments: number;
    numberOfAnswers: number;
    numberOfViews: number;
}
