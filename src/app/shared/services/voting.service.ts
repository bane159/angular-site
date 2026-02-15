import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface VoteResponse {
  success: boolean;
  message: string;
  newVoteCount: number;
  userVote: 'upvote' | 'downvote' | null;
}

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Vote on a question
   * @param questionId - The ID of the question
   * @param voteType - 'upvote' or 'downvote'
   */
  voteOnQuestion(questionId: number, voteType: 'upvote' | 'downvote'): Observable<VoteResponse> {
    const path = `${this.apiUrl}/questions/${questionId}/vote`;
    return this.http.post<VoteResponse>(path, { vote_type: voteType });
  }

  /**
   * Vote on a comment/answer
   * @param commentId - The ID of the comment/answer
   * @param voteType - 'upvote' or 'downvote'
   */
  voteOnComment(commentId: number, voteType: 'upvote' | 'downvote'): Observable<VoteResponse> {
    const path = `${this.apiUrl}/comments/${commentId}/vote`;
    return this.http.post<VoteResponse>(path, { vote_type: voteType });
  }

  /**
   * Remove vote from a question
   * @param questionId - The ID of the question
   */
  removeVoteFromQuestion(questionId: number): Observable<VoteResponse> {
    const path = `${this.apiUrl}/questions/${questionId}/vote`;
    return this.http.delete<VoteResponse>(path);
  }

  /**
   * Remove vote from a comment/answer
   * @param commentId - The ID of the comment/answer
   */
  removeVoteFromComment(commentId: number): Observable<VoteResponse> {
    const path = `${this.apiUrl}/comments/${commentId}/vote`;
    return this.http.delete<VoteResponse>(path);
  }
}
