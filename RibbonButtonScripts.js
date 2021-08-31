var Sdk = window.Sdk || {};
(
    function () {

        // Open rent report ribbon button
        this.OpenRentReportRibbonBtn = function () {
            var parameters = {};
            parameters["cr03e_type"] = 177740000;
            debugger;
            var carId = Xrm.Page.data.entity.attributes.get()[3].xrmFormUi.formContext._entityReference.id;
            if (carId != null) {
                parameters["cr03e_car"] = carId;
            }
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "cr03e_cartransferreport";

            // Open the form.
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(result);
                },
                function (error) {
                    console.log(error);
                });
        }

        // Open return report ribbon button
        this.OpenReturnReportRibbonBtn = function () {
            var parameters = {};
            parameters["cr03e_type"] = 177740001;
            var carId = = Xrm.Page.data.entity.attributes.get()[3].xrmFormUi.formContext._entityReference.id;
            if (carId != null) {
                parameters["cr03e_car"] = carId;
            }
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "cr03e_cartransferreport";

            // Open the form.
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(result);
                },
                function (error) {
                    console.log(error);
                });
        }

    }

).call(Sdk);
