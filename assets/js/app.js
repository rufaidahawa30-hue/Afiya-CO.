
const $ = (q,el=document)=>el.querySelector(q);
const $$= (q,el=document)=>[...el.querySelectorAll(q)];
const STORE_KEY='afiya_cart_v1';

function loadCart(){ try { return JSON.parse(localStorage.getItem(STORE_KEY)||'[]'); } catch(e){ return []; } }
function saveCart(items){ localStorage.setItem(STORE_KEY, JSON.stringify(items)); renderCart(); }
function addToCart(item){ const items=loadCart(); const idx=items.findIndex(x=>x.id===item.id);
  if(idx>-1){ items[idx].qty+=1; } else { items.push({...item, qty:1}); } saveCart(items);
  openDrawer();
}
function removeFromCart(id){ saveCart(loadCart().filter(x=>x.id!==id)); }
function changeQty(id,delta){ const items=loadCart().map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+delta)}:x); saveCart(items); }

function renderCart(){
  const wrap=$('#cartItems'); if(!wrap) return;
  const items=loadCart();
  wrap.innerHTML = items.map(x=>`
   <div class="cart-item">
     <img src="${x.img}" alt="${x.name}">
     <div style="flex:1">
       <div><strong>${x.name}</strong></div>
       <div class="price">Rp ${(x.price).toLocaleString()}</div>
       <div>
         <button class="btn" style="padding:.2rem .6rem" onclick="changeQty('${x.id}',-1)">-</button>
         <span class="badge">${x.qty}</span>
         <button class="btn" style="padding:.2rem .6rem" onclick="changeQty('${x.id}',1)">+</button>
         <button class="btn" style="padding:.2rem .6rem;background:#f7d7de" onclick="removeFromCart('${x.id}')">Hapus</button>
       </div>
     </div>
   </div>
  `).join('');
  const total = items.reduce((a,b)=>a+b.price*b.qty,0);
  $('#cartTotal').textContent = 'Rp '+ total.toLocaleString();
}
function openDrawer(){ $('.drawer')?.classList.add('open'); }
function closeDrawer(){ $('.drawer')?.classList.remove('open'); }
function toggleDrawer(){ $('.drawer')?.classList.toggle('open'); }

function checkoutWA(){
  const items=loadCart();
  if(items.length===0) { alert('Keranjang masih kosong'); return; }
  const lines=items.map(i=>`• ${i.name} x${i.qty} @Rp ${i.price.toLocaleString()}`).join('%0A');
  const total=items.reduce((a,b)=>a+b.price*b.qty,0);
  const addr='Jl. Bougenvil No.15, Jakarta';
  const msg = `Halo Afiya&Co,%0A%0ASaya mau checkout:%0A${lines}%0A%0ATotal: Rp ${total.toLocaleString()}%0AAlamat Toko: ${addr}%0A`;
  const phone='6281234567890';
  window.open(`https://wa.me/${phone}?text=${msg}`,'_blank');
}

function bindATC(scope=document){
  $$('[data-atc]', scope).forEach(btn=>{
    btn.addEventListener('click', e=>{
      const card = btn.closest('[data-product]');
      const item = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price),
        img: card.dataset.img
      };
      addToCart(item);
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCart(); bindATC(document);
  $('#drawerOpen')?.addEventListener('click', openDrawer);
  $('#drawerClose')?.addEventListener('click', closeDrawer);
  const f=$('#feedbackForm');
  if(f){
    f.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nama = f.name.value.trim();
      const pesan = encodeURIComponent(f.message.value.trim());
      const subject = encodeURIComponent('Kritik & Saran Afiya&Co');
      const mail='mailto:afiya.co@example.com?subject='+subject+'&body='+encodeURIComponent(nama+': ')+pesan;
      window.location.href = mail;
      f.reset();
    });
  }
});
