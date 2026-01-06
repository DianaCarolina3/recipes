/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,order]` on the table `Step` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Ingredient_recipeId_name_key` ON `Ingredient`(`recipeId`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `Step_recipeId_order_key` ON `Step`(`recipeId`, `order`);
