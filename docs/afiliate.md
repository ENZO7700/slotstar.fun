Searched for "AFFILIATE_URL"
Viewed affiliate.ts:1-28

Tu je kompletný návod a vysvetlenie, ako funguje affiliate program **22Bet Partners (`22betpartners.com`)**, ako sa stať partnerom a ako získané odkazy prepojiť s tvojou aplikáciou `slotstar.fun`.

---

### 1. Ako funguje Casino Affiliate Marketing v praxi?

Keď niekto navštívi tvoj web `slotstar.fun`, hrá tam zadarmo demo hry a klikne na tlačidlo **"Získaj bonus"** alebo **"Hrať za reálne peniaze"**:
1. Preklikne sa cez tvoj **unikátny affiliate link** (napr. `https://22bet.com/?tag=d_123456m_...`).
2. V prehliadači používateľa sa uloží **Cookie** (zvyčajne na 30 až 90 dní).
3. Ak sa hráč v 22Bet zaregistruje a spraví vklad (deposit), systém 22Bet automaticky priradí tohto hráča k tvojmu partnerskému účtu.
4. Ty získavaš províziu zo všetkých vkladov alebo prehier tohto hráča — často **doživotne**!

---

### 2. Typy provízií v 22Bet Partners

Pri registrácii si zvyčajne vyberáš (alebo ti manažér pridelí) jeden z týchto modelov:

* **RevShare (Revenue Share)** – *Najčastejší a najvýhodnejší*:
  * Získavaš **25 % až 45 %** z čistého zisku kasína (NGR = Net Gaming Revenue), ktorý vygenerujú tvoji privedení hráči.
  * *Príklad:* Ak tvoj hráč prehrá 100 €, ty dostaneš 35 € až 45 €. Hráči sa sčítavajú a platby dostávaš každý týždeň alebo mesiac.
* **CPA (Cost Per Acquisition)**:
  * Dostaneš jednorazovú fixnú sumu za každého nového hráča, ktorý sa zaregistruje a vloží napr. minimálne 10 € ali 20 € (napr. 50 € - 100 € za hráča).
* **Hybrid (RevShare + CPA)**:
  * Kombinácia oboch (menšia fixná suma + menšie % z tržieb).

---

### 3. Krok za krokom: Ako sa zaregistrovať na 22betpartners.com

1. **Registrácia**:
   * Otvor [22betpartners.com](https://22betpartners.com) a klikni na **Registration / Register**.
   * Vyplň svoje údaje (meno, e-mail, heslo, skype/telegram pre kontakt s affiliate managerom).
   * Do pola **Traffic Source / Website** zadaj doménu tvojej aplikácie: `https://slotstar.fun`.

2. **Schválenie účtu (Approval)**:
   * Žiadosť zvyčajne schvália do 24 – 48 hodín. Niekedy sa ti ozve affiliate manažér na Telegram alebo e-mail a opýta sa, akú máš návštevnosť. Stačí povedať, že spúšťaš nový demo slot agregátor `slotstar.fun` zameraný na testovanie hier.

3. **Vygenerovanie Affiliate Linku**:
   * Po prihlásení do dashboardu 22Bet Partners choď do sekcie **Marketing Tools** ➔ **Affiliate Links** (alebo *Get Link*).
   * Vyber si cieľovú stránku (Landing Page / Registration Page).
   * Systém ti vygeneruje tvoj osobnostný odkaz, napríklad:
     `https://refpa123.com/L?p=:1234&bid=56`

---

### 4. Ako to vložíš do svojej aplikácie `slotstar.fun`?

Tvoja aplikácia je navrhnutá tak, že má **jediné centrálne miesto** pre affiliate linky. Nemusíš prepisovať 50 súborov!

Stačí otvoriť súbor:
📄 [apps/web/src/lib/affiliate.ts](file:///Users/erikbabcan/HUB/01-Projekty/slotstar.fun/apps/web/src/lib/affiliate.ts)

A zmeniť riadok č. 8 na tvoj nový 22Bet link:

```typescript
// Zmeníš tento riadok:
export const AFFILIATE_URL = 'TVOJ_NOVY_22BET_AFFILIATE_LINK';
```

Akonáhle tento súbor uložíš a pushneš na Vercel:
* Všetky tlačidlá v hlavičke (Header), v bočnom menu (Sidebar), pri náhľadoch hier (Game Cards), v detailoch hier aj v pätičke (Footer) sa **okamžite prepnú na tvoj nový 22Bet link**!

---

### Chceš pomôcť s nastavením?
Keď získaš schválený účet a odkaz z `22betpartners.com`, stačí mi ho sem poslať a ja ti ho hneď nahodím do `affiliate.ts` a nasadím na produkciu!


affiliate link - https://betlbl.com/?bf=6858ac6c4bbc5_11430411467
