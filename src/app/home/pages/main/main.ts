import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { HomeQuestion } from "../../../questions/components/home-question/home-question";
import { HomeQuestionWrapper } from "../../../questions/components/home-question-wrapper/home-question-wrapper";
import { IQuestionHome } from '../../../questions/interfaces/iquestion';
import { QuestionsService } from '../../../questions/services/questions-service';
import { Layout } from "../../../shared/components/layout/layout";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '../../../questions/services/tags.service';
import { Tag } from '../../../questions/interfaces/tag';
// import { RouterLink } from "../../../../../node_modules/@angular/router/router_module.d";
import { SharedModule } from '../../../shared/shared-module';
import { IQuestionSingle } from '../../../questions/interfaces/iquestion-single';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HomeQuestion, HomeQuestionWrapper, Layout, SharedModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit {
  questions: Array<IQuestionSingle> = [];
  questionsAll: Array<IQuestionSingle> = [];
  answeredQuestionsCount: number = 0;
  filterCriteria: string = 'newest';
  tag!: string;
  tags: Array<Tag> = [];
  selectedTag: string = 'all';
  searchQuery: string = '';
  isSearchMode: boolean = false;
  @ViewChild('tagFilter') tagFilter!: ElementRef<HTMLSelectElement>;


  protected isLoading: boolean = false;
  constructor(
    protected questionService: QuestionsService, 
    protected route: ActivatedRoute, 
    protected tagsService: TagsService,
    private router: Router
  ) { }

  private getAll()  {
    this.isLoading = true;
    
    // Load tags first
    this.tagsService.getAllTags().subscribe((tags) => {
      this.tags = tags;
      
      // Then check for search query parameters
      this.route.queryParamMap.subscribe((queryParams) => {
        this.searchQuery = queryParams.get('search') || '';
        
        if (this.searchQuery) {
          this.isSearchMode = true;
          this.performSearch();
        } else {
          this.isSearchMode = false;
          this.loadQuestions();
        }
      });
    });
  }

  private performSearch() {
    this.questionService.searchQuestions(this.searchQuery).subscribe({
      next: (data: IQuestionSingle[]) => {
        this.questionsAll = data;
        this.questions = data.slice(0, 10);
        this.answeredQuestionsCount = data.filter(q => q.numberOfAnswers != 0).length;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Search error:', err);
        this.isLoading = false;
      }
    });
  }

  private loadQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (data: IQuestionSingle[]) => {
        this.questionsAll = data;
        this.answeredQuestionsCount = this.questionsAll.filter(q => q.numberOfAnswers != 0 ).length;
        
        this.route.paramMap.subscribe((params) => {
          this.tag = params.get('tag')!;
          
          if(this.tag) {
            this.selectedTag = this.tag;
            
            let filteredQuestions = this.questionsAll.filter(q => q.tags.includes(this.tag));
            this.questions = this.questionService.filter(this.filterCriteria, filteredQuestions).slice(0, 10);
          } else {
            this.selectedTag = 'all'; 
            this.questions = this.questionService.filter(this.filterCriteria, this.questionsAll).slice(0, 10);
          }
        });
        
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  ngOnInit() {

    this.getAll();

  }

  onFilterChange(criteria: string) {
    this.filterCriteria = criteria;
    
    
    if (this.isSearchMode) {
      return;
    }
    
   
    let filteredQuestions = this.questionsAll;
       
    if (this.selectedTag && this.selectedTag !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.tags.includes(this.selectedTag));
    }
      
    filteredQuestions = this.questionService.filter(criteria, filteredQuestions);
    
    this.questions = filteredQuestions.slice(0, 10);
  }
  
  onTagChange(tag: string) {
    this.selectedTag = tag;
    console.log('Selected tag:', this.selectedTag);
    
    // In search mode, we don't apply tag filters
    if (this.isSearchMode) {
      return;
    }
    
    // Navigate to the appropriate route
    if(tag !== 'all') {
      this.router.navigate(['/questions', tag]);
    } else {
      this.router.navigate(['/']);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.router.navigate(['/']);
  }

}
