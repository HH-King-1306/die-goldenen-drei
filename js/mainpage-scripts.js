//////Elemente in Array packen
const arrRooms = [
    document.querySelector('#SvgjsPolygon1014'),
    document.querySelector('#SvgjsPolygon1015'),
    document.querySelector('#SvgjsPolygon1016'),
    document.querySelector('#SvgjsPolygon1017'),
    document.querySelector('#SvgjsPolygon1018'),
    document.querySelector('#SvgjsPolygon1020'),
    document.querySelector('#SvgjsPolygon1021'),
    document.querySelector('#SvgjsPolygon1022'),
    document.querySelector('#SvgjsPolygon1025'),
    document.querySelector('#SvgjsPolygon1026'),
    document.querySelector('#SvgjsPolygon1027'),
    document.querySelector('#SvgjsPolygon1028'),
    document.querySelector('#SvgjsPolygon1030'),
    document.querySelector('#SvgjsPolygon1031'),
    document.querySelector('#SvgjsPolygon1033'),
    document.querySelector('#SvgjsPolygon1034'),
    document.querySelector('#SvgjsPolygon1035')
];

//Page Onload Event Check Roomstatus//

window.addEventListener('load', checkRoomStatus);

function checkRoomStatus() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'zimmertest.php');
    xhr.send();
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {
            let arrJSON = JSON.parse(xhr.responseText);
            let i = 0;
            arrJSON.map((temp) => {
                setAttribute(temp, i);
                i++;
            });
        }
    };
}

//Event + Function wenn Gebäude oder Etage neu ausgewählt werden
let elReiterGebaeude = document.querySelector('#gebaeudeReiter');
let elReiterEtage = document.querySelector('#etageReiter');

elReiterGebaeude.addEventListener('change', refresh);
elReiterEtage.addEventListener('change', refresh);


function refresh() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'zimmertest.php');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`gebaeude=${elReiterGebaeude.value}&etage=${elReiterEtage.value}`);
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

            let arrJSON = JSON.parse(xhr.responseText);
            let i = 0;
            arrJSON.map((temp) => {
                setAttribute(temp, i);
                i++
            });
        }
    };
}

////////////////////Ajax Abfragen, wenn man ein Zimmer anklickt
//Hier Verbindung zu den unterschiedlichen .html-Dateien.

let elModal = document.querySelector(".modal");

function openModalFree(e) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'modalBox.html');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            elModal.innerHTML = xhr.responseText;
            openModal();
            showRoomInModal(e);
        }
    };
}

function openModalBusy(e) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'roomBusy.html');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            elModal.innerHTML = xhr.responseText;
            openModal();
            showRoomInModal(e);
        }
    };
}

function openModal() {
    document.querySelector('.btn.btn-secondary').addEventListener('click', hideInfo);
    elModal.style.display = 'block';
}


function hideInfo() {
    elModal.style.display = 'none';
}


function showRoomInModal(e) {
    const zimmerNrAnzeigeModalBox = document.querySelector('.zimmerNrAnzeige');
    zimmerNrAnzeigeModalBox.innerHTML = e.getAttribute('room');

    let zimmerNr = e.getAttribute('room');


    if (e.getAttribute('fill') === '#8B0000') {
        let xhrBusy = new XMLHttpRequest();
        xhrBusy.open('POST', 'roomBusyOutput.php');
        xhrBusy.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhrBusy.send(`zimmerNr=${zimmerNr}`);
        xhrBusy.onreadystatechange = function () {
            if (xhrBusy.readyState === 4 && xhrBusy.status === 200) {
                let rueckWert = JSON.parse(xhrBusy.responseText);
                console.log(rueckWert);
                if (rueckWert) {
                    document.querySelector('#anredeBuchungBusy').setAttribute('placeholder', rueckWert.Anrede);
                    document.querySelector('#vornameBuchungBusy').setAttribute('placeholder', rueckWert.Vorname);
                    document.querySelector('#nachnameBuchungBusy').setAttribute('placeholder', rueckWert.Nachname);
                    document.querySelector('#strasseBuchungBusy').setAttribute('placeholder', rueckWert.Strasse);
                    document.querySelector('#hausnummerBuchungBusy').setAttribute('placeholder', rueckWert.Hausnr);
                    document.querySelector('#postleitzahlBuchungBusy').setAttribute('placeholder', rueckWert.PLZ);
                    document.querySelector('#ortBuchungBusy').setAttribute('placeholder', rueckWert.Ort);
                    document.querySelector('#landBuchungBusy').setAttribute('placeholder', rueckWert.Land);
                    document.querySelector('#telefonNrBusy').setAttribute('placeholder', rueckWert.Telefon);
                    document.querySelector('#emailAddyBusy').setAttribute('placeholder', rueckWert.Email);
                    document.querySelector('#inputDatumVonBusy').value = rueckWert.DatumVon;
                    document.querySelector('#inputDatumBisBusy').value = rueckWert.DatumBis;
                }
            }
        };
    } else {
        const submitButtonInModal = document.querySelector('.btn.btn-primary');
        submitButtonInModal.setAttribute('value', e.getAttribute('room'));
    }
}


function setAttribute(temp, i) {
    arrRooms[i].setAttribute('room', temp.ZimmerNr);

    if (temp.Status === 0) {
        arrRooms[i].setAttribute('fill', 'green');
        arrRooms[i].setAttribute('fill-opacity', '1');
        arrRooms[i].addEventListener('click', function () {
            openModalFree(this);
        });

    } else if (temp.Status === 1) {
        arrRooms[i].setAttribute('fill', '#8B0000');
        arrRooms[i].setAttribute('fill-opacity', '1');
        arrRooms[i].addEventListener('click', function () {
            openModalBusy(this);
        });
    }

    i === 0 && arrRooms[i].getAttribute('fill') === 'green' ? document.querySelector('#SvgjsPolygon1032').setAttribute('fill', 'green') : "";
    i === 0 && arrRooms[i].getAttribute('fill') === '#8B0000' ? document.querySelector('#SvgjsPolygon1032').setAttribute('fill', '#8B0000') : "";

    i === 3 && arrRooms[i].getAttribute('fill') === 'green' ? document.querySelector('#SvgjsPolygon1029').setAttribute('fill', 'green') : "";
    i === 3 && arrRooms[i].getAttribute('fill') === '#8B0000' ? document.querySelector('#SvgjsPolygon1029').setAttribute('fill', '#8B0000') : "";

    i === 6 && arrRooms[i].getAttribute('fill') === 'green' ? document.querySelector('#SvgjsPolygon1024').setAttribute('fill', 'green') : "";
    i === 6 && arrRooms[i].getAttribute('fill') === '#8B0000' ? document.querySelector('#SvgjsPolygon1024').setAttribute('fill', '#8B0000') : "";

    i === 10 && arrRooms[i].getAttribute('fill') === 'green' ? document.querySelector('#SvgjsPolygon1019').setAttribute('fill', 'green') : "";
    i === 10 && arrRooms[i].getAttribute('fill') === '#8B0000' ? document.querySelector('#SvgjsPolygon1019').setAttribute('fill', '#8B0000') : "";

}
