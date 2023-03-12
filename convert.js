//Данный класс предназначен для громоздких строковый преобразований для запросов
class Convert {
    //метод формирует строку после выражения WHERE, где name - название столбца, array - массив значений
    //например: name = 'Фантастика' OR name = 'Ужасы'
    WHEREOr(name, array) {
        let expression = '';

        for (let elem of array) {
            if (typeof elem == 'string') {
                expression += `${name} = '${elem}' OR `;
            } else if (typeof elem == 'number') {
                expression += `${name} = ${elem} OR `;
            }
        }

        expression = expression.slice(0, -3);

        return expression;
    }
    //метод соединяет элементы массива и ставит между ними запятую и оборачивает в скобки
    //используется в следующем методе
    wrapInBrackets(array) {
        let str = '(';

        for (let elem of array) {
            if (typeof elem == 'string') {
                str += `'${elem}', `;
            } else if (typeof elem == 'number') {
                str += `${elem}, `;
            }
        }

        str = str.slice(0, -2) + ')';

        return str;
    }
    //соединяет скобки предыдущего метода и ставит между ними запятые
    //например VALUES (1, 2), (1, 3), (1, 5) - используется для занесения жанров в смежную таблицу
    bracketsJoin(mainId, array) {
        let arr = [];

        for (let elem of array) {
            arr.push( this.wrapInBrackets([mainId, elem.id]) );
        }

        let str = arr.join(', ');

        return str;
    }
    // разность массивов как множеств (array1/array2) массивы содержат объекты, у которых есть свойства id1, id2
    //например свойства id у жанров и genresid у смежной таблицы
    //используется для обновления жанров у фильмов
    subtract(array1, array2, id1, id2) {
        let result = [];

        label: for (let elem1 of array1) {
            for (let elem2 of array2) {
                if (elem1[id1] == elem2[id2]) continue label;
            }
            result.push( {id: elem1[id1]} );
        }

        return result;
    }
}

export let convert = new Convert();