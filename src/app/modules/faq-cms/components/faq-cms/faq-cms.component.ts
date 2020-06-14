import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FaqCmsInterface } from '../../entities/faq-cms.interface';

@Component({
  selector: 'app-faq-cms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq-cms.component.html',
  styleUrls: ['./faq-cms.component.scss']
})
export class FaqCmsComponent implements OnInit {
  @Input() cms: FaqCmsInterface;
  isShown: boolean;

  setHeight(e) {
    const item = e.target.parentElement;
    const input = item.children['0'];
    const itemWrapper = item.children['3'];
    const itemBody = item.children['3'].firstElementChild;

    if (input.checked) {
      itemWrapper.style.maxHeight = itemBody.offsetHeight + 'px';
    } else {
      itemWrapper.style.maxHeight = '0px';
    }
  }

  ngOnInit(): void {
    this.isShown =
      (!!this.cms.faq_question_1 && !!this.cms.faq_answer_1) ||
      (!!this.cms.faq_question_2 && !!this.cms.faq_answer_2) ||
      (!!this.cms.faq_question_3 && !!this.cms.faq_answer_3);
  }
}
