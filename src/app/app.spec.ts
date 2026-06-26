import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the library name in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('ngx-dialog-forge');
  });

  it('should render all four demo sections', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('section.demo-card');
    expect(sections.length).toBe(4);
  });

  it('should start with all dialogs closed', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.showBasicDialog()).toBe(false);
    expect(app.showActionsSlotDialog()).toBe(false);
    expect(app.showActionsInputDialog()).toBe(false);
    expect(app.showRestrictedDialog()).toBe(false);
  });

  it('should track the last action', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.lastAction()).toBeNull();
    app.onAction('confirm');
    expect(app.lastAction()).toBe('confirm');
    app.onAction('cancel');
    expect(app.lastAction()).toBe('cancel');
  });
});
