import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1754035168884 implements MigrationInterface {
    name = 'Schema1754035168884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
