const jatekosszamDiv = document.getElementById("number");
const namesLi = document.querySelector(".player-names").getElementsByTagName("li");
const moreOptionsP = document.querySelector("#more-options");
const gameMode = document.querySelector("#mode");
const nameScoreSideBar = document.querySelector("#name-score-game-tab");
const setExistsButtonS = document.querySelector("#set-exists");
const setShowButtonS = document.querySelector("#set-show");
const automaticS = document.querySelector("#automatic");

const startButton = document.querySelector(".start");
const backButton = document.querySelector("#back-button");
const vanSetButton = document.querySelector("#van-set-button");
const holVanSetButton = document.querySelector("#hol-van-set-button");

const title = document.querySelector(".title");
const optionSelect = document.querySelector(".option-select");
const gameSite = document.querySelector("#game");

const defaultNames = ["Játékos1", "Játékos2", "Játékos3", "Játékos4", "Játékos5", "Játékos6", "Játékos7", "Játékos8", "Játékos9", "Játékos10"];

let kivalasztaDB = 0;
let kartyaLentMost;
let kartyaLentOssz;
let holVanSet;
let tiltott = 0;

jatekosszamDiv.addEventListener('change', playerName);
moreOptionsP.addEventListener('click', moreOptionsVis);
gameMode.addEventListener('change', gameModeChange);
startButton.addEventListener('click', start);
backButton.addEventListener('click', back);
vanSetButton.addEventListener('click', vanSetButtonf);
holVanSetButton.addEventListener('click', holVanSetButtonf);

function playerName(){
    let jatekosszam = jatekosszamDiv.value;
    for (let i = 1; i<=namesLi.length; i++){
        if (i <= jatekosszam){
            namesLi[i-1].style.display = 'inline';
        }
        else{
            namesLi[i-1].style.display = 'none';
        }
    }
}

function moreOptionsVis(){
    let ul = document.querySelector(".more");
    if(ul.style.display === 'none'){
        ul.style.display = 'block';
    }
    else{
        ul.style.display = 'none'
    }
}

function gameModeChange(){
    let li = document.querySelector("#more-options-li")
    if (gameMode.value == 2){
        li.style.display = 'none';
    }
    else{
        li.style.display = 'list-item';
    }
}

function start(){
    title.style.display = "none";
    optionSelect.style.display = "none";
    gameSite.style.display = "block";

    if(gameMode.value == 2){
        vanSetButton.style.display = 'none';
        holVanSetButton.style.display = 'none';

    }
    else{
        if(setExistsButtonS.value == 0){
            vanSetButton.style.display = 'none';
            holVanSetButton.style.marginTop = "50px";
        }
        else{
            vanSetButton.style.display = 'inline-block';
            holVanSetButton.style.marginTop = "10px";
        }

        if(setShowButtonS.value == 0){
            holVanSetButton.style.display = 'none';
        }
        else{
            holVanSetButton.style.display = 'inline-block';
        }
    }

    let jatekosszam = jatekosszamDiv.value;
    let pArray = document.querySelector("#name-score-game-tab").getElementsByTagName('p');
    let userNames = document.querySelectorAll(".input-names");
    let displayNames = document.querySelectorAll(".names");
    let imgs = gameSite.querySelectorAll('img');
    

    for (let i=0; i<10; i++){
        if(i+1 <= jatekosszam){
            pArray[i].style.display = "block";
            if(userNames[i].value != ""){
                displayNames[i].innerHTML = userNames[i].value;
            }
            pArray[i].addEventListener('click', kivalasztasEmber);
        }
        else{
            pArray[i].style.display = "none";
        }
    }

    if (jatekosszam == 1){
        pArray[0].classList.add('selected');
        pArray[0].removeEventListener('click', kivalasztasEmber);
    }

    shuffle(deck);
    console.log(deck);

    for (let i=0; i<12; i++){
        imgs[i].src = deck[i].src;
        imgs[i].dataset.Forma = deck[i].Forma;
        imgs[i].dataset.Szin = deck[i].Szin;
        imgs[i].dataset.Szam = deck[i].Szam;
        imgs[i].dataset.Ures = "Nem";
        imgs[i].addEventListener('click', kivalasztasKartya);
    }
    kartyaLentMost = 12;
    kartyaLentOssz = 12;

    
}

function back(){
    title.style.display = "block";
    optionSelect.style.display = "block";
    gameSite.style.display = "none";

    let pArray = document.querySelector("#name-score-game-tab").getElementsByTagName('p');
    let imgs = gameSite.querySelectorAll('img');
    for (let i = 0; i<jatekosszamDiv.value;i++){
        if (pArray[i].classList.contains('selected')){
            pArray[i].classList.remove('selected');
        }
    }
    for (let i = 0; i<imgs.length; i++){
        if(imgs[i].classList.contains('sleceted')){
            imgs[i].classList.remove('selected');
        }
        if(imgs[i].classList.contains('set')){
            imgs[i].classList.remove('set');
        }
    }
}

function kivalasztasKartya(){
    let t = false;
    let kivJatekos;
    let imgs = gameSite.querySelectorAll('img');
    let pArray = document.querySelector("#name-score-game-tab").getElementsByTagName('p');
    for (let i = 0; i<jatekosszamDiv.value;i++){
        if (pArray[i].classList.contains('selected')){
            t = true;
            kivJatekos = pArray[i];
            break;
        }
    }
    if(!t){
        alert("Előbb válassz egy játékost!");
    }
    else{
        if(this.classList.contains('selected')){
            this.classList.remove('selected');
            kivalasztaDB--;
        }
        else{
            this.classList.add('selected');
            kivalasztaDB++;
            if(kivalasztaDB == 3){
                let set = isSet();
                if(set){
                    for(let i=0; i<pArray.length; i++){
                        if(pArray[i].classList.contains('tiltott')){
                            pArray[i].classList.remove('tiltott');
                            pArray[i].addEventListener('click', kivalasztasEmber);
                        }
                    }
                    let score = kivJatekos.querySelector(".points").innerHTML;
                    score++;
                    kivJatekos.querySelector(".points").innerHTML = score;
                    if (jatekosszamDiv.value != 1){
                        kivJatekos.classList.remove('selected');
                    }
                    if(kartyaLentOssz!=27){
                        for (let i=0; i<kartyaLentMost; i++){
                            if (imgs[i].classList.contains('selected')){
                                imgs[i].src = deck[kartyaLentOssz].src
                                imgs[i].dataset.Forma = deck[kartyaLentOssz].Forma;
                                imgs[i].dataset.Szin = deck[kartyaLentOssz].Szin;
                                imgs[i].dataset.Szam = deck[kartyaLentOssz].Szam;
                                imgs[i].classList.remove('selected');
                                kartyaLentOssz++;
                            }
                            if(imgs[i].classList.contains('set')){
                                imgs[i].classList.remove('set');
                            }
                        }
                    }else{
                        for (let i=0; i<kartyaLentMost; i++){
                            if (imgs[i].classList.contains('selected')){
                                imgs[i].src = "assets/empty.png";
                                imgs[i].classList.remove('selected');
                                delete imgs[i].dataset.Forma;
                                delete imgs[i].dataset.Szam;
                                delete imgs[i].dataset.Szin;
                                imgs[i].removeEventListener('click', kivalasztasKartya);
                                imgs[i].dataset.Ures = "Igen";
                            }
                        }
                        if(!setExists()){
                            if(jatekosszamDiv.value == 1){
                                alert(`Játék vége pont: ${kivJatekos.querySelector(".points").innerHTML}`);
                                back();
                            }else{
                                let max = 0;
                                let neve;
                                for(let i=0; i<jatekosszamDiv.value; i++){
                                    if (pArray[i].querySelector(".points").innerHTML > max){
                                        max = pArray[i].querySelector(".points").innerHTML;
                                        neve = pArray[i].querySelector(".names").innerHTML;
                                    }
                                }
                                alert(`Játék vége!\nLegjobb játékos: ${neve}\nPontja: ${max}`);
                                back();
                            }
                            
                        }
                    }
                    console.log(kartyaLentOssz);
                    
                }
                else{
                    alert("Nem volt SET! -1 pont");
                    let score = kivJatekos.querySelector(".points").innerHTML;
                    if (score>0){
                        score--;
                        kivJatekos.querySelector(".points").innerHTML = score;
                    }
                    if (jatekosszamDiv.value != 1){
                        kivJatekos.classList.remove('selected');
                    }
                    for (let i=0; i<kartyaLentMost; i++){
                        if (imgs[i].classList.contains('selected')){
                            imgs[i].classList.remove('selected');
                            
                        }
                    }
                    kivJatekos.classList.add('tiltott');
                    kivJatekos.removeEventListener('click', kivalasztasEmber);
                    tiltott++;
                    if(jatekosszamDiv.value == tiltott){
                        for(let i=0; i<jatekosszamDiv.value; i++){
                            pArray[i].classList.remove('tiltott');
                            pArray[i].addEventListener('click', kivalasztasEmber);
                        }
                        tiltott = 0;
                    }
                }
                kivalasztaDB = 0;
            }
    
        }
    }
}

function isSet(){
    let comp = [];
    let imgs = gameSite.querySelectorAll('img');
    for (let i=0; i<kartyaLentMost; i++){
        if (imgs[i].classList.contains('selected')){
            comp.push(imgs[i]);
        }
    }
    let szamBool = false;
    let formaBool = false;
    let szinBool = false;

    //szamcheck
    if(comp[0].dataset.Szam == comp[1].dataset.Szam){
        if (comp[2].dataset.Szam == comp[0].dataset.Szam){
            szamBool = true;
        }
    }
    else{
        if(comp[2].dataset.Szam != comp[0].dataset.Szam && comp[2].dataset.Szam != comp[1].dataset.Szam){
            szamBool = true;
        }
    }

    //formacheck
    if(comp[0].dataset.Forma == comp[1].dataset.Forma){
        if (comp[2].dataset.Forma == comp[0].dataset.Forma){
            formaBool = true;
        }
    }
    else{
        if(comp[2].dataset.Forma != comp[0].dataset.Forma && comp[2].dataset.Forma != comp[1].dataset.Forma){
            formaBool = true;
        }
    }

    //szincheck
    if(comp[0].dataset.Szin == comp[1].dataset.Szin){
        if (comp[2].dataset.Szin == comp[0].dataset.Szin){
            szinBool = true;
        }
    }
    else{
        if(comp[2].dataset.Szin != comp[0].dataset.Szin && comp[2].dataset.Szin != comp[1].dataset.Szin){
            szinBool = true;
        }
    }

    return szamBool && formaBool && szinBool;
}

function setExists(){
    let imgs = gameSite.querySelectorAll('img');
    let t = false;
    let f, sza, szi;
    let elso, masodik, harmadik;
    for (let i = 0; i<kartyaLentMost-2; i++){
        elso = imgs[i];
        if(elso.dataset.Ures == "Nem"){
            for(let j=i+1; j<kartyaLentMost-1; j++){
                masodik = imgs[j];
                if(masodik.dataset.Ures == "Nem"){
                    for(let k=j+1; k<kartyaLentMost; k++){
                        harmadik = imgs[k];
                        if(harmadik.dataset.Ures == "Nem"){
                            if (elso.dataset.Forma == masodik.dataset.Forma){
                                if(harmadik.dataset.Forma == elso.dataset.Forma){
                                    f = true;
                                }
                                else{
                                    f = false;
                                }
                            }else{
                                if(harmadik.dataset.Forma != elso.dataset.Forma && harmadik.dataset.Forma != masodik.dataset.Forma){
                                    f = true;
                                }
                                else{
                                    f = false;
                                }
                            }
                            if (elso.dataset.Szam == masodik.dataset.Szam){
                                if(harmadik.dataset.Szam == elso.dataset.Szam){
                                    sza = true;
                                }
                                else{
                                    sza = false;
                                }
                            }else{
                                if(harmadik.dataset.Szam != elso.dataset.Szam && harmadik.dataset.Szam != masodik.dataset.Szam){
                                    sza = true;
                                }
                                else{
                                    sza = false;
                                }
                            }
                            if (elso.dataset.Szin == masodik.dataset.Szin){
                                if(harmadik.dataset.Szin == elso.dataset.Szin){
                                    szi = true;
                                }
                                else{
                                    szi = false;
                                }
                            }else{
                                if(harmadik.dataset.Szin != elso.dataset.Szin && harmadik.dataset.Szin != masodik.dataset.Szin){
                                    szi = true;
                                }
                                else{
                                    szi = false;
                                }
                            }
                            if(f && sza && szi){
                                t = true;
                                holVanSet = [elso, masodik, harmadik];
                                break;
                            }
                        }
                        
                    }
                }
                
                if(t){
                    break;
                }
            }
        }
        
        if(t){
            break;
        }
    }
    return t;
}

function kivalasztasEmber(){
    if(this.classList.contains('selected')){
        this.classList.remove('selected');
    }
    else{
        let pArray = document.querySelector("#name-score-game-tab").getElementsByTagName('p');
        for (let i=0; i<jatekosszamDiv.value; i++){
            if (pArray[i].classList.contains('selected')){
                pArray[i].classList.remove('selected');
            }
        }
        this.classList.add('selected');
    }
}

function vanSetButtonf(){
    let t = setExists();
    if(t){
        alert("Van SET!");
    }
    else{
        alert("Nincs SET!");
    }
}

function holVanSetButtonf(){
    let t = setExists();
    if(t){
        for(let i = 0; i<3; i++){
            holVanSet[i].classList.add('set');
        }
    }
    else{
        alert("Nincs SET!");
    }
}

let szam = [1, 2, 3];
let forma = ["ovalis", "hullamos", "rombusz"];
let szin = ["piros", "zold", "lila"];

let deck = getDeck();

function getDeck(){
    let deck = new Array();

    for(let i = 0; i < szam.length; i++)
	{
		for(let j = 0; j < forma.length; j++)
		{
            for(let k = 0; k < szin.length; k++){
                let card = {Szin: szin[k], Forma: forma[j], Szam: szam[i]};
                if(card.Szin == "piros"){
                    let sz = "r";
                    if (card.Forma == "ovalis"){
                        let f = "P";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg';
                        }
                    }
                    else if (card.Forma == "hullamos"){
                        let f = "S";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg';
                        }
                    }
                    else{
                        let f = "D";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg'; 
                        }
                    }
                }
                else if(card.Szin == "zold"){
                    let sz = "g";
                    if (card.Forma == "ovalis"){
                        let f = "P";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg';
                        }
                    }
                    else if (card.Forma == "hullamos"){
                        let f = "S";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg';
                        }
                    }
                    else{
                        let f = "D";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg'; 
                        }
                    }
                }
                else{
                    let sz = "p"
                    if (card.Forma == "ovalis"){
                        let f = "P";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg';
                        }
                    }
                    else if (card.Forma == "hullamos"){
                        let f = "S";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg';
                        }
                    }
                    else{
                        let f = "D";
                        if (card.Szam == 1){
                            card.src = 'assets/1O' + sz + f + '.svg';
                        }
                        else if (card.Szam == 2){
                            card.src = 'assets/2O' + sz + f + '.svg';
                        }
                        else{
                            card.src = 'assets/3O' + sz + f + '.svg'; 
                        }
                    }
                }
                deck.push(card);
            }
			
		}
	}

	return deck;
}

function shuffle(deck)
{
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

