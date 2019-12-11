-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Berisheba
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Berisheba
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Berisheba` ;
USE `Berisheba` ;

-- -----------------------------------------------------
-- Table `Berisheba`.`Client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Client` (
  `idClient` INT NOT NULL AUTO_INCREMENT,
  `nomClient` VARCHAR(100) NULL,
  `adresseClient` VARCHAR(100) NULL,
  `numTelClient` VARCHAR(13) NULL,
  PRIMARY KEY (`idClient`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Materiels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Materiels` (
  `idMateriels` INT NOT NULL AUTO_INCREMENT,
  `nomMateriels` VARCHAR(50) NULL,
  `nbStock` INT NULL,
  PRIMARY KEY (`idMateriels`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`DemiJournee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`DemiJournee` (
  `date` DATE NOT NULL,
  `TypeDemiJournee` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`date`, `TypeDemiJournee`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Salle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Salle` (
  `idSalle` VARCHAR(10) NOT NULL,
  `nomSalle` VARCHAR(100) NULL,
  PRIMARY KEY (`idSalle`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`TypeReservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`TypeReservation` (
  `typeReservation` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`typeReservation`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Appareil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Appareil` (
  `typeAppareil` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`typeAppareil`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Ustensile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Ustensile` (
  `idUstensile` INT NOT NULL AUTO_INCREMENT,
  `nomUstensile` VARCHAR(100) NULL,
  `nbDisponible` VARCHAR(45) NULL,
  PRIMARY KEY (`idUstensile`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Paiement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Paiement` (
  `typePaiement` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`typePaiement`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Reservation` (
  `idReservation` INT NOT NULL AUTO_INCREMENT,
  `prixPersonne` REAL NULL,
  `prixKW` REAL NULL,
  `etatReservation` TINYINT NULL,
  `descReservation` JSON NULL,
  `nomReservation` VARCHAR(100) NULL,
  `Client_idClient` INT NOT NULL,
  `TypeReservation_typeReservation` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idReservation`),
  CONSTRAINT `fk_Reservation_Client`
    FOREIGN KEY (`Client_idClient`)
    REFERENCES `Berisheba`.`Client` (`idClient`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservation_TypeReservation1`
    FOREIGN KEY (`TypeReservation_typeReservation`)
    REFERENCES `Berisheba`.`TypeReservation` (`typeReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Louer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Louer` (
  `Reservation_idReservation` INT NOT NULL,
  `Materiels_idMateriels` INT NOT NULL,
  PRIMARY KEY (`Reservation_idReservation`, `Materiels_idMateriels`),
  CONSTRAINT `fk_Reservation_has_Materiels_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservation_has_Materiels_Materiels1`
    FOREIGN KEY (`Materiels_idMateriels`)
    REFERENCES `Berisheba`.`Materiels` (`idMateriels`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Concerner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Concerner` (
  `Reservation_idReservation` INT NOT NULL,
  `Salle_idSalle` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`Reservation_idReservation`, `Salle_idSalle`),
  CONSTRAINT `fk_Reservation_has_Salle_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservation_has_Salle_Salle1`
    FOREIGN KEY (`Salle_idSalle`)
    REFERENCES `Berisheba`.`Salle` (`idSalle`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Constituer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Constituer` (
  `Reservation_idReservation` INT NOT NULL,
  `nbPersonne` INT NULL,
  `DemiJournee_date` DATE NOT NULL,
  `DemiJournee_TypeDemiJournee` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`Reservation_idReservation`, `DemiJournee_date`, `DemiJournee_TypeDemiJournee`),
  CONSTRAINT `fk_Reservation_has_DemiJournee_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Constituer_DemiJournee1`
    FOREIGN KEY (`DemiJournee_date` , `DemiJournee_TypeDemiJournee`)
    REFERENCES `Berisheba`.`DemiJournee` (`date` , `TypeDemiJournee`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Utiliser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Utiliser` (
  `Appareil_typeAppareil` VARCHAR(50) NOT NULL,
  `Reservation_idReservation` INT NOT NULL,
  `nomAppareil` VARCHAR(100) NULL,
  `puissance` REAL NULL,
  `duree` INT NULL,
  PRIMARY KEY (`Appareil_typeAppareil`, `Reservation_idReservation`),
  CONSTRAINT `fk_Appareil_has_Reservation_Appareil1`
    FOREIGN KEY (`Appareil_typeAppareil`)
    REFERENCES `Berisheba`.`Appareil` (`typeAppareil`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Appareil_has_Reservation_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Payer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Payer` (
  `Reservation_idReservation` INT NOT NULL,
  `Paiement_typePaiement` VARCHAR(20) NOT NULL,
  `datePaiement` DATE NULL,
  `sommePayee` VARCHAR(45) NULL,
  PRIMARY KEY (`Reservation_idReservation`, `Paiement_typePaiement`),
  CONSTRAINT `fk_Reservation_has_Paiement_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservation_has_Paiement_Paiement1`
    FOREIGN KEY (`Paiement_typePaiement`)
    REFERENCES `Berisheba`.`Paiement` (`typePaiement`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Autre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Autre` (
  `typeAutre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`typeAutre`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Doit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Doit` (
  `Autre_typeAutre` VARCHAR(50) NOT NULL,
  `Reservation_idReservation` INT NOT NULL,
  `prixAutre` REAL NULL,
  `motif` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`Autre_typeAutre`, `Reservation_idReservation`, `motif`),
  CONSTRAINT `fk_Autre_has_Reservation_Autre1`
    FOREIGN KEY (`Autre_typeAutre`)
    REFERENCES `Berisheba`.`Autre` (`typeAutre`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Autre_has_Reservation_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Emprunt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Emprunt` (
  `Ustensile_idUstensile` INT NOT NULL,
  `Reservation_idReservation` INT NOT NULL,
  `dateEmprunt` DATE NULL,
  `nbEmprunt` INT NULL,
  PRIMARY KEY (`Ustensile_idUstensile`, `Reservation_idReservation`),
  CONSTRAINT `fk_Ustensile_has_Reservation_Ustensile1`
    FOREIGN KEY (`Ustensile_idUstensile`)
    REFERENCES `Berisheba`.`Ustensile` (`idUstensile`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Ustensile_has_Reservation_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Berisheba`.`Rendre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Berisheba`.`Rendre` (
  `Ustensile_idUstensile` INT NOT NULL,
  `Reservation_idReservation` INT NOT NULL,
  `dateRendue` DATE NULL,
  `nbRendue` INT NULL,
  PRIMARY KEY (`Ustensile_idUstensile`, `Reservation_idReservation`),
  CONSTRAINT `fk_Ustensile_has_Reservation1_Ustensile1`
    FOREIGN KEY (`Ustensile_idUstensile`)
    REFERENCES `Berisheba`.`Ustensile` (`idUstensile`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Ustensile_has_Reservation1_Reservation1`
    FOREIGN KEY (`Reservation_idReservation`)
    REFERENCES `Berisheba`.`Reservation` (`idReservation`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
