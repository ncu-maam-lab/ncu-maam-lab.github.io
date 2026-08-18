(() => {
  const data = window.SITE_DATA;
  const esc = value => String(value ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const tags = value => String(value || '').split(/[、,，]/).map(x => x.trim()).filter(Boolean);

  function renderProfessor() {
    if (!data?.professor) return;
    const p = data.professor, c = data.contact;
    const card = document.querySelector('.person-card');
    if (card) card.innerHTML = `<img class="faculty-photo" src="${esc(p.image)}" alt="${esc(p.name)} ${esc(p.title)}"><div><h3 style="margin:0 0 6px">${esc(p.name)} ${esc(p.englishName)}</h3><div class="meta">${esc(p.title)} · ${esc(p.department)}</div><div class="interest-block"><strong>研究專長</strong><div class="interest-tags">${tags(p.interests).map(x => `<span class="interest-tag">${esc(x)}</span>`).join('')}</div></div><div class="faculty-details"><div class="detail-row"><strong>辦公室</strong><span>${esc(c.office)}</span></div><div class="detail-row"><strong>專線電話</strong><a href="tel:${esc(c.directTel)}">${esc(c.directTel)}</a></div><div class="detail-row"><strong>校內分機</strong><span>${esc(c.campusExtension)}</span></div><div class="detail-row"><strong>實驗室分機</strong><span>${esc(c.labExtension)}</span></div><div class="detail-row"><strong>傳真電話</strong><span>${esc(c.fax)}</span></div><div class="detail-row"><strong>E-mail</strong><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div></div><div class="faculty-background"><div><strong>學歷</strong><p>${esc(p.education)}</p></div><div><strong>經歷</strong><p>${esc(p.experience)}</p></div><div><strong>教授課程</strong><p>${esc(p.courses)}</p></div></div></div>`;
    const home = document.querySelector('.home-professor-card');
    if (home) home.innerHTML = `<img class="home-professor-photo" src="${esc(p.image)}" alt="${esc(p.name)}${esc(p.title)}" decoding="async"><div class="home-professor-content"><span class="eyebrow">指導教授</span><h2 class="section-title">${esc(p.name)} ${esc(p.title)}</h2><p class="home-professor-role">${esc(p.department)}</p><p class="home-professor-description">${esc(p.description)}</p><div class="interest-tags home-professor-tags">${tags(p.interests).map(x => `<span class="interest-tag">${esc(x)}</span>`).join('')}</div><a class="card-link home-professor-link" href="members.html">查看教師與成員資料 →</a></div>`;
  }

  function renderMembers() {
    const grids = document.querySelectorAll('.member-grid');
    if (grids[0]) grids[0].innerHTML = data.members.map(name => `<article class="member-card"><div><span class="tag">研究生</span></div><h3>${esc(name)}</h3></article>`).join('');
    if (grids[1]) grids[1].innerHTML = data.alumni.map(x => `<article class="member-card"><div><span class="tag">碩士畢業</span><span class="member-id">${esc(x.year)}</span></div><h3>${esc(x.name)}</h3><strong class="thesis-label">碩士論文</strong><p class="thesis-title">${esc(x.thesis)}</p></article>`).join('');
    const honors = document.querySelector('.honor-list');
    if (honors) honors.innerHTML = data.honors.map(x => `<div class="honor-item"><span class="tag">${esc(x.year)}</span><p>${esc(x.text)}</p></div>`).join('');
  }

  function renderPublications() {
    const projects = document.querySelector('.project-list');
    if (projects) projects.innerHTML = data.projects.map(x => `<article class="project-item"><div><span class="tag">${esc(x.role)}</span><span class="project-period">${esc(x.period)}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.sponsor)} · ${esc(x.amount)}</p></article>`).join('');
    const lists = document.querySelectorAll('.publication-list');
    if (lists[0]) lists[0].innerHTML = data.journals.map(x => `<article class="publication-item"><span class="tag">${esc(x.tag)}</span><h3>${esc(x.title)}</h3><p>${esc(x.citation)}</p></article>`).join('');
    if (lists[1]) lists[1].innerHTML = [...data.alumni].reverse().map(x => `<article class="publication-item"><span class="tag">${esc(x.year)}</span><h3>${esc(x.thesis)}</h3><p>${esc(x.name)}</p></article>`).join('');
  }

  function renderActivities() {
    const albums = document.querySelector('.activity-albums');
    if (albums) albums.innerHTML = data.activities.map(x => `<article class="activity-album"><header class="album-header"><div><span class="tag">${esc(x.date)}</span><h3>${esc(x.title)}</h3></div></header><div class="photo-grid photo-grid-single"><a href="${esc(x.image)}" target="_blank" rel="noopener"><img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy" decoding="async"></a></div></article>`).join('');
    const slides = document.querySelector('.activity-slides');
    if (slides) slides.innerHTML = data.activities.map((x,i) => `<a class="activity-slide${i?'':' active'}" href="news.html#activities" aria-hidden="${i?'true':'false'}"><img src="${esc(x.image)}" alt="${esc(x.title)}" decoding="async"><div class="slide-caption"><span>${esc(x.date)}</span><h3>${esc(x.title)}</h3></div></a>`).join('');
  }

  function renderContact() {
    const list = document.querySelector('.contact-list');
    if (!list) return;
    const c=data.contact, rows=[['學校',c.school],['系所',c.department],['實驗室',c.labRoom],['實驗室分機',c.labExtension],['教授辦公室',c.office],['專線電話',c.directTel],['校內分機',c.campusExtension],['傳真電話',c.fax]];
    list.innerHTML = rows.map(x => `<div class="contact-item"><strong>${x[0]}</strong><span>${esc(x[1])}</span></div>`).join('')+`<div class="contact-item"><strong>E-mail</strong><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>`;
    const image=document.querySelector('.location-panel img'); if(image) image.src=c.buildingImage;
  }

  function initSlider() {
    document.querySelectorAll('[data-activity-slider]').forEach(slider => {
      const slides=[...slider.querySelectorAll('.activity-slide')], box=slider.querySelector('[data-slider-dots]'); if(!slides.length||!box)return;
      let current=0,timer; box.innerHTML='';
      const dots=slides.map((_,i)=>{const b=document.createElement('button');b.type='button';b.className='slider-dot';b.setAttribute('aria-label',`切換至第 ${i+1} 張活動照片`);b.onclick=()=>{show(i);start();};box.appendChild(b);return b;});
      const show=i=>{current=(i+slides.length)%slides.length;slides.forEach((s,n)=>{const on=n===current;s.classList.toggle('active',on);s.setAttribute('aria-hidden',on?'false':'true');s.tabIndex=on?0:-1;dots[n].classList.toggle('active',on);});};
      const start=()=>{clearInterval(timer);if(slides.length>1)timer=setInterval(()=>show(current+1),4000);};
      slider.querySelector('[data-slider-prev]')?.addEventListener('click',()=>{show(current-1);start();}); slider.querySelector('[data-slider-next]')?.addEventListener('click',()=>{show(current+1);start();}); slider.addEventListener('mouseenter',()=>clearInterval(timer));slider.addEventListener('mouseleave',start);show(0);start();
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    document.documentElement.lang='zh-Hant'; renderProfessor();renderMembers();renderPublications();renderActivities();renderContact();
    const toggle=document.querySelector('.nav-toggle'),nav=document.querySelector('.nav-links');if(toggle&&nav){toggle.onclick=()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));};nav.querySelectorAll('a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));}
    document.querySelectorAll('.footer-links').forEach(links=>{if(!links.querySelector('[href="manage.html"]'))links.insertAdjacentHTML('beforeend','<a href="manage.html">網站維護</a>');});
    document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());initSlider();
  });
})();
