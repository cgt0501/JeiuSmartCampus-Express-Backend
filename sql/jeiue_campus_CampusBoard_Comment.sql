DROP TABLE IF EXISTS `CampusBoard_AI_Comment`;

CREATE TABLE `CampusBoard_AI_Comment`
(
    `id`      int          NOT NULL AUTO_INCREMENT,
    `content` varchar(200) NOT NULL,
    `stu_id`  varchar(45)  NOT NULL,
    `user`    varchar(45)  NOT NULL,
    `page_id` varchar(45)  NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 32
  DEFAULT CHARSET = utf8mb3;

CREATE TABLE `CampusBoard_Art_Comment`
(
    `id`      int          NOT NULL AUTO_INCREMENT,
    `content` varchar(200) NOT NULL,
    `stu_id`  varchar(45)  NOT NULL,
    `user`    varchar(45)  NOT NULL,
    `page_id` varchar(45)  NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 32
  DEFAULT CHARSET = utf8mb3;

CREATE TABLE `CampusBoard_Founded_Comment`
(
    `id`      int          NOT NULL AUTO_INCREMENT,
    `content` varchar(200) NOT NULL,
    `stu_id`  varchar(45)  NOT NULL,
    `user`    varchar(45)  NOT NULL,
    `page_id` varchar(45)  NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 32
  DEFAULT CHARSET = utf8mb3;

CREATE TABLE `CampusBoard_Human_Comment`
(
    `id`      int          NOT NULL AUTO_INCREMENT,
    `content` varchar(200) NOT NULL,
    `stu_id`  varchar(45)  NOT NULL,
    `user`    varchar(45)  NOT NULL,
    `page_id` varchar(45)  NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 32
  DEFAULT CHARSET = utf8mb3;

CREATE TABLE `CampusBoard_Nature_Comment`
(
    `id`      int          NOT NULL AUTO_INCREMENT,
    `content` varchar(200) NOT NULL,
    `stu_id`  varchar(45)  NOT NULL,
    `user`    varchar(45)  NOT NULL,
    `page_id` varchar(45)  NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 32
  DEFAULT CHARSET = utf8mb3;

