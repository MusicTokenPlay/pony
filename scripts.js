document.addEventListener("DOMContentLoaded", function() {
    // Получаем ссылки на все нужные элементы
    const sobElements = document.querySelectorAll(".sob");
    const counterElement = document.getElementById("st1-counter");
    const boxCenter = document.querySelector(".box_center");
    const modalBox = document.getElementById("modal_box");
    const modalContents = document.querySelectorAll(".modal_content");
    const box1 = document.querySelector(".box1");
    const button1 = document.getElementById("button1");
    const button3 = document.getElementById("button3");
    const box1Progress = document.getElementById("box1-progress");
    const circles = document.querySelectorAll(".modal_circle");
    const flyNumberContainer = document.getElementById("fly-number-container");

    // Инициализация переменных
    let counter = 0; // Счетчик кликов
    let clicksToFillProgress = 30; // Количество кликов, необходимых для появления boxCenter
    let progressClicks = 0; // Количество кликов по sob для заполнения прогресса
    let box1ProgressClicks = 0; // Количество кликов по boxCenter для прогресса box1
    let boxCenterAppearances = 0; // Количество появлений boxCenter
    let isBoxCenterActive = false; // Флаг активности boxCenter
    let activeSob = null; // Текущий активный sob элемент

    // Функция для сохранения данных в localStorage
    function saveProgress() {
        const progressData = {
            counter,
            boxCenterAppearances,
            progressClicks
        };
        localStorage.setItem('gameProgress', JSON.stringify(progressData));
    }

    // Функция для загрузки данных из localStorage
    function loadProgress() {
        const savedData = localStorage.getItem('gameProgress');
        if (savedData) {
            const progressData = JSON.parse(savedData);
            counter = progressData.counter;
            boxCenterAppearances = progressData.boxCenterAppearances;
            progressClicks = progressData.progressClicks;
            counterElement.textContent = counter;
            updateBox1Progress();
        }
    }

    // Функция для получения случайного изображения
    function getRandomImage() {
        return Math.random() < 0.67 ? 'img/top_st1.png' : 'img/top_st3.png';
    }

    // Функция для показа случайного sob элемента
    function showRandomSob() {
        if (isBoxCenterActive) return; // Если boxCenter активен, ничего не делаем

        // Выбираем случайный sob элемент
        const randomIndex = Math.floor(Math.random() * sobElements.length);
        activeSob = sobElements[randomIndex];
        const randomImage = getRandomImage();

        // Устанавливаем изображение и делаем элемент видимым
        activeSob.style.backgroundImage = `url('${randomImage}')`;
        activeSob.style.opacity = 1;
        activeSob.dataset.image = randomImage;

        // Добавляем обработчик клика на sob элемент
        activeSob.addEventListener('click', handleSobClick);
    }

    // Обработчик клика на sob элемент
    function handleSobClick(event) {
        const clickedSob = event.currentTarget;
        const image = clickedSob.dataset.image;
        let value;

        // Увеличиваем счетчики в зависимости от изображения
        if (image.includes('top_st1.png')) {
            value = 1;
            counter += value;
            progressClicks += 1;
        } else {
            value = 3;
            counter += value;
            progressClicks += 3;
        }

        // Обновляем счетчик на экране
        counterElement.textContent = counter;
        clickedSob.style.backgroundImage = 'none';
        clickedSob.style.opacity = 0.5;
        clickedSob.removeEventListener('click', handleSobClick); // Удаляем обработчик клика
        activeSob = null; // Сбрасываем активный sob элемент

        updateProgress(); // Обновляем прогресс

        // Показываем следующий sob элемент, если boxCenter не активен
        if (!isBoxCenterActive) {
            showRandomSob();
        }

        // Сохраняем прогресс
        saveProgress();

        // Показываем летающее число
        showFlyNumber(value, event.clientX, event.clientY);
    }

    // Функция для обновления прогресса
    function updateProgress() {
        // Если прогресс достиг требуемого значения, активируем boxCenter
        if (progressClicks >= clicksToFillProgress) {
            activateBoxCenter();
            progressClicks = 0; // Сбрасываем счетчик прогресса
        }
    }

    // Функция для активации boxCenter
    function activateBoxCenter() {
        isBoxCenterActive = true;
        boxCenter.style.pointerEvents = 'auto';
        boxCenter.style.opacity = 1;
        boxCenterAppearances += 1; // Увеличиваем количество появлений boxCenter
        boxCenter.addEventListener('click', handleBoxCenterClick);

        // Деактивируем boxCenter через 10 секунд
        setTimeout(deactivateBoxCenter, 10000);
    }

    // Обработчик клика на boxCenter
    function handleBoxCenterClick(event) {
        const value = 10;
        counter += value;
        counterElement.textContent = counter;
        box1ProgressClicks += 1;

        // Обновляем прогресс для box1 при каждом клике на boxCenter
        updateBox1Progress();

        // Сохраняем прогресс
        saveProgress();

        // Показываем летающее число
        showFlyNumber(value, event.clientX, event.clientY);
    }

    // Функция для деактивации boxCenter
    function deactivateBoxCenter() {
        isBoxCenterActive = false;
        boxCenter.style.pointerEvents = 'none';
        boxCenter.style.opacity = 0;
        boxCenter.removeEventListener('click', handleBoxCenterClick);

        // Показываем следующий sob элемент после деактивации boxCenter
        showRandomSob();
    }

    // Функция для обновления прогресса box1
    function updateBox1Progress() {
        // Расчет процента прогресса на основе количества появлений boxCenter
        const progressPercentage = Math.min((boxCenterAppearances / 5) * 100, 100);
        box1Progress.style.width = `${progressPercentage}%`;

        // Если прогресс достиг 100%, активируем box1
        if (progressPercentage >= 100) {
            activateBox1();
        }
    }

    // Функция для активации box1
    function activateBox1() {
        box1.classList.add('active');
        box1Progress.classList.add('filled'); // Убираем класс "progressing" после активации
    }

    // Функция для скрытия всех модальных окон
    function hideAllModals() {
        modalBox.style.display = 'none';
        modalContents.forEach(modalContent => {
            modalContent.style.display = 'none';
        });
    }

    // Функция для переключения модального окна
    function toggleModal(modalContentId) {
        const modalContent = document.getElementById(modalContentId);
        if (modalContent.style.display === 'flex') {
            hideAllModals();
        } else {
            hideAllModals();
            modalBox.style.display = 'flex';
            modalContent.style.display = 'flex';
        }
    }

    // Функция для скрытия модального окна при клике вне его
    function hideModal(event) {
        if (event.target === modalBox) {
            hideAllModals();
        }
    }

    // Добавляем обработчик клика на box1 для вызова модального окна
    box1.addEventListener('click', function() {
        if (box1.classList.contains('active')) {
            // Назначаем случайные значения для кругов
            circles.forEach(circle => {
                const randomValue = Math.floor(Math.random() * 3) === 0 ? 100 : (Math.floor(Math.random() * 2) === 0 ? 1000 : 5000);
                circle.dataset.value = randomValue;
                circle.textContent = randomValue;
            });

            // Показать модальное окно
            toggleModal('modal_box01');
        }
    });

    // Добавляем обработчики кликов на круги внутри модального окна
    circles.forEach(circle => {
        circle.addEventListener('click', function(event) {
            const value = parseInt(event.currentTarget.dataset.value, 10);
            counter += value; // Увеличиваем счетчик на значение круга
            counterElement.textContent = counter; // Обновляем счетчик на экране

            // Скрыть модальное окно и сбросить прогресс box1
            hideAllModals();
            box1.classList.remove('active');
            box1Progress.style.width = '0';
            boxCenterAppearances = 0; // Сбрасываем количество появлений boxCenter

            // Сохраняем прогресс
            saveProgress();

            // Показываем летающее число
            showFlyNumber(value, event.clientX, event.clientY);
        });
    });

    // Функция для отображения летающего числа
    function showFlyNumber(value, x, y) {
        const flyNumber = document.createElement('div');
        flyNumber.className = 'fly-number';
        flyNumber.textContent = `+${value}`;
        flyNumber.style.left = `${x}px`;
        flyNumber.style.top = `${y}px`;

        flyNumberContainer.appendChild(flyNumber);

        // Удаляем элемент после окончания анимации
        flyNumber.addEventListener('animationend', function() {
            flyNumberContainer.removeChild(flyNumber);
        });
    }

    // Добавляем обработчики кликов на другие кнопки для вызова соответствующих модальных окон
    button1.addEventListener('click', function() {
        toggleModal('modal_box02');
    });

    button3.addEventListener('click', function() {
        toggleModal('modal_box03');
    });

    // Добавляем обработчик для скрытия модального окна при клике вне его
    modalBox.addEventListener('click', hideModal);

    // Инициализация: скрываем все модальные окна при загрузке страницы и показываем первый случайный sob элемент
    hideAllModals();
    loadProgress(); // Загружаем сохраненный прогресс при загрузке страницы
    showRandomSob();
});