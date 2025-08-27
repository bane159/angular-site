export interface IQuestionSingle {
    id: number;
    title: string;
    content: string;
    categories: Array<string>;
    tags: Array<string>;
    askedAt: Date;
    userName: string;
    userId: string;
    numberOfVotes: number;
    numberOfComments: number;
    numberOfAnswers: number;
    numberOfViews: number;
}
