import { MigrationInterface, QueryRunner } from 'typeorm';

export class Schema1754018202828 implements MigrationInterface {
  name = 'Schema1754018202828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('activa', 'terminada')`);
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "estimatedHours" integer NOT NULL, "dueDate" date NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'activa', "monetaryCost" numeric(10,2) NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks_assigned_users_users" ("tasksId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_5a6da4e5c21aed2dfa0109f3e60" PRIMARY KEY ("tasksId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d6b60e47e400d0db8bb05ce4e" ON "tasks_assigned_users_users" ("tasksId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3b70948b5437335343eaaf242" ON "tasks_assigned_users_users" ("usersId") `,
    );
    await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('member', 'admin')`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member'`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "tasks_assigned_users_users" ADD CONSTRAINT "FK_8d6b60e47e400d0db8bb05ce4e8" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_assigned_users_users" ADD CONSTRAINT "FK_f3b70948b5437335343eaaf242f" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks_assigned_users_users" DROP CONSTRAINT "FK_f3b70948b5437335343eaaf242f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_assigned_users_users" DROP CONSTRAINT "FK_8d6b60e47e400d0db8bb05ce4e8"`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('Member', 'Admin')`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Member'`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f3b70948b5437335343eaaf242"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8d6b60e47e400d0db8bb05ce4e"`);
    await queryRunner.query(`DROP TABLE "tasks_assigned_users_users"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
}
