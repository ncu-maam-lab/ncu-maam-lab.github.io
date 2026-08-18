(() => {
  const original = JSON.parse(JSON.stringify(window.SITE_DATA));
  let state;
  try { state = JSON.parse(localStorage.getItem('lab-site-draft')) || original; } catch { state = original; }
  let rootHandle = null;

  const sections = [
    {key:'professor',title:'老師資料',note:'首頁與成員頁會同步更新',type:'object',fields:[['name','中文姓名'],['englishName','英文姓名'],['title','職稱'],['department','系所'],['image','照片路徑','image'],['description','首頁介紹','long'],['interests','研究專長（以頓號分隔）','long'],['education','學歷','long'],['experience','經歷','long'],['courses','授課','long']]},
    {key:'contact',title:'聯絡資訊',note:'成員頁與聯絡頁會同步更新',type:'object',fields:[['school','學校'],['department','系所'],['labRoom','實驗室位置'],['labExtension','實驗室分機'],['office','教授辦公室'],['directTel','專線電話'],['campusExtension','校內分機'],['fax','傳真'],['email','E-mail'],['buildingImage','位置圖片','image']]},
    {key:'members',title:'目前成員',note:'只需填姓名，不顯示學號',type:'primitive',fields:[['value','姓名']]},
    {key:'alumni',title:'碩士畢業校友',note:'此處論文會同步出現在研究成果頁',type:'array',fields:[['year','畢業年份'],['name','姓名'],['thesis','碩士論文題目','long']]},
    {key:'honors',title:'榮譽事蹟',note:'獲獎與學生指導紀錄',type:'array',fields:[['year','年份'],['text','內容','long']]},
    {key:'projects',title:'研究計畫',note:'會顯示在研究成果頁最上方',type:'array',fields:[['role','身分'],['period','執行期間'],['title','計畫名稱','long'],['sponsor','補助單位'],['amount','金額']]},
    {key:'journals',title:'期刊論文',note:'建議將最新論文放在最上方',type:'array',fields:[['tag','年份與類別'],['title','論文題目','long'],['citation','作者、期刊與卷頁','long']]},
    {key:'activities',title:'活動花絮',note:'首頁幻燈片與活動頁會同步更新',type:'array',fields:[['date','日期或學年度'],['title','活動名稱'],['image','照片路徑','image']]}
  ];

  const editor=document.querySelector('#editor'), nav=document.querySelector('#section-nav'), notice=document.querySelector('#notice');
  const clone = value => JSON.parse(JSON.stringify(value));
  const saveDraft = () => localStorage.setItem('lab-site-draft',JSON.stringify(state));
  const announce = (message,type='') => { notice.textContent=message;notice.className=`notice ${type}`; };
  const fileText = () => `window.SITE_DATA = ${JSON.stringify(state,null,2)};\n`;

  function fieldHtml(section, field, value, index='object') {
    const [key,label,kind]=field, id=`${section.key}-${index}-${key}`, full=kind==='long'||kind==='image';
    if(kind==='long') return `<div class="field full"><label for="${id}">${label}</label><textarea id="${id}" data-section="${section.key}" data-index="${index}" data-key="${key}">${escape(value)}</textarea></div>`;
    if(kind==='image') return `<div class="field full"><label for="${id}">${label}</label><div class="image-tools"><input id="${id}" type="text" value="${escape(value)}" data-section="${section.key}" data-index="${index}" data-key="${key}"><label class="mini">選擇並複製照片<input type="file" accept="image/*" hidden data-photo data-section="${section.key}" data-index="${index}" data-key="${key}"></label></div></div>`;
    return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="text" value="${escape(value)}" data-section="${section.key}" data-index="${index}" data-key="${key}"></div>`;
  }
  function escape(value){return String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

  function render() {
    nav.innerHTML=sections.map((s,i)=>`<button data-show="${s.key}" class="${i===0?'active':''}">${s.title}</button>`).join('');
    editor.innerHTML=sections.map((s,i)=>{
      const value=state[s.key]; let cards='';
      if(s.type==='object') cards=`<article class="edit-card"><div class="field-grid">${s.fields.map(f=>fieldHtml(s,f,value[f[0]])).join('')}</div></article>`;
      else cards=value.map((item,n)=>{const object=s.type==='primitive'?{value:item}:item;return `<article class="edit-card"><div class="card-head"><strong>第 ${n+1} 筆</strong><button class="mini" data-move="up" data-section="${s.key}" data-index="${n}" aria-label="上移">↑</button><button class="mini" data-move="down" data-section="${s.key}" data-index="${n}" aria-label="下移">↓</button><button class="mini danger" data-delete data-section="${s.key}" data-index="${n}">刪除</button></div><div class="field-grid">${s.fields.map(f=>fieldHtml(s,f,object[f[0]],n)).join('')}</div></article>`;}).join('');
      return `<section class="editor-section ${i===0?'active':''}" data-panel="${s.key}"><div class="section-head"><div><h1>${s.title}</h1><p>${s.note}</p></div>${s.type==='object'?'':`<button class="add" data-add="${s.key}">＋ 新增一筆</button>`}</div>${cards}</section>`;
    }).join('');
  }

  function updateValue(input) {
    const {section,index,key}=input.dataset;
    if(index==='object') state[section][key]=input.value;
    else { const schema=sections.find(s=>s.key===section); if(schema.type==='primitive') state[section][Number(index)]=input.value; else state[section][Number(index)][key]=input.value; }
    saveDraft(); announce('修改已暫存。完成後請按「儲存並預覽」。');
  }

  editor.addEventListener('input',e=>{if(e.target.matches('[data-key]'))updateValue(e.target);});
  editor.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]'); if(add){const schema=sections.find(s=>s.key===add.dataset.add);state[schema.key].push(schema.type==='primitive'?'':Object.fromEntries(schema.fields.map(f=>[f[0],'' ])));saveDraft();const active=schema.key;render();show(active);return;}
    const del=e.target.closest('[data-delete]'); if(del&&confirm('確定刪除這一筆？')){const key=del.dataset.section;state[key].splice(Number(del.dataset.index),1);saveDraft();render();show(key);return;}
    const move=e.target.closest('[data-move]');if(move){const key=move.dataset.section,from=Number(move.dataset.index),to=from+(move.dataset.move==='up'?-1:1);if(to>=0&&to<state[key].length){[state[key][from],state[key][to]]=[state[key][to],state[key][from]];saveDraft();render();show(key);} }
  });
  editor.addEventListener('change',async e=>{if(!e.target.matches('[data-photo]'))return;const file=e.target.files[0];if(!file)return;const isActivity=e.target.dataset.section==='activities', path=`assets/images/${isActivity?'activities/':''}${file.name}`;if(rootHandle){try{const assets=await rootHandle.getDirectoryHandle('assets');const images=await assets.getDirectoryHandle('images');const folder=isActivity?await images.getDirectoryHandle('activities'):images;const handle=await folder.getFileHandle(file.name,{create:true});const writer=await handle.createWritable();await writer.write(file);await writer.close();announce(`照片已複製到 ${path}`,'success');}catch(err){announce(`照片複製失敗：${err.message}`,'error');return;}}else announce('照片路徑已填入；儲存前請先選擇網站資料夾，並再選一次照片以完成複製。','error');const target=document.querySelector(`[data-section="${e.target.dataset.section}"][data-index="${e.target.dataset.index}"][data-key="${e.target.dataset.key}"]:not([type=file])`);target.value=path;updateValue(target);});
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-show]');if(b)show(b.dataset.show);});
  function show(key){document.querySelectorAll('[data-panel]').forEach(x=>x.classList.toggle('active',x.dataset.panel===key));document.querySelectorAll('[data-show]').forEach(x=>x.classList.toggle('active',x.dataset.show===key));window.scrollTo({top:0,behavior:'smooth'});}

  document.querySelector('#choose-folder').onclick=async()=>{if(!window.showDirectoryPicker){announce('此瀏覽器不支援直接儲存，請使用 Chrome／Edge，或改用「下載資料檔」。','error');return;}try{rootHandle=await window.showDirectoryPicker({mode:'readwrite'});const hasIndex=await rootHandle.getFileHandle('index.html').catch(()=>null);if(!hasIndex)throw new Error('選到的資料夾內沒有 index.html');document.querySelector('#folder-status').textContent=`已選：${rootHandle.name}`;announce('網站資料夾已連接，可以直接儲存與複製照片。','success');}catch(err){if(err.name!=='AbortError')announce(err.message,'error');}};
  document.querySelector('#save').onclick=async()=>{if(!rootHandle){announce('請先按「選擇網站資料夾」。若瀏覽器不支援，可按「下載資料檔」再覆蓋 assets/data/site-data.js。','error');return;}try{const assets=await rootHandle.getDirectoryHandle('assets'),dir=await assets.getDirectoryHandle('data'),file=await dir.getFileHandle('site-data.js',{create:true}),writer=await file.createWritable();await writer.write(fileText());await writer.close();localStorage.removeItem('lab-site-draft');announce('儲存完成，已開啟網站預覽。確認後再將整個網站上傳或推送到 GitHub。','success');window.open(`index.html?updated=${Date.now()}`,'_blank');}catch(err){announce(`儲存失敗：${err.message}`,'error');}};
  document.querySelector('#download').onclick=()=>{const blob=new Blob([fileText()],{type:'application/javascript;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='site-data.js';a.click();URL.revokeObjectURL(a.href);announce('已下載 site-data.js，請用它覆蓋網站的 assets/data/site-data.js。','success');};
  document.querySelector('#import-file').onchange=async e=>{try{const text=await e.target.files[0].text(),json=text.trim().startsWith('{')?text:text.replace(/^\s*window\.SITE_DATA\s*=\s*/,'').replace(/;\s*$/,'');state=JSON.parse(json);saveDraft();render();announce('備份已匯入，請檢查後再儲存。','success');}catch(err){announce(`匯入失敗：${err.message}`,'error');}};
  document.querySelector('#discard').onclick=()=>{if(confirm('確定放棄所有尚未寫入網站的修改？')){localStorage.removeItem('lab-site-draft');state=clone(original);render();announce('已恢復目前網站資料。','success');}};
  render();
})();
