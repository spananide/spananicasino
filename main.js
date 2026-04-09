// Globale Variablen (In einer echten App kommen diese aus der Datenbank)
let currentUser = "";
let currentBalance = 0;

// Mock-Daten für das globale Leaderboard
let globalLeaderboard = [
    { name: "HighRoller99", balance: 154000 },
    { name: "LuckyLuck", balance: 89000 },
    { name: "CasinoKing", balance: 45000 },
    { name: "NoobPlayer", balance: 1200 }
];

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user.trim() === "" || pass.trim() === "") {
        alert("Bitte gib Nutzername und Passwort ein.");
        return;
    }

    currentUser = user;
    
    // Einfache lokale Speicherung für den Kontostand (ersetzt später die Datenbank)
    if (!localStorage.getItem(currentUser + "_balance")) {
        localStorage.setItem(currentUser + "_balance", 0);
    }
    currentBalance = parseInt(localStorage.getItem(currentUser + "_balance"));

    // UI Updates
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("welcomeText").innerText = "Willkommen, " + currentUser + "!";
    updateBalanceDisplay();

    // Spanani Admin Check
    if (user === "Spanani" && pass === "Admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
        document.getElementById("welcomeText").innerText = "👑 Willkommen zurück, Boss!";
    }

    // Leaderboard updaten und eigenen Namen hinzufügen
    updateLeaderboard();
}

function claimReward(type, amount) {
    // Hier müsste man in einem echten Casino einen Zeitstempel (Timestamp) prüfen, 
    // um zu verhindern, dass Nutzer einfach spammen. Für das UI-Mockup geben wir das Geld direkt.
    
    currentBalance += amount;
    localStorage.setItem(currentUser + "_balance", currentBalance);
    updateBalanceDisplay();
    updateLeaderboard();
    
    alert(`Du hast deine ${type} Belohnung von ${amount} Coins abgeholt!`);
}

function updateBalanceDisplay() {
    document.getElementById("balance").innerText = currentBalance.toLocaleString();
}

function updateLeaderboard() {
    // Füge den aktuellen Nutzer temporär dem Leaderboard hinzu, um den Effekt zu zeigen
    let allPlayers = [...globalLeaderboard];
    
    // Prüfen ob der Nutzer schon im Fake-Leaderboard ist
    let existingUser = allPlayers.find(p => p.name === currentUser);
    if (existingUser) {
        existingUser.balance = currentBalance;
    } else if (currentUser !== "Spanani") { // Admin ausblenden, wenn gewünscht
        allPlayers.push({ name: currentUser, balance: currentBalance });
    }

    // Sortieren (Meistes Geld zuerst)
    allPlayers.sort((a, b) => b.balance - a.balance);

    // HTML generieren
    const listHtml = document.getElementById("leaderboardList");
    listHtml.innerHTML = "";
    
    allPlayers.slice(0, 5).forEach((player, index) => {
        let isMe = player.name === currentUser ? "style='color: var(--accent-glow); font-weight: bold;'" : "";
        listHtml.innerHTML += `
            <div class="leaderboard-item" ${isMe}>
                <span>#${index + 1} ${player.name}</span>
                <span>${player.balance.toLocaleString()} Coins</span>
            </div>
        `;
    });
}
