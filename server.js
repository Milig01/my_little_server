import http from 'http';
import {processing} from './processing.js';
import {films} from './films.js';
import {genres} from './genres.js';

let context = new Map([['films', films], ['genres', genres]]);

http.createServer(async (request, response) => {
    try{
        URLProcessing(request);
        
        let result = await processing.start.call(processing, request);
        
        response.end(result);
    } catch(err) {
        console.log(err.message);
        response.end(err.message);
    }
}).listen(3000);

function URLProcessing(request) {
    let route = request.url.split('/');

    //проверка URL на корректность
    if (route.length == 2 && route[1] == '') throw (new Error('Добро пожаловать!'));
    if (route.length > 3) throw (new Error('Ресурс не найден. Слишком много /'));
    if (route[1] != 'genres' && route[1] != 'films') throw (new Error('Некорректное название таблицы'));
    if (route.length == 3 && (isNaN(route[2]) || route[2] == '')) throw (new Error('id должен быть числом'));
    if (route.length == 2 && (request.method == 'PUT' || request.method == 'DELETE')) throw (new Error('Укажите id в запросе'));

    request.method += '_' + route[1];
    request['context'] = context.get(route[1]);

    if (route.length == 3) {
        request.method += '_id';
        request['id'] = +route[2];
    }
}