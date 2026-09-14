import { getStore } from "@netlify/blobs";

const MAX_PUNKTE = 1000000;

function antwort(daten, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function sortiereTop10(eintraege) {
  return eintraege
    .filter((eintrag) => typeof eintrag?.name === "string" && Number.isInteger(eintrag?.punkte))
    .map((eintrag) => ({
      name: eintrag.name.trim().slice(0, 20),
      punkte: Math.max(0, Math.min(MAX_PUNKTE, eintrag.punkte)),
      level: Math.max(1, Math.min(100001, Number.isInteger(eintrag.level) ? eintrag.level : 1)),
      schwierigkeit: ["leicht", "mittel", "schwer"].includes(eintrag.schwierigkeit) ? eintrag.schwierigkeit : "mittel"
    }))
    .filter((eintrag) => eintrag.name.length > 0)
    .sort((a, b) => b.punkte - a.punkte || b.level - a.level)
    .slice(0, 10);
}

export default async (request) => {
  const store = getStore("duesenjet-top10");
  const gespeichert = await store.get("top10.json", { consistency: "strong" });
  let top10 = [];

  try {
    top10 = sortiereTop10(gespeichert ? JSON.parse(gespeichert) : []);
  } catch {
    top10 = [];
  }

  if (request.method === "GET") return antwort(top10);
  if (request.method !== "POST") return antwort({ fehler: "Methode nicht erlaubt." }, 405);

  let eingabe;
  try {
    eingabe = await request.json();
  } catch {
    return antwort({ fehler: "Ungültige Daten." }, 400);
  }

  const name = typeof eingabe?.name === "string" ? eingabe.name.trim().slice(0, 20) : "";
  const punkte = Number.isInteger(eingabe?.punkte) ? eingabe.punkte : -1;
  const schwierigkeit = eingabe?.schwierigkeit;

  if (!name || punkte < 0 || punkte > MAX_PUNKTE || !["leicht", "mittel", "schwer"].includes(schwierigkeit)) {
    return antwort({ fehler: "Ungültiges Ergebnis." }, 400);
  }

  const neuerEintrag = { name, punkte, level: Math.floor(punkte / 10) + 1, schwierigkeit };
  const index = top10.findIndex((eintrag) => eintrag.name.toLocaleLowerCase() === name.toLocaleLowerCase());

  // Pro Spieler bleibt nur das beste Ergebnis in der weltweiten Rangliste.
  if (index === -1) {
    top10.push(neuerEintrag);
  } else if (punkte > top10[index].punkte) {
    top10[index] = neuerEintrag;
  }

  top10 = sortiereTop10(top10);
  await store.set("top10.json", JSON.stringify(top10));
  return antwort(top10, 201);
};
