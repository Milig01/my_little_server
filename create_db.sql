-- CREATE DATABASE smallFilms;

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE films (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    year INTEGER CHECK (year > 1900 AND year < 2030)
);

CREATE TABLE filmsAndGenres (
    filmsId INTEGER REFERENCES films(id) ON DELETE CASCADE,
    genresId INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (filmsId, genresId)
);