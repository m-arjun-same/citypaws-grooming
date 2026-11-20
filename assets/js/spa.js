/* CityPaws Grooming v2 — motion system + own engines.
   Loader, hero intro, marquees, split-word section heads, pinned story,
   groom-wipe, worlds expander, pinned groom journey, doodle drift,
   press word-scrub, colour-journey bands, accordion, counter, booking form. */
(function(){
"use strict";
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduced){ var hv = document.getElementById("heroVid"); if (hv){ hv.removeAttribute("autoplay"); hv.pause(); } }
var hasGsap = !!(window.gsap && window.ScrollTrigger);

/* ---------- tiny word splitter (own code, no SplitText) ---------- */
function splitWords(el){
  var tokens = [];
  (function walk(node, inEm){
    Array.prototype.slice.call(node.childNodes).forEach(function(ch){
      if (ch.nodeType === 3){
        ch.textContent.split(/\s+/).filter(Boolean).forEach(function(w){ tokens.push({ w:w, em:inEm }); });
      } else if (ch.nodeType === 1){ walk(ch, inEm || ch.tagName === "EM"); }
    });
  })(el, false);
  el.innerHTML = "";
  var inners = [];
  tokens.forEach(function(t, i){
    var mask = document.createElement("span"); mask.className = "wmask";
    var inner = document.createElement("span"); inner.className = "wword";
    if (t.em){ var em = document.createElement("em"); em.textContent = t.w; inner.appendChild(em); }
    else inner.textContent = t.w;
    mask.appendChild(inner); el.appendChild(mask);
    if (i < tokens.length - 1) el.appendChild(document.createTextNode(" "));
    inners.push(inner);
  });
  return inners;
}
function splitPlainWords(el){
  var words = el.textContent.trim().split(/\s+/);
  el.innerHTML = "";
  return words.map(function(w, i){
    var s = document.createElement("span"); s.className = "pword"; s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    return s;
  });
}

/* ---------- smooth scroll (Lenis, vendored) ---------- */
var lenis = null;
if (window.Lenis && !reduced){
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  window.__lenis = lenis;
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener("click", function(e){
    var id = a.getAttribute("href");
    if (id.length > 1){
      var el = document.querySelector(id);
      if (el){ e.preventDefault(); if (lenis) lenis.scrollTo(el, {offset:-70}); else el.scrollIntoView({behavior:"smooth"}); }
    }
  });
});

/* ---------- header state ---------- */
var hdr = document.getElementById("hdr");
function onScroll(){ hdr.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.82); }
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

/* ---------- fallback when GSAP/reduced-motion: show everything ---------- */
function showAll(){
  document.documentElement.classList.add("no-anim");
  var f = document.getElementById("storyProg"); if (f) f.style.transform = "scaleX(1)";
  var b = document.querySelector(".trust__big span[data-count]"); if (b) b.textContent = "4.5";
  var loader = document.getElementById("loader"); if (loader) loader.style.display = "none";
}

if (hasGsap && !reduced){
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on("scroll", ScrollTrigger.update);
  var mm = gsap.matchMedia();

  /* ---------- LOADER + HERO INTRO ---------- */
  var loaderEl = document.getElementById("loader");
  gsap.set(".loader__word span", { y:26, opacity:0 });
  gsap.set(".loader__paw", { scale:.5, opacity:0 });
  gsap.set(".loader__sub", { opacity:0 });
  gsap.set(".hline__in", { yPercent:112 });
  gsap.set(".hero__rule", { scaleX:0 });
  var heroIn = gsap.utils.toArray(".hero .hin");
  gsap.set(heroIn, { y:28 });

  var intro = gsap.timeline();
  intro
    .to(".loader__paw", { scale:1, opacity:1, duration:.38, ease:"back.out(2)" })
    .to(".loader__word span", { y:0, opacity:1, duration:.45, stagger:.045, ease:"power3.out" }, "-=.15")
    .to(".loader__sub", { opacity:1, duration:.3 }, "-=.2")
    .to(".loader__core", { opacity:0, y:-18, duration:.32, ease:"power2.in", delay:.22 })
    .to(".loader__panel--l", { xPercent:-101, duration:.68, ease:"power4.inOut" }, "curtain")
    .to(".loader__panel--r", { xPercent:101, duration:.68, ease:"power4.inOut" }, "curtain")
    .set(loaderEl, { display:"none" })
    /* hero intro */
    .fromTo("#heroVid", { scale:1.14 }, { scale:1, duration:1.6, ease:"power3.out" }, "curtain+=.18")
    .to(".hline__in", { yPercent:0, duration:.9, ease:"power4.out" }, "curtain+=.3")
    .to(heroIn, { opacity:1, y:0, duration:.8, stagger:.09, ease:"power3.out" }, "curtain+=.45")
    .to(".hero__rule", { scaleX:1, duration:.8, ease:"power3.inOut" }, "curtain+=.6");
  /* safety: never trap the page behind the loader */
  setTimeout(function(){
    if (loaderEl && loaderEl.style.display !== "none" && intro.progress() < 0.9){
      intro.kill(); loaderEl.style.display = "none";
      gsap.set(heroIn, { opacity:1, y:0 });
      gsap.set(".hline__in", { yPercent:0 });
      gsap.set(".hero__rule", { scaleX:1 });
      gsap.set("#heroVid", { scale:1 });
    }
  }, 4500);

  /* hero photo parallax on scroll-out */
  gsap.to("#heroVid", { yPercent:10, ease:"none",
    scrollTrigger:{ trigger:".hero", start:"top top", end:"bottom top", scrub:true } });

  /* ---------- MARQUEES ---------- */
  function marquee(track, dur, reverse){
    if (!track) return null;
    var tween = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration:dur, repeat:-1, ease:"none" });
    return tween;
  }
  marquee(document.getElementById("mqMain"), 26, false);
  marquee(document.getElementById("mqHire"), 30, true);
  /* velocity skew on the main marquee */
  var mqMain = document.getElementById("mqMain");
  if (mqMain && lenis){
    var skewTo = gsap.quickTo(mqMain, "skewX", { duration:.35, ease:"power3" }), skewTimer = null;
    lenis.on("scroll", function(e){
      var v = (e && typeof e.velocity === "number") ? e.velocity : 0;
      skewTo(gsap.utils.clamp(-6, 6, v * -0.55));
      clearTimeout(skewTimer);
      skewTimer = setTimeout(function(){ skewTo(0); }, 130);
    });
  }

  /* ---------- SECTION HEADS: kick line draw + split-word rise ---------- */
  document.querySelectorAll(".shead").forEach(function(head){
    var line = head.querySelector(".kick__line");
    var h2 = head.querySelector("[data-split]");
    var words = h2 ? splitWords(h2) : [];
    if (line) gsap.set(line, { scaleX:0 });
    if (words.length) gsap.set(words, { yPercent:115 });
    var tl = gsap.timeline({ scrollTrigger:{ trigger:head, start:"top 86%" } });
    if (line) tl.to(line, { scaleX:1, duration:.7, ease:"power3.inOut" });
    if (words.length) tl.to(words, { yPercent:0, duration:.85, stagger:.045, ease:"power4.out" }, line ? "-=.35" : 0);
  });
  /* press kick is outside a .shead */
  document.querySelectorAll(".press .kick__line").forEach(function(line){
    gsap.fromTo(line, { scaleX:0 }, { scaleX:1, duration:.7, ease:"power3.inOut",
      scrollTrigger:{ trigger:line, start:"top 88%" } });
  });

  /* ---------- generic .rv reveals (fallback layer) ---------- */
  gsap.utils.toArray(".rv").forEach(function(el){
    gsap.to(el, { opacity:1, y:0, duration:1.0, ease:"power3.out",
      scrollTrigger:{ trigger:el, start:"top 88%" } });
  });

  /* ---------- group staggers ---------- */
  function group(sel, vars){
    var items = gsap.utils.toArray(sel);
    if (!items.length) return;
    gsap.fromTo(items, { opacity:0, y:56 }, Object.assign({
      opacity:1, y:0, duration:.95, stagger:.12, ease:"power3.out",
      scrollTrigger:{ trigger:items[0].parentElement, start:"top 82%" } }, vars || {}));
  }
  var pkgs = gsap.utils.toArray(".pkg");
  if (pkgs.length){
    gsap.fromTo(pkgs,
      { opacity:0, y:56, rotate:function(i){ return i === 0 ? -1.6 : (i === 2 ? 1.6 : 0); } },
      { opacity:1, y:0, rotate:0, duration:1, stagger:.13, ease:"power3.out",
        scrollTrigger:{ trigger:".pkgs", start:"top 82%" } });
  }
  group(".step"); group(".vaxcard"); group(".job");

  /* ---------- COLOUR JOURNEY bands ---------- */
  document.querySelectorAll(".band").forEach(function(band){
    gsap.fromTo(band, { backgroundColor:band.getAttribute("data-from") },
      { backgroundColor:band.getAttribute("data-to"), ease:"none",
        scrollTrigger:{ trigger:band, start:"top bottom", end:"bottom top", scrub:true } });
  });

  /* ---------- STORY: pinned horizontal (desktop) / stacked (mobile) ---------- */
  mm.add("(min-width: 821px)", function(){
    var track = document.getElementById("storyTrack");
    gsap.to(track, { x:function(){ return -(track.scrollWidth - window.innerWidth); }, ease:"none",
      scrollTrigger:{ trigger:".story", start:"top top", end:function(){ return "+=" + (track.scrollWidth - window.innerWidth + 300); },
        pin:true, scrub:1, invalidateOnRefresh:true,
        onUpdate:function(self){ var p = document.getElementById("storyProg"); if (p) p.style.transform = "scaleX(" + self.progress + ")"; } } });
    return function(){ gsap.set(track, { x:0 }); };
  });
  mm.add("(max-width: 820px)", function(){
    gsap.fromTo("#storyProg", { scaleX:0 }, { scaleX:1, ease:"none",
      scrollTrigger:{ trigger:".story", start:"top 70%", end:"bottom 60%", scrub:true } });
    gsap.utils.toArray(".spanel").forEach(function(p){
      gsap.fromTo(p, { opacity:0, y:44 }, { opacity:1, y:0, duration:.9, ease:"power3.out",
        scrollTrigger:{ trigger:p, start:"top 88%" } });
    });
  });

  /* ---------- REVEAL wipe entrance ---------- */
  gsap.fromTo("#ba", { clipPath:"inset(0 0 0 100%)" },
    { clipPath:"inset(0 0 0 0%)", duration:1.15, ease:"power3.inOut",
      scrollTrigger:{ trigger:"#ba", start:"top 82%" } });

  /* ---------- WORLDS image parallax ---------- */
  gsap.utils.toArray(".world img").forEach(function(img){
    gsap.fromTo(img, { yPercent:-3.5 }, { yPercent:3.5, ease:"none",
      scrollTrigger:{ trigger:img.closest(".world"), start:"top bottom", end:"bottom top", scrub:true } });
  });

  /* ---------- GROOM JOURNEY ---------- */
  var jsteps = gsap.utils.toArray(".jstep"), jphotos = gsap.utils.toArray(".jphoto"),
      jdots = gsap.utils.toArray(".jdot"), jNum = document.getElementById("jNum");
  function setJourney(idx){
    jsteps.forEach(function(s, i){ s.classList.toggle("is-on", i === idx); });
    jphotos.forEach(function(p, i){ p.classList.toggle("is-on", i === idx); });
    jdots.forEach(function(d, i){ d.classList.toggle("is-on", i <= idx); });
    if (jNum) jNum.textContent = "0" + (idx + 1);
  }
  mm.add("(min-width: 821px)", function(){
    gsap.set(jphotos, { opacity:0, scale:1.08 }); gsap.set(jphotos[0], { opacity:1, scale:1 });
    gsap.set(jsteps, { opacity:0, y:26, visibility:"visible", position:"absolute" });
    gsap.set(jsteps[0], { opacity:1, y:0 });
    var jtl = gsap.timeline({
      scrollTrigger:{ trigger:".journey", start:"top top", end:"+=170%", pin:true, scrub:.6,
        onUpdate:function(self){ setJourney(Math.max(0, Math.min(3, Math.floor(self.progress * jtl.duration() - 0.44)))); } } });
    for (var i = 1; i < 4; i++){
      (function(i){
        jtl.to(jphotos[i-1], { opacity:0, scale:1.05, duration:1, ease:"power2.inOut" }, i)
           .fromTo(jphotos[i], { opacity:0, scale:1.08 }, { opacity:1, scale:1, duration:1, ease:"power2.inOut" }, i)
           .to(jsteps[i-1], { opacity:0, y:-22, duration:.38, ease:"power2.in" }, i)
           .fromTo(jsteps[i], { opacity:0, y:22 }, { opacity:1, y:0, duration:.38, ease:"power2.out" }, i + .5);
      })(i);
    }
    return function(){ setJourney(0); gsap.set(jsteps, { clearProps:"all" }); gsap.set(jphotos, { clearProps:"all" }); };
  });
  mm.add("(max-width: 820px)", function(){
    jsteps.forEach(function(s){
      gsap.fromTo(s, { opacity:0, y:40 }, { opacity:1, y:0, duration:.9, ease:"power3.out",
        scrollTrigger:{ trigger:s, start:"top 86%" } });
    });
  });

  /* ---------- DOODLE HQ: giant drift + photo parallax ---------- */
  gsap.fromTo("#doodleGiant", { xPercent:2 }, { xPercent:-22, ease:"none",
    scrollTrigger:{ trigger:".doodle", start:"top bottom", end:"bottom top", scrub:true } });
  gsap.fromTo("#doodleImg", { yPercent:-6 }, { yPercent:6, ease:"none",
    scrollTrigger:{ trigger:".doodle", start:"top bottom", end:"bottom top", scrub:true } });
  gsap.fromTo("#poodleImg", { yPercent:6 }, { yPercent:-6, ease:"none",
    scrollTrigger:{ trigger:".doodle", start:"top bottom", end:"bottom top", scrub:true } });

  /* ---------- PRESS: word-by-word scrub ---------- */
  var pressQ = document.getElementById("pressQ");
  if (pressQ){
    var pwords = splitPlainWords(pressQ);
    gsap.to(pwords, { opacity:1, stagger:.05, ease:"none",
      scrollTrigger:{ trigger:pressQ, start:"top 78%", end:"bottom 55%", scrub:true } });
  }

  /* ---------- TRUST: counter + alternating review cards ---------- */
  var big = document.querySelector(".trust__big span[data-count]");
  if (big){
    var target = parseFloat(big.getAttribute("data-count")), obj = { v:0 };
    gsap.to(obj, { v:target, duration:1.6, ease:"power2.out",
      scrollTrigger:{ trigger:big, start:"top 85%" },
      onUpdate:function(){ big.textContent = obj.v.toFixed(1); } });
  }
  gsap.fromTo(".q--l", { x:-64, opacity:0 }, { x:0, opacity:1, duration:1, ease:"power3.out",
    scrollTrigger:{ trigger:".quotes", start:"top 84%" } });
  gsap.fromTo(".q--r", { x:64, opacity:0 }, { x:0, opacity:1, duration:1, ease:"power3.out",
    scrollTrigger:{ trigger:".quotes", start:"top 84%" } });

  /* ---------- FOOTER: giant letters stagger-rise ---------- */
  var foot = document.getElementById("footName");
  if (foot){
    var letters = foot.textContent.split("").map(function(ch){
      var m = document.createElement("span"); m.className = "fmask";
      var l = document.createElement("span"); l.className = "flet"; l.textContent = ch;
      m.appendChild(l); return { mask:m, let:l };
    });
    foot.innerHTML = "";
    letters.forEach(function(o){ foot.appendChild(o.mask); });
    gsap.fromTo(letters.map(function(o){ return o.let; }), { yPercent:112 },
      { yPercent:0, duration:.9, stagger:.05, ease:"power4.out",
        scrollTrigger:{ trigger:foot, start:"top 92%" } });
  }

  /* ---------- MAGNETIC buttons (fine pointers only) ---------- */
  if (window.matchMedia("(pointer: fine)").matches){
    document.querySelectorAll(".mag").forEach(function(btn){
      var xTo = gsap.quickTo(btn, "x", { duration:.4, ease:"power3" }),
          yTo = gsap.quickTo(btn, "y", { duration:.4, ease:"power3" });
      btn.addEventListener("mousemove", function(e){
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .28);
        yTo((e.clientY - r.top - r.height / 2) * .34);
      });
      btn.addEventListener("mouseleave", function(){ xTo(0); yTo(0); });
    });
  }

  window.addEventListener("load", function(){ ScrollTrigger.refresh(); });
} else {
  showAll();
}

/* ---------- THE GROOM WIPE — rest shows BEFORE only; drag wipes the groomed AFTER in over it ---------- */
var ba = document.getElementById("ba");
if (ba){
  var pos = 0, dragging = false;
  function setPos(p){
    pos = Math.max(0, Math.min(100, p));
    ba.style.setProperty("--pos", pos + "%");
    ba.setAttribute("aria-valuenow", Math.round(pos));
  }
  function fromEvent(e){
    var r = ba.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  }
  ba.addEventListener("pointerdown", function(e){ dragging = true; ba.classList.add("is-touched"); try{ ba.setPointerCapture(e.pointerId); }catch(_){} setPos(fromEvent(e)); });
  ba.addEventListener("pointermove", function(e){ if (dragging) setPos(fromEvent(e)); });
  ["pointerup","pointercancel"].forEach(function(ev){ ba.addEventListener(ev, function(){ dragging = false; }); });
  ba.addEventListener("keydown", function(e){
    if (e.key === "ArrowLeft"){ ba.classList.add("is-touched"); setPos(pos - 4); e.preventDefault(); }
    if (e.key === "ArrowRight"){ ba.classList.add("is-touched"); setPos(pos + 4); e.preventDefault(); }
  });
  setPos(0);
}

/* ---------- TWO WORLDS expander (salon / mobile) ---------- */
var worlds = document.querySelectorAll("[data-world]");
worlds.forEach(function(w){
  function open(){ worlds.forEach(function(x){ x.classList.toggle("is-open", x === w); }); }
  w.addEventListener("mouseenter", function(){ if (window.innerWidth > 900) open(); });
  w.addEventListener("click", open);
});

/* ---------- SERVICES — à la carte accordion (packages are rendered in HTML) ---------- */
var SERVICES = [
  ["De-matting","À la carte","Patient, gentle work through tangles and mats — we save every bit of coat we safely can, and we'll tell you honestly when a fresh start is kinder."],
  ["De-shedding","À la carte","Treatments designed to remove loose undercoat and reduce shedding — a healthier coat for them, a cleaner home for you."],
  ["Nail Cutting & Grinding","À la carte","Cut and smooth finish by grinding, keeping nails at a healthy length for comfortable paws and proper foot health."],
  ["Teeth Brushing","À la carte","A gentle brush that helps reduce plaque and bad breath, and keeps teeth and gums in better shape between vet visits."],
  ["Doggie Facials","À la carte","A soothing facial cleanse for tear-stained, food-catching faces — a CityPaws finishing touch, and a doodle favourite."],
  ["Doodle & Poodle Specialist Cuts","Specialists","Our headquarters specialty: teddy-bear cuts, face shaping and coat plans for doodles and poodles, shaped to the dog in front of us."]
];
var list = document.getElementById("menuList");
if (list){
  SERVICES.forEach(function(s, i){
    var row = document.createElement("div"); row.className = "mrow";
    row.innerHTML = '<button class="mrow__head" aria-expanded="false">' +
      '<span class="mrow__no">' + String(i+1).padStart(2,"0") + '</span>' +
      '<span class="mrow__name"></span>' +
      '<span class="mrow__for"></span>' +
      '<span class="mrow__plus">+</span></button>' +
      '<div class="mrow__body"><p></p></div>';
    row.querySelector(".mrow__name").textContent = s[0];
    row.querySelector(".mrow__for").textContent = s[1];
    row.querySelector(".mrow__body p").textContent = s[2];
    list.appendChild(row);
  });
  list.addEventListener("click", function(e){
    var head = e.target.closest(".mrow__head"); if (!head) return;
    var row = head.parentElement, body = row.querySelector(".mrow__body"), open = row.classList.contains("is-open");
    list.querySelectorAll(".mrow.is-open").forEach(function(r){
      r.classList.remove("is-open"); r.querySelector(".mrow__body").style.maxHeight = "0px";
      r.querySelector(".mrow__head").setAttribute("aria-expanded","false");
    });
    if (!open){ row.classList.add("is-open"); body.style.maxHeight = body.scrollHeight + "px"; head.setAttribute("aria-expanded","true"); }
  });
}

/* ---------- BOOKING FORM ---------- */
var form = document.getElementById("bookForm");
if (form){
  var dateInput = form.querySelector('input[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var fd = new FormData(form);
    var owner = (fd.get("owner")||"").toString().trim(),
        phone = (fd.get("phone")||"").toString().trim(),
        pet = (fd.get("pet")||"").toString().trim(),
        where = (fd.get("where")||"River Oaks Salon").toString(),
        service = (fd.get("service")||"").toString(),
        date = (fd.get("date")||"").toString(),
        err = document.getElementById("formErr");
    var missing = [];
    if (!owner) missing.push("your name");
    if (!phone) missing.push("a phone number");
    if (!pet) missing.push("your pet's name");
    if (!service) missing.push("a service");
    if (missing.length){
      err.hidden = false;
      err.textContent = "Almost — we still need " + missing.join(", ") + ".";
      return;
    }
    err.hidden = true;
    var notes = (fd.get("notes")||"").toString().trim();
    var body = ["Appointment request from the website","",
      "Name: " + owner, "Phone: " + phone, "Pet: " + pet,
      "Where: " + where,
      "Service: " + service, "Preferred day: " + (date || "First available"),
      "Notes: " + (notes || "—")].join("\n");
    var mail = "mailto:management@citypawshtx.com"
      + "?subject=" + encodeURIComponent("Appointment request — " + pet + " · " + service)
      + "&body=" + encodeURIComponent(body);
    document.getElementById("doneText").textContent =
      "Thanks, " + owner.split(" ")[0] + " — your email app should open with this request addressed to CityPaws. Press Send there, and we'll call you on " + phone + " to confirm " + pet + "'s appointment.";
    var sum = document.getElementById("doneSum");
    sum.innerHTML = "";
    [["Pet", pet], ["Where", where], ["Service", service], ["Preferred day", date || "First available"], ["We call", phone]].forEach(function(pair){
      var d = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = pair[0];
      var dd = document.createElement("dd"); dd.textContent = pair[1];
      d.appendChild(dt); d.appendChild(dd); sum.appendChild(d);
    });
    form.hidden = true;
    document.getElementById("bookDone").hidden = false;
    window.location.href = mail;
  });
  document.getElementById("againBtn").addEventListener("click", function(){
    form.reset(); form.hidden = false;
    document.getElementById("bookDone").hidden = true;
  });
}
})();
