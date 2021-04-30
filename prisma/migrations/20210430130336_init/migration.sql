-- CreateTable
CREATE TABLE "CommonLocations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "nameOrigin" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "sortNo" INTEGER
);

-- CreateTable
CREATE TABLE "CommonSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "morningStart" INTEGER,
    "morningEnd" INTEGER
);

-- CreateTable
CREATE TABLE "DateSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN,
    "pattern" TEXT,
    "fontSize" INTEGER
);

-- CreateTable
CREATE TABLE "FuelPriceSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN,
    "apiKey" TEXT,
    "showE5" BOOLEAN,
    "showE10" BOOLEAN,
    "showDiesel" BOOLEAN,
    "interval" BOOLEAN
);

-- CreateTable
CREATE TABLE "FuelPriceStations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "nameOrigin" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "sortNo" INTEGER,
    "remoteId" TEXT
);

-- CreateTable
CREATE TABLE "TimetableSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN,
    "timetableStationFrom" TEXT,
    "timetableStationTo" TEXT,
    "maxChanges" INTEGER,
    "showICE" BOOLEAN,
    "showIC" BOOLEAN,
    "showBus" BOOLEAN,
    "showTram" BOOLEAN,
    "showSBahn" BOOLEAN,
    "showRE" BOOLEAN,
    "showRB" BOOLEAN,
    "showUBahn" BOOLEAN
);

-- CreateTable
CREATE TABLE "TimetableStations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "nameOrigin" TEXT,
    "sortNo" INTEGER,
    "remoteId" INTEGER
);

-- CreateTable
CREATE TABLE "TrafficSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN,
    "apiKey" TEXT,
    "commonLocationFrom" TEXT,
    "commonLocationTo" TEXT
);

-- CreateTable
CREATE TABLE "WeatherSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN,
    "apiKey" TEXT,
    "commonLocation" TEXT
);
