import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchJournal } from './match-journal';

describe('MatchJournal', () => {
  let component: MatchJournal;
  let fixture: ComponentFixture<MatchJournal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchJournal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchJournal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
