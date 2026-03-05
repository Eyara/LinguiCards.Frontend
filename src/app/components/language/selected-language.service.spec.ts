import { TestBed } from '@angular/core/testing';
import { SelectedLanguageService } from './selected-language.service';
import { LanguageModel } from '../../models/language.model';

describe('SelectedLanguageService', () => {
  let service: SelectedLanguageService;

  const mockLanguage: LanguageModel = {
    id: 1,
    name: 'English',
    editMode: false,
    url: '/flags/en.png',
    languageDictionaryId: 1,
    userId: 1
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [SelectedLanguageService]
    });

    service = TestBed.inject(SelectedLanguageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default language when nothing is stored', () => {
    const language = service.getSelectedLanguage();
    expect(language.id).toBe(0);
    expect(language.name).toBe('');
  });

  it('should set and get a language', () => {
    service.setLanguage(mockLanguage);
    const language = service.getSelectedLanguage();
    expect(language.id).toBe(1);
    expect(language.name).toBe('English');
  });

  it('should persist language to localStorage', () => {
    service.setLanguage(mockLanguage);
    const stored = localStorage.getItem('selectedLanguage');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).name).toBe('English');
  });

  it('should emit language changes via selectedLanguage$', (done) => {
    const emitted: LanguageModel[] = [];
    service.selectedLanguage$.subscribe(lang => {
      emitted.push(lang);
      if (emitted.length === 2) {
        expect(emitted[1].name).toBe('English');
        done();
      }
    });

    service.setLanguage(mockLanguage);
  });

  it('should clear language and revert to default', () => {
    service.setLanguage(mockLanguage);
    service.clear();

    const language = service.getSelectedLanguage();
    expect(language.id).toBe(0);
    expect(localStorage.getItem('selectedLanguage')).toBeNull();
  });

  it('should load from localStorage on construction', () => {
    localStorage.setItem('selectedLanguage', JSON.stringify(mockLanguage));
    const newService = TestBed.inject(SelectedLanguageService);
    expect(newService.getSelectedLanguage().name).toBe('English');
  });
});
