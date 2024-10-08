const obtenerPeliculas = async () => {
    try {
        const respuesta = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        if (!respuesta.ok) throw new Error('Error en la respuesta de la red');
        const peliculas = await respuesta.json();
        return peliculas;
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        return [];
    }
};

const filtrarPeliculas = (peliculas, consulta) => {
    return peliculas.filter(pelicula => {
        const consultaMinuscula = consulta.toLowerCase();
        const nombresGeneros = pelicula.genres.map(genre => genre.name.toLowerCase()).join(', ');
        return pelicula.title.toLowerCase().includes(consultaMinuscula) ||
               pelicula.tagline.toLowerCase().includes(consultaMinuscula) ||
               nombresGeneros.includes(consultaMinuscula) ||
               pelicula.overview.toLowerCase().includes(consultaMinuscula);
    });
};

const mostrarPeliculas = (peliculas) => {
    const contenedor = document.getElementById('lista');
    contenedor.innerHTML = '';
    
    peliculas.forEach(pelicula => {
        const articulo = document.createElement('article');
        const estrellas = '★'.repeat(Math.round(pelicula.vote_average)) + '☆'.repeat(10 - Math.round(pelicula.vote_average));
        articulo.innerHTML = `
            <h2>${pelicula.title}</h2>
            <p>${pelicula.tagline}</p>
            <p class="estrellas">${estrellas}</p>
        `;
        contenedor.appendChild(articulo);

        articulo.addEventListener('click', () => mostrarDetallesPelicula(pelicula));
    });
};

const mostrarDetallesPelicula = (pelicula) => {
    const contenedorDetalles = document.getElementById('filmDetails');
    contenedorDetalles.innerHTML = '';

    const nombresGeneros = pelicula.genres.map(genre => genre.name).join(', ');

    contenedorDetalles.innerHTML = `
        <div class="detailsHeader">
            <h2>${pelicula.title}</h2>
            <button id="cerrarDetalles" class="detailsButton">✖</button>
        </div>
        <p>${pelicula.overview}</p>
        <p>Géneros:${nombresGeneros}</p>
        <button id="toggleDetalles" class="detailsButton">Más información</button>
        <section id="informacionAdicional" class="additionalInfo" style="display: none;">
            <div class="infoContainer">
                <p class="addInfoData">Año de lanzamiento:${pelicula.release_date.split('-')[0]}</p>
                <p class="addInfoData"> Duración:${pelicula.runtime}</p>
                <p class="addInfoData">Presupuesto:${pelicula.budget.toLocaleString()}</p>
                <p class="addInfoData">Ganancias:${pelicula.revenue.toLocaleString()}</p>
            </div>
        </section>
    `;

    document.getElementById('toggleDetalles').addEventListener('click', () => {
        const informacionAdicional = document.getElementById('informacionAdicional');
        informacionAdicional.style.display = informacionAdicional.style.display === 'none' ? 'block' : 'none';
        document.getElementById('toggleDetalles').innerHTML = informacionAdicional.style.display === 'none' ? 'Más información' : '✖';
    });

    document.getElementById('cerrarDetalles').addEventListener('click', () => {
        const contenedorDetalles = document.getElementById('filmDetails');
        contenedorDetalles.style.display = 'none'; 
    });

    contenedorDetalles.style.display = 'block';
};

const inicializarBusqueda = (peliculas) => {
    const barraBusqueda = document.querySelector('#inputBuscar');

    barraBusqueda.addEventListener('input', function () {
        const consulta = barraBusqueda.value.trim();
        const peliculasFiltradas = consulta ? filtrarPeliculas(peliculas, consulta) : [];
        mostrarPeliculas(peliculasFiltradas);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    obtenerPeliculas().then(peliculas => {
        inicializarBusqueda(peliculas);
    });
});
