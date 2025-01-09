/*
  Warnings:

  - You are about to drop the `_TaskUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaskUsers" DROP CONSTRAINT "_TaskUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskUsers" DROP CONSTRAINT "_TaskUsers_B_fkey";

-- DropTable
DROP TABLE "_TaskUsers";

-- CreateTable
CREATE TABLE "userTasks" (
    "user_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "userTasks_pkey" PRIMARY KEY ("user_id","task_id")
);

-- AddForeignKey
ALTER TABLE "userTasks" ADD CONSTRAINT "userTasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTasks" ADD CONSTRAINT "userTasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
