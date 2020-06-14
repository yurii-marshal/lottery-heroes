export class LoadScripts {
  static append(scriptSrc: string, callback) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = scriptSrc;

    s.onload = callback;

    document.body.appendChild(s);

    return false;
  }
}
