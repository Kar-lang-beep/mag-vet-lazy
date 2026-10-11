// Skrypt strony MAG-VET. Strona działa też bez niego – skrypt dodaje tylko mapę po kliknięciu.

// === MAPA PO KLIKNIĘCIU (komponent mapa.js) ===
// Wstawia mapę Google (iframe) dopiero, gdy ktoś kliknie „Pokaż mapę”.
// Przed kliknięciem Google nie zapisuje ciasteczek, więc nie trzeba banera cookies.
function przygotujMapy() {
  document.querySelectorAll('[data-mapa]').forEach((mapa) => {
    const przycisk = mapa.querySelector('.mapa__przycisk');
    const adres = mapa.dataset.mapaSrc || '';
    if (!przycisk || !adres.startsWith('https://')) return;

    // Bez JS ramka mapy jest ukryta (atrybut hidden w HTML) – teraz ją pokazujemy
    mapa.hidden = false;
    przycisk.hidden = false;
    przycisk.addEventListener('click', () => {
      const ramka = document.createElement('iframe');
      ramka.src = adres;
      ramka.title = mapa.dataset.mapaTytul || 'Mapa Google';
      ramka.className = 'mapa__ramka';
      ramka.referrerPolicy = 'no-referrer-when-downgrade';
      ramka.allowFullscreen = true;
      mapa.prepend(ramka);
      przycisk.remove();
      mapa.querySelector('.mapa__info')?.remove();
      ramka.focus();
    });
  });
}

przygotujMapy();

// === PASEK WIZYTY (telefon i tablet) ===
// Pokazuje dolny pasek „Zadzwoń / Zapisz się online” tylko wtedy, gdy żadnej pary
// przycisków zapisów z treści strony (elementy z data-zapisy) nie widać na ekranie.
// Dzięki temu na ekranie jest zawsze najwyżej jedna para tych przycisków.
function przygotujPasekWizyty() {
  const pasek = document.querySelector('.pasek-wizyty');
  const przyciski = document.querySelectorAll('[data-zapisy]');
  // Stara przeglądarka bez IntersectionObserver: pasek zostaje ukryty, strona działa normalnie
  if (!pasek || przyciski.length === 0 || !('IntersectionObserver' in window)) return;

  pasek.classList.add('pasek-wizyty--schowany');
  pasek.hidden = false;

  const widoczne = new Set();
  const obserwator = new IntersectionObserver((wpisy) => {
    wpisy.forEach((wpis) => {
      if (wpis.isIntersecting) widoczne.add(wpis.target);
      else widoczne.delete(wpis.target);
    });
    pasek.classList.toggle('pasek-wizyty--schowany', widoczne.size > 0);
  }, { rootMargin: '0px 0px -72px 0px' }); // -72 px = wysokość paska (--wysokosc-paska)

  przyciski.forEach((element) => obserwator.observe(element));
}

przygotujPasekWizyty();
