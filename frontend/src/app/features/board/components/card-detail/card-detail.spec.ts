import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailComponent } from './card-detail';

describe('CardDetail', () => {
  let component: CardDetailComponent;
  let fixture: ComponentFixture<CardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
