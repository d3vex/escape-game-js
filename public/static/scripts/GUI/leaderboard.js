/**
 * Fonction pour charger et afficher le leaderboard
 */
async function loadLeaderboard() {
    try {
        console.log("Fetching leaderboard data...");
        const response = await fetch('/api/leaderboard');

        if (!response.ok) {
            throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
        }

        const leaderboardData = await response.json();
        console.log("Leaderboard data received:", leaderboardData);

        const leaderboardTable = document.querySelector('.leaderboard');
        if (!leaderboardTable) {
            console.error("Leaderboard table element not found");
            return;
        }

        // Récupérer l'en-tête du tableau
        const tableHeader = leaderboardTable.querySelector('thead');

        // Vider le tableau
        leaderboardTable.innerHTML = '';

        // Réajouter l'en-tête
        if (tableHeader) {
            leaderboardTable.appendChild(tableHeader);
        } else {
            // Créer un nouvel en-tête si nécessaire
            const newHeader = document.createElement('thead');
            newHeader.innerHTML = `
                <tr>
                    <th>Pseudo</th>
                    <th>Remaining time</th>
                </tr>
            `;
            leaderboardTable.appendChild(newHeader);
        }

        // Créer le corps du tableau
        const tableBody = document.createElement('tbody');

        // Vérifier si le leaderboard est vide
        if (leaderboardData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2;
            cell.textContent = 'No scores yet. Be the first!';
            row.appendChild(cell);
            tableBody.appendChild(row);
        } else {
            // Ajouter chaque entrée du leaderboard
            leaderboardData.forEach(entry => {
                const row = document.createElement('tr');

                const pseudoCell = document.createElement('td');
                pseudoCell.textContent = entry.pseudo;

                const timeCell = document.createElement('td');
                // Formater le temps en minutes:secondes
                const minutes = Math.floor(entry.time / 60);
                const seconds = entry.time % 60;
                timeCell.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                row.appendChild(pseudoCell);
                row.appendChild(timeCell);
                tableBody.appendChild(row);
            });
        }

        leaderboardTable.appendChild(tableBody);
    } catch (error) {
        console.error('Error loading leaderboard:', error);

        const leaderboardTable = document.querySelector('.leaderboard');
        if (leaderboardTable) {
            // Garder l'en-tête si présent
            const tableHeader = leaderboardTable.querySelector('thead');
            leaderboardTable.innerHTML = '';
            if (tableHeader) {
                leaderboardTable.appendChild(tableHeader);
            }

            // Afficher le message d'erreur
            const tbody = document.createElement('tbody');
            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.colSpan = 2;
            errorCell.textContent = 'Failed to load leaderboard. Please try again later.';
            errorRow.appendChild(errorCell);
            tbody.appendChild(errorRow);
            leaderboardTable.appendChild(tbody);
        }
    }
}

// Charger le leaderboard quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, loading leaderboard...");
    loadLeaderboard();
});