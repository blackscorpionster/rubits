CREATE EXTENSION "uuid-ossp";

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "number_of_tickets" INTEGER NOT NULL DEFAULT 1000,
    "ticket_cost" INTEGER NOT NULL DEFAULT 1,
    "profit_percent" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "grid_size_x" INTEGER NOT NULL DEFAULT 5,
    "grid_size_y" INTEGER NOT NULL DEFAULT 10,
    "matching_tiles_to_win" INTEGER NOT NULL DEFAULT 3,
    "tiles_theme" TEXT DEFAULT 'numbers',

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "draw_id" TEXT NOT NULL,
    "prize" DOUBLE PRECISION NOT NULL,
    "number_of_tickets" INTEGER NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "draw_id" TEXT NOT NULL,
    "grid_elements" JSONB NOT NULL,
    "md5" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'intact',
    "tier_id" TEXT,
    "position" INTEGER NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchased_by" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Draw_name_key" ON "Draw"("name");

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_draw_id_fkey" FOREIGN KEY ("draw_id") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_draw_id_fkey" FOREIGN KEY ("draw_id") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_purchased_by_fkey" FOREIGN KEY ("purchased_by") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
