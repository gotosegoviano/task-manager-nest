import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1754028069389 implements MigrationInterface {
    name = 'Schema1754028069389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "completionDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "completionDate"`);
    }

}
