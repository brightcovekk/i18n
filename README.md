App Cloud デモアプリケーション（3ヶ国語ニュース）

App Cloud のコンテンツフィードとローカルキャッシュのAPIを使った、App Cloud のテンプレートデモ、i18n です。このテンプレートは2つのビュー（HelloとGoodbye）から構成されるシンプルなアプリケーションです。Hello ビューでは、Google Newsのフィードを表示します。表示言語を英語、スペイン語、日本語の3つから選ぶと、それに応じて書く言語のニュースコンテンツが表示されます。Goodbyeビューでは選ばれた言語に応じてローカライズされたメッセージが表示されます。

このデモテンプレートでは App Cloud のコンテンツフィードとローカルキャッシュを使って以下の機能を実装してみました。

- フィードのパラメータ: App Cloud のコンテンツフィードに Google News フィードを登録し、言語をパラメータとして渡してユーザの選択に合わせて適切な言語のニュースフィードを取得します。
- ローカルキャッシュ: デバイスのローカルキャッシュを使ってユーザが選択した言語を記憶し、HelloビューとGoodbyeビューで言語の選択によってメッセージの表示言語を切り替えます。

フィードのパラメータ
Google News のRSSフィードは以下のようなURLでアクセスできます。
http://news.google.co.jp/news?pz=1&cf=all&ned=us&hl=en&output=rss
[hl=en] が言語を指定しているパラメータです。hl=の後ろに言語コードを入れることによって意図する言語のニュースを取得する事ができます。

App Cloud のコンテンツセクションで
http://news.google.co.jp/news?pz=1&cf=all&ned=us&output=rss&hl={"lang":"en"}

とフィードを登録し、フィードの呼び出し時に

options = {
     parameterizedFeedValues: {"lang", "ja"}
};

bc.cora.getData("google-news", onsuccess, onerror, options);

のようにパラメータを引数に渡して動的にフィードの取得をしています。

ローカルキャッシュ
App Cloud SDK の APIを使い、

bc.core.cache("lang");  // キャッシュの読込
bc.core.cache("lang", "ja");  // キャッシュの書き込み

でローカルキャッシュへのデータの保存と読込を行います。キャッシュに指定した名前の値が存在しない場合は null が返ってきますので、初めてキャッシュの変数にアクセスする場合にはこれで対応します。

i18n をローカルPCで動かす
まず、ローカルPCのウェブサーバで動作を確認してみます。お使いのPCのウェブサーバのルートディレクトリに i18n.zip を解凍します。ブラウザを立ち上げ、コピーしたディレクトリ i18n にある html/hello.html を開きます。この際、アドレスは file://ではなく、http:// から始まっていること、マシンの名前や localhost、127.0.0.1 ではないIPアドレスが指定されていることを確認してください。

http://[IPアドレス]/[some direcotry]/i18n/html/hello.html

PCのブラウザ上で hello.html が表示されます。画面上部のE/S/Jが英語/スペイン語/日本語に対応していますので、クリックすると該当の言語のニュースが読み込まれます。同様に goodbye.html ファイルを開きます。hello.html で選択した言語で「さようなら」のメッセージが表示されていることを確認してください。

PCのブラウザで動作が確認できたら、次はWorkshopアプリでプレビューしてみましょう。PCブラウザから i18n ディレクトリにある scan.html をリクエストします。 

http://[IPアドレス]/[some direcotry]/i18n/scan.html

お使いのデバイスがPCと同じネットワークに接続されていることを確認し、Workshop アプリを開きます。ブラウザに表示されているQRコードを読み込み、Workshop で i18n テンプレートを開いてみましょう。

i18n をApp Cloud で動かす
ローカルPCで動作が確認できたら App Cloud にテンプレートをアップロードし、テンプレートからアプリを作成してみましょう。手順は以下のとおりです。

1) i18n のディレクトリをZipにします。
2) App Cloud スタジオにログインします。
3) コンテンツセクションに行き、以下のフィード（Content Feed）を作成します。
名前: Google ニュース
URL: http://news.google.co.jp/news?pz=1&cf=all&ned=us&output=rss&hl={"lang":"en"}
それ以外の項目はデフォルトのままです。

4) App Cloud スタジオのテンプレートセクションに行きます。
5) 先程圧縮した i18n のZip ファイルをドラッグ＆ドロップでアップロードします。
6) アップロード完了し、テンプレートが準備できたら "App Cloud i18n デモ" という名前のテンプレートができます。
7) テンプレート一覧から"App Cloud i18n デモ"をクリックし、「アプリの作成」をクリックし、このテンプレートをベースに新しいアプリを作成します。（* エラーメッセージは無視してください。manifest.jsonファイルで指定されたデフォルトのニュースコンテンツにアクセス出来ないために起こりますがアプリは正常に作成できてます）
8) 新しいアプリが作成後「アプリの編集」をクリックします。
9) Helloビューを選択し、「google-newsの変更」から先ほど作った 「Google ニュース」フィードを選択し保存します。
10) App Cloud スタジオ内でプレビューがうまく動いていることを確認し、QRコードをWorkshopで読み込みます。

コンテンツフィードURLでパラメータを使用する
http://support.brightcove.com/ja/docs/8666

このアプリの中では、JavaScrioptのライブラリ、Markup.js を使っています。Markup.js は Adam Mark が公開しているJavaScript のテンプレートシステムです (https://github.com/adammark/Markup.js)。

