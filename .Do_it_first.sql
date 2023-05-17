"\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -uroot -p1234

create schema tetris_online;
use tetris_online;

create user 'tetris_online'@'%' identified by '1234';
grant all privileges on tetris_online.* to 'tetris_online'@'%';

CREATE TABLE users (
  idUsers       INT NOT NULL AUTO_INCREMENT,
  id            VARCHAR(50) NOT NULL,
  nick          VARCHAR(30) NOT NULL,
  pw            VARCHAR(30) NOT NULL,
  joinDate      TIMESTAMP NOT NULL,
  lastLogin     TIMESTAMP NOT NULL,
  tier          VARCHAR(10) NOT NULL,
  highScore     INT,
  PRIMARY KEY(idUsers));

INSERT INTO users (id, nick, pw, joinDate, lastLogin, tier, highScore) 
      VALUES ('master@lol.com', '마스터이', '1234', '2023-03-02 14:44:44', '2023-04-05 14:44:44', '돌', 1000000);
INSERT INTO users (id, nick, pw, joinDate, lastLogin, tier, highScore) 
      VALUES ('tester@hoon.com', '테스터훈', '1234', '2023-03-02 14:44:44', '2023-04-05 14:44:44', '돌', 100000);
