import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultCategories1610533915366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO categories (title, description) VALUES ('Non Adult', 'Movies does not contain any adult sensitive content such as pornography or something similar.'), ('Adult', 'Movie contains adult content such as pornography or nude pictures or scenes.')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM categories WHERE title='Non Adult' OR title='Adult'");
  }
}
