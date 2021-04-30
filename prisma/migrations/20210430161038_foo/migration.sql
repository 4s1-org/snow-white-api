-- CreateTable
CREATE TABLE "CommonLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameOrigin" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "sortNo" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CommonSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "morningStart" INTEGER NOT NULL,
    "morningEnd" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DateSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL,
    "pattern" TEXT NOT NULL,
    "fontSize" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "FuelPriceSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL,
    "apiKey" TEXT NOT NULL,
    "showE5" BOOLEAN NOT NULL,
    "showE10" BOOLEAN NOT NULL,
    "showDiesel" BOOLEAN NOT NULL,
    "interval" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "FuelPriceStation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameOrigin" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "sortNo" INTEGER NOT NULL,
    "remoteId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TimetableSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL,
    "apiKey" TEXT NOT NULL,
    "timetableStationFromId" TEXT,
    "timetableStationToId" TEXT,
    "maxChanges" INTEGER NOT NULL,
    "showICE" BOOLEAN NOT NULL,
    "showIC" BOOLEAN NOT NULL,
    "showBus" BOOLEAN NOT NULL,
    "showTram" BOOLEAN NOT NULL,
    "showSBahn" BOOLEAN NOT NULL,
    "showRE" BOOLEAN NOT NULL,
    "showRB" BOOLEAN NOT NULL,
    "showUBahn" BOOLEAN NOT NULL,
    FOREIGN KEY ("timetableStationFromId") REFERENCES "TimetableStation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("timetableStationToId") REFERENCES "TimetableStation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimetableStation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameOrigin" TEXT NOT NULL,
    "sortNo" INTEGER NOT NULL,
    "remoteId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TrafficSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL,
    "apiKey" TEXT NOT NULL,
    "commonLocationFromId" TEXT,
    "commonLocationToId" TEXT,
    FOREIGN KEY ("commonLocationFromId") REFERENCES "CommonLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("commonLocationToId") REFERENCES "CommonLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeatherSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL,
    "apiKey" TEXT NOT NULL,
    "commonLocationId" TEXT,
    FOREIGN KEY ("commonLocationId") REFERENCES "CommonLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
