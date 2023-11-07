CREATE TABLE sessions(
    session_id SERIAL PRIMARY KEY,
    session_user_count INT DEFAULT 1,
    rounds INT NOT NULL,
    forfeit VARCHAR(250) NOT NULL,
    phase INT DEFAULT 1
);

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    socket_id INT NOT NULL,
    session_id INT NOT NULL,
    user_name VARCHAR(20) NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE questions(
    session_id INT,
    user_id INT,
    round INT,
    question VARCHAR(100) NOT NULL,
    answer_id INT,
    guess_id INT,
    forfeit_id INT,
    PRIMARY KEY (session_id, user_id, round),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (answer_id) REFERENCES users(user_id),
    FOREIGN KEY (guess_id) REFERENCES users(user_id),
    FOREIGN KEY (forfeit_id) REFERENCES users(user_id)
);