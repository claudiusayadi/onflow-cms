import { MigrationInterface, QueryRunner } from 'typeorm';

export class Starter1755532765845 implements MigrationInterface {
  name = 'Starter1755532765845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."role" AS ENUM('admin', 'editor', 'author', 'reader')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying,
                "last_name" character varying,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "avatar" character varying DEFAULT 'avatar.jpg',
                "bio" character varying,
                "role" "public"."role" NOT NULL DEFAULT 'reader',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."role"
        `);
  }
}
