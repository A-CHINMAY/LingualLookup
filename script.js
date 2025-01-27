document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('word-input');
    const searchBtn = document.getElementById('search-btn');
    const speakBtn = document.getElementById('speak-btn');
    const resultContainer = document.getElementById('result');
    const wordTitle = document.getElementById('word-title');
    const phoneticEl = document.getElementById('phonetic');
    const definitionsEl = document.getElementById('definitions');
    const synonymsEl = document.getElementById('synonyms');

    // Free Dictionary API endpoint
    const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    // Function to fetch word data
    async function fetchWordData(word) {
        try {
            const response = await fetch(`${API_URL}${word}`);

            if (!response.ok) {
                throw new Error('Word not found');
            }

            const data = await response.json();
            displayWordData(data[0]);
        } catch (error) {
            displayError(error.message);
        }
    }

    // Display word data
    function displayWordData(wordData) {
        // Reset previous results
        wordTitle.textContent = '';
        phoneticEl.textContent = '';
        definitionsEl.innerHTML = '';
        synonymsEl.innerHTML = '';

        // Display word and phonetic
        wordTitle.textContent = wordData.word;
        phoneticEl.textContent = wordData.phonetic || 'No phonetic information';

        // Display definitions
        definitionsEl.innerHTML = '<h3>Definitions:</h3>';
        wordData.meanings.forEach(meaning => {
            meaning.definitions.forEach(def => {
                const defItem = document.createElement('div');
                defItem.classList.add('definition-item');
                defItem.innerHTML = `
                    <strong>${meaning.partOfSpeech}</strong>: 
                    ${def.definition}
                    ${def.example ? `<br><em>Example: ${def.example}</em>` : ''}
                `;
                definitionsEl.appendChild(defItem);
            });
        });

        // Display synonyms
        const synonyms = wordData.meanings.flatMap(meaning =>
            meaning.synonyms || []
        ).filter(Boolean);

        if (synonyms.length > 0) {
            synonymsEl.innerHTML = '<h3>Synonyms:</h3>';
            const synonymsList = document.createElement('div');
            synonymsList.classList.add('synonyms-list');

            synonyms.slice(0, 10).forEach(synonym => {
                const synonymTag = document.createElement('span');
                synonymTag.classList.add('synonym-tag');
                synonymTag.textContent = synonym;
                synonymsList.appendChild(synonymTag);
            });

            synonymsEl.appendChild(synonymsList);
        }

        // Show result container
        resultContainer.style.display = 'block';
    }

    // Display error
    function displayError(message) {
        wordTitle.textContent = 'Error';
        phoneticEl.textContent = '';
        definitionsEl.innerHTML = `<p style="color: red;">${message}</p>`;
        synonymsEl.innerHTML = '';
        resultContainer.style.display = 'block';
    }

    // Text-to-speech functionality
    function speakWord() {
        const word = wordTitle.textContent;
        if (word) {
            const utterance = new SpeechSynthesisUtterance(word);
            speechSynthesis.speak(utterance);
        }
    }

    // Search button event listener
    searchBtn.addEventListener('click', () => {
        const word = wordInput.value.trim();
        if (word) {
            fetchWordData(word);
        }
    });

    // Enter key support
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const word = wordInput.value.trim();
            if (word) {
                fetchWordData(word);
            }
        }
    });

    // Speak button event listener
    speakBtn.addEventListener('click', speakWord);
});
