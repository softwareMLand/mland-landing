(function(){
  var KEY="mland_lang";
  function getLang(){try{var s=localStorage.getItem(KEY);if(s==="en"||s==="es")return s}catch(e){}return"es"}
  function apply(lang){
    document.documentElement.lang=lang;
    document.querySelectorAll("[data-es]").forEach(function(el){var v=el.getAttribute("data-"+lang);if(v!=null)el.textContent=v});
    document.querySelectorAll("[data-es-html]").forEach(function(el){var v=el.getAttribute("data-"+lang+"-html");if(v!=null)el.innerHTML=v});
    document.querySelectorAll("[data-es-href]").forEach(function(el){var v=el.getAttribute("data-"+lang+"-href");if(v!=null)el.setAttribute("href",v)});
    document.querySelectorAll(".lang-btn").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-set-lang")===lang)});
    try{localStorage.setItem(KEY,lang)}catch(e){}
  }
  window.mlandSetLang=function(lang){if(lang==="es"||lang==="en")apply(lang)};
  document.addEventListener("DOMContentLoaded",function(){
    apply(getLang());
    document.querySelectorAll("[data-set-lang]").forEach(function(btn){
      btn.addEventListener("click",function(e){e.preventDefault();apply(btn.getAttribute("data-set-lang"))});
    });
  });
})();
