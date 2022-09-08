## Встраиваемый виджет погоды

Универсальный и легко встраиваемый виджет погоды, разработанный на **Vue.js 3** с использованием **TypeScript** и препроцессора стилей **SCSS**.

Всю информацию, которую обрабатывает и выводит виджет, взята из бесплатного публичного [API OpenWeatherMap](https://openweathermap.org/api).

---

## Как установить виджет на сайт?

Для этого нужно просто подключить один _.js_ файл к вашему веб-сайту и прописать тэг `<weather-widget/>` в вашей разметке.

> Вот пример подключения виджета на основе пустой HTML-разметки:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Weather Widget - test</title>
    </head>
    <body>

        <weather-widget/>
        <script type="text/javascript" src="/weather_widget--app.js"></script>

    </body>
</html>
```

---

## Что умеет виджет?

~ВООБЩЕ ВСЁ~

1.  Запрашивать местоположение пользователя и определять погоду по местоположению;
2.  Предусмотрено множество (это действительно так) сценариев скрипта, которые проигрываются в зависимости от действий пользователя;
3.  Виджет умеет хранить в кэше необходимую информацию, которая помогает оставаться виджету быстро действенным и нересурсозатратным;
4.  Даёт пользователю полную свободу в сортировке избранных локаций, которая также запоминается виджетом и в дальнейшем выводит элементы в соответствии с настройкой пользователя;
5.  Полностью валидную и адаптивную HTML-разметку, которая не сломает ваш сайт.

---

## Экраны виджета

> Основной экран
>
> ![](https://i.postimg.cc/rF3fCw20/main.png)

> Экран настроек
>
> ![](https://i.postimg.cc/htmpCRKC/settings.png)

> Экран ручного ввода города (если юзер заблокировал определение местоположения)
>
> ![](https://i.postimg.cc/8CBwSdJM/upps.png)
 
> Основной экран при загрузке информации
>
> ![](https://i.postimg.cc/CKVJXr1w/upload.png)

> Предложение юзеру переключится с активного элемента X, на текущую определённую с помощью местоположения, локацию Y
>
> ![](https://i.postimg.cc/PxXyrLYc/switch.png)

---

## Какие технологии были использованы?

```plaintext
TypeScript ( 4.5.5) : типизация JS-кода;
Vue ( 3.2.13) : основной функционал виджета;
Axios ( 0.27.2) : GET-запросы к API;
Vuedraggable ( 4.1.0) : функционал Drag&Drop для избранных локаций в настройках виджета.
```

[_t.me: @ulmanss_](https://t.me/ulmanss)
