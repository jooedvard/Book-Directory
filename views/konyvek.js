$(function () {
  let ajax = new Ajax();
  let form = $(".uj-konyv-form");
  menu();
  ujKonyvFelvetele();
  konyvTorlese();
  fetchKonyvek();
  konyvControl();
  konyvModositasa();
  kereses();

  let aktivID;

  $(window).on("aktiv", (e) => {
    aktivID = e.detail.adat.ID;
    form.slideDown(500);
  });
  
  ajax.ajaxApiGet("/logged",(a)=>{
      let welcome = $(".welcome-text");
      welcome.find(".username").text(a.user)
  })

  function konyvControl() {
    let main = $("main");
    let jobb = $(".jobb");
    let bal = $(".bal");

    jobb.on("click", () => {
      main.animate({ scrollLeft: "-=250" });
    });
    bal.on("click", () => {
      main.animate({ scrollLeft: "+=250" });
    });
  }

  function ujKonyvFelvetele() {
    let ujKonyvGomb = $(".uj-konyv");

    ujKonyvGomb.on("click", (event) => {
      event.preventDefault();
      let obj = {
        id: 0,
        cim: $("#cim").val(),
        kep: $("#kep").val(),
        ertekeles: $("#ertek").val(),
      };

      ajax.ajaxApiPost("/konyvek", obj, () => {
        fetchKonyvek();
      });
    });
  }

  function konyvTorlese() {
    let torlesGomb = $(".del-konyv");
    torlesGomb.on("click", (event) => {
      event.preventDefault();
      if (aktivID != undefined) {
        ajax.ajaxApiDelete("/konyvek", aktivID, () => {
          fetchKonyvek();
        });
      }
    });
  }

  function konyvModositasa() {
    let modKonyv = $(".mod-konyv");
    modKonyv.on("click", (event) => {
      event.preventDefault();
      let obj = {
        id: aktivID,
        cim: $("#cim").val(),
        kep: $("#kep").val(),
        ertekeles: $("#ertek").val(),
      };
      if (inputEllenorzes(obj)) {
        ajax.ajaxApiPost("/konyvek/" + obj.id, obj, () => {
          fetchKonyvek();
        });
      } else {
        inputHibaUzenet();
      }
    });
  }

  function fetchKonyvek(vegpont) {
    let konyvtarolo = $(".konyvek");
    let lista = new Konyvlist([]);
    $(".hiba-uzenet").hide();
    konyvtarolo.empty();
    ajax.ajaxApiGet("/konyvek", (konyvek) => {
      konyvek.forEach((konyv) => {
        lista.add(new Konyv(konyvtarolo, konyv.kep, konyv));
      });
      lista.megjelenit();
      lista.sorba();
    });
  }

  function inputEllenorzes(obj) {
    let mehet = true;
    for (const key in obj) {
      if (obj[key] == "") {
        console.log("üres");
        mehet = false;
      }
    }
    return mehet;
  }

  function inputHibaUzenet() {
    $(".hiba-uzenet").slideDown(500);
    setTimeout(() => {
      $(".hiba-uzenet").slideUp(500);
    }, 2000);
  }

  function menu() {
    form.hide();
    menuMegnyit();
    menuBezar();
  }

  function menuMegnyit() {
    let megnyit = $(".new_mod_del-open");
    megnyit.on("click", () => {
      form.slideDown(500);
    });
  }

  function menuBezar() {
    let bezar = $(".new_mod_del-close");
    bezar.on("click", () => {
      form.slideUp(500);
    });
  }

  function kereses() {
    let keresoMezo = $("#kereses");
    keresoMezo.on("input", (event) => {
      let keresendo = event.target.value;
      ajax.ajaxApiGet("/konyvek/" + keresendo, (eredmeny) => {
        let konyvtarolo = $(".konyvek");
        $(".hiba-uzenet").hide();
        konyvtarolo.empty();
        let lista = new Konyvlist([]);
        eredmeny.forEach((konyv) => {
          lista.add(new Konyv(konyvtarolo, konyv.kep, konyv));
        });
        lista.megjelenit();
        lista.sorba();
      });
    });
  }
});
