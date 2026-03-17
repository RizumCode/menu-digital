async function loadMenu() {
  const res = await fetch('/menu/');
  const text = await res.text();

  const parser = new DOMParser();
  const html = parser.parseFromString(text, 'text/html');

  const links = html.querySelectorAll('a');
  const container = document.getElementById('menu');

  for (let link of links) {
    if (link.href.endsWith('.md')) {
      const file = await fetch(link.href);
      const content = await file.text();

      const data = parseFrontMatter(content);

      container.innerHTML += `
        <div class="menu-item">
          <h3>${data.name}</h3>
          <p>${data.category}</p>
          <p>Rp ${data.price}</p>
          <img src="${data.image}" width="120">
        </div>
      `;
    }
  }
}

function parseFrontMatter(md) {
  const match = md.match(/---([\s\S]*?)---/);
  const lines = match[1].split('\n');

  let obj = {};
  lines.forEach(line => {
    let [key, value] = line.split(':');
    if (key && value) obj[key.trim()] = value.trim();
  });

  return obj;
}

loadMenu();