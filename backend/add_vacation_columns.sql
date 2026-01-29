-- Adds new columns to vacations table (Phase 1 + optional Art, Link).
-- Run against your SQLite DB when applicable (e.g. sqlite3 your.db < add_vacation_columns.sql).
-- SQLite 3.35+ required for ADD COLUMN.

ALTER TABLE vacations ADD COLUMN title TEXT;
ALTER TABLE vacations ADD COLUMN notes TEXT;
ALTER TABLE vacations ADD COLUMN accommodation TEXT;
ALTER TABLE vacations ADD COLUMN vacation_type TEXT;
ALTER TABLE vacations ADD COLUMN link TEXT;
