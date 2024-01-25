(() => {
  "use strict";

  const Kuc = Kucs["1.7.0"];
  // 販売実績アプリID
  const SALES_APPID = 4522;
  // 試用申し込み管理アプリID
  const TRIAL_APPID = 4523;

  let oneTimeFlg = true;
  let chart1, chart2, chart3;

  Chart.register(ChartDataLabels);

  // luxonで使用する日付フォーマット
  const dateFormat = "yyyy-MM-dd";
  const dateFormatM1 = "M月";
  const dateFormatM2 = "M";
  const dateFormatY = "yyyy";
  const endOfFormatM = "month";

  // ローディング画面を出す関数
  const setLoading = () => {
    const $body = $("body");
    $body.css("width", "100%");
    // eslint-disable-next-line max-len
    const $loading = $("<div>")
      .attr("id", "loading")
      .attr("class", "loading")
      .attr(
        "style",
        "width: 100%; height: 100%; position:absolute; top:0; left:0; text-align:center; background-color:#666666; opacity:0.6; z-index: 9;"
      );
    const $div = $("<div>")
      .attr("id", "imgBox")
      .attr("style", "width: 100%; height: 100%;");
    // eslint-disable-next-line max-len
    const $img = $("<img>").attr(
      "src",
      "data:image/gif;base64,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"
    );
    $loading.append($div.append($img));
    $body.append($loading);
    $("#imgBox").attr(
      "style",
      "margin-top: " + Math.floor($("#loading").height() / 2) + "px;"
    );
    $body.css("position", "fixed");
  };

  // ローディング画面を消す関数
  const removeLoading = () => {
    const $loading = $(".loading");
    $loading.remove();

    const $body = $("body");
    $body.css("position", "");
  };

  // dataオブジェクトの中身を消す関数
  const refreshData = (data) => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = 0;
      }
    }
    return data;
  };

  // レコード取得用クエリ作成
  const strQuery = (dateS, dateE) =>
    `日付 <= "${dateE}" and 日付 >= "${dateS}"`;

  // 全レコード取得関数
  const fetchRecords = async (appId, query, orderField) => {
    const client = new KintoneRestAPIClient();
    const params = {
      app: appId,
      condition: query,
      orderBy: orderField,
    };

    return await client.record.getAllRecordsWithOffset(params);
  };

  // DatePicker設置
  const createDatePicker = () => {
    const datePickerMax = new Kuc.DatePicker({
      value: luxon.DateTime.local().toFormat(dateFormat),
      id: "datePickerMax",
    });

    $("#datepicker").append(datePickerMax);
    datePickerMax.addEventListener("change", (event) => {
      createCompareGraph(datePickerMax.value);
    });

    oneTimeFlg = false;
  };

  // グラフを描画する
  const createCompareGraph = async (max) => {
    setLoading();

    const maxDateTime = max
      ? luxon.DateTime.fromFormat(max, dateFormat)
      : luxon.DateTime.local();
    const minDateTime = maxDateTime.minus({ months: 11 });

    // 'yyyy-MM-dd'フォーマットの文字列
    const maxMonth = maxDateTime.endOf(endOfFormatM).toFormat(dateFormat);
    const maxMonth2 = maxDateTime
      .minus({ months: 12 })
      .endOf(endOfFormatM)
      .toFormat(dateFormat);
    const minMonth = maxDateTime
      .minus({ months: 11 })
      .startOf(endOfFormatM)
      .toFormat(dateFormat);
    const minMonth2 = maxDateTime
      .minus({ months: 23 })
      .startOf(endOfFormatM)
      .toFormat(dateFormat);

    // 11ヶ月前,10ヶ月前,....,1ヶ月前,今月 の順に、12ヶ月分が 'M月'フォーマットで格納されている配列
    const nMonthsBefore = Array(12)
      .fill()
      .map((e, i) => maxDateTime.minus({ months: i }).toFormat(dateFormatM1))
      .reverse();

    // 日付昇順にするので
    const orderField = "日付";
    // 指定日～1年前までの売上レコード取得
    const canvas1Rec = await fetchRecords(
      SALES_APPID,
      strQuery(minMonth, maxMonth),
      orderField
    );
    // 1年前～2年前までの売上レコード取得
    const canvas1Rec2 = await fetchRecords(
      SALES_APPID,
      strQuery(minMonth2, maxMonth2),
      orderField
    );
    // 指定日～1年前までの試用申込数レコード取得
    const canvas2Rec = await fetchRecords(
      TRIAL_APPID,
      strQuery(minMonth, maxMonth),
      orderField
    );

    // グラフデータ作成用にテンポラリとして使うdataオブジェクト
    let data = [];
    nMonthsBefore.forEach((el) => {
      data[el] = 0;
    });
    // 今月～1年前までの売上グラフデータ作成
    canvas1Rec.forEach((e) => {
      data[
        luxon.DateTime.fromFormat(e.日付.value, dateFormat).toFormat(
          dateFormatM1
        )
      ] += Number(e.販売額.value);
    });
    // 今月～1年前までの売上グラフデータ
    const eventuallyThisYearData = nMonthsBefore.map((e) => data[e]);

    // dataを初期化
    data = refreshData(data);
    // 1年前～2年前までの売上グラフのデータ作成
    canvas1Rec2.forEach((e) => {
      data[
        luxon.DateTime.fromFormat(e.日付.value, dateFormat).toFormat(
          dateFormatM1
        )
      ] += Number(e.販売額.value);
    });
    // 1年前～2年前までの売上グラフのデータ
    const eventuallyLastYearData = nMonthsBefore.map((e) => data[e]);

    // dataを初期化
    data = refreshData(data);
    // 指定日～1年前までの試用申込数グラフのデータ作成
    canvas2Rec.forEach((e) => {
      data[
        luxon.DateTime.fromFormat(e.日付.value, dateFormat).toFormat(
          dateFormatM1
        )
      ] += 1;
    });
    // 指定日～1年前までの試用申込数グラフデータ
    const eventuallyTrialData = nMonthsBefore.map((e) => data[e]);

    // ドーナツグラフのデータ作成
    const prodData = [];
    const prodLabels = [];
    canvas1Rec.forEach((e) => {
      const prod = e.製品名.value;
      if (typeof prodData[prod] === "undefined") {
        prodData[prod] = 0;
        prodLabels.push(prod);
      }
      prodData[prod] += Number(e.販売額.value);
    });

    // 製品名ラベル表示順を売上データ降順にソート
    prodLabels.sort((a, b) => prodData[b] - prodData[a]);

    // 製品ごとの背景色
    const prodBGColorMST = {
      製品A: "rgba(54, 162, 235, 0.4)",
      製品B: "rgba(255, 99, 132, 0.4)",
      製品C: "rgba(0, 100, 0, 0.4)",
      製品D: "rgba(255, 60, 255, 0.4)",
      製品E: "rgba(255, 255, 0, 0.4)",
      製品F: "rgba(255, 112, 0, 0.4)",
      製品G: "rgba(60, 60, 120, 0.4)",
      製品H: "rgba(255, 0, 0, 0.4)",
      製品I: "rgba(0, 255, 255, 0.4)",
    };

    /*
      // 【参考】製品縁取り色
      const prodBDColorMST = {
        製品A:"rgba(54, 162, 235, 1)",
        製品B:"rgba(255,99,132,1)",
        製品C:"rgba(0, 170, 0, 1)",
        製品D:"rgba(255, 170, 255, 1)",
        製品E:"rgba(255, 255, 0, 1)",
        製品F:"rgba(255, 112, 0, 1)",
        製品G:"rgba(100, 0, 0, 1)",
        製品H:"rgba(255, 184, 184, 1)",
        製品I:"rgba(0, 255, 255, 1)"
      };
      */

    // ドーナツグラフのデータ
    const eventuallyByProductData = prodLabels.map((e) => prodData[e]);
    const sumOfeventuallyByProductData = eventuallyByProductData.reduce(
      (a, c) => a + c,
      0
    );
    const prodBGColor = prodLabels.map((e) => prodBGColorMST[e]);
    // const prodBDColor = prodLabels.map(e=>prodBDColorMST[e]);

    // 前年同月比グラフを描画（1つ目のグラフ）
    const ctx = document.getElementById("canvas1");
    if (chart1) {
      chart1.destroy();
    }
    chart1 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: nMonthsBefore,
        datesets: [
          {
            label: "前年同月売上",
            data: eventuallyLastYearData,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            test: "aiueo",
          },
          {
            label:
              minDateTime.toFormat("yyyy年M月～") +
              maxDateTime.toFormat("yyyy年M月売上"),
            data: eventuallyThisYearData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            test: "ABCDE",
          },
        ],
      },
      options: {
        scales: {
          // xAxes: [
          //   {
          //     type: "linear",
          //     stacked: true,
          //   },
          // ],
          // yAxes: [
          //   {
          //     display: true,
          //     scaleLabel: {
          //       display: true,
          //       labelString: "売上",
          //       fontFamily: "monospace",
          //     },
          //     ticks: {
          //       beginAtZero: true,
          //       maxTicksLimit: 8,
          //       callback: (value) => value + "万円",
          //     },
          //   },
          // ],
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            title: (tooltipItems, titleData) => {
              const tmp = tooltipItems[0].xLabel.split("月");
              // 1) tooltipItems[0].datasetIndex  0:指定日(maxDateTime)の前年、1:指定日（maxDateTime）の年
              // 2) tooltipItems[0].xLabelの月がmaxDateTimeより大きかったら-1年にする
              let retYear = maxDateTime
                .minus({ years: 1 })
                .toFormat(dateFormatY);
              if (Number(tmp[0]) > Number(maxDateTime.toFormat(dateFormatM2))) {
                if (tooltipItems[0].datasetIndex === 0) {
                  retYear = maxDateTime
                    .minus({ years: 2 })
                    .toFormat(dateFormatY);
                }
              } else if (tooltipItems[0].datasetIndex === 1) {
                retYear = maxDateTime.toFormat(dateFormatY);
              }
              return `${retYear}年${tooltipItems[0].xLabel}`;
            },
            label: (tooltipItems, data3) => tooltipItems.yLabel + "万円",
          },
        },
      },
    });

    // // 売上と試用申込数グラフを描画（2つ目のグラフ）
    // const ctx2 = document.getElementById("canvas2");
    // if (chart2) {
    //   chart2.destroy();
    // }
    // chart2 = new Chart(ctx2, {
    //   type: "bar",
    //   data: {
    //     labels: nMonthsBefore,
    //     datasets: [
    //       {
    //         yAxisID: "y-axis-1",
    //         type: "line",
    //         label: "試用申込数",
    //         data: eventuallyTrialData,
    //         backgroundColor: "rgba(54, 162, 235, 0.2)",
    //         borderColor: "rgba(54, 162, 235, 1)",
    //         borderWidth: 1,
    //       },
    //       {
    //         yAxisID: "y-axis-0",
    //         type: "bar",
    //         label:
    //           minDateTime.toFormat("yyyy年M月～") +
    //           maxDateTime.toFormat("yyyy年M月売上"),
    //         data: eventuallyThisYearData,
    //         backgroundColor: "rgba(255, 99, 132, 0.2)",
    //         borderColor: "rgba(255,99,132,1)",
    //         borderWidth: 1,
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       xAxes: [
    //         {
    //           stacked: true,
    //         },
    //       ],
    //       yAxes: [
    //         {
    //           stacked: true,
    //           position: "left",
    //           id: "y-axis-0",
    //           display: true,
    //           scaleLabel: {
    //             display: true,
    //             labelString: "売上",
    //             fontFamily: "monospace",
    //           },
    //           ticks: {
    //             beginAtZero: true,
    //             maxTicksLimit: 8,
    //             callback: (value) => value + "万円",
    //           },
    //         },
    //         {
    //           position: "right",
    //           id: "y-axis-1",
    //           display: true,
    //           scaleLabel: {
    //             display: true,
    //             labelString: "試用申込数",
    //             fontFamily: "monospace",
    //           },
    //           ticks: {
    //             beginAtZero: true,
    //             maxTicksLimit: 6,
    //           },
    //         },
    //       ],
    //     },
    //     tooltips: {
    //       enabled: true,
    //       mode: "single",
    //       callbacks: {
    //         title: (tooltipItems, data4) => {
    //           const tmp = tooltipItems[0].xLabel.split("月");
    //           // tooltipItems[0].xLabelの月がmaxDateTimeより大きかったら-1年する
    //           // eslint-disable-next-line max-len
    //           const retYear =
    //             Number(tmp[0]) > Number(maxDateTime.toFormat(dateFormatM2))
    //               ? maxDateTime.minus({ years: 1 }).toFormat(dateFormatY)
    //               : maxDateTime.toFormat(dateFormatY);
    //           return `${retYear}年${tooltipItems[0].xLabel}`;
    //         },
    //         label: (tooltipItems, data5) => {
    //           if (tooltipItems.datasetIndex === 0) {
    //             return `試用申込数：${tooltipItems.yLabel}`;
    //           }
    //           return `売上：${tooltipItems.yLabel}万円`;
    //         },
    //       },
    //     },
    //   },
    // });

    // // ドーナツグラフを描画
    // const ctx3 = document.getElementById("canvas3");
    // if (chart3) {
    //   chart3.destroy();
    // }
    // chart3 = new Chart(ctx3, {
    //   type: "doughnut",
    //   data: {
    //     labels: prodLabels,
    //     datasets: [
    //       {
    //         data: eventuallyByProductData,
    //         backgroundColor: prodBGColor,
    //         // borderColor: prodBDColor,
    //         borderWidth: 1,
    //       },
    //     ],
    //   },
    //   options: {
    //     showAllTooltips: true,
    //     animation: {
    //       animateScale: true,
    //     },
    //     tooltips: {
    //       callbacks: {
    //         title: (tooltipItems, data6) => {
    //           return data6.labels[tooltipItems[0].index];
    //         },
    //         label: (tooltipItems, data7) => {
    //           const per = Math.round(
    //             (data7.datasets[0].data[tooltipItems.index] /
    //               sumOfeventuallyByProductData) *
    //               100
    //           );
    //           return `${per}% ${
    //             data7.datasets[0].data[tooltipItems.index]
    //           }万円`;
    //         },
    //       },
    //     },
    //   },
    // });
    // // グラフのデフォルトフォントサイズ設定
    // Chart.defaults.global.defaultFontSize = 10;

    // datePickerの作成は画面読み込み時のみ
    if (oneTimeFlg) {
      createDatePicker();
    }
    removeLoading();
  };

  kintone.events.on("app.record.index.show", (event) => {
    if (event.viewName === "Dashboard") {
      createCompareGraph();
    }
    return event;
  });
})();
