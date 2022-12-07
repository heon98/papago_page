const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');
const [sourceTextArea, targetTextArea] = document.querySelectorAll('textarea');
const changeButton = document.getElementById('changeButton');

// console.log(sourceSelect, targetSelect, sourceTextArea, targetTextArea);

let targetLanguage = 'en';

targetSelect.addEventListener('change', () => {
    targetLanguage = targetSelect.value;
});

changeButton.addEventListener('click', () => {

})

let debouncer;
sourceTextArea.addEventListener('input', (event) => {
    if (debouncer) clearTimeout(debouncer);


    debouncer = setTimeout(() => {
        const text = event.target.value; // 번역할 텍스트
        if (!text) return

        // 언어감지 URL
        const url = '/detect';

        // 보낼 데이터
        const requestData = {
            query: text
        };

        // fetch() 부가 옵션
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
        }

        // 언어 감지 요청
        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                const sourceLanguage = data.langCode; // 'ko'
                sourceSelect.value = sourceLanguage;


                // 언어 번역 요청 URL

                if (sourceLanguage === targetLanguage) {
                    if (sourceLanguage === 'ko') {
                        targetLanguage = 'en'
                    } else {
                        targetLanguage = 'ko';
                    }
                }

                const url = '/translate';

                // 보낼 데이터
                const requestData = {
                    source: sourceLanguage,
                    target: targetLanguage,
                    text,
                };

                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData),
                }

                fetch(url, options)
                    .then(response => response.json())
                    .then((json) => {
                        const result = json.message.result;
                        targetTextArea.value = result.translatedText;
                        targetSelect.value = result.tarLangType;
                    });
            });
    }, 2000)
});