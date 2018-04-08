drop database if exists products;

create  database products;

use products;

create table items(
    id integer auto_increment not null,
    primary key (id),
    name varchar(30) not null,
    price integer(8) not null

);

select * from  items;