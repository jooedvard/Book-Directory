class Konyvlist {
  constructor(tomb) {
    this.konyvek = tomb;
  }

  getkonyv(index) {
    return this.konyvek[index];
  }

  add(konyv) {
    this.konyvek.push(konyv);
  }

  megjelenit() {
    this.konyvek.forEach((konyv) => {
      konyv.megjelenit();
    });
  }

  getKonyv_konyvID(ID) {
    return this.konyvek.find((konyv) => {
      return konyv.adat.ID == ID;
    });
  }

  kedvencek(kedvencek) {
    this.kedvencek = [];
    this.konyvek.forEach((konyv) => {
      kedvencek.forEach((konyv2) => {
        if (konyv.adat.ID == konyv2.konyvID) {
          konyv.isKedvenc = true;
          this.kedvencek.push(konyv);
        }
      });
    });
    return kedvencek;
  }

  osszesKedvenc() {
    return this.kedvencek;
  }

  sorba() {
    let section = $(".lista");
    section.empty();

    this.konyvek.sort(function compare(a, b) {
      let egyikCim = a.adat.cim;
      let masikCim = b.adat.cim;
      if (egyikCim < masikCim) {
        return -1;
      }
      if (egyikCim > masikCim) {
        return 1;
      }
      return 0;
    });

    let betuk = new Set();
    this.konyvek.forEach((konyv) => {
      let { cim } = konyv.adat;
      let elso_betu = cim.charAt(0);
      betuk.add(elso_betu);
    });

    for (const iterator of betuk) {
      section.append(`<ul><h2>${iterator}</h2></ul>`);
      this.konyvek.forEach((konyv) => {
        let { cim } = konyv.adat;
        let elso_betu = cim.charAt(0);
        if (iterator == elso_betu) {
          section.find("ul:last").append(`<li>${cim}</li>`);
        }
      });
    }
  }

  ki() {
    console.log(this);
  }
}
