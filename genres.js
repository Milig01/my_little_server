import {pool} from './sql.js';
import {processing} from './processing.js';

class Genres {
    async GETId(request) {
        let result = await pool.query(`SELECT * FROM genres WHERE id = ${request.id}`);

        if (result.rows.length == 0) throw (new Error('Жанр не найден'));

        result = result.rows[0];

        let films = await pool.query(`SELECT * FROM filmsandgenres
        JOIN films ON filmsandgenres.filmsid = films.id
        WHERE filmsandgenres.genresid = ${request.id}`);

        let filmNames = processing.getPropArrayFromObjArray('name', films.rows);

        result['films'] = filmNames;

        return JSON.stringify(result);
    }

    async GET(request) {
        let result = await pool.query('SELECT * FROM genres');

        if (result.rows.length == 0) throw (new Error('Жанры не найдены'));

        result = result.rows;
        
        return JSON.stringify(result);
    }

    async POST(request) {
        let data = await processing.dataLoad.call(this, request);

        let result = await pool.query(`INSERT INTO genres (name)
        VALUES ($1) RETURNING *`, [data.name]);

        result = result.rows[0];

        return JSON.stringify(result);
    }

    async PUTId(request) {
        let data = await processing.dataLoad.call(this, request);

        let result = await pool.query(`UPDATE genres SET name = $1 WHERE id = $2 RETURNING *`, [data.name, request.id]);

        if (result.rows.length == 0) throw (new Error('Жанр не найден'));

        result = result.rows[0];

        return JSON.stringify(result);
    }

    async DELETEId(request) {
        let result = await pool.query(`DELETE FROM genres WHERE id = ${request.id} RETURNING *`);

        if (result.rows.length == 0) throw (new Error('Жанр не найден'));

        result = result.rows[0];

        return JSON.stringify(result);
    }
}

export let genres = new Genres();