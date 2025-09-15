CREATE DATABASE db_controle_jogos_bb;

use db_controle_jogos_bb;


CREATE TABLE IF NOT EXISTS tbl_clientes(
    id int not null primary key auto_increment,
    nome varchar(80) not null UNIQUE,
    idade int not null
);