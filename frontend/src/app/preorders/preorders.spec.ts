import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preorders } from './preorders';

describe('Preorders', () => {
  let component: Preorders;
  let fixture: ComponentFixture<Preorders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preorders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Preorders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
