# level1. AngularJSはじめの一歩

## 基本知識

### コントローラ(Controller)

AngularJSでは、templateへの値の受け渡しやイベントハンドリングなどを行う。

DOMElementにまつわる処理はディレクティブ内に隠蔽し、
単純な値の受け渡しやイベントのハンドリングのみに注力すべきである。

[Understanding Controllers](https://docs.angularjs.org/guide/controller)

### ディレクティブ(directive)

> ディレクティブ（英: Directive）は、プログラミングにおいてコマンドのような意味で使われる用語であり、プログラミング言語の一部の構成要素（例えば、コンパイラやアセンブラに処理方法を指示する記述など）を指すこともある。
> 引用元: <cite>https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96</cite>

AngularJSで言うところのディレクティブ(Directive)とは、拡張されたHTMLの要素・属性を指します。

以下のHTMLで言えば、 `ng-app`, `ng-controller`, `ng-if`, `ng-bind` 等がディレクティブです。

```html
<!doctype html>
<html lang="ja" ng-app="App">
  <div ng-controller="App as app">
    <p ng-if=" app.login" ng-bind="app.logined_message"></p>
    <p ng-if="!app.login">ログインしましょう</p>
  </div>
</html>
```

[Creating Custom Directives](https://docs.angularjs.org/guide/directive)

### 依存注入(DI: Dependency injection)

> 依存性の注入（いそんせいのちゅうにゅう、英: Dependency injection）とは、コンポーネント間の依存関係をプログラムのソースコードから排除し、外部の設定ファイルなどで注入できるようにするソフトウェアパターンである。英語の頭文字からDIと略される。
> 引用元: <cite>https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5</cite>

AngularJSで言うところのDIとは、以下のように引数にmoduleを指定して利用可能にすること、あるいは `$injector`サービスを利用してmoduleをスコープの中に引きこむことを示します。

注入するオブジェクト・値はmoduleの中で定義されている名前空間を利用します。

```js
angular.module('stuff', [])
  .factory('ninjin', function () { ... })
  .factory('tamanegi', function () { ...  })
  .factory('spices', function () { ... })

angular.module('curry', [
  'stuff'
]).factory('nabe', function (ninjin, tamanegi, spices) { // 注入している
  // ぐつぐつ煮込むよ
})
```

[Dependency Injection](https://docs.angularjs.org/guide/di)

### 双方向データバインディング

データとUIを双方向に結びつけ、UIが更新されればデータが更新され、データが更新されればUIが更新される。

以下の様なコードの場合、`this.message` をJS側で更新すれば、 `input`の値も更新され、 `input`側を更新すれば、`this.message`の値も更新される。

```js
angular.module('App', [])
  .controller('App', function () {
    this.message = ''
  })
```

```html
<!doctype html>
<html lang="ja" ng-app="App">
  <div ng-controller="App as app">
    <input type="text" ng-model="app.message" />
  </div>
</html>
```

[Data binding](https://docs.angularjs.org/guide/databinding)

## アプリケーションを作る

### モジュールを定義する(`angular.module`)

Angularアプリケーションを作成するには `angular.module` を使います。

第二引数に他のAngularモジュールの名前をリスト指定することで、
他のモジュールをアプリケーション内で使えるようになります。

```js
angular.module(名前空間, [
  依存モジュール1,
  依存モジュール2,
  ...
])
```

### モジュールをhtmlから利用する(`ngApp`)

Angularアプリケーションを自動起動(documentが読み込まれたら実行)するには、
`ngApp` というディレクティブを利用します。

`document`内で最初に発見された`ngApp`が自動起動の対象となり、
その値に指定されているモジュールを実行します。

```js
angular.module('angularStudy', [])
```

```html
<!doctype html>
<html lang="ja" ng-app="angularStudy">
</html>
```

[Modules](https://docs.angularjs.org/guide/module)

### JavaScriptからHTML上に文字列を出力する

JavaScriptとHTML(template)をつなぐのは `controller` の役目です。

以下はJavaScriptで設定した文言をHTML上に表示します。

```js
angular.module('angularStudy', [])
  .controller('HelloWorldCtrl', function () {
    this.message = 'hello angular!'
  })
```

```html
<!doctype html>
<html lang="ja" ng-app="angularStudy">
  <div ng-controller="HelloWorldCtrl as helloWorld">
    <p ng-bind="helloWorld.message"></p>
  </div>
</html>
```

これは、以下のようにも記述できます。

```js
angular.module('angularStudy', [])
  .controller('HelloWorldCtrl', function ($scope) {
    $scope.message = 'hello angular!'
  })
```

```html
<!doctype html>
<html lang="ja" ng-app="angularStudy">
  <div ng-controller="HelloWorldCtrl">
    <p ng-bind="message"></p>
  </div>
</html>
```

#### ngController

ControllerとDOMを紐付けるディレクティブです。

このディレクティブが指定されたDOMと、ディレクティブが指定するControllerをひも付けます。

#### ngBind

指定された値をコンパイルした結果をHTMLのTextNodeに反映します。

template
```html
<span ng-bind="'hello world'"></span>
```

コンパイル後
```html
<span ng-bind="'hello world'">hello world</span>
```

この例は、 `<span>{{'hello world'}}</span>` と書いても同じ結果が得られるが、TextNodeに評価式を書いてしまっているので、AngularのCompileが走るまで、 `{{'hello world'}}`という文字列が見えてしまうことがある。

この現象はよく「髭」と呼ばれる。

#### module.controller

Controllerをmoduleに定義します。
第二引数に登録する関数はコンストラクタで、 `ng-controller="Ctrl as ctrl"` のように `as` を指定するとインスタンス化され、そのControllerのコンテキスト(`this`)をtemplateから参照できるようになります。

`as`を使わない場合、 `$scope` を注入しそのプロパティに値を追加することでtemplateから参照できるようになりますが、最近ではあまり推奨されません。


## イベントハンドリング

DOMで発生したイベントを補足し、処理を実行する

### ngClick

```js
angular.module('angularStudy', [])
  .controller('App', function () {
    this.count = 0
    this.onClick = function () {
      this.count++
    }
  })
```

```html
<!doctype html>
<html ng-app="angularStudy">
  <div ng-controller="App as app">
    <p>カウント: <span ng-bind="app.count"></span></p>
    <button type="button" ng-click="app.onClick()">カウントアップ</button>
  </div>
</html>
```

### 例題1: ボタンを押したらクッキーの枚数が増えてく仕組みを作ってみよう

#### 以下のDOMを作成

- クッキーの枚数
- クッキーを作るボタン

#### 振る舞い

- _クッキーを作るボタン_ をクリックしたら _クッキーの枚数_ が`1`増える


## 繰り返し処理(`ngRepeat`)

`ngRepeat`ディレクティブを使うと、コレクションの繰り返し処理が行えます。

```html
<ul ng-init="items = ['a', 'b', 'c', 'd']">
  <li ng-repeat="item in  items" ng-bind="item"></li>
</ul>
```
[ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat)

### 例題2: ボタンを押したらクッキーが増えていく仕組みを作ってみよう

#### 以下のDOMを追加

- クッキー

#### 振る舞い

- _クッキーを作るボタン_ をクリックしたら _クッキーの枚数_ が`1`増える
- _クッキーを作るボタン_ をクリックしたら _クッキー_ が一つ増える


## 条件分岐

template上で表示を出し分けたいケースがあるときに用いるDirectiveを紹介する。

### ngIf

与えた条件式が`true`であればDOMを追加する。

```html
<div ng-if="a == b">hello</div>
````

### ngShow

与えた条件式が`false`であるとき、`style="display:none"`のプロパティをDOMに追加する。

```html
<div ng-show="a == b">hello</div>
```

### ngSwitch

与えた条件式が合致する結果を振り分けDOMを追加する。


```html
<div ng-switch="app.state">
  <div ng-switch-when="wait">待機</div>
  <div ng-switch-when="inprog">実行中</div>
  <div ng-switch-when="done">完了</div>
</div>
```

### 例題3: 5個クッキーが溜まったら _クッキーを作るボタン_ を２つにしてみよう

#### 以下のDOMを追加

- _クッキーを作るボタン2_

#### 振る舞い

- _クッキーを作るボタン_ をクリックしたら _クッキーの枚数_ が`1`増える
- _クッキーを作るボタン_ をクリックしたら _クッキー_ が一つ増える
- _クッキーの枚数_ が `5` 以上の時に _クッキーを作るボタン2_ を表示


## タイマー処理

`$timeout`サービスを使うと、 `setTimeout`と同じように指定ミリ秒後にコールバックを実行できる。

[$timeout](https://docs.angularjs.org/api/ng/service/$timeout)

```
$timeout(function () {
  console.log('5秒後に実行')
}, 5 * 1000)
```

### 例題4: _クッキーを作るボタン_ を実行してから10秒は再実行できないようにしよう

#### 振る舞い

- _クッキーを作るボタン_ をクリックしたら _クッキーの枚数_ が`1`増える
- _クッキーを作るボタン_ をクリックしたら _クッキー_ が一つ増える
- _クッキーの枚数_ が `5` 以上の時に _クッキーを作るボタン2_ を表示
- _クッキーを作るボタン_ 、 _クッキーを作るボタン2_ を一度実行したら10秒間ボタンは押せなくなる

#### hint

- [ngDisabled](https://docs.angularjs.org/api/ng/directive/ngDisabled)
- [ngClass](https://docs.angularjs.org/api/ng/directive/ngClass)

