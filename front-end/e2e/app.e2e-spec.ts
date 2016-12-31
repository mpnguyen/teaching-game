import { TeachingCliPage } from './app.po';

describe('teaching-cli App', function() {
  let page: TeachingCliPage;

  beforeEach(() => {
    page = new TeachingCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
