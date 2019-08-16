//https://www.datos.gov.co/resource/g373-n3yy.json
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