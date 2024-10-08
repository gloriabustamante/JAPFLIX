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
        <button id="toggleDetalles" class="detailsButton"></button>
        <section id="informacionAdicional" class="additionalInfo" style="display: none;">
            <div class="infoContainer">
                <h3 class="addInfoHeading">Año de lanzamiento:</h3>
                <p class="addInfoData">${pelicula.release_date.split('-')[0]}</p>
                <h3 class="addInfoHeading">Duración:</h3>
                <p class="addInfoData">${pelicula.runtime} minutos</p>
                <h3 class="addInfoHeading">Presupuesto:</h3>
                <p class="addInfoData">${pelicula.budget.toLocaleString()}</p>
                <h3 class="addInfoHeading">Ganancias:</h3>
                <p class="addInfoData">${pelicula.revenue.toLocaleString()}</p>
            </div>
        </section>
    `;

    actualizarMenuDesplegable(pelicula);

    document.getElementById('toggleDetalles').addEventListener('click', () => {
        const informacionAdicional = document.getElementById('informacionAdicional');
        informacionAdicional.style.display = informacionAdicional.style.display === 'none' ? 'block' : 'none';
        document.getElementById('toggleDetalles').innerHTML = informacionAdicional.style.display === 'none' ? 'more' : '✖';
    });

    document.getElementById('cerrarDetalles').addEventListener('click', () => {
        const contenedorDetalles = document.getElementById('filmDetails');
        contenedorDetalles.style.display = 'none'; 
    });

    contenedorDetalles.style.display = 'block';
};

const actualizarMenuDesplegable = (pelicula) => {
    if (pelicula) {
        document.getElementById('dropdownYear').innerHTML = `Year: ${pelicula.release_date.split('-')[0]}`;
        document.getElementById('dropdownRuntime').innerHTML = `Runtime: ${pelicula.runtime} minutes`;
        document.getElementById('dropdownBudget').innerHTML = `Budget: ${pelicula.budget.toLocaleString()} USD`;
        document.getElementById('dropdownRevenue').innerHTML = `Revenue: ${pelicula.revenue.toLocaleString()} USD`;
    }
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
