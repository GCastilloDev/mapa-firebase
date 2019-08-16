firebase.initializeApp({
    apiKey: "AIzaSyCj4wyAWcrUeOEBMiArINCLq-6nd3Jv1X8",
    authDomain: "proyectousuario-cb5fd.firebaseapp.com",
    projectId: "proyectousuario-cb5fd"
});


//Variable global id
var id = 0;
var la = 0;
var lo = 0;

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

//Agregar documentos 
function guardar() {
    var latitud = document.getElementById('latitud').value;
    var longitud = document.getElementById('longitud').value;

    /*
    map.remove();
    map = L.map('map').setView([latitud,longitud], 17).addLayer(osm);
    L.marker([latitud, longitud])
    .addTo(map)
    .bindPopup('Tu ubicación.')
    .openPopup();
    */

    db.collection("maps").add({ //.add agrega un ID automatico a nuestro documento
        latitud: latitud,
        longitud: longitud,
        id: parseInt(id) + 1


    })
        .then(function (docRef) {

            console.log("Document written with ID: ", docRef.id); //Mensaje a consola

            latitud = document.getElementById('latitud').value = '';
            longitud = document.getElementById('longitud').value = '';
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });


}




//Leer documentos
var tabla = document.getElementById('tabla');
var contador = 0;
db.collection("maps").orderBy("id","desc").onSnapshot((querySnapshot) => { //Se sustituye get, por onSnapshot() que es un elemento de escucha

    console.log("Contador " + contador);
    contador++;
    //Mapa


    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);

        if (id < doc.data().id) {
            id = doc.data().id;
            la = doc.data().latitud;
            lo = doc.data().longitud;
        }

        tabla.innerHTML +=
            `
                            <tr>
                            <th scope="row">${doc.id}</th>
                            <td>${doc.data().id}</td>
                            <td>${doc.data().latitud}</td>
                            <td>${doc.data().longitud}</td>
                            <td class="center"><button class="btn-small waves-effect red" onclick="eliminar('${doc.id}')">Eliminar</button></td>
                            <td class="center"><button class="btn-small waves-effect yellow" onclick="editar('${doc.id}','${doc.data().latitud}','${doc.data().longitud}')">Editar</button></td>
                            </tr>
                            `
    });

    console.log("El id: " + id);
    console.log("La latitud es: " + la);
    console.log("La longitud es: " + lo);
   
      if (id > 0) {
        map.remove();
        map = L.map('map').setView([la, lo], 17).addLayer(osm);
        L.marker([la, lo])
            .addTo(map)
            .bindPopup('Yosi viajando...')
            .openPopup();
    }

})


//Borrar datos
function eliminar(id) {
    db.collection("maps").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

//Editar documentos
function editar(id, latitud, longitud) {

    document.getElementById('latitud').value = latitud;
    document.getElementById('longitud').value = longitud;

    var boton = document.getElementById('btnGuardar');
    boton.innerHTML = 'Editar';

    boton.onclick = function () {
        var usersRef = db.collection("maps").doc(id);

        //Variables para recuperar los datos del campo a actualizar 
        var latitud = document.getElementById('latitud').value;
        var longitud = document.getElementById('longitud').value;

        //Se actualizan los campos con el contenido de las variables
        return usersRef.update({
            latitud: latitud,
            longitud: longitud
        })
            .then(function () {
                console.log("Document successfully updated!");
                boton.innerHTML = 'Guardar';
                latitud = document.getElementById('latitud').value = '';
                longitud = document.getElementById('longitud').value = '';

                boton.onclick = guardar; //Si se pone guardar() ejecuta el método, y sin () solo referencia el método
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}



/*
function activarMapa() {
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
    var map = L.map('map').setView([18.148405, -94.473625], 17).addLayer(osm);
    L.marker([18.148405, -94.473625])
        .addTo(map)
        .bindPopup('La Catedral de la Habana.')
        .openPopup();
}
*/

/*
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
var map = L.map('map').setView([18.148455, -94.473766], 17).addLayer(osm);
L.marker([18.148455, -94.473766])
    .addTo(map)
    .bindPopup('Tu ubicación.')
    .openPopup();
*/
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
        var map = L.map('map').setView([18.048006, -94.401559], 18).addLayer(osm);
        L.marker([18.048006, -94.401559])
            .addTo(map)
            .bindPopup('Yosi viajando...')
            .openPopup();

