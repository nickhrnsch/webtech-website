-- Entfernt die Spalte "abteilung" aus der users-Tabelle.
-- Für moderne SQLite-Versionen (>= 3.35) oder andere SQL-Datenbanken,
-- die DROP COLUMN unterstützen:

ALTER TABLE users DROP COLUMN abteilung;

