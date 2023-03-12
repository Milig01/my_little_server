import {films} from './films.js';
import {genres} from './genres.js';

class Processing {
    procFunctions = new Map([
        ['GET_films_id', films.GETId],
        ['GET_films', films.GET],
        ['POST_films', films.POST],
        ['PUT_films_id', films.PUTId],
        ['DELETE_films_id', films.DELETEId],
        ['GET_genres_id', genres.GETId],
        ['GET_genres', genres.GET],
        ['POST_genres', genres.POST],
        ['PUT_genres_id', genres.PUTId],
        ['DELETE_genres_id', genres.DELETEId],
    ]);

    async start(request) {
        let procFunction = this.procFunctions.get(request.method);

        let result = await procFunction.call(request.context, request);
        
        return result;
    }

    async dataLoad(request) {
        let data = [];

        for await (let chunk of request) {
            data.push(chunk);
        }

        data = data.join('');
        data = JSON.parse(data);

        if (this == films && !('name' in data)) throw (new Error('У фильмов должно быть свойство "name"'));
        if (this == genres && !('name' in data)) throw (new Error('У жанров должно быть свойство "name"'));

        return data;
    }

    getPropArrayFromObjArray(nameProperty, array) {
        let arr = [];

        for (let elem of array) {
            arr.push(elem[nameProperty]);
        }

        return arr;
    }
}

export let processing = new Processing();