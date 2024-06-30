import React from 'react';
import "../css/HelpMenu.css"

interface HelpMenuProps {
    onClose: () => void;
    isHelpMenuVisible: boolean;
  }

const HelpMenuLith: React.FC<HelpMenuProps> = ({onClose, isHelpMenuVisible}) => {
    return (
        <div className={`help-menu ${isHelpMenuVisible ? 'visible' : ''}`}>
            <button className="close" onClick={onClose} />
            <h1>Pagalbos Meniu IDE</h1>

            <h2>Įvadas</h2>
            <p>Sveiki atvykę į jūsų Ruby specializuotą IDE. Tai sukurtas ne tik padidinti jūsų produktyvumą, bet ir motyvuoti kiekvieną eilutę rašant kodą. Galų gale, kodas pats nesutvarko save.</p>

            <h2>1. Failų sąsaja</h2>
            <h3>1.1 Aplanko pasirinkimas</h3>
            <ul>
                <li><strong>Atverti aplanką</strong>: Naudojant aplanko pasirinkimo mygtuką, atverkite esamą projektą. Įveskite ABSOLIUTŲ kelią.</li>
                <li><strong>Atverti failą</strong>: Naršykite medį ir spustelėkite failą, kurį norite atverti. Tai kaip dovanų atidarymas, tik tai yra kodas.</li>
            </ul>
            <h3>1.2 Failų ir aplankų kūrimas bei tvarkymas</h3>
            <ul>
                <li><strong>Kurti naują failą/aplanką</strong>: Spustelėkite kūrimo parinktį, norėdami pridėti naują failą arba aplanką į savo projektą.</li>
                <li><strong>Pervadinti</strong>: Spustelėkite pieštuką šalia failo/aplanko pavadinimo arba naudokite kontekstinio meniu parinktį pervadinti.</li>
                <li><strong>Trinti</strong>: Naudojant panašią trinimo parinktį, bet tai šiukšlės (kaip jūsų kodas), kad būtų pašalintas failas arba aplankas.</li>
            </ul>

            <h2>2. Kodo redaktorius</h2>
            <h3>2.1 Failų atidarymas ir redagavimas</h3>
            <ul>
                <li><strong>Atverti failą</strong>: Spustelėkite failą medyje, kad jį atvertumėte redaktoriuje. Tai kaip durų atidarymas į kambaryje, pilname galimybių (ir kartais klaidų, bet tai kita istorija).</li>
                <li><strong>Redagavimas</strong>: Redaguokite atidarytų failų turinį. Kiekviena kodų eilutė turi būti parašyta per 15 sekundžių, kitaip prarasite gyvybes ir savo kodą.</li>
            </ul>
            <h3>2.2 Įrašymas</h3>
            <ul>
                <li><strong>Įrašyti</strong>: Naudokite "Įrašyti" parinktį, kad išsaugotumėte pakeitimus dabartiniame faile. Kadangi prarasti savo darbą - tai kaip išpilti ryto kavą, vengtina ir skausminga.</li>
                <li><strong>Įrašyti kaip</strong>: Įrašykite failą nauju pavadinimu ar nauju vieta. Saugumo kopija visada yra gera idėja.</li>
            </ul>

            <h2>3. Terminalas</h2>
            <h3>3.1 Terminalo naudojimas</h3>
            <ul>
                <li><strong>Vykdyti komandas</strong>: Įveskite savo komandas į terminalą ir spustelėkite Enter. Tai kaip kalbėti su savo kompiuteriu... ir kartais jis atsako!</li>
                <li><strong>Rezultatų rodymas</strong>: Komandų rezultatai rodomi tiesiogiai terminale (išvestis ir klaidos). Tai kaip gauti akimirkinius atsakymus į savo egzistencinius kodavimo klausimus.</li>
            </ul>

            <h2>4. Versijų valdymas (Git)</h2>
            <h3>4.1 Git komandos</h3>
            <ul>
                <li><strong>Pridėti (Git Add)</strong>: Naudokite "pasirinkti" mygtuką, norėdami pasirinkti failus, kuriuos norite pridėti prie savo saugyklos. Tada naudokite "Pridėti" mygtuką, norėdami pridėti savo pakeitimus.</li>
                <li><strong>Commit (Git Commit)</strong>: Įrašykite pakeitimus su aprašančiu pranešimu. Tai kaip parašyti meilės laišką savo ateities sau. "Brangus aš, čia yra, ką pakeičiau ir kodėl aš taip prastai kodinau."</li>
                <li><strong>Pull (Git Pull)</strong>: Sinchronizuokite savo vietinę saugyklą su nutolusia saugykla. Pajuskite tai kaip gera taisyklės mainų su kitais kūrėjais... arba kaip gauna pagalbą iš savo ateities savęs.</li>
            </ul>

            <h2>5. Dirbtinio intelekto funkcijos</h2>
            <h3>5.1 Prieigos prie dirbtinio intelekto funkcijų</h3>
            <ul>
                <li><strong>Aktyvuoti AI meniu</strong>: Spustelėkite "IA" naršymo juostoje. Atlaisvinkite dirbtinio intelekto galią, jūsų naująjį asmeninį asistentą, kuris niekada nesnaudžia (bet jūs jo taip pat nemėgstate).</li>
                <li><strong>Naudingumas</strong>: Naudokite šiuos įrankius generuoti kodą, siūlyti pataisas ar kitas AI užduotis.</li>
            </ul>

            <h2>6. Priderinimas ir kalba</h2>
            <h3>6.1 Tema</h3>
            <ul>
                <li><strong>Keisti temą</strong>: Perjunkite tamsaus ir šviesaus režimo naudodami temos piktogramą. Kadangi kartais programuoti tamsoje yra tiesiog motyvuojančiau.</li>
            </ul>
            <h3>6.2 Kalba</h3>
            <ul>
                <li><strong>Keisti kalbą</strong>: Pasirinkite norimą kalbą iš "Kalba" meniu. Kalbėkite su savo IDE pasirinkta kalba (lituanų ar prancūzų).</li>
            </ul>

            <h2>7. Muzika</h2>
            <h3>7.1 Muzikos grotuvas</h3>
            <ul>
                <li><strong>Aktyvuoti grotuvą</strong>: Naudokite integruotą muzikos grotuvą, kad galėtumėte klausytis muzikos dirbdami. Pakelkite savo motyvaciją ir kūrybiškumą su savo mėgstamiausia muzika (bet mes ją jums pasirenkame, taigi neapsigaukite).</li>
            </ul>

            <h2>8. Parama ir pagalba</h2>
            <h3>8.1 Susisiekite su pagalba</h3>
            <ul>
                <li><strong>Gauti pagalbą</strong>: Ar yra internetas?</li>
            </ul>

            <p>Šis vadovas yra čia, kad padėtų jums paversti kiekvieną kodavimo sesiją malonia ir motyvuojančia patirtimi. Gerų programavimo metų! (nors mes žinome, kad jūs blogai koduojate)</p>
        </div>

    );
};

export default HelpMenuLith;
