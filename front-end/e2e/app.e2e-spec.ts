import { TeachingGamePage } from './app.po';

describe('teaching-game App', function() {
  let page: TeachingGamePage;

  beforeEach(() => {
    page = new TeachingGamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
