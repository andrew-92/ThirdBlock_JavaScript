// Open rent report ribbon button
function OpenRentReportRibbonBtn(executionContext) {
    var formContext = executionContext; //rename

    var parameters = {};

    parameters["cr03e_type"] = 177740000;

    var car = formContext.getAttribute("cr03e_car").getValue();
    if (car != null) {
        parameters["cr03e_car"] = car[0].id;
    }
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "cr03e_cartransferreport";
    entityFormOptions["useQuickCreateForm"] = true;

    //
    var callback = function (success, executionContext) {
        debugger;
    }

    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions, parameters).then(
        function (success, executionContext) {
            //
            callback(success, executionContext);
        },
        function (error) {
            console.log(error);
        });
}

// Open return report ribbon button
function OpenReturnReportRibbonBtn(executionContext) {

    var formContext = executionContext;
    var parameters = {};
    parameters["cr03e_type"] = 177740001;
    var car = formContext.getAttribute("cr03e_car").getValue();
    if (car != null) {
        parameters["cr03e_car"] = car[0].id;
    }
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "cr03e_cartransferreport";

    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions, parameters).then(
        function (success) {
            console.log(success);
        },
        function (error) {
            console.log(error);
        });
}

// Enable create rent rule
function IsEnableCreateRent(executionContext) {
    var formContext = executionContext;
    var pickupReport = formContext.getAttribute("cr03e_pickup").getValue();
    if (pickupReport == null) {
        return true;
    } else {
        return false;
    }
}

// Enable create return rule
function IsEnableCreateReturn(executionContext) {
    var formContext = executionContext;
    var returnReport = formContext.getAttribute("cr03e_return").getValue();
    if (returnReport == null) {
        return true;
    } else {
        return false;
    }
}