// Math.floor(Math.random()*3)

// arr_events нигде не используется
var arr, /* arr_events = [], */ win_block, winner, again, winning, game;

// Символ который будет рисоваться когда компьютер делает ход
var comp_sym = "o";

// Символ который будет рисоваться когда пользователь делает ход
var user_sym = "x";

// Функция которая вызывается как только страница загрузилась
// https://htmlbook.ru/html/attr/onload
onload = function(){
    // Присваиваем переменным ссылки на HTML элементы (элементы определены в index.html)
    
    // <div id="game">
    // (элемент верхнего уровня который содержит весь интерфейс игры)
	game = document.getElementById("game");
    
    // <div class="inner">
    // Выбираем 9 элементов <div class="inner"> из каждой ячейки таблицы (<td>)
    // (внутри <div class="inner"> будет рисоваться "o" или "x")
	arr = game.getElementsByClassName("inner");

    // Блок в котором находится надпись, говорящая кто выиграл, и ссылка перезапуска игры
	win_block = document.getElementById("win_block");

    // <span class="winner"></span>
    // В этом элементе будет показываться кто выиграл (пользователь или компьютер)
	win_text = win_block.getElementsByClassName("winner")[0];

    // <span class="again">Играть еще!</span>
    // Ссылка перезапускающая игру
	again = win_block.getElementsByClassName("again")[0];

    // <div class="winning"></div>
    // Зеленый/красный/фиолетовый квадрат который рисуется поверх игрового поля когда игра закончена
	winning = game.getElementsByClassName("winning")[0];

    // Назначаем обработчик ссылке перезапускаюшей игру
	again.onclick = function(){
        // Прячем цветной квадрат рисующийся поверх игрового поля
		winning.style.display = "none";

        // Прячем блок в котором будет написано кто выиграл и в котором находится ссылка перезапуска игры
		win_block.style.display = "none";

        // Очистка игрового поля. Убираем "o"/"x" из каждой ячейки игрового поля
		clearTable();

        // С вероятностью 50% компьтер сделает первый ход (поставит "o" в случайную клетку игрового поля)
		randomMove();
	};

    // Назначаем каждой клетки игрового поля обработчик срабатываюший при щелчке мышью
	for(var i = 0; i < arr.length; i++){
		arr[i].onclick = function(){
            // Рисуем "x" в клетке по которой щелкнул пользователь
            // В this находитcя элемент по которому был сделан щелчок мышью:
            // https://learn.javascript.ru/introduction-browser-events#dostup-k-elementu-cherez-this
			drawSym(this);
		};

		/* тут хотел использовать addEven.. и потом убрать его, когда определился победитель */
	}

    // С вероятностью 50% компьтер сделает первый ход (поставит "o" в случайную клетку игрового поля)
	randomMove();
};

// С вероятностью 50% компьтер сделает первый ход (поставит "o" в случайную клетку игрового поля)
function randomMove(){
    // Случайно генерируем 0 или 1
	var rnd = getRandomInt(2);
	console.log(rnd);

    // С вероятностью 50% первый ход делает компьютер.
    // Если нет, первым играет пользователь
	if (rnd == 1) {
		autoDrawing(); // Ход компьютера
	}
	return true;
}

// Рисуем символ (sym) в HTML-элементе (item) и определяем есть ли победитель
// Если кто-то выиграл (компьтер или пользователь), выводим сообщение о выигрыше
// Аргументы функции:
// item - HTML-элемент в котором должен быть нарисован символ
// sym  - символ который нужено нарисовать.
//        если при вызове функции аргумент не передаётся,
//        будет использоваться значение по умолчанию - user_sym ("x")
function drawSym(item, sym = user_sym){
	// console.log(item);

    // Если в клетке что-то уже есть ("x" или "o"),
    // ничего не рисуем и возвращаем false (рисовка не была выполнена)
	if (item.hasChildNodes()) return false;

    // Рисуем символ в клетке ("x" или "o")
	item.innerHTML = sym;
	
    // Проверяем есть ли победитель
	var winner = checkWinner();


    // Если ход был сделан пользователем и нет победителя, компьютер делает ход
	if (sym == user_sym && !winner)
		autoDrawing(); // ход компьютера


	if (winner == user_sym) { // Если выиграл пользователь ("x")
		win_text.innerHTML = "Вы выиграли!";
		win_text.style.color = "green";
		winning.style.backgroundColor = "rgba(0,200,0, 0.5)";
	}else if (winner == comp_sym) { // Если выиграл компьютер ("o")
		win_text.innerHTML = "Выиграл компьютер! Попоробуйте еще раз!";
		win_text.style.color = "red";
		winning.style.backgroundColor = "rgba(200,0,0, 0.5)";
	}
    
    // Если есть победитель, делаем элемент показывающей сообщение о выигрыше видимым
	if (winner) {
		winning.style.display = "block";
		win_block.style.display = "block";
	}

    // Задача функции была выполнена (символ был успешно нарисован), возвращаем true
	return true;
}

// Функция проверяющая кто выиграл
// Если выиграл пользователь, возвращается "x" (user_sym)
// Если выиграл компьютер, возвращается "o" (comp_sym)
function checkWinner(){
    // Кто выиграл: "x" или "o" или "" (если нет победителя)
	var winner = "";

    // Множитель для вычисления координат строк
	var j = 0;


    // Ячейки по диагонали 1 (и левого верхнего угла в правый нижний)
	var xy_1_1 = arr[0].innerHTML;
	var xy_1_2 = arr[4].innerHTML;
	var xy_1_3 = arr[8].innerHTML;

    // Ячейки по диагонали 2 (и правого верхнего угла в левый нижний)
	var xy_2_1 = arr[2].innerHTML;
	var xy_2_2 = arr[4].innerHTML;
	var xy_2_3 = arr[6].innerHTML;

    // Если хотя бы одна диагональ заполнена
	if ((xy_1_1 && xy_1_2 && xy_1_3) || (xy_2_1 && xy_2_2 && xy_2_3)) {

		if (xy_1_1 == user_sym && xy_1_2 == user_sym && xy_1_3 == user_sym) {
            // Если диагональ 1 заполнена клетками пользователя
			winner = user_sym;
		}
		else if(xy_1_1 == comp_sym && xy_1_2 == comp_sym && xy_1_3 == comp_sym){
            // Если диагональ 1 заполнена клетками компьютера
			winner = comp_sym;
		}


		if (xy_2_1 == user_sym && xy_2_2 == user_sym && xy_2_3 == user_sym) {
            // Если диагональ 2 заполнена клетками пользователя
			winner = user_sym;
		}
		else if(xy_2_1 == comp_sym && xy_2_2 == comp_sym && xy_2_3 == comp_sym){
            // Если диагональ 2 заполнена клетками компьютера
			winner = comp_sym;
		}
	}



    // Если при проверки диагоналей не был найден победитель проверяем другие места
    // (строки и столбцы)
	if (!winner){
		for(var i = 0; i < 3; i++){

			// alert(i);

            // Выбираем столбец
			var a1 = arr[i].innerHTML;
			var a2 = arr[i + 3].innerHTML;
			var a3 = arr[i + 6].innerHTML;

            // Следующий три строчки кода делают бессмыслицу
            // (эти значения не будут использованы и будут переопределены в коде ниже)
			var b1 = arr[i].innerHTML;
			var b2 = arr[i + 1].innerHTML;
			var b3 = arr[i + 2].innerHTML;
			

			// console.log("b1 = '" + (b1) + "' b2 = '" + (b2) + "' b3 = '" + (b3) +"'");

			if (a1 == user_sym && a2 == user_sym && a3 == user_sym) {
                // Столбец заполнен клетками пользователя
				winner = user_sym;
				break;
			}
			else if(a1 == comp_sym && a2 == comp_sym && a3 == comp_sym){
                // Столбец заполнен клетками компьютера
				winner = comp_sym;
				break;
			}


			if (i != 0) j = 3*i;

            // Выбираем строку
			b1 = arr[j].innerHTML;
			b2 = arr[j + 1].innerHTML;
			b3 = arr[j + 2].innerHTML;

			if (b1 == user_sym && b2 == user_sym && b3 == user_sym) {
                // Строка заполнена клетками пользователя
				winner = user_sym;
				break;
			}
			else if(b1 == comp_sym && b2 == comp_sym && b3 == comp_sym){
                // Строка заполнена клетками компьютера
				winner = comp_sym;
				break;
			}

			// Если мы определили победителя, не делаем больше проверок
			if (winner) 
				break;
		}
	}

	return winner;
}

// Ход компьютера (нарисует "o" в случайной пустой клетке игрового поля)
// Если пустых клеток нет, пользователю будет показно сообщение о ничье
function autoDrawing(){
    // Если не осталось пустых клеток, показываем сообщения о ничье и возвращаем false
	if (!ckeckFreeSpace()) {
		
		win_text.innerHTML = "Выиграла ничья! ";
		win_text.style.color = "blue";
		winning.style.display = "block";
		winning.style.backgroundColor = "rgba(0,0,200, 0.5)";
		win_block.style.display = "block";

		return false;
	}
	var el, rnd;

    // Генерируем случайное число и много раз пытаемся нарисовать
    // символ в ячейке пока не получится (пока мы случайно не попадём в свободную ячейку)
	do{
		// Выбриаем случайное число от 0 до 8 включительно
		rnd = getRandomInt(arr.length);
		// Выбираем клетку игрового поля соответствующую этому числу
		el = arr[rnd];
		// console.log(rnd);
	} while(!drawSym(el, comp_sym)); // бесконечно повторяем пока успешно не нарисуем (пока не попадём в пустую клетку)

    // Проверям остались ли свободные клетки
    // Если не осталось, функция рекурсивно вызывает саму себя и покажет сообщение о ничье
	if (!ckeckFreeSpace()) {
		autoDrawing(); // покажет сообщение и вернёт false ничего не рисуя
	}
}

// Очистка. Убираем "o"/"x" из каждой ячейки игрового поля
function clearTable(){
	for(var i = 0; i < arr.length; i++){
		arr[i].innerHTML =  "";
	}
}

// Проверить остались ли пустые клетки
function ckeckFreeSpace(){
	var res = false;

	for(var i = 0; i < arr.length; i++){
		if (arr[i].hasChildNodes()){
            // Если в клетке есть дочерний элемент ("o" или "x") значит клетка не пуста
			res = false;
		}else{
            // Клетка пуста
            // Возвращаем true и не проверяем больше
			res = true;
			break;
		}
	}

	return res;
}

// Функция возвращаю случайное число меньшее чем max
function getRandomInt(max){
	return Math.floor(Math.random() * max);
}






// Не используется
// function addHandler(el, ev, func ){
// 	try{
// 		el.addEventListener(ev, func, false);
// 	}
// 	catch(e){
// 		el.attachEvent("on"+ev, func);
// 	}
// }

// Не используется
// function removerEvent(el, ev, func){
// 	try{
// 		el.removeEventListener(ev, func, false);

// 	}catch(x){
// 		el.detachEvent("on"+ev, func);
		
// 	}
// }
