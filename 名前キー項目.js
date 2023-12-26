(function () {
    'use strict';

    //編集画面でA、Bの値が変更された場合に呼ばれるイベント
    kintone.events.on(
        // ["app.record.edit.change.日付","app.record.edit.change.作成者"],
        [
            'app.record.create.change.氏名',
            'app.record.create.change.日付',
            'app.record.create.change.キー項目用ユーザー名',
            'app.record.edit.change.日付',
            'app.record.edit.change.キー項目用ユーザー名',
            'app.record.create.show',
            'app.record.edit.show',
        ],
        function (event) {
            var record = event.record;

            let strA = record['日付']['value'] || '';
            let strB =
                record['キー項目用ユーザー名']['value'][0]
                    .name || '';
            var str = strA.replaceAll('-', '') + strB;

            record['名前キー項目']['value'] = str;
            record['氏名']['value'] = strB;

            record['氏名'].lookup = true;

            //イベント終了（変更した値を反映する）
            return event;
        }
    );
})();
