class Konyv {
  constructor(szulo, kep, adat) {
    this.szulo = szulo;
    this.kep = kep;
    this.adat = adat;
    
  }

  megjelenit() {
    let kep = document.createElement("img");
    let div = document.createElement("div");
    this.szulo.append(div);
    this.szulo.append(kep);
    this.szulo.find(div).append(kep);
    
    this.elem = this.szulo.find(kep);
    this.elem.addClass("kep");
    
    kep.src = this.kep;

    this.elem.on("click",()=>{
      
      $("#cim").val(this.adat.cim)
      $("#kep").val(this.adat.kep)
      $("#ertek").val(this.adat.ertekeles)
      $(".aktivkep").attr("src",this.kep)
      
      this.kedvenc();
      this.kattintas();
    
    })
  }

  kedvenc(){
    if(this.isKedvenc){
      $(".uj-kedvenc").attr("disabled",true);
      $(".uj-kedvenc").addClass("kedvencGomb");

    }
    else{
      $(".uj-kedvenc").attr("disabled",false);
      $(".uj-kedvenc").removeClass("kedvencGomb");
    }
  }

  kattintas(){
    let esemeny = new CustomEvent("aktiv",{detail:this});
    window.dispatchEvent(esemeny);
    console.log(esemeny)
  }

}
