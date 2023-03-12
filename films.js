import {pool} from './sql.js';
import {convert} from './convert.js';
import {processing} from './processing.js';

class Films {
    async GETId(request) {
        let result = await pool.query(`SELECT * FROM films WHERE id = ${request.id}`);

        if (result.rows.length == 0) throw (new Error('Фильм не найден'));

        result = result.rows[0];

        let genres = await pool.query(`SELECT * FROM filmsandgenres
        JOIN genres ON filmsandgenres.genresid = genres.id
        WHERE filmsandgenres.filmsid = ${request.id}`);

        let genreNames = processing.getPropArrayFromObjArray('name', genres.rows);

        result['genres'] = genreNames;

        return JSON.stringify(result);
    }

    async GET(request) {
        let films = await pool.query('SELECT * FROM films');

        if (films.rows.length == 0) throw (new Error('Фильмы не найдены'));
        
        let result = '';

        for (let elem of films.rows) {
            request['id'] = elem.id;

            let str = await this.GETId(request);

            result += str + '\n';
        }

        return result;
    }

    async POST(request) {
        let data = await processing.dataLoad.call(this, request);

        let result = await pool.query(`INSERT INTO films (name, year)
        VALUES ($1, $2) RETURNING *`, [data.name, data.year]);
        result = result.rows[0];

        if (!('genres' in data)) return JSON.stringify(result);
        if (!(data.genres instanceof Array)) return JSON.stringify(result);
        if (data.genres.length == 0) return JSON.stringify(result);

        let condition = convert.WHEREOr('name', data.genres);

        let genres = await pool.query(`SELECT * FROM genres WHERE ${condition}`);

        if (genres.rows.length == 0) return JSON.stringify(result);

        let values = convert.bracketsJoin.call(convert, result.id, genres.rows);

        await pool.query(`INSERT INTO filmsandgenres (filmsid, genresid) VALUES ${values}`);

        return JSON.stringify(result);
    }

    async PUTId(request) {
        let data = await processing.dataLoad.call(this, request);

        let result = await pool.query(`UPDATE films SET name = $1, year = $2 WHERE id = $3 RETURNING *`,
        [data.name, data.year, request.id]);

        if (result.rows.length == 0) throw (new Error('Фильм не найден'));

        result = result.rows[0];

        if (!('genres' in data)) return JSON.stringify(result);
        if (!(data.genres instanceof Array)) return JSON.stringify(result);
        if (data.genres.length == 0) return JSON.stringify(result);

        let condition = convert.WHEREOr('name', data.genres);

        let genres = await pool.query(`SELECT * FROM genres WHERE ${condition}`);
        let existingGenres = await pool.query(`SELECT * FROM filmsandgenres WHERE filmsid = $1`, [request.id]);

        let addGenres = convert.subtract(genres.rows, existingGenres.rows, 'id', 'genresid');
        let deleteGenres = convert.subtract(existingGenres.rows, genres.rows, 'genresid', 'id');

        if (addGenres.length != 0) { 
            let values = convert.bracketsJoin.call(convert, request.id, addGenres);
            await pool.query(`INSERT INTO filmsandgenres (filmsid, genresid) VALUES ${values}`);
        }

        if (deleteGenres.length != 0) {
            let idArray = processing.getPropArrayFromObjArray('id', deleteGenres);

            condition = convert.WHEREOr('genresid', idArray);
            await pool.query(`DELETE FROM filmsandgenres WHERE filmsid = ${request.id} AND (${condition})`);
        }

        return JSON.stringify(result);
    }

    async DELETEId(request) {
        let result = await pool.query(`DELETE FROM films WHERE id = ${request.id} RETURNING *`);

        if (result.rows.length == 0) throw (new Error('Фильм не найден'));

        result = result.rows[0];

        return JSON.stringify(result);
    }
}

export let films = new Films();