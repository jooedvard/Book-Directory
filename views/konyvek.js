$(function () {
  let ajax = new Ajax();
  let form = $(".uj-konyv-form");
  
  let {ajaxApiDelete} = ajax;
  menu();
  ujKonyvFelvetele();
  konyvTorlese();
  fetchKonyvek();
  konyvControl();
  konyvModositasa();
  kereses();
  kedvenchezAd();

  let aktivID = 0;

  $(window).on("aktiv", (e) => {
    aktivID = e.detail.adat.ID;
    form.slideDown(500);
  });

  $(window).on("kedvenctorles", (event) => {
      let { detail } = event;
      ajaxApiDelete("/kedvencek",detail.ID,()=>{
        fetchKonyvek();
        let kep = $(".aktivkep").attr("src");
        let gomb = $(".uj-kedvenc");
        if(detail.kep==kep && gomb.attr("disabled")){
            gomb.removeClass("kedvencGomb");
            gomb.attr("disabled",false);
            
        }
      })
  });

  $(".logout").on("click", () => {
    ajax.ajaxApiGet("/logout", (adat) => {
      window.location = adat.redirect;
    });
  });

  ajax.ajaxApiGet("/logged", (a) => {
    let welcome = $(".welcome-text");
    console.log(a);
    welcome.find(".username").text(a);
  });

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
        $(".aktivkep").attr("src",obj.kep);
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
      

      ajax.ajaxApiGet("/kedvencek/", (adatok) => {
        let kedvencTomb = [];
        let kedvencek = lista.kedvencek(adatok);
        kedvencek.forEach((kedvenc) => {
          let konyv = lista.getKonyv_konyvID(kedvenc.konyvID);
          kedvencTomb.push(konyv);
        });

        kedvencLista(kedvencTomb);
      });

      
    });
  }

  function kedvencLista(kedvencek) {
    let listaElem = $(".kedvenc-lista");
    listaElem.empty();
    listaElem.append("<ul><h2>A Kedvenceid</h2></ul>");

    let lista = listaElem.find("ul");
    kedvencek.forEach((kedvenc) => {
      lista.append(`<li></li>`);
      new Kedvenc(lista.find("li:last"), kedvenc.kep, kedvenc);
    });
  }

  function inputEllenorzes(obj) {
    let mehet = true;
    console.log(obj)
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

  function kedvenchezAd() {
    let elem = $(".uj-kedvenc");
    elem.on("click", (event) => {
      event.preventDefault();
      ajax.ajaxApiPost("/kedvenc/add", { konyvId: aktivID }, () => {
        fetchKonyvek();
        elem.addClass("kedvencGomb");
        elem.attr("disabled",true);
      });
    });
  }

  function menu() {
    form.hide();
    menuMegnyit();
    menuBezar();
  }

  function menuMegnyit() {
    let megnyit = $(".new_mod_del-open");

    megnyit.on("click", () => {
      $("header").find(".welcome-text").hide();
     // lista.getkonyv(0).kedvenc();
      form.slideDown(500);
    });
  }

  function menuBezar() {
    let bezar = $(".new_mod_del-close");
    bezar.on("click", () => {
      $("header").find(".welcome-text").show();
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

        $(".lista").hide();
        $(".lista").slideDown(200);
      });
    });
  }
});
