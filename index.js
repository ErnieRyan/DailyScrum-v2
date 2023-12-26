(function () {
  "use strict";

  function hideFields(fieldCodes) {
    fieldCodes.forEach((fieldCode) =>
      kintone.app.record.setFieldShown(fieldCode, false)
    );
  }

  // Example usage
  const userSelection = [
    "User_Selection",
    "User_Selection_0",
    "User_Selection_1",
    "User_Selection_2",
  ];

  // Hide user select elements
  // function hideElement(...targetSelectors) {
  //   targetSelectors.forEach((selector) => {
  //     const elements = document.querySelectorAll(selector);
  //     elements.forEach((element) => {
  //       if (element) {
  //         element.style.display = "none";
  //       }
  //     });
  //   });
  // }

  // Luxon for date format
  function getFormattedDate() {
    const currentDate = luxon.DateTime.now();

    // Format the date as "YYYY-MM-DD"
    const formattedDate = currentDate.toFormat("yyyy-MM-dd");

    return formattedDate;
  }

  kintone.events.on(
    [
      "app.record.create.change.今日やったこと",
      "app.record.create.change.明日やること",
      "app.record.create.change.来週やること",
      "app.record.create.change.来月やること",
    ],
    (event) => {
      const records = event.records;
      // Enter your code here
      hideFields(userSelection);

      // hideElement(
      //   ".subtable-label-gaia.subtable-label-user_select-gaia.label-8237407",
      //   ".control-gaia.control-user_select-field-gaia.field-8237407",
      //   ".subtable-label-gaia.subtable-label-user_select-gaia.label-8237408",
      //   ".control-gaia.control-user_select-field-gaia.field-8237408",
      //   ".subtable-label-gaia.subtable-label-user_select-gaia.label-8237409",
      //   ".control-gaia.control-user_select-field-gaia.field-8237409",
      //   ".subtable-label-gaia.subtable-label-user_select-gaia.label-8237894",
      //   ".control-gaia.control-user_select-field-gaia.field-8237894"
      // );
      return event;
    }
  );

  kintone.events.on(["app.record.create.show"], (event) => {
    // Last date of the record
    var body = {
      app: 4450,
      query: "作成者 in (LOGINUSER())",
    };

    kintone.api(
      kintone.api.url("/k/v1/records.json", true),
      "GET",
      body,
      function (resp) {
        // success
        // Records created by the logged-in user
        console.log("all personal records", resp);

        // Get the date of the last record
        if (resp && resp.records && resp.records.length > 0) {
          // Check if the 'records' array is not empty before accessing the first element
          var firstObject = resp.records[0];
          var dateOfLastRecord = firstObject.日付.value;
          console.log("Last record of the user", firstObject);

          var record = kintone.app.record.get();
          console.log("Current record detail page", record);

          // Set the defaultDate of 前日 and 前日_0 to be the same as dateOfLastRecord
          record.record.前日.value = dateOfLastRecord;
          record.record.前日_0.value = dateOfLastRecord;
          record.record.日付.value = getFormattedDate();
          kintone.app.record.set(record);
        } else {
          console.log(
            "Response does not contain the expected 'records' array."
          );
        }
      },
      function (error) {
        // error
        console.log(error);
      }
    );

    return event;
  });

  kintone.events.on(
    [
      "app.record.detail.show",
      "app.record.edit.show",
      "app.record.create.show",
    ],
    (event) => {
      const record = event.record;

      // Enter your code here
      
      hideFields(userSelection);

      return event;
    }
  );
})();
