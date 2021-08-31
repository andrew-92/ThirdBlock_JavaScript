var Sdk = window.Sdk || {};
(
    function () {

        // Price field should be not editable by user
        this.PriceOnLoad = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var fPrice = formContext.getControl("cr03e_price").setDisabled(true);
        }

        // In case user selects Status = Renting and Paid is not true than show notification “Car rent is not yet paid.Car cannot be rented”
        this.StatusRentingNotPaidOnChange = function (executionContext) {
            debugger;
            var formContext = executionContext.getFormContext();
            var status = formContext.getAttribute("cr03e_status").getText();
            var paid = formContext.getAttribute("cr03e_paid").getValue();
            if (status == "Renting (Active)" && paid == 0) {
                formContext.getControl("cr03e_status").setNotification("Car rent is not yet paid.Car cannot be rented", "statusnotpaidmsg");
            }
            else {
                formContext.getControl("cr03e_status").clearNotification("statusnotpaidmsg");
            }
        }

        // Reserved return date/time cannot be earlier than Reserved pickup date/time
        this.ReturnedDateEarlyPickup = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var reservedPickup = formContext.getAttribute("cr03e_reservedpickup").getValue();
            var reservedReturn = formContext.getAttribute("cr03e_reservedhandover").getValue();

            if (reservedPickup != null && reservedReturn != null) {

                if (reservedPickup > reservedReturn) {
                    formContext.getControl("cr03e_reservedpickup").setNotification("Reserved handover date/time cannot be earlier than Reserved pickup date/time", "returneddateearlypickupmsg");
                }
                else {
                    formContext.getControl("cr03e_reservedpickup").clearNotification("returneddateearlypickupmsg");
                }
            }
            else {
                formContext.getControl("cr03e_reservedpickup").clearNotification("pickupdateearlycurrentmsg");
                formContext.getControl("cr03e_reservedpickup").clearNotification("returneddateearlypickupmsg");
            }
        }

        // Reserved pickup date/time cannot be earlier than current date
        this.PickupDateEarlyCurrent = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var reservedPickup = formContext.getAttribute("cr03e_reservedpickup").getValue();
            var reservedReturn = formContext.getAttribute("cr03e_reservedhandover").getValue();

            if (reservedPickup != null && reservedReturn != null) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                if (reservedPickup < today) {
                    formContext.getControl("cr03e_reservedpickup").setNotification("Reserved pickup date/time cannot be earlier than current date", "pickupdateearlycurrentmsg");
                }
                else {
                    formContext.getControl("cr03e_reservedpickup").clearNotification("pickupdateearlycurrentmsg");
                }
            }
            else {
                formContext.getControl("cr03e_reservedpickup").clearNotification("pickupdateearlycurrentmsg");
                formContext.getControl("cr03e_reservedpickup").clearNotification("returneddateearlypickupmsg");
            }
        }

        // When user change status to either Confirmed/Renting/Returned – Car field should become obligatory
        this.CarObligatory = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var status = formContext.getAttribute("cr03e_status").getText();
            if (status == "Confirmed (Active)" || status == "Renting (Active)" || status == "Returned (Inactive)") {
                var carRequired = formContext.getAttribute("cr03e_car").setRequiredLevel("required");
            }
            else {
                var carRequired = formContext.getAttribute("cr03e_car").setRequiredLevel("none");
            }
        }

        // If Car class field is empty – Car field should be disabled
        this.CarClassIsEmpty = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var carClass = formContext.getAttribute("cr03e_carclass").getValue();
            if (carClass == null) {
                var car = formContext.getAttribute("cr03e_car").setValue(null);
                var carControl = formContext.getControl("cr03e_car").setDisabled(true);
            }
            else {
                var carControl = formContext.getControl("cr03e_car").setDisabled(false);
            }
        }

        // Car field should be filtered based on Car class field
        this.filterCarsByClass = function (executionContext, carClassId) {
            formContext = executionContext.getFormContext();
            var customerCarFilter = "<filter type='and'>" + "<condition attribute='cr03e_carclass' operator='eq' value='" + carClassId + "' />" + "</filter>";
            formContext.getControl("cr03e_car").addCustomFilter(customerCarFilter, "cr03e_car");
        }

        this.customFilterCarsByClass = function (executionContext) {
            formContext = executionContext.getFormContext();
            var carClass = formContext.getAttribute("cr03e_carclass").getValue();
            if (carClass != null) {
                var carClassId = carClass[0].id.replace("{", "").replace("}", "");

                formContext.getControl("cr03e_car").addPreSearch(executionContext, Sdk.filterCarsByClass(carClassId));
            }
        }

        // Price should be calculated automatically based on next formula: 
        //  Car class.Price * Difference in Days(End date / time – Start date / time) + 100(if pickup location is not office) + 100(if return location is not office) 
        this.PriceCalculated = function (executionContext) {
            formContext = executionContext.getFormContext();
            debugger;
            var carClass = formContext.getAttribute("cr03e_carclass").getValue();
            if (carClass != null) {
                var carClassId = carClass[0].id;
                var carClassPrice = Xrm.WebApi.retrieveRecord("cr03e_carclass", carClassId).then(
                    function success(result) {
                        Sdk.SetPrice(executionContext, result);
                    },
                    function (error) {
                        Sdk.SetPrice(executionContext, null);
                    }
                );
            }
        }

        this.SetPrice = function (executionContext, result) {

            carClassPrice = 0;
            if (result != null) {
                carClassPrice = result.cr03e_price;
            }

            var startDate = formContext.getAttribute("cr03e_reservedpickup").getValue();
            var endDate = formContext.getAttribute("cr03e_reservedhandover").getValue();
            var rentPeriod = 0;
            if (startDate != null && endDate != null) {
                rentPeriod = endDate.getDate() - startDate.getDate() + 1;
            }

            var pickupPrice = 0;
            var pickupLocation = formContext.getAttribute("cr03e_pickuplocation").getText();
            if (pickupLocation != null && pickupLocation != "Office") {
                var pickupPrice = 100;
            }

            var returnPrice = 0;
            var returnLocation = formContext.getAttribute("cr03e_returnlocation").getText();
            if (returnLocation != null && returnLocation != "Office") {
                var returnPrice = 100;
            }

            var price = carClassPrice * rentPeriod + pickupPrice + returnPrice;

            formContext.getAttribute("cr03e_price").setValue(price);
        }

        // Status transition should work as follows...
        this.StatusTransition = function (executionContext) {

            formContext = executionContext.getFormContext();
            var status = formContext.getAttribute("cr03e_status").getText();
            //var controlOptions = formContext.getControl("cr03e_status").getOptions();
            var controlOptions = [{ text: "Created (Active)", value: 177740001 }, { text: "Confirmed (Active)", value: 177740002 }, { text: "Renting (Active)", value: 177740003 }, { text: "Returned (Inactive)", value: 177740004 }, { text: "Canceled (Inactive)", value: 177740005 },];
            var formType = formContext.ui.getFormType();
            if (formType == 1) {
                formContext.getControl("cr03e_status").clearOptions();
                for (let i = 0; i < controlOptions.length; i++) {
                    if (controlOptions[i].text == "Created (Active)" || controlOptions[i].text == "Confirmed (Active)" || controlOptions[i].text == "Renting (Active)") {
                        formContext.getControl("cr03e_status").addOption(controlOptions[i]);
                    }
                }
            }
            else {
                if (status == "Created (Active)") {
                    formContext.getControl("cr03e_status").clearOptions();
                    for (let i = 0; i < controlOptions.length; i++) {
                        if (controlOptions[i].text == "Canceled (Inactive)" || controlOptions[i].text == "Confirmed (Active)" || controlOptions[i].text == "Renting (Active)" || controlOptions[i].text == "Created (Active)") {
                            formContext.getControl("cr03e_status").addOption(controlOptions[i]);
                        }
                    }
                    formContext.getAttribute("cr03e_status").setValue(177740001);
                } else if (status == "Confirmed (Active)") {
                    formContext.getControl("cr03e_status").clearOptions();
                    for (let i = 0; i < controlOptions.length; i++) {
                        if (controlOptions[i].text == "Canceled (Inactive)" || controlOptions[i].text == "Renting (Active)" || controlOptions[i].text == "Confirmed (Active)") {
                            formContext.getControl("cr03e_status").addOption(controlOptions[i]);
                        }
                    }
                    formContext.getAttribute("cr03e_status").setValue(177740002);
                } else if (status == "Renting (Active)") {
                    formContext.getControl("cr03e_status").clearOptions();
                    for (let i = 0; i < controlOptions.length; i++) {
                        if (controlOptions[i].text == "Returned (Inactive)" || controlOptions[i].text == "Renting (Active)") {
                            formContext.getControl("cr03e_status").addOption(controlOptions[i]);
                        }
                    }
                    formContext.getAttribute("cr03e_status").setValue(177740003);
                }
            }

        }


        // Dynamics 365 should prevent creation of more than 10 rents in status Renting per one owner
        this.CheckOwnerRents = function (executionContext) {
            //            formContext = executionContext.getFormContext();
            //            var currentStatus = formContext.getAttribute("cr03e_status").getText();
            //            if(currentStatus == "Renting (Active)"){
            //                var customerId = formContext.getAttribute("cr03e_customer").getValue()[0].id;
            //                var fetchXML = "?fetchXml=<fetch><entity name = 'cr03e_rent' ><attribute name='cr03e_name' /><attribute name='cr03e_status' /><attribute name='cr03e_customer' /><order attribute='cr03e_name' descending='false' /><filter type='and'><condition attribute='cr03e_status' operator='eq' value='177740003' /><condition attribute='cr03e_customer' operator='eq' value='" + customerId + "' /></filter></entity ></fetch >";
            //                Xrm.WebApi.retrieveMultipleRecords("cr03e_rent", fetchXML).then(
            //                function success(result) {
            //                    var count = result.entities.length;
            //                    if(count >= 10){
            //                        formContext.getControl("cr03e_status").setNotification("Customer has 10 or more acvite Rents", "customeractiverentsmsg");
            //                    }
            //                    else {
            //                        formContext.getControl("cr03e_status").clearNotification("customeractiverentsmsg");
            //                    }
            //                },
            //                function (error) {
            //                    console.log(error.message);
            //                });
            //            }
            //            else {
            //                formContext.getControl("cr03e_status").clearNotification("customeractiverentsmsg");
            //            }
        }


        // After Pickup report (or Return report) field is saved – Actual pickup date/time (or Actual 
        // return date/time) should be populated with current date/time.

        //Actual pickup report changed
        this.PickupReportSaved = function (executionContext) {
            formContext = executionContext.getFormContext();
            var pickupReport = formContext.getAttribute("cr03e_pickup").getValue();
            if (pickupReport != null) {
                formContext.getAttribute("cr03e_actualpickup").setValue(new Date());
            }
        }

        //Actual return report changed
        this.ReturnReportSaved = function (executionContext) {
            formContext = executionContext.getFormContext();
            var returnReport = formContext.getAttribute("cr03e_return").getValue();
            if (returnReport != null) {
                formContext.getAttribute("cr03e_actualreturn").setValue(new Date());
            }
        }

        this.FormOnLoad = function (executionContext) {
            this.PriceOnLoad(executionContext);
            this.CarObligatory(executionContext);
            this.CarClassIsEmpty(executionContext);
            this.StatusTransition(executionContext);
        }

        this.ReservedPickupOnChange = function (executionContext) {
            this.ReturnedDateEarlyPickup(executionContext);
            this.PickupDateEarlyCurrent(executionContext);
            this.PriceCalculated(executionContext);
        }

        this.ReservedHandoverOnChange = function (executionContext) {
            this.ReturnedDateEarlyPickup(executionContext);
            this.PriceCalculated(executionContext);
        }

        this.StatusOnChange = function (executionContext) {
            this.StatusRentingNotPaidOnChange(executionContext);
            this.CarObligatory(executionContext);
            this.StatusTransition(executionContext);
        }

    }


).call(Sdk);