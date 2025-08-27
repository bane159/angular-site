import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IQuestionHome } from '../interfaces/iquestion';
import { Observable } from 'rxjs';
import { IQuestionSingle } from '../interfaces/iquestion-single';
import { IQuestionCategory } from '../interfaces/iquestion-category';
import { IQuestionForEdit } from '../interfaces/iquestion-for-edit';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {


  constructor(private http: HttpClient) { }

  private questions: Array<IQuestionHome> = [];


  getQuestions(): Observable<IQuestionSingle[]> {
    const path = 'http://localhost:8000/api/questions/popular';
    return this.http.get<IQuestionSingle[]>(path);
  }

  searchQuestions(query: string): Observable<IQuestionSingle[]> {
    const path = `http://localhost:8000/api/questions/search?q=${encodeURIComponent(query)}`;
    console.log(path);
    return this.http.get<IQuestionSingle[]>(path);
  }



  filter(criteria: string, questionsToFilter: IQuestionSingle[]): IQuestionSingle[] {
    console.log('Filtering questions with criteria:', criteria);
    return questionsToFilter.filter(question => {
      switch (criteria) {
        case 'answered':
          return question.numberOfAnswers > 0;
        case 'unanswered':
          return question.numberOfAnswers === 0;
        case 'newest':
          return true;
        default:
          return true;
      }
    });
  }

  getAllCategories(): Observable<IQuestionCategory[]> {
    const path = 'http://localhost:8000/api/question/categories';
    return this.http.get<IQuestionCategory[]>(path);
  }

  getQuestionById(id: string): Observable<IQuestionSingle> {
    console.log('Fetching question with ID:', id);
    const path = `http://localhost:8000/api/questions/` + id;
    return this.http.get<IQuestionSingle>(path);
  }
  getQuestionByIdForEdit(id: string): Observable<IQuestionForEdit> {
    console.log('Fetching question for edit with ID:', id);
    const path = `http://localhost:8000/api/questions/` + id + '/edit';
    return this.http.get<IQuestionForEdit>(path);
  }

  createQuestion(questionData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) {
    const path = 'http://localhost:8000/api/questions';
    console.log('Creating question:', questionData);
    return this.http.post(path, questionData);
  }

  updateQuestion(questionId: number, questionData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }): Observable<any> {
    const path = `http://localhost:8000/api/questions/${questionId}`;
    console.log('Updating question:', questionId, questionData);
    return this.http.put(path, questionData);
  }

  getUserQuestions(userId: number | null): Observable<IQuestionHome[]> {
    const path = `http://localhost:8000/api/users/${userId}/questions`;
    console.log('Fetching questions for user:', userId);
    return this.http.get<IQuestionHome[]>(path);
  }

  deleteQuestion(questionId: number): Observable<any> {
    const path = `http://localhost:8000/api/questions/${questionId}`;
    console.log('Deleting question:', questionId);
    return this.http.delete(path);
  }
}
