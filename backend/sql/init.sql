-- Создание таблицы фильмов
CREATE TABLE IF NOT EXISTS films (
    id VARCHAR(50) PRIMARY KEY,
    rating INTEGER NOT NULL,
    director VARCHAR(255) NOT NULL,
    tags TEXT[] NOT NULL,
    image VARCHAR(500) NOT NULL,
    cover VARCHAR(500) NOT NULL,
    title VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Создание таблицы расписания
CREATE TABLE IF NOT EXISTS schedules (
    id VARCHAR(50) PRIMARY KEY,
    film_id VARCHAR(50) NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    daytime VARCHAR(50) NOT NULL,
    hall VARCHAR(50) NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    taken TEXT[] DEFAULT '{}',
    price INTEGER NOT NULL
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_schedules_film_id ON schedules(film_id);
CREATE INDEX IF NOT EXISTS idx_films_id ON films(id);