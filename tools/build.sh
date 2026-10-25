#!/usr/bin/env bash
# Kompletter Build der Homegym-App:
#   HTML bauen -> Assets -> Java kompilieren -> dex -> apktool b -> signieren
#
# Werkzeuge (Pfade per Umgebungsvariable überschreibbar, Standard: tools/.cache):
#   APKTOOL_JAR   apktool 2.9.3          https://github.com/iBotPeaches/Apktool/releases/tag/v2.9.3
#   SIGNER_JAR    uber-apk-signer 1.3.0  https://github.com/patrickfav/uber-apk-signer/releases/tag/v1.3.0
#   D2J_DIR       dex2jar 2.4 (enthält dx) https://github.com/pxb1988/dex2jar/releases/tag/v2.4
#   ANDROID_JAR   android.jar API 34     z. B. https://github.com/Sable/android-platforms (android-34/android.jar)
#   FONTS_DIR     entpackte npm-Pakete @fontsource/rajdhani, @fontsource/orbitron, @fontsource/instrument-sans
#   Außerdem: JDK (javac/jar, Java 8-Bytecode via --release 8), python3.
#
# Aufrufe:
#   tools/build.sh fonts   # lädt die Schriften per "npm pack" nach tools/.cache
#   tools/build.sh         # baut out/index.html und dist/Homegym.apk
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
CACHE="$REPO/tools/.cache"
APKTOOL_JAR="${APKTOOL_JAR:-$CACHE/apktool.jar}"
SIGNER_JAR="${SIGNER_JAR:-$CACHE/uber-signer.jar}"
D2J_DIR="${D2J_DIR:-$CACHE/dex-tools-v2.4}"
ANDROID_JAR="${ANDROID_JAR:-$CACHE/android-34.jar}"
export FONTS_DIR="${FONTS_DIR:-$CACHE}"

need() { [ -e "$1" ] || { echo "FEHLT: $2 ($1). Siehe Kopf von tools/build.sh." >&2; exit 1; }; }

if [ "${1:-}" = "fonts" ]; then
  mkdir -p "$CACHE"; cd "$CACHE"
  for p in rajdhani orbitron instrument-sans; do
    npm pack "@fontsource/$p" >/dev/null
    f=$(ls fontsource-$p-*.tgz | tail -1); d="${f%.tgz}"; mkdir -p "$d"; tar xzf "$f" -C "$d"
  done
  echo "Schriften liegen in $CACHE"; exit 0
fi

need "$APKTOOL_JAR" "apktool 2.9.3"; need "$SIGNER_JAR" "uber-apk-signer 1.3.0"
need "$D2J_DIR/d2j-jar2dex.sh" "dex2jar 2.4"; need "$ANDROID_JAR" "android.jar (API 34)"
command -v javac >/dev/null || { echo "FEHLT: javac (JDK)" >&2; exit 1; }

echo "1/5 HTML"
mkdir -p "$REPO/out"
python3 "$REPO/tools/build_html.py" "$REPO/out/index.html"
cp "$REPO/out/index.html" "$REPO/android/assets/index.html"
rm -rf "$REPO/out/jai"; cp -r "$REPO/android/assets/jai" "$REPO/out/jai"   # für die Tests

echo "2/5 Java kompilieren (Java 8, ohne Lambdas)"
B="$REPO/build"; rm -rf "$B"; mkdir -p "$B/classes"
javac --release 8 -cp "$ANDROID_JAR" -d "$B/classes" $(find "$REPO/java" -name '*.java')
(cd "$B/classes" && jar cf "$B/classes.jar" .)

echo "3/5 dex"
sh "$D2J_DIR/d2j-jar2dex.sh" -f -o "$REPO/android/classes.dex" "$B/classes.jar"

echo "4/5 apktool"
java -jar "$APKTOOL_JAR" b "$REPO/android" -o "$B/homegym-unsigned.apk"

echo "5/5 signieren"
java -jar "$SIGNER_JAR" -a "$B/homegym-unsigned.apk" -o "$B/signed"
mkdir -p "$REPO/dist"
cp "$B"/signed/*-aligned-debugSigned.apk "$REPO/dist/Homegym.apk"
echo "Fertig: dist/Homegym.apk"
