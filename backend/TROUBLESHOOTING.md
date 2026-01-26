# Troubleshooting - Installation Probleme

## Problem: Rust/Cargo Fehler bei pip install

Wenn beim Installieren der Dependencies ein Fehler mit Rust/Cargo auftritt:

### Lösung 1: Rust installieren (Empfohlen)

1. Rust installieren von: https://rustup.rs/
2. Nach Installation Terminal neu starten
3. Erneut versuchen: `pip install -r requirements.txt`

### Lösung 2: Python 3.13 verwenden

Falls Python 3.14 Probleme macht, verwende Python 3.13:

1. Python 3.13 installieren (von python.org)
2. Neues Virtual Environment mit Python 3.13 erstellen:
   ```bash
   python3.13 -m venv venv
   # oder
   py -3.13 -m venv venv
   ```
3. Dann: `pip install -r requirements.txt`

### Lösung 3: Pre-compiled Wheels erzwingen

Manchmal hilft es, pip zu aktualisieren und dann mit `--only-binary` zu installieren:

```bash
pip install --upgrade pip
pip install --only-binary :all: -r requirements.txt
```

Falls das nicht funktioniert, versuche es ohne `--only-binary`:

```bash
pip install -r requirements.txt
```

## Problem: pydantic-core Kompilierungsfehler

Die neueste Version von Pydantic (2.12+) sollte Pre-compiled Wheels für Python 3.14 haben. Falls nicht:

1. Prüfe Python Version: `python --version`
2. Falls Python 3.14: Versuche Python 3.13
3. Oder installiere Rust (siehe Lösung 1)
