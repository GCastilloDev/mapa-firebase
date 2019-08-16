firebase.initializeApp({
    apiKey: "AIzaSyCj4wyAWcrUeOEBMiArINCLq-6nd3Jv1X8",
    authDomain: "proyectousuario-cb5fd.firebaseapp.com",
    projectId: "proyectousuario-cb5fd"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


//Agregar documentos 
function guardar() {
    var latitud = document.getElementById('latitud').value;
    var longitud = document.getElementById('longitud').value;
    db.collection("maps").add({ //.add agrega un ID automatico a nuestro documento
        latitud: latitud,
        longitud: longitud
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
db.collection("maps").onSnapshot((querySnapshot) => { //Se sustituye get, por onSnapshot() que es un elemento de escucha
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        tabla.innerHTML +=
            `
                            <tr>
                            <th scope="row">${doc.id}</th>
                            <td>${doc.data().latitud}</td>
                            <td>${doc.data().longitud}</td>
                            <td class="center"><button class="btn-small waves-effect red" onclick="eliminar('${doc.id}')">Eliminar</button></td>
                            <td class="center"><button class="btn-small waves-effect yellow" onclick="editar('${doc.id}','${doc.data().latitud}','${doc.data().longitud}')">Editar</button></td>
                            </tr>
                            `
    });
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

//Dibujar mapa
let lugaresInfo = [];
const conseguirLugares = () => {
    fetch('https://www.datos.gov.co/resource/g373-n3yy.json')
    .then(response => response.json())
    .then(lugares =>{
        console.log(lugares)
        
        lugares.forEach(lugar => {
            let lugarInfo = {
                posicion:{ lat:lugar.punto.coordinates[1],lng:lugar.punto.coordinates[0]},
                nombre:lugar.nombre_sede
            }

            lugaresInfo.push(lugarInfo)
        });
        if( navigator.geolocation){
            navigator.geolocation.getCurrentPosition(usuarioUbicacion =>{
                let ubicacion = {
                    lat:usuarioUbicacion.coords.latitude,
                    lng:usuarioUbicacion.coords.longitude
                }
                dibujarMapa(ubicacion)
            })
        }

    })
}

const dibujarMapa = (obj) => {
    let mapa = new google.maps.Map(document.getElementById('mapa'),{
        center: obj,
        zoom: 4
    })
    let marcadorUsuario = new google.maps.Marker({
        position:obj,
        title:'Tu ubicación'
    })

    marcadorUsuario.setMap(mapa)
    let marcadores = lugaresInfo.map(lugar =>{
        return new google.maps.Marker({
            position:lugar.posicion,
            title:lugar.nombre,
            map:mapa
        })
    })
}
conseguirLugares();