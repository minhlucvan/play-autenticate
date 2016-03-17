# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table THT_AREA_DATA (
  id                        varchar(40) not null,
  area_code                 varchar(20),
  constraint pk_THT_AREA_DATA primary key (id))
;

create table THT_AREA_MAP (
  id                        varchar(40) not null,
  name                      varchar(20),
  data                      varchar(255),
  constraint pk_THT_AREA_MAP primary key (id))
;

create table THT_AREA_SUMARY (
  id                        varchar(40) not null,
  area_data_id              varchar(40),
  category                  varchar(20),
  name                      varchar(20),
  value                     varchar(20),
  constraint pk_THT_AREA_SUMARY primary key (id))
;

create table THT_USER_LINKED_ACCOUNT (
  id                        bigserial not null,
  user_id                   bigint,
  provider_user_id          varchar(255),
  provider_key              varchar(255),
  constraint pk_THT_USER_LINKED_ACCOUNT primary key (id))
;

create table THT_USER_ROLE (
  id                        bigserial not null,
  role_name                 varchar(255),
  constraint pk_THT_USER_ROLE primary key (id))
;

create table THT_USER_VERIFY_TOKEN (
  id                        bigserial not null,
  token                     varchar(255),
  target_user_id            bigint,
  type                      varchar(2),
  created                   timestamp,
  expires                   timestamp,
  constraint ck_THT_USER_VERIFY_TOKEN_type check (type in ('PR','EV')),
  constraint uq_THT_USER_VERIFY_TOKEN_token unique (token),
  constraint pk_THT_USER_VERIFY_TOKEN primary key (id))
;

create table THT_USERS (
  id                        bigserial not null,
  email                     varchar(255),
  name                      varchar(255),
  first_name                varchar(255),
  last_name                 varchar(255),
  last_login                timestamp,
  active                    boolean,
  email_validated           boolean,
  constraint pk_THT_USERS primary key (id))
;

create table THT_USER_PERMISSION (
  id                        bigserial not null,
  value                     varchar(255),
  constraint pk_THT_USER_PERMISSION primary key (id))
;


create table THT_USERS_THT_USER_ROLE (
  THT_USERS_id                   bigint not null,
  THT_USER_ROLE_id               bigint not null,
  constraint pk_THT_USERS_THT_USER_ROLE primary key (THT_USERS_id, THT_USER_ROLE_id))
;

create table THT_USERS_THT_USER_PERMISSION (
  THT_USERS_id                   bigint not null,
  THT_USER_PERMISSION_id         bigint not null,
  constraint pk_THT_USERS_THT_USER_PERMISSION primary key (THT_USERS_id, THT_USER_PERMISSION_id))
;
alter table THT_AREA_SUMARY add constraint fk_THT_AREA_SUMARY_areaData_1 foreign key (area_data_id) references THT_AREA_DATA (id);
create index ix_THT_AREA_SUMARY_areaData_1 on THT_AREA_SUMARY (area_data_id);
alter table THT_USER_LINKED_ACCOUNT add constraint fk_THT_USER_LINKED_ACCOUNT_use_2 foreign key (user_id) references THT_USERS (id);
create index ix_THT_USER_LINKED_ACCOUNT_use_2 on THT_USER_LINKED_ACCOUNT (user_id);
alter table THT_USER_VERIFY_TOKEN add constraint fk_THT_USER_VERIFY_TOKEN_targe_3 foreign key (target_user_id) references THT_USERS (id);
create index ix_THT_USER_VERIFY_TOKEN_targe_3 on THT_USER_VERIFY_TOKEN (target_user_id);



alter table THT_USERS_THT_USER_ROLE add constraint fk_THT_USERS_THT_USER_ROLE_TH_01 foreign key (THT_USERS_id) references THT_USERS (id);

alter table THT_USERS_THT_USER_ROLE add constraint fk_THT_USERS_THT_USER_ROLE_TH_02 foreign key (THT_USER_ROLE_id) references THT_USER_ROLE (id);

alter table THT_USERS_THT_USER_PERMISSION add constraint fk_THT_USERS_THT_USER_PERMISS_01 foreign key (THT_USERS_id) references THT_USERS (id);

alter table THT_USERS_THT_USER_PERMISSION add constraint fk_THT_USERS_THT_USER_PERMISS_02 foreign key (THT_USER_PERMISSION_id) references THT_USER_PERMISSION (id);

# --- !Downs

drop table if exists THT_AREA_DATA cascade;

drop table if exists THT_AREA_MAP cascade;

drop table if exists THT_AREA_SUMARY cascade;

drop table if exists THT_USER_LINKED_ACCOUNT cascade;

drop table if exists THT_USER_ROLE cascade;

drop table if exists THT_USER_VERIFY_TOKEN cascade;

drop table if exists THT_USERS cascade;

drop table if exists THT_USERS_THT_USER_ROLE cascade;

drop table if exists THT_USERS_THT_USER_PERMISSION cascade;

drop table if exists THT_USER_PERMISSION cascade;

