import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDbSetup1609841207961 implements MigrationInterface {
    name = 'InitialDbSetup1609841207961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `fullname` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`), UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `collections` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `summary` text NULL, `userId` int NULL, `channelId` int NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `channels` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `summary` text NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, UNIQUE INDEX `IDX_10b2cf630bc6d62cca516c4dd8` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `resolutions` (`id` int NOT NULL AUTO_INCREMENT, `res_720p` varchar(255) NULL, `res_1080p` varchar(255) NULL, `res_480p` varchar(255) NULL, `res_360p` varchar(255) NULL, `movieId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `movies` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `plot` text NULL, `filename` text NOT NULL, `mimetype` text NOT NULL, `originalName` text NOT NULL, `filesize` text NOT NULL, `rating` float NOT NULL DEFAULT '0', `categoryId` int NULL, `resolutionId` int NULL, `channelId` int NULL, `collectionId` int NULL, `isPublished` tinyint NOT NULL DEFAULT 0, `isPublic` tinyint NOT NULL DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, UNIQUE INDEX `REL_cd9928fa8ac60e286cb7aab74a` (`resolutionId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `categories` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `description` text NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `collections` ADD CONSTRAINT `FK_d78cb05c3709824c8f8539c7589` FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `collections` ADD CONSTRAINT `FK_da613d6625365707f8df0f65d81` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `channels` ADD CONSTRAINT `FK_b89f82f218818e3d7e0a09b65d2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `movies` ADD CONSTRAINT `FK_756446d4a415245bf4e95f9a37c` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `movies` ADD CONSTRAINT `FK_cd9928fa8ac60e286cb7aab74a3` FOREIGN KEY (`resolutionId`) REFERENCES `resolutions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `movies` ADD CONSTRAINT `FK_212c8d2ae8c293b8d05a59c0767` FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `movies` ADD CONSTRAINT `FK_ee22323c964e3e6c2650705d3a3` FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `movies` ADD CONSTRAINT `FK_64a78407424745d6c053e93cc36` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `movies` DROP FOREIGN KEY `FK_64a78407424745d6c053e93cc36`");
        await queryRunner.query("ALTER TABLE `movies` DROP FOREIGN KEY `FK_ee22323c964e3e6c2650705d3a3`");
        await queryRunner.query("ALTER TABLE `movies` DROP FOREIGN KEY `FK_212c8d2ae8c293b8d05a59c0767`");
        await queryRunner.query("ALTER TABLE `movies` DROP FOREIGN KEY `FK_cd9928fa8ac60e286cb7aab74a3`");
        await queryRunner.query("ALTER TABLE `movies` DROP FOREIGN KEY `FK_756446d4a415245bf4e95f9a37c`");
        await queryRunner.query("ALTER TABLE `channels` DROP FOREIGN KEY `FK_b89f82f218818e3d7e0a09b65d2`");
        await queryRunner.query("ALTER TABLE `collections` DROP FOREIGN KEY `FK_da613d6625365707f8df0f65d81`");
        await queryRunner.query("ALTER TABLE `collections` DROP FOREIGN KEY `FK_d78cb05c3709824c8f8539c7589`");
        await queryRunner.query("DROP TABLE `categories`");
        await queryRunner.query("DROP INDEX `REL_cd9928fa8ac60e286cb7aab74a` ON `movies`");
        await queryRunner.query("DROP TABLE `movies`");
        await queryRunner.query("DROP TABLE `resolutions`");
        await queryRunner.query("DROP INDEX `IDX_10b2cf630bc6d62cca516c4dd8` ON `channels`");
        await queryRunner.query("DROP TABLE `channels`");
        await queryRunner.query("DROP TABLE `collections`");
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP INDEX `IDX_fe0bb3f6520ee0469504521e71` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
