import { Component, Input } from '@angular/core';
import { QuestionsService } from '../../services/questions-service';
// import {  IQuestionHome } from '../../interfaces/iquestion';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IQuestionSingle } from '../../interfaces/iquestion-single';


@Component({
  selector: 'app-home-question',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './home-question.html',
  styleUrl: './home-question.scss'
})
export class HomeQuestion {
  @Input() question!: IQuestionSingle;

  ngOnInit() {
    console.log(this.question);
  }

}
