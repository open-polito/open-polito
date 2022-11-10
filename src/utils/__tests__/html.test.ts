import {stripHTML} from '../html';

describe('html.stripHTML', () => {
  const tests = [
    ['<a href="imagehere">CLICK</a>', 'CLICK'],
    ['<div><div>NESTED</div></div>', 'NESTED'],
    [
      '<a href="https://www.example.com" style="color: rgb(0, 0, 128);">Example website</a>',
      'Example website',
    ],
    ['<p data-custom-data="hello">paragraph</p>', 'paragraph'],
    [
      '<p>This <em>is</em> the<b> original <i>string</i></b></p>',
      'This is the original string',
    ],
  ];

  it('strips HTML tags from strings', () => {
    tests.forEach(t => {
      expect(stripHTML(t[0])).toEqual(t[1]);
    });
  });
});
