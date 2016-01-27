# level2. 大規模へのマイグレーション

## 用語

### AngularJSのライフサイクル

AngularJSは実行段階に応じて幾つかのフックポイントを提供しています。

1. bootstraping  ... ngAppの実行タイミング
2. config-blocks ... module.config(fn) 
3. run-blocks    ... module.run(fn)
4. compile       ... templateをコンパイルし、Controllerを実行

各サービスのセットアップ等は `config-blocks` で行いますが、サービスのセットアップ段階のためDIによって注入できないサービスがあるため注意が必要です。

そのため、アプリケーション自体の初期化は `run-blocks`で行い、`config-blocks`ではサービスのセットアップのみを行います。

## ルーティングする

URLとアプリの状態を連携させ、機能を分割することを考えます。

AngularJSには[ngRoute](https://docs.angularjs.org/api/ngRoute)というmoduleが提供されていますが、これは窓から投げ捨てましょう。

### UI-Router

UI-RouterはAngularJSのサードパーティ製のルーティングライブラリです。

UI-Routerの特徴は、_ページとURI_ ではなく _`state`とURI_ を連携させる。

#### state

アプリから見た、UIの単位

- ネストでき、親から子に状態を引き継げる
- 単位はtemplateとcontroller
- Componentの考え方に近い(いまとなっては)

stateの表現方法は数種類あるので、
使うときは常にドキュメントを参照し動作を確認しながら進めることをおすすめする。

#### 実装例

```js
angular.module('routerExample', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider
      // stateの定義を行う
      .state('app', {
        template: 'app.html'
      })
      .state('app.header', {
        views: {
          "header": {
            controller: 'HeaderCtrl',
            controllerAs: 'header',
            template: 'header.html',
          }
        }
      })
      .state('app.body', {
        controller: 'BodyCtrl',
        controllerAs: 'body',
        template: 'body.html'
      })
  })
  .controller('HeaderCtrl', function () {
    var vm = this
  })
  .controller('BodyCtrl', function () {
    var vm = this
  })
```

```html
<!doctype html>
<html lang="ja" ng-app="routerExample">
  <meta charset="UTF-8">
  <script src="js/angular.js"></script>
  <script src="js/angular-ui-router.js"></script>

  <article ui-view></article>

  <script type="text/ng-template" id="app.html">
    <header ui-view="header"></header>
    <div ui-view="body"></div>
  </script>
  <script type="text/ng-template" id="header.html">
    <h1><a ui-sref="app" ng-bind="header.name"></a></h1>
  </script>
  <script type="text/ng-template" id="body.html">
    ...
  </script>
</html>
```

#### $stateProvider

stateを定義するサービス・プロバイダ。

config-blocks(`module.config(fn)`)でしか注入できないので注意。
アプリの初期化時に実行され、登録される。

[ui-router/wiki](https://github.com/angular-ui/ui-router/wiki)

#### ui-view

stateで定義されたUIを挿入するDOM属性。

渡した値がviewの名で、 `state.views`のキーとマッチする。
例えば、`app.header`の`state.views.header`は`app.html`の`<header ui-view="header"></header>`を示す。

このui-viewは必ずstateに紐づくので、stateの親子関係を気にしながら記述する必要がある。

- [Angular UI-Routerのviewsの定義を確認してみた](http://mizuki-r.hatenablog.com/entry/2014/03/27/091434)

### 例題1: ページを分けてみよう

#### 要素とURI

- URI: #/
  - _クッキーを作るボタン_
  - _クッキーの枚数_
  - _クッキー_
  - _クッキーを使うボタン_
- URI: #/consume
  - _クッキーを 5個消費するボタン_
  - _クッキーを10個消費するボタン_

#### 振る舞い

- _クッキーを作るボタン_ をクリックしたら _クッキーの枚数_ が`1`増える
- _クッキーを作るボタン_ をクリックしたら _クッキー_ が一つ増える
- _クッキーの枚数_ と _クッキー_ の個数は同じである
- _クッキーを作るボタン_ を一度実行したら10秒間ボタンは押せなくなる
- _クッキーを 5個消費するボタン_ をクリックしたら _クッキーを作るボタン_ を追加する
- _クッキーを10個消費するボタン_ をクリックしたら _10秒に一つクッキーを追加する君_ を追加する
- _クッキーを使うボタン_ をクリックしたら、 `#/consume` に遷移する

## サービス化する

DI(Dependency Injection)を利用して、アプリケーション内でコード・ロジックを共有する機能です。

AngularJS側で提供されている `$timeout`などもサービスの一部です。

### factory

デザインパターンで言うところの[Abstract Factoryパターン](https://ja.wikipedia.org/wiki/Abstract_Factory_%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3)パターンを実現する。

`factory`関数は、与えたコールバックを実行した返り値をAngularのModuleに追加する。
以下のように記述したケースでは、`curryFactory`を注入すると、`Curry`クラスのインスタンスを生成する関数を受け取れる。

```js
angular('example', [])
  .factory('curryFactory', function () {
    return function () {
      new Curry()
    }
  })
```

### service

デザインパターンで言うところの[Singletonパターン](https://ja.wikipedia.org/wiki/Singleton_%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3)を実現する。

`service`関数は、与えたコールバックをコンストラクタとしたクラスインスタンスをAngularのModuleに追加する。
以下の様に記述したケースでは、`curry` を注入すると `Curry`クラスのインスタンスを受け取れる。

```js
function Curry () {
}

angular.module('example', [])
  .service('curry', Curry) // new Curry() した値が入る
```

### provider

これまでの、`factory`, `service` を実現する基盤となる仕組みを提供する。

providerの特徴は、`config-blocks`でのセットアップ処理のI/Fを提供することと、`$get`に登録したコールバックの結果をAngularのModuleに注入すること。

```js
angular.module('example', [])
  .provider('exceptionHandler', function () {
    var handlers = []
    this.handler = function (name, fn) {
      handlers.push({name: name, fn: fn})
    }
    this.$get = function () {
      return new ExceptionHandler(handlers)
    }
  })
  .config(function (exceptionHandlerProvider) {
    exceptionHandlerProvider.handler('throw', function (e) {
      throw new Error(e)
    })
  })
  .controller('App', function (exceptionHandler) {
    })
```

[Providers](https://docs.angularjs.org/guide/providers)

### Providersの使いどころ

Providersの良い所は、ただ機能を分離出来るだけでなく、どの注入すれば複数のControllerに渡ってその機能を利用することができる点である。

- シンプルにインスタンスをキャッシュしたいなら、`service`を使えばいい。
- 値を引き回すだけなら、`value`や`constant`を使えばいい。

それぞれの役割と特性を理解しておくと、Angularで大規模なアプリケーションやライブラリを書く際に役立つ。

### 例題2: サービスにロジックを分けてコントローラをシンプルにしてみよう

FIXME
