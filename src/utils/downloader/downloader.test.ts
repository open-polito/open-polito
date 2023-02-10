import {Downloader} from './downloader';

describe('Downloader', () => {
  it('Enqueues a file code', () => {
    const code = '123';
    Downloader.enqueue(code);
    expect(Downloader.manager.downloading).toContain(code);
  });

  it('Downloads up to the max parallel number', () => {
    const codes = ['123', '456', '789', '101', '112'];
    codes.forEach(code => Downloader.enqueue(code));
    expect(Downloader.manager.downloading).toHaveLength(4);
    expect(Downloader.manager.queue).toHaveLength(2);
  });
});
