


const ngrok_url = 'https://1d1b-2a00-1fa0-102-12a6-7c37-5c6e-4f9b-d73f.ngrok-free.app';


$('#comment-form').submit(function(event) {
    event.preventDefault();
    var username = $('#username').val();
    var comment = $('#comment').val();
    
    // Отправка POST запроса с комментариями
    $.ajax({
        url: ngrok_url + '/',  /// путь 4
        method: 'POST',
        data: {
            username: username,
            comment: comment
        },
        headers: {
            'ngrok-skip-browser-warning': 'true'  
        },
        success: function(response) {
            console.log('Ответ от сервера (POST):', response);
            loadComments();  
            $('#comment-form')[0].reset();
        },
        error: function(xhr, status, error) {
            console.log('Ошибка при отправке комментария:', status, error);
        }
    });
});

function loadComments() {
    $.ajax({
        url: ngrok_url+'/',  // путь 3
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'  
        },
        success: function(data) {
            console.log('Полученные данные от сервера (GET):', data);
            
            $('#comments-container').empty();  // Очищаем контейнер для комментариев

            // Проверяем, есть ли комментарии и выводим их
            if (data.comments && data.comments.length > 0) {
                data.comments.forEach(function(comment) {
                    var commentHTML = `
                        <div class="comment">
                            <h3><strong>${comment.username}:</strong></h3> <p>${comment.content}</p>
                        </div>
                    `;
                    $('#comments-container').append(commentHTML);
                });
            } else {
                $('#comments-container').append('<p>Комментариев нет.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.log('Ошибка при загрузке комментариев:', status, error);
            $('#comments-container').append('<p>Ошибка загрузки комментариев. Попробуйте позже.</p>');
        }
    });
}

$(document).ready(function() {
    loadComments();  // Загружаем комментарии при загрузке страницы



    document.querySelectorAll('.elem').forEach(function(item) {
        let count = 1;  // Переменная для количества каждого товара
        const counterElement = item.querySelector('.counter'); 
        const increaseButton = item.querySelector('.increase'); 
        const decreaseButton = item.querySelector('.decrease'); 
        const orderButton = item.querySelector('.orderButton'); 
        const productPriceElement = item.querySelector('.new-price');
        const productName = item.querySelector('h3'); // Получаем название товара
        const totalMessage = document.getElementById('totalMessage');
        
        // Обновление счётчика
        function updateCounter() {
            counterElement.textContent = count;
            updateTotalPrice();
        }
    
        // Обновление итоговой цены
        function updateTotalPrice() {
            const productPrice = parseFloat(productPriceElement.textContent.replace('р', '').trim());
            const totalPrice = productPrice * count;
            totalMessage.innerHTML = `Вы точно хотите заказать "${productName.textContent}" в количестве ${counterElement.textContent} ? <br> Итоговая сумма: ${totalPrice.toFixed(2)} рублей.`;
        }
    
        // Обработчики кнопок увеличения/уменьшения
        increaseButton.addEventListener('click', function() {
            count++;
            updateCounter();
        });
    
        decreaseButton.addEventListener('click', function() {
            if (count > 1) {
                count--;
                updateCounter();
            }
        });
    
        // Показать модальное окно при заказе
        orderButton.addEventListener('click', function() {
            updateTotalPrice();
            document.getElementById('modal').style.display = 'block';
            document.getElementById('modal').setAttribute('data-product', productName.textContent);
            document.getElementById('modal').setAttribute('data-count', count);  // Сохраняем количество товара в модальном окне
            document.getElementById('modal').setAttribute('data-total', (parseFloat(productPriceElement.textContent.replace('р', '').trim()) * count).toFixed(2));

        });
    });
    
    // Закрытие модального окна
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });
    
    // Обработчик формы для телефона
    document.getElementById('phoneForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = document.getElementById('phone').value;
        const productName = document.getElementById('modal').getAttribute('data-product'); // Получаем название товара из модального окна
        const count = document.getElementById('modal').getAttribute('data-count'); // Получаем количество товара из модального окна
        const total = document.getElementById('modal').getAttribute('data-total');
        
    
        if (phone) {
            const orderData = {
                phone: phone,
                productName: productName,
                quantity: count,  // Передаем правильное количество товара
                totalPrice: total
            };
    
            // Отправка данных через fetch
            fetch(ngrok_url+'/submit_order', { ///Путь 2
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Заказ оформлен успешно!');
                    document.getElementById('modal').style.display = 'none';
                } else {
                    alert('Произошла ошибка при оформлении заказа.');
                }
            })
            .catch(error => {
                alert('Ошибка: ' + error);
            });
        } else {
            alert('Пожалуйста, введите вашу почту.');
        }
    });
});

//Переворот карточки 
function flipсard(card, event) {
    if (event.target.tagName.toLowerCase() === 'button') {
        return 0; 
    }
    else {
    card.classList.toggle("flipped"); 
    }
}

//Прокрутка экрана в нужную область 
function scrolltoelement(element) {
    const section = document.getElementById(element);
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth"  
    });
  }




let check; 


function searchOrders() {
    let check;
    check = document.getElementById('phone').value;  

    if (!check) {
        alert("Пожалуйста, введите адрес почты.");
        return;
    }

    // Отправка POST запроса для получения кода подтверждения
    fetch(ngrok_url+'/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: check }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            /// - блок с вводом почты + блок с вводом кода
           
            document.getElementById('codeVerification').style.display = 'block'
            document.querySelector('.find_place').style.display = 'none';

        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при поиске.');
    });
}

function verifyCode() {
    const code = document.getElementById('verificationCode').value;
    const phone = document.getElementById('phone').value;  

    if (!code || !phone) {
        alert("Пожалуйста, введите код подтверждения и почту.");
        return;
    }

    console.log("Отправляем код на сервер: " + code + ", Почта: " + phone);  

    
    fetch(ngrok_url+'/verify_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            phone: phone
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Код подтверждения верный!");
            document.querySelector('.delivery').style.display = 'block';

            displayOrders(data);
        }
    })
    
}

/// отправка данных о адресе доставки
function send_delivery_address() {
    const deliveryAddress = document.getElementById('delivery_address').value;
    const phone = document.getElementById('phone').value;  

    if (!deliveryAddress || !phone) {
        alert("Пожалуйста, введите почту и адрес доставки.");
        return;
    }

    console.log("Отправляем почту: " + phone + " и адрес: " + deliveryAddress);

    
    fetch(ngrok_url + '/save_delivery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: phone,
            deliveryAddress: deliveryAddress
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Данные успешно сохранены!");
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке данных.');
    });
}
///Формирования списка заказов
function displayOrders(data) {
    const rezults = document.getElementById('results');
    rezults.innerHTML = "";  

    console.log("Тип данных (data):", typeof data);  
    console.log("Данные, полученные от сервера:", data);  

    if (data.error) {
        // Если сервер вернул ошибку, выводим сообщение
        rezults.innerHTML = `<p>${data.error}</p>`;
        console.error("Ошибка от сервера:", data.error);
        return;
    }

    // Проверяем, что 'orders' существует и является массивом
    if (Array.isArray(data.orders)) {
        console.log("Полученные заказы (orders):", data.orders);  // Логируем массив заказов
    } else {
        console.error("Ошибка: Ожидался массив 'orders', но получен:", typeof data.orders);
        rezults.innerHTML = "<p>Ошибка при получении заказов. Пожалуйста, попробуйте снова.</p>";
        return;
    }

    if (data.orders.length === 0) {
        rezults.innerHTML = "<p>Заказы с таким адресом почты не найдены.</p>";
        console.log("Заказы не найдены.");
    } else {
        data.orders.forEach(order => {
            const card = document.createElement('div');
            card.classList.add('order-card');

            card.innerHTML = `
                <h3>Позиция: ${order["Позиция"]}</h3>
                <p>Количество: ${order["Количество"]}</p>
                <p class="total">Итоговая сумма: ${order["Итоговая сумма"]} ₽</p>
            `;

            rezults.appendChild(card);
            console.log("Карточка добавлена в DOM:", card);
        });
    }

    // Добавляем дополнительную карточку с формой для запроса товара
    const requestCard = document.createElement('div');
    requestCard.classList.add('order-card');
    requestCard.classList.add('request-card');

    requestCard.innerHTML = `
        <h3>Не нашли нужный товар?</h3>
        <p>Запросите его здесь:</p>
        <form id="productRequestForm">
            <label for="productName">Название товара:</label>
            <input type="text" id="productName" name="productName" required placeholder="Введите название товара">
            <button type="submit">Отправить</button>
        </form>
    `;

    requestCard.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value.trim();
        const email = document.getElementById('phone').value.trim();  // Используем почту/телефон из поля с id="phone"

        if (productName && email) {
            send_need_product(email, productName);
        } else {
            alert("Пожалуйста, заполните все поля.");
        }
    });

    rezults.appendChild(requestCard);
    console.log("Карточка с запросом добавлена в DOM:", requestCard);
}

function send_need_product(email, productName) {
    fetch(ngrok_url+'/request_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            productName: productName,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Ваш запрос на товар успешно отправлен!");
        } else {
            alert("Произошла ошибка при отправке запроса.");
        }
    })
    .catch(error => {
        console.error("Ошибка при отправке запроса:", error);
        alert("Произошла ошибка. Пожалуйста, попробуйте позже.");
    });
}



///Кнопки появления товаров
const button_korneplod_vision = document.getElementById('ogorod_korneplodi');
button_korneplod_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_korneplodi_container");
  container.classList.toggle("hidden");  
});

const button_luk_vision = document.getElementById('ogorod_luk');
button_luk_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_luk_container");
  container.classList.toggle("hidden");  
});

const button_tykva_vision = document.getElementById('ogorod_tykva');
button_tykva_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_tykva_container");
  container.classList.toggle("hidden");  
});

const button_ogurez_vision = document.getElementById('ogorod_ogurez');
button_ogurez_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_ogurez_container");
  container.classList.toggle("hidden");  
});

const button_travi_vision = document.getElementById('ogorod_travi');
button_travi_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_travi_container");
  container.classList.toggle("hidden");  
});

const button_pomidor_vision = document.getElementById('ogorod_pomidor');
button_pomidor_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_pomidor_container");
  container.classList.toggle("hidden");  
});

const button_jagodi_vision = document.getElementById('sad_jagodi');
button_jagodi_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_jagodi_container");
  container.classList.toggle("hidden");  
});

const button_ploderevia_vision = document.getElementById('sad_ploderevia');
button_ploderevia_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_ploderevia_container");
  container.classList.toggle("hidden");  
});

const button_flowers_vision = document.getElementById('sad_flowers');
button_flowers_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_flowers_container");
  container.classList.toggle("hidden");  
});

const button_decderevia_vision = document.getElementById('sad_decderevia');
button_decderevia_vision.addEventListener('click', function() {
  this.classList.toggle('clicked');
  var container = document.getElementById("cards_decderevia_container");
  container.classList.toggle("hidden");  
});





///динамическая смена фона 
const background_box = [
    'url("images/fruits_header.jpg")',
    'url("images/vegetables_ogorod_back.jpg")'
];
let nowback = 0;
const element = document.getElementById('backgroundchange');
function changeback() 
{
    nowback = (nowback + 1) % background_box.length;  /// нахожу остаток для того чтобы не переполнять счётчик 
    element.style.backgroundImage = background_box[nowback];  
}

setInterval(changeback, 10000);


