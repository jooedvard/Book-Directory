class Kedvenc {
  constructor(szulo, kep, adat) {
    this.adat = adat;
    this.elem = szulo;
    this.kep = kep;
    this.ID = this.adat.adat.ID;
    this.megjelenit();
    console.log(this);
  }

  megjelenit() {
    let { cim, ertekeles } = this.adat.adat;

    this.elem.append(
      `<img src="${this.kep}"/><span>${cim}</span><span>${ertekeles}</span><button class="torles">X</button>`
    );
    this.torles = this.elem.find(".torles");
    this.torles.css("visibility","hidden");

    this.elem.on("click", () => {
      this.elem.parent().find(".torles").css("visibility","hidden");
      this.torles.css("visibility","visible");
    });

    this.torles.on("click", () => {
      this.kattintas();
    });
  }

  kattintas() {
    let esemeny = new CustomEvent("kedvenctorles", { detail: this });
    window.dispatchEvent(esemeny);
  }
}
